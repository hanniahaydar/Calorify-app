// src// /components/pages/Dashboard/FoodLogger.tsx

import React, { useState, useMemo } from 'react';
import { type DailyFoodLog } from '../../../types/index';
import { MOCK_FOOD_LIST, FOOD_CATEGORIES } from '../../../utils/constants'; 
import Card from '../../common/Card'; 
import InputGroup from '../../common/InputGroup'; 
import SelectGroup from '../../common/SelectGroup'; 

// Define el tipo de dato para un ítem individual de la lista de alimentos.
type MockFoodItem = typeof MOCK_FOOD_LIST[number];

// Define las propiedades que recibe el componente.
interface FoodLoggerProps {
    addFoodToLog: (food: DailyFoodLog) => void; // Función para registrar el alimento en el log principal.
}

// Componente para buscar y registrar nuevos alimentos.
const FoodLogger: React.FC<FoodLoggerProps> = ({ addFoodToLog }) => {
    // Estados para controlar la búsqueda, el filtro por categoría y la selección actual.
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [selectedFood, setSelectedFood] = useState<MockFoodItem | null>(null);
    const [portion, setPortion] = useState(100); // Estado para la porción en gramos.

    // Filtra la lista de alimentos basándose en el término de búsqueda y la categoría seleccionada.
    const filteredFoods = useMemo(() => {
        return MOCK_FOOD_LIST.filter(food => {
            const matchesCategory = selectedCategory === 'Todas' || food.category === selectedCategory; 
            const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedCategory]);

    // Calcula las calorías totales para la porción ingresada del alimento seleccionado.
    const calculatedCalories = useMemo(() => {
        if (!selectedFood) return 0;
        return Math.round((selectedFood.kcalPer100g / 100) * portion);
    }, [selectedFood, portion]);

    // Maneja el envío del formulario para agregar el alimento al log diario.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFood || portion <= 0) {
            console.error('Selecciona un alimento y una porción válida.');
            return;
        }

        // Crea el nuevo objeto de registro de comida con los datos actuales.
        const newLogEntry: DailyFoodLog = {
            id: Date.now().toString(),
            foodId: selectedFood.id,
            name: selectedFood.name,
            calories: calculatedCalories,
            portionSize: portion,
            kcalPer100g: selectedFood.kcalPer100g,
            timestamp: Date.now(),
            // Las propiedades de macros deben añadirse si son requeridas por DailyFoodLog.
        };

        addFoodToLog(newLogEntry);

        // Limpia el estado del formulario después de registrar.
        setSelectedFood(null);
        setSearchTerm('');
        setPortion(100);
    };

    // Array de categorías para el selector.
    const categories = FOOD_CATEGORIES;

    return (
        <Card title="Añadir Alimento">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    
                    {/* Componente para ingresar el texto de búsqueda. */}
                    <div className="flex-1">
                        <InputGroup
                            id="search"
                            label="Buscar Alimento"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Componente para seleccionar la categoría de filtro. */}
                    <SelectGroup
                        id="category"
                        label="Categoría"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="Todas">Todas</option>
                        {/* Mapea las categorías disponibles como opciones del selector. */}
                        {categories.map(category => ( 
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </SelectGroup>
                </div>
                
                {/* Contenedor que muestra los alimentos que coinciden con la búsqueda y filtro. */}
                <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                    {filteredFoods.length > 0 ? (
                        filteredFoods.map(food => (
                            // Elemento clickable para seleccionar un alimento.
                            <div
                                key={food.id}
                                className={`p-3 border-b cursor-pointer last:border-b-0
                                    ${selectedFood?.id === food.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                onClick={() => setSelectedFood(food)}
                            >
                                <p className="font-semibold">{food.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {food.kcalPer100g} kcal / 100g
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="p-3 text-center text-gray-500 dark:text-gray-400">No se encontraron alimentos.</p>
                    )}
                </div>
                
                {/* Sección de registro de porción: Solo se muestra si se ha seleccionado un alimento. */}
                {selectedFood && (
                    <div className="p-4 border border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-gray-700 space-y-3">
                        <h4 className="font-semibold text-green-800 dark:text-green-300">Agregando: {selectedFood.name}</h4>
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            {/* Campo para ingresar la porción en gramos. */}
                            <InputGroup 
                                id="portion" 
                                label={`Porción (gramos, basado en ${selectedFood.kcalPer100g} kcal/100g)`} 
                                type="number" 
                                min="1" 
                                value={portion} 
                                onChange={(e) => setPortion(parseFloat(e.target.value) || 0)} 
                            />
                            
                            {/* Muestra el cálculo total de calorías para la porción. */}
                            <div className="shrink-0 w-full sm:w-auto text-lg font-bold text-gray-800 dark:text-gray-100 p-2 border border-dashed rounded-lg bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-600">
                                Total: {calculatedCalories} kcal
                            </div>

                            {/* Botón de envío del formulario. */}
                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-200"
                            >
                                Añadir alimento
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </Card>
    );
};

export default FoodLogger;