import React from 'react';

// Define las propiedades esperadas para el componente Card.
interface CardProps {
    title: string; // Título que se mostrará en la cabecera de la tarjeta.
    children: React.ReactNode; // Contenido anidado dentro de la tarjeta.
}

// Componente funcional para renderizar una tarjeta reutilizable (Card).
const Card: React.FC<CardProps> = ({ title, children }) => (
    // Estilos principales: define el fondo, relleno, bordes, sombra y manejo de modos claro/oscuro (dark:bg-gray-800).
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-100 dark:border-gray-600 transition-colors duration-300">
        {/* Encabezado de la tarjeta: muestra el título con estilos de fuente y un separador inferior. */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-600">{title}</h3>
        {/* Contenido principal: aquí se inserta el contenido pasado como 'children'. */}
        {children}
    </div>
);

export default Card;