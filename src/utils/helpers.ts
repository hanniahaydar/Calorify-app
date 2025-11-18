import { MOTIVATIONAL_MESSAGES } from './constants';
import { type TMBData } from '../types/index'; // Importa el tipo TMBData

/**
 * Genera la clave de fecha para el registro diario.
 */
export const getDateKey = (date: Date = new Date()): string => {
    return date.toISOString().split('T')[0];
};

/**
 * Obtiene un nombre legible para el día ('Hoy', 'Ayer').
 */
export const getDayName = (date: Date): string => {
    const todayKey = getDateKey();
    const dateKey = getDateKey(date);
    
    // Retorna 'Hoy' si la fecha coincide con el día actual.
    if (dateKey === todayKey) {
        return 'Hoy';
    }
    
    // Compara con la clave del día de ayer.
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = getDateKey(yesterday);

    if (dateKey === yesterdayKey) {
        return 'Ayer';
    }

    // Retorna la fecha 
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
};

/**
 * Obtiene un mensaje motivacional aleatorio según el estado calórico.
 */
export const getRandomMessage = (status: 'great' | 'under' | 'over'): string => {
    const messages = MOTIVATIONAL_MESSAGES[status]; 
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
};

/**
 * Calcula la Tasa Metabólica Basal (TMB) usando la fórmula de Mifflin-St Jeor.
 * @returns TMB en kcal/día (redondeado).
 */
export const calculateTMB = (data: Omit<TMBData, 'dailyGoal'>): number => {
    const { gender, weight, height, age } = data;
    let bmr: number;

    // Fórmula base: (10 * peso) + (6.25 * altura) - (5 * edad)
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5; // +5 para hombres
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161; // -161 para mujeres
    }

    return Math.round(bmr);
};