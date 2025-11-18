import React from 'react';

// Define la interfaz de las propiedades que acepta el componente.
interface BarChartProps {
    data: { date: string, consumed: number }[]; // Datos de consumo diario.
    recommended: number; // Valor de la meta o consumo recomendado.
}

// Componente principal que renderiza el historial como un gráfico de barras.
const BarChartHistory: React.FC<BarChartProps> = ({ data, recommended }) => {
    // Calcula el valor máximo para establecer la escala del gráfico.
    const maxConsumed = Math.max(...data.map(d => d.consumed), recommended);

    return (
        <div className="flex flex-col space-y-2 p-2">
            {/* Itera sobre los datos para dibujar una barra por cada día registrado. */}
            {data.map((day, index) => {
                // Cálculo para determinar el tamaño visual de la barra de consumo.
                const heightPercent = (day.consumed / maxConsumed) * 100;
                // Condición que se usa para cambiar el color de la barra (verde si está bien, rojo si se excede).
                const isOver = day.consumed > recommended;

                return (
                    <div key={index} className="flex items-center space-x-2">
                        {/* Muestra la fecha del registro. */}
                        <span className="w-12 text-xs text-gray-500 dark:text-gray-400 font-medium">{day.date}</span>
                        <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
                            {/* Barra de consumo. */}
                            <div
                                style={{ width: `${heightPercent}%` }}
                                className={`h-full rounded-full transition-all duration-500
                                    ${isOver ? 'bg-red-400' : 'bg-green-400'}`}
                            ></div>
                            {/* Línea vertical que marca la meta recomendada. */}
                            <div
                                style={{ left: `${(recommended / maxConsumed) * 100}%` }}
                                className={`absolute top-0 h-full w-0.5 bg-blue-600 ${recommended > maxConsumed ? 'hidden' : ''}`}
                                title={`Meta: ${recommended} kcal`}
                            ></div>
                            {/* Etiqueta de texto que muestra el valor de consumo dentro de la barra. */}
                            <span
                                className={`absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-white ${day.consumed < 100 ? 'hidden' : ''}`}
                            >
                                {day.consumed}
                            </span>
                        </div>
                    </div>
                );
            })}
             {/* Leyenda que indica el color y valor de la meta. */}
            <div className="flex justify-end items-center space-x-2 text-sm mt-2">
                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                <span className="text-gray-500 dark:text-gray-400">Meta ({recommended} kcal)</span>
            </div>
        </div>
    );
};

export default BarChartHistory;