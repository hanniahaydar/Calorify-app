import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

// Función auxiliar para determinar el tema inicial leyendo la clase 'dark' del DOM.
const getInitialTheme = (): Theme => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

/**
 * Hook personalizado para gestionar el tema (claro/oscuro) de la aplicación.
 * @returns {[Theme, () => void]} - El tema actual y una función para alternarlo.
 */
export const useSimpleTheme = (): [Theme, () => void] => {
    // Inicializa el estado leyendo el tema inicial del DOM.
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    // Efecto que sincroniza el estado de React con el DOM y localStorage.
    useEffect(() => {
        const isDark = theme === 'dark';
        
        // Aplica o remueve la clase 'dark' al elemento <html>.
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Persiste la preferencia del usuario en localStorage.
        localStorage.setItem('Calorify_dark_mode', isDark.toString());
    }, [theme]); // Se ejecuta cada vez que el estado 'theme' cambia.

    // Función memorizada para alternar el estado del tema de forma segura.
    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    return [theme, toggleTheme];
};