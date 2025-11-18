import React, { useState, useMemo, useCallback } from 'react';
// Importa todos los tipos de datos necesarios para el usuario, logs y recetas.
import { type User, type DailyFoodLog, type Recipe, type RecipeIngredient } from '../../../types/index'; 
// Importa constantes y utilidades, como mensajes motivacionales y funciones de ayuda.
import { MOTIVATIONAL_MESSAGES } from '../../../utils/constants';
import { getDateKey, getRandomMessage } from '../../../utils/helpers';

// Importa componentes de interfaz de usuario.
import Card from '../../common/Card'; 
import CircularProgress from '../../common/CircularProgress';
import BarChartHistory from '../../common/BarChartHistory';
import DateNavigator from '../../DateNavigator'; 
// Importa componentes de la lógica de la aplicación.
import FoodLogger from '././FoodLogger';
import LogList from '././LogList';
import RecipeList from '././RecipeList';

// Define las propiedades (props) para el Dashboard.
interface DashboardProps {
    currentUser: User; // El objeto de usuario actual que contiene todos los datos (logs, recetas, meta calórica).
    updateCurrentUser: (updateFn: (prev: User) => User) => void; // Función para actualizar el estado del usuario (usando un enfoque inmutable).
    onLogout: () => void; // Función para cerrar la sesión (no utilizada en este componente, pero se mantiene en la interfaz).
}

/**
 * Componente principal que actúa como el panel de control del seguimiento calórico.
 * Maneja la navegación de fechas, calcula el progreso diario, y centraliza la lógica de
 * añadir/eliminar alimentos y gestionar recetas.
 */
