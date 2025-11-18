// src/components/common/CircularProgress.tsx

import React from 'react';
import { MOTIVATIONAL_MESSAGES } from '../../utils/constants'; 

// Define las propiedades (props) esperadas por el componente.
interface ProgressProps {
    percent: number; // Porcentaje de progreso a mostrar.
    status: keyof typeof MOTIVATIONAL_MESSAGES; // Estado actual (ej: 'ok', 'over', 'under').
}

// Componente para un indicador de progreso circular usando SVG.
const CircularProgress: React.FC<ProgressProps> = ({ percent, status }) => {
    const radius = 70;
    // Calcula la circunferencia total del círculo.
    const circumference = 2 * Math.PI * radius;
    // Calcula el desplazamiento (offset) necesario para dibujar el porcentaje de progreso.
    const offset = circumference - (Math.min(100, percent) / 100) * circumference;

    // Determina la clase de color basada en el estado actual del progreso.
    let colorClass = 'text-green-500 dark:text-green-400';
    if (status === 'over') colorClass = 'text-red-500 dark:text-red-400';
    if (status === 'under') colorClass = 'text-yellow-500 dark:text-yellow-400';

    return (
        <div className="relative w-40 h-40">
            {/* Contenedor SVG: Rota 90 grados para que la barra comience desde arriba. */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Círculo de Fondo: Define la pista gris estática del progreso. */}
                <circle
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="80"
                    cy="80"
                />
                {/* Círculo de Progreso: Dibuja el progreso dinámico (barra de color). */}
                <circle
                    className={`${colorClass} transition-all duration-700`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset} // Controla la longitud de la barra de progreso.
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="80"
                    cy="80"
                />
            </svg>
            {/* Capa de contenido central: Muestra el porcentaje de progreso como texto. */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">{percent}%</span>
            </div>
        </div>
    );
};

export default CircularProgress;