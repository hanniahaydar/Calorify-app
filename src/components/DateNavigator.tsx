import React from 'react';
import { getDayName } from '../utils/helpers'; // Importa la función auxiliar para formatear la fecha a un nombre de día.

/**
 * Define las propiedades (props) esperadas por el componente DateNavigator.
 * @interface DateNavigatorProps
 * @property {Date} currentDate - La fecha actualmente seleccionada en el Dashboard para mostrar los logs.
 * @property {(date: Date) => void} setCurrentDate - Función setter para actualizar la fecha de visualización.
 */
interface DateNavigatorProps {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
}

/**
 * Componente de navegación de fechas.
 * Permite al usuario moverse hacia adelante y hacia atrás entre los días para ver los registros.
 * Deshabilita la navegación futura (más allá del día de hoy).
 */
const DateNavigator: React.FC<DateNavigatorProps> = ({ currentDate, setCurrentDate }) => {
    // 1. Inicializa la fecha de hoy, limpiando la información de hora, minutos, segundos y milisegundos.
    // Esto es crucial para una comparación precisa de solo el día.
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    // 2. Comprueba si la fecha actualmente seleccionada es el día de hoy.
    const isToday = currentDate.getTime() === today.getTime();
    
    /**
     * Función que maneja el cambio de fecha.
     * @param {number} days - El número de días a desplazar (e.g., -1 para atrás, 1 para adelante).
     */
    const handleNavigation = (days: number) => {
        // Crea una nueva instancia de la fecha para evitar mutar el estado directamente.
        const newDate = new Date(currentDate);
        // Ajusta el día del mes.
        newDate.setDate(newDate.getDate() + days);
        // Actualiza el estado de la fecha.
        setCurrentDate(newDate);
    };

    return (
        // Contenedor principal con diseño flexible y estilos centrados.
        <div className="flex items-center justify-center space-x-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md">
            
            {/* Botón Anterior: Navega 1 día hacia atrás. */}
            <button
                onClick={() => handleNavigation(-1)}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-2 rounded-full transition"
                aria-label="Día anterior"
            >
                {'◀'}
            </button>

            {/* Fecha Central: Muestra la fecha seleccionada con el nombre del día (formato largo). */}
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 min-w-[10rem] text-center">
                {/* Llama a la función auxiliar para formatear la fecha. */}
                {getDayName(currentDate)}
            </h2>

            {/* Botón Siguiente: Navega 1 día hacia adelante. */}
            <button
                onClick={() => handleNavigation(1)}
                // Deshabilita el botón si isToday es verdadero (impide ir a fechas futuras).
                disabled={isToday}
                className={`p-2 rounded-full transition ${isToday
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' // Estilo para estado deshabilitado
                    : 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300' // Estilo para estado activo
                }`}
                aria-label="Día siguiente"
            >
                {'▶'}
            </button>
        </div>
    );
};

export default DateNavigator;