const Dashboard: React.FC<DashboardProps> = ({ currentUser, updateCurrentUser }) => {
    
    // Estado para la fecha que se está visualizando en el dashboard (por defecto, hoy).
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calcula una clave de cadena única para la fecha actual (ej: "2024-05-30").
    const todayKey = useMemo(() => getDateKey(currentDate), [currentDate]); 
    
    // Calcula las comidas diarias y el total de calorías consumidas para la fecha seleccionada.
    const { dailyMeals, consumedCalories } = useMemo(() => {
        // Obtiene las entradas del log para la fecha actual. Si no hay, usa un array vacío.
        const meals: DailyFoodLog[] = currentUser.dailyLogs[todayKey] || [];
        // Suma las calorías de todas las comidas registradas.
        const consumed = meals.reduce((sum, item) => sum + (item.calories || 0), 0);
        
        return {
            dailyMeals: meals,
            consumedCalories: consumed
        };
    }, [currentUser.dailyLogs, todayKey]); 
    
    // Obtiene la meta calórica diaria, usando 2000 kcal como valor por defecto si no está definida.
    const recommendedCalories = currentUser.tmbData?.dailyGoal || 2000;
    
    // Calcula la diferencia calórica, el porcentaje de progreso y el estado actual (bajo, genial, exceso).
    const { difference, progressPercent, status } = useMemo(() => {
        const diff = recommendedCalories - consumedCalories;
        // Calcula el porcentaje de progreso, limitado al 100% (aunque el consumo pueda ser mayor).
        const percent = Math.min(100, Math.round((consumedCalories / recommendedCalories) * 100));

        let currentStatus: keyof typeof MOTIVATIONAL_MESSAGES;
        if (consumedCalories < recommendedCalories * 0.8) {
            // Menos del 80% de la meta.
            currentStatus = 'under';
        } else if (consumedCalories > recommendedCalories * 1.1) {
            // Más del 110% de la meta.
            currentStatus = 'over';
        } else {
            // Entre 80% y 110% de la meta (rango objetivo).
            currentStatus = 'great';
        }

        return {
            difference: diff,
            progressPercent: percent,
            status: currentStatus,
        };
    }, [consumedCalories, recommendedCalories]);
    
    // Selecciona un mensaje motivacional basado en el estado calórico diario.
    const motivationalMessage = useMemo(() => getRandomMessage(status), [status]);

    // Determina si la fecha actual es "hoy" para permitir la edición/registro.
    const isLoggingToday = getDateKey(new Date()) === todayKey;

    // --- Funciones de Lógica de Mutación (Actualización de datos) ---

    /**
     * Añade un nuevo alimento al log de la fecha seleccionada.
     */
    const addFoodToLog = useCallback((food: DailyFoodLog) => {
        // Solo permite el registro si la fecha seleccionada es hoy.
        if (!isLoggingToday) return; 
        
        // Utiliza la función de actualización para mantener la inmutabilidad.
        updateCurrentUser(prev => {
            const currentMeals = prev.dailyLogs[todayKey] || [];
            return {
                ...prev,
                dailyLogs: {
                    ...prev.dailyLogs, 
                    [todayKey]: [...currentMeals, food] // Añade el nuevo alimento.
                }
            };
        });
    }, [todayKey, updateCurrentUser, isLoggingToday]);

    /**
     * Elimina una entrada específica del log diario.
     */
    const removeFoodFromLog = useCallback((id: string) => {
        // Solo permite la remoción si la fecha seleccionada es hoy.
        if (!isLoggingToday) return; 
        
        updateCurrentUser(prev => {
            const currentMeals = prev.dailyLogs[todayKey] || [];
            // Filtra el alimento por su ID.
            const updatedLog = currentMeals.filter(item => item.id !== id);
            return {
                ...prev,
                dailyLogs: {
                    ...prev.dailyLogs,
                    [todayKey]: updatedLog // Reemplaza el log con la versión actualizada.
                }
            };
        });
    }, [todayKey, updateCurrentUser, isLoggingToday]);

    /**
     * Guarda un conjunto de entradas del log como una nueva receta.
     */
    const handleSaveAsRecipe = useCallback((logItems: DailyFoodLog[], recipeName: string) => {
        if (recipeName.trim() === "") return;

        // Suma las calorías totales de los ingredientes seleccionados.
        const totalCalories = logItems.reduce((sum, item) => sum + item.calories, 0);
        
        // Mapea las entradas del log a la estructura de ingredientes de receta.
        const ingredients: RecipeIngredient[] = logItems.map(item => ({
            foodId: item.foodId,
            name: item.name,
            calories: item.calories,
            portionSize: item.portionSize,
            kcalPer100g: item.kcalPer100g,
        }));

        // Crea el nuevo objeto Recipe.
        const newRecipe: Recipe = {
            id: crypto.randomUUID(), // Genera un ID único.
            name: recipeName,
            ingredients: ingredients,
            totalCalories: totalCalories,
        };

        // Añade la nueva receta al array de recetas guardadas del usuario.
        updateCurrentUser(prev => ({
            ...prev,
            savedRecipes: [...(prev.savedRecipes || []), newRecipe]
        }));
    }, [updateCurrentUser]);

    /**
     * Añade todos los ingredientes de una receta al log diario.
     */
    const addRecipeToLog = useCallback((recipe: Recipe) => {
        // Solo permite añadir recetas al log de hoy.
        if (!isLoggingToday) return;
        
        // Mapea los ingredientes de la receta a nuevas entradas de DailyFoodLog.
        const newLogEntries: DailyFoodLog[] = recipe.ingredients.map((ingredient: RecipeIngredient) => ({
            id: crypto.randomUUID(), 
            foodId: ingredient.foodId,
            // Modifica el nombre para indicar que proviene de una receta.
            name: `${ingredient.name} (${recipe.name})`, 
            calories: ingredient.calories,
            portionSize: ingredient.portionSize,
            kcalPer100g: ingredient.kcalPer100g,
            timestamp: Date.now(),
        }));

        // Añade todas las nuevas entradas al log actual.
        updateCurrentUser(prev => {
            const currentMeals = prev.dailyLogs[todayKey] || [];
            return {
                ...prev,
                dailyLogs: {
                    ...prev.dailyLogs,
                    [todayKey]: [...currentMeals, ...newLogEntries] // Agrega los nuevos items.
                }
            };
        });
    }, [todayKey, updateCurrentUser, isLoggingToday]);

    /**
     * Prepara los datos para el gráfico de historial de los últimos 7 días.
     */
    const last7DaysLogs = useMemo(() => {
        const logs: { date: string, consumed: number }[] = [];
        for (let i = 6; i >= 0; i--) { // Itera de 6 días atrás hasta hoy (i=0).
            const date = new Date();
            date.setDate(date.getDate() - i); // Ajusta la fecha.
            const dateKey = getDateKey(date);
            // Calcula las calorías consumidas para ese día.
            const consumed = (currentUser.dailyLogs[dateKey] || []).reduce((sum, item) => sum + item.calories, 0);
            logs.push({ 
                // Etiqueta 'Hoy' para el día actual.
                date: i === 0 ? 'Hoy' : date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }), 
                consumed 
            });
        }
        return logs;
    }, [currentUser.dailyLogs]);

    // --- Renderizado del Dashboard ---

    return (
        // Layout principal con cuadrícula responsive (1 columna en móvil, 3 en desktop).
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Columna Izquierda: Resumen, Recetas e Historial */}
            <div className="lg:col-span-1 space-y-8">
                
                {/* Navegador de fechas para cambiar el día visualizado */}
                <DateNavigator currentDate={currentDate} setCurrentDate={setCurrentDate} />

                {/* Tarjeta de Progreso Calórico Diario */}
                <Card title="Progreso Calórico Diario">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        {/* Indicador circular de progreso */}
                        <CircularProgress percent={progressPercent} status={status} />
                        <div className="text-center">
                            {/* Visualización de calorías consumidas */}
                            <p className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">{consumedCalories} <span className="text-xl font-normal text-gray-500 dark:text-gray-400">kcal</span></p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">CONSUMIDAS de {recommendedCalories} kcal</p>
                            {/* Mensaje de diferencia calórica (lo que queda o el superávit) */}
                            <p className={`mt-2 font-bold ${difference >= 0 ? 'text-blue-500 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`}>
                                {difference >= 0 ? `Quedan ${difference} kcal` : `Superávit de ${Math.abs(difference)} kcal`}
                            </p>
                        </div>
                    </div>
                    {/* Mensaje motivacional con color de fondo dinámico basado en el estado */}
                    <div className={`mt-4 p-3 rounded-lg text-center font-medium ${status === 'great' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : status === 'over' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}`}>
                        {motivationalMessage}
                    </div>
                </Card>
                
                {/* Lista de Recetas Guardadas (solo si los datos TMB están disponibles) */}
                {currentUser.tmbData && (
                    <RecipeList 
                        recipes={currentUser.savedRecipes || []} 
                        addRecipeToLog={addRecipeToLog} // Prop para añadir receta al log de hoy.
                    />
                )}
                
                {/* Gráfico de Historial Semanal */}
                <Card title="Historial Semanal (Kcal)">
                    <BarChartHistory data={last7DaysLogs} recommended={recommendedCalories} />
                </Card>
            </div>

            {/* Columna Derecha: Registro de Alimentos y Log Diario */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Componente para registrar nuevos alimentos (solo visible si es hoy) */}
                {isLoggingToday ? (
                    <FoodLogger addFoodToLog={addFoodToLog} />
                ) : (
                    // Mensaje de deshabilitación si se está viendo un día pasado.
                    <Card title="Registro Deshabilitado">
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Estás viendo el historial. Solo puedes registrar alimentos en la fecha actual.</p>
                    </Card>
                )}

                {/* Lista de Alimentos Consumidos para la fecha seleccionada */}
                <Card title={`Alimentos Consumidos (${isLoggingToday ? 'Hoy' : todayKey})`}>
                    {dailyMeals.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                            {isLoggingToday ? 'Aún no has registrado alimentos hoy.' : `No hay registros para la fecha ${todayKey}.`}
                        </p>
                    ) : (
                        // Componente que lista los alimentos y permite eliminar/guardar como receta.
                        <LogList 
                            log={dailyMeals} 
                            removeFood={removeFoodFromLog} 
                            allowRemoval={isLoggingToday} // Solo permite eliminar/guardar si es hoy.
                            onSaveAsRecipe={handleSaveAsRecipe} 
                        />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;