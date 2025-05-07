import * as SQLite from 'expo-sqlite';
import { Recipe } from '../types/recipe';
import { mockRecipes } from './mockRecipes';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb() {
    if (!db) {
        db = await SQLite.openDatabaseAsync('recipes.db');
        await db.execAsync('PRAGMA journal_mode = WAL');
        await db.execAsync('PRAGMA foreign_keys = ON');
    }
    return db;
}

export async function initRecipesTable() {
    const db = await getDb();
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      prepTime INTEGER NOT NULL,
      cookTime INTEGER NOT NULL,
      servings INTEGER NOT NULL,
      calories INTEGER NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      imageUrl TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
}

export async function addRecipe(recipe: Recipe): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `INSERT INTO recipes (id, title, description, prepTime, cookTime, servings, calories, ingredients, instructions, imageUrl, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
            recipe.id,
            recipe.title,
            recipe.description,
            recipe.prepTime,
            recipe.cookTime,
            recipe.servings,
            recipe.calories,
            JSON.stringify(recipe.ingredients),
            JSON.stringify(recipe.instructions),
            recipe.imageUrl ?? null,
            recipe.createdAt,
            recipe.updatedAt,
        ]
    );
}

export async function getAllRecipes(): Promise<Recipe[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<any>(`SELECT * FROM recipes;`);
    return rows.map(row => ({
        ...row,
        prepTime: Number(row.prepTime),
        cookTime: Number(row.cookTime),
        servings: Number(row.servings),
        calories: Number(row.calories),
        ingredients: JSON.parse(row.ingredients),
        instructions: JSON.parse(row.instructions),
    }));
}

export async function deleteRecipe(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM recipes WHERE id = ?;', [id]);
}

export async function migrateDefaultRecipes() {
    const db = await getDb();
    const rows = await db.getAllAsync<any>('SELECT COUNT(*) as count FROM recipes;');
    if (rows[0]?.count === 0) {
        for (const recipe of mockRecipes) {
            await addRecipe(recipe);
        }
    }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<any>('SELECT * FROM recipes WHERE id = ?', id);
    if (!row) return null;
    return {
        ...row,
        prepTime: Number(row.prepTime),
        cookTime: Number(row.cookTime),
        servings: Number(row.servings),
        calories: Number(row.calories),
        ingredients: JSON.parse(row.ingredients),
        instructions: JSON.parse(row.instructions),
    };
}