export interface Recipe {
    id: string;
    title: string;
    description: string;
    prepTime: number; // in minutes
    cookTime: number; // in minutes
    servings: number;
    ingredients: string[];
    instructions: string[];
    imageUrl?: string;
    calories: number;
    createdAt: string;
    updatedAt: string;
} 