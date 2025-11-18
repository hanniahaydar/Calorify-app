import React from 'react';
// Importa el tipo de dato 'Recipe' desde una ubicación en la carpeta 'types'
import { type Recipe } from '../../../types'; 
// CORRECCIÓN: Se ajusta la ruta de importación del componente 'Card' para una resolución correcta.
import Card from '../../common/Card'; 

// Define la interfaz de las propiedades (props) que espera el componente RecipeList
interface RecipeListProps {
    // Array de objetos Recipe que se van a mostrar
    recipes: Recipe[]; 
    // Función para añadir una receta seleccionada al registro (log) diario
    addRecipeToLog: (recipe: Recipe) => void; 
}

/**
 * Componente que renderiza una lista de recetas guardadas.
 * Permite al usuario seleccionar una receta para añadirla a su registro de alimentos.
 * @param {RecipeListProps} props - Las recetas y la función para añadirlas al log.
 */
const RecipeList: React.FC<RecipeListProps> = ({ recipes, addRecipeToLog }) => {
    return (
        // Envuelve todo el contenido en el componente Card con un título
        <Card title="Recetas Guardadas">
            {/* Contenedor de la lista de recetas. 
              'space-y-3' añade espacio vertical entre elementos.
              'max-h-60' limita la altura máxima y 'overflow-y-auto' habilita el scroll vertical
              cuando la lista excede esa altura.
            */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
                {/* Lógica condicional: Si no hay recetas, muestra un mensaje. */}
                {recipes.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        Aún no tienes recetas guardadas.
                    </p>
                ) : (
                    // Si hay recetas, itera sobre el array para renderizar cada una.
                    recipes.map(recipe => (
                        <div 
                            key={recipe.id} 
                            // Contenedor de cada item: flexbox para alinear contenido y botón, 
                            // padding, fondo gris claro/oscuro (modo día/noche), esquinas redondeadas y sombra.
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
                        >
                            {/* Sección de detalles de la receta (nombre y calorías) */}
                            <div>
                                {/* Nombre de la receta, con fuente seminegrita y color adaptable al tema */}
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{recipe.name}</p>
                                {/* Metadatos: número de ingredientes y calorías totales */}
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {recipe.ingredients.length} alimentos | {recipe.totalCalories} kcal
                                </p>
                            </div>
                            {/* Botón de acción para añadir al log */}
                            <button
                                // Llama a la función 'addRecipeToLog' al hacer clic, pasando el objeto 'recipe'
                                onClick={() => addRecipeToLog(recipe)}
                                // Estilos del botón: fondo azul, hover, texto blanco, negrita, padding y transición suave
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-150"
                            >
                                Añadir
                            </button>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default RecipeList;