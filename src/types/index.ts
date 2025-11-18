import { type ACTIVITY_FACTORS } from '../utils/constants';

// Datos básicos de la Tasa Metabólica Basal (TMB) del usuario.
export interface TMBData {
    age: number;
    gender: 'male' | 'female';
    weight: number; // Peso en kg
    height: number; // Altura en cm
    activity: keyof typeof ACTIVITY_FACTORS; // Nivel de actividad para el cálculo
    dailyGoal: number; // Objetivo calórico diario (kcal)
}

// Estructura de un alimento base en la base de datos o mock.
export interface FoodItem {
    id: string;
    name: string;
    category: string;
    kcalPer100g: number; // Calorías por cada 100 gramos
}
// ----------------------------------------

// Entrada de registro de comida diaria (lo que el usuario consumió).
export interface DailyFoodLog {
    id: string; // ID único del log
    foodId: string; // ID del alimento original
    name: string;
    calories: number; // Calorías finales de la porción consumida
    portionSize: number; // Cantidad consumida
    kcalPer100g: number;
    timestamp: number; // Momento del consumo
}

// ===============================================
// INTERFACES PARA RECETAS
// ===============================================

// Un ingrediente específico usado y calculado dentro de una receta.
export interface RecipeIngredient {
    foodId: string;
    name: string;
    calories: number; // Calorías de este ingrediente en la receta
    portionSize: number; // Cantidad usada en la receta
    kcalPer100g: number;
}

// Estructura completa de una receta guardada.
export interface Recipe {
    id: string;
    name: string;
    description?: string;
    ingredients: RecipeIngredient[];
    totalCalories: number; // Suma total de calorías de todos los ingredientes
}

// ===============================================

// Estructura del objeto de usuario completo para la aplicación.
export interface User {
    id: string;
    username: string;
    tmbData: TMBData | null;
    dailyLogs: Record<string, DailyFoodLog[]>; // Registros diarios por fecha
    savedRecipes: Recipe[]; // Lista de recetas guardadas por el usuario
}

// Tipos de las vistas o páginas principales de la aplicación.
export type Page = 'login' | 'register' | 'tmb_setup' | 'dashboard';