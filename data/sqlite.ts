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

const DB_VERSION = 1; // Increment this when making schema changes

async function getCurrentVersion(): Promise<number> {
    const db = await getDb();
    const version = await db.getFirstAsync<{ version: number }>('SELECT version FROM db_version');
    return version?.version || 0;
}

async function updateVersion(version: number): Promise<void> {
    const db = await getDb();
    await db.execAsync(`UPDATE db_version SET version = ${version}`);
}

async function initVersionTable(): Promise<void> {
    const db = await getDb();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS db_version (
            version INTEGER NOT NULL
        );
    `);

    // Check if version exists
    const version = await db.getFirstAsync<{ version: number }>('SELECT version FROM db_version');
    if (!version) {
        // Initialize with current version
        await db.execAsync(`INSERT INTO db_version (version) VALUES (${DB_VERSION})`);
    }
}

async function runMigrations(): Promise<void> {
    const currentVersion = await getCurrentVersion();
    const db = await getDb();

    // Run migrations in order
    if (currentVersion < 1) {
        // Version 1 migrations
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

    // Add more migrations here as needed
    // Example:
    // if (currentVersion < 2) {
    //     await db.execAsync(`
    //         ALTER TABLE recipes ADD COLUMN difficulty TEXT;
    //     `);
    // }

    // Update version after migrations
    await updateVersion(DB_VERSION);
}

export async function initRecipesTable() {
    // Initialize version tracking
    await initVersionTable();

    // Run migrations
    await runMigrations();
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
    await db.runAsync(`DELETE FROM recipes WHERE id = ?`, [id]);
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

export async function updateRecipe(recipe: Recipe): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `UPDATE recipes 
        SET title = ?, 
            description = ?, 
            prepTime = ?, 
            cookTime = ?, 
            servings = ?, 
            calories = ?, 
            ingredients = ?, 
            instructions = ?, 
            imageUrl = ?, 
            updatedAt = ?
        WHERE id = ?;`,
        [
            recipe.title,
            recipe.description,
            recipe.prepTime,
            recipe.cookTime,
            recipe.servings,
            recipe.calories,
            JSON.stringify(recipe.ingredients),
            JSON.stringify(recipe.instructions),
            recipe.imageUrl ?? null,
            recipe.updatedAt,
            recipe.id,
        ]
    );
}