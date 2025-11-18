// --- Tipos de Datos (Interfaces para constantes) ---

// Estructura para los mensajes de motivación según el estado calórico.
interface MotivationalMessages {
    great: string[]; // Mensajes cuando se está en la meta
    under: string[]; // Mensajes cuando faltan calorías
    over: string[];  // Mensajes cuando se excede el límite
}

// Estructura para un alimento simulado.
interface MockFoodItem {
    id: string;
    name: string;
    kcalPer100g: number;
    category: string;
}

// Estructura para los factores de actividad.
interface ActivityFactors {
    sedentary: number;
    light: number;
    moderate: number;
    intense: number;
}

// --- Constantes de la Aplicación ---

// 1. Mensajes que se muestran en el dashboard según el balance calórico.
export const MOTIVATIONAL_MESSAGES: MotivationalMessages = {
    great: [
        "¡Meta alcanzada! Estás haciendo un trabajo increíble.",
        "Perfecto equilibrio calórico. ¡Sigue así!",
        "Tu esfuerzo rinde frutos. ¡Día completado con éxito!",
        "El balance es la clave, y tú lo has dominado."
    ],
    under: [
        "Estás ligeramente bajo tu meta. ¡Un pequeño snack extra te ayudará!",
        "Recuerda que la nutrición es combustible. ¡Asegúrate de llenarte de energía!",
        "Tienes espacio para más. ¡Busca una fuente saludable de calorías!"
    ],
    over: [
        "Estás un poco arriba, pero no es el fin del mundo. ¡Mañana volvemos al plan!",
        "Ajusta las porciones en tu próxima comida. ¡Es un día, no la trayectoria!",
        "Un poco de exceso hoy, nos enfocamos en el déficit mañana. ¡Tú puedes!"
    ]
};

// 2. Lista de categorías disponibles para clasificar los alimentos.
export const FOOD_CATEGORIES: string[] = [
    'Frutas',
    'Vegetales',
    'Proteínas',
    'Granos',
    'Lácteos',
    'Grasas',
    'Bebidas',
    'Otros'
];

// Lista de alimentos de prueba (mock data) para la funcionalidad de registro.
export const MOCK_FOOD_LIST: MockFoodItem[] = [
    { id: '1', name: 'Manzana', kcalPer100g: 52, category: 'Frutas' },
    { id: '2', name: 'Pechuga de Pollo', kcalPer100g: 165, category: 'Proteínas' },
    { id: '3', name: 'Arroz Blanco', kcalPer100g: 130, category: 'Granos' },
    { id: '4', name: 'Espinacas', kcalPer100g: 23, category: 'Vegetales' },
    { id: '5', name: 'Leche Desnatada', kcalPer100g: 42, category: 'Lácteos' },
    { id: '6', name: 'Aceite de Oliva', kcalPer100g: 884, category: 'Grasas' },
    { id: '7', name: 'Huevo (unidad, 50g)', kcalPer100g: 143, category: 'Proteínas' },
    { id: '8', name: 'Café solo', kcalPer100g: 2, category: 'Bebidas' },
    { id: '9', name: 'Pan Integral', kcalPer100g: 250, category: 'Granos' },
    { id: '10', name: 'Yogur Natural', kcalPer100g: 63, category: 'Lácteos' },
];

// 3. Multiplicadores de actividad física usados para calcular el gasto calórico total (TMB * factor).
export const ACTIVITY_FACTORS: ActivityFactors = {
    sedentary: 1.2, // Poco o ningún ejercicio
    light: 1.375, // Ejercicio ligero (1-3 días/sem)
    moderate: 1.55, // Ejercicio moderado (3-5 días/sem)
    intense: 1.725, // Ejercicio intenso (6-7 días/sem)
};