import React from 'react';

// Define las propiedades: el tema actual y la función para alternarlo.
interface ThemeToggleProps {
    currentTheme: 'light' | 'dark';
    onToggle: () => void;
}

/**
 * Componente Botón para alternar entre el modo claro y oscuro.
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onToggle }) => {
    // Determina si el tema actual es oscuro.
    const isDark = currentTheme === 'dark';

    return (
        // Botón con clases de estilo Tailwind y manejo de clic.
        <button
            onClick={onToggle}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            // El título indica el modo al que se cambiará.
            title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
            aria-label={`Alternar a modo ${isDark ? 'claro' : 'oscuro'}`}
        >
            {/* Muestra 🌙 si el tema actual es claro (para cambiar a oscuro) y ☀️ si es oscuro (para cambiar a claro). */}
            {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;