import React, { useState } from 'react';
// Importa el tipo de dato para una entrada de registro de comida diaria.
import { type DailyFoodLog } from '../../../types';

// Define las propiedades (props) que espera el componente.
interface LogListProps {
    log: DailyFoodLog[]; // Array de alimentos consumidos en el día actual.
    removeFood: (id: string) => void; // Función para eliminar una entrada del log.
    onSaveAsRecipe: (logItems: DailyFoodLog[], recipeName: string) => void; // Función para guardar elementos seleccionados como receta.
    allowRemoval: boolean; // Bandera para permitir o no la eliminación y guardado de recetas (útil para ver logs históricos).
}

/**
 * Muestra el registro diario de alimentos.
 * Permite la eliminación de entradas y ofrece la funcionalidad de guardar una selección
 * de alimentos como una nueva receta.
 */
const LogList: React.FC<LogListProps> = ({ log, removeFood, onSaveAsRecipe, allowRemoval }) => {
    // Estado para controlar si el usuario está en el modo de "Guardar como Receta".
    const [isSaving, setIsSaving] = useState(false);
    // Estado para almacenar el nombre que el usuario quiere darle a la nueva receta.
    const [recipeName, setRecipeName] = useState('');
    // Estado que guarda los IDs de los elementos del log seleccionados para la receta.
    const [selectedLogs, setSelectedLogs] = useState<string[]>([]); 

    /**
     * Agrega o quita el ID de un elemento del log de la lista de selección.
     */
    const toggleLogSelection = (id: string) => {
        // Solo permite la selección si la remoción está permitida (log actual).
        if (!allowRemoval) return; 

        setSelectedLogs(prev => 
            // Si ya está seleccionado, lo quita; si no, lo añade.
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    /**
     * Maneja la acción de guardar la receta con los elementos seleccionados.
     */
    const handleSave = () => {
        // Valida que haya elementos seleccionados y un nombre válido.
        if (selectedLogs.length === 0 || recipeName.trim() === "") return;
        
        // Filtra los elementos del log que coinciden con la selección.
        const itemsToSave = log.filter(item => selectedLogs.includes(item.id));
        
        // Llama a la prop para guardar la receta.
        onSaveAsRecipe(itemsToSave, recipeName.trim());
        
        // Reinicia el estado después de guardar.
        setIsSaving(false);
        setRecipeName('');
        setSelectedLogs([]);
    };

    /**
     * Cancela el modo de guardado de receta y limpia los estados.
     */
    const handleCancel = () => {
        setIsSaving(false);
        setRecipeName('');
        setSelectedLogs([]);
    };

    return (
        // Contenedor principal con un divisor entre elementos.
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            
            {/* Botón para iniciar el modo de guardado de receta */}
            {allowRemoval && !isSaving && log.length > 0 && (
                <div className="py-3">
                    <button
                        onClick={() => setIsSaving(true)}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded-lg transition duration-150 text-sm"
                    >
                        Guardar comidas seleccionadas como Receta
                    </button>
                </div>
            )}

            {/* Formulario de guardado de receta (visible solo en modo 'isSaving') */}
            {isSaving && (
                <div className="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg mb-4 space-y-3">
                    {/* Campo de entrada para el nombre de la receta */}
                    <input
                        type="text"
                        placeholder="Nombre de la Receta (ej: Desayuno Fit)"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        className="w-full p-2 border border-yellow-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg"
                    />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Selecciona los alimentos que formarán parte de esta receta ({selectedLogs.length} elementos)
                    </p>
                    {/* Botones de Confirmar y Cancelar */}
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSave}
                            // Deshabilita el botón si no hay elementos seleccionados o si falta el nombre
                            disabled={selectedLogs.length === 0 || recipeName.trim() === ""}
                            className={`flex-1 font-bold py-2 rounded-lg text-sm transition duration-150 
                                ${selectedLogs.length > 0 && recipeName.trim() !== "" ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            Confirmar Receta ({selectedLogs.length})
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-150"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
            
            {/* Mapeo y renderizado de los elementos del log diario */}
            {log.map(item => {
                const isSelected = selectedLogs.includes(item.id);

                return (
                    <div 
                        key={item.id} 
                        className={`flex justify-between items-center py-3 
                            ${isSaving && allowRemoval ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600' : ''}
                            ${isSelected && isSaving ? 'bg-blue-100 dark:bg-blue-800' : ''}`}
                        // Permite la selección si estamos en modo guardado y está permitido
                        onClick={() => isSaving && allowRemoval && toggleLogSelection(item.id)}
                    >
                        <div className="flex items-center space-x-2">
                            {/* Checkbox visible solo en modo de guardado de receta */}
                            {isSaving && allowRemoval && ( 
                                <input 
                                    type="checkbox" 
                                    checked={isSelected} 
                                    // Previene que el clic se propague al div contenedor para evitar doble toggle
                                    onChange={() => toggleLogSelection(item.id)} 
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            )}
                            {/* Detalles del alimento */}
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.portionSize} g / {item.kcalPer100g} kcal/100g</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Calorías totales del alimento */}
                            <span className={`font-bold text-lg ${isSelected && isSaving ? 'text-white' : 'text-green-700 dark:text-green-400'}`}>
                                {item.calories} kcal
                            </span>
                            {/* Botón de eliminación visible solo cuando NO se está guardando y SÍ está permitido eliminar */}
                            {!isSaving && allowRemoval && ( 
                                <button 
                                    // Detiene la propagación del evento para que no active la selección/deselección de la fila
                                    onClick={(e) => { e.stopPropagation(); removeFood(item.id); }}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition duration-150"
                                    title="Eliminar"
                                >
                                    {/* Icono de papelera (SVG) */}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LogList;