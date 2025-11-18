import React, { useState } from 'react';
import { type Page } from '../../types'; // Importa el tipo Page (define qué pantalla se muestra).

// Define las propiedades (props) que el componente de autenticación recibe.
interface AuthProps {
    onAuth: (username: string, type: 'login' | 'register') => void; // Función que maneja el inicio de sesión o registro.
    currentPage: Page; // Indica si la pantalla actual es 'login' o 'register'.
    setCurrentPage: (page: Page) => void; // Función para cambiar entre las pantallas de 'login' y 'register'.
}

// Componente AuthScreen: Muestra la interfaz para iniciar sesión o registrar un usuario.
const AuthScreen: React.FC<AuthProps> = ({ onAuth, currentPage, setCurrentPage }) => {
    // Estado local para almacenar el valor ingresado en el campo de nombre de usuario.
    const [username, setUsername] = useState('');

    // Determina si el modo actual es 'Iniciar Sesión'.
    const isLogin = currentPage === 'login';

    // Maneja el envío del formulario.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Llama a la función onAuth con el nombre de usuario y el tipo de acción.
        onAuth(username, isLogin ? 'login' : 'register');
    };

    return (
        // Contenedor principal centrado.
        <div className="max-w-md mx-auto py-12">
            {/* Título dinámico que cambia entre 'Iniciar Sesión' y 'Registro'. */}
            <h2 className="text-4xl font-bold text-center text-green-700 dark:text-green-500 mb-6">
                {isLogin ? 'Iniciar Sesión' : 'Registro'}
            </h2>
            {/* Descripción dinámica basada en el modo actual. */}
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                {isLogin
                    ? 'Ingresa tu nombre para acceder a tus datos.'
                    : 'Crea tu cuenta con un nombre de usuario único.'
                }
            </p>
            {/* Formulario de autenticación. */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo de entrada para el nombre de usuario. */}
                <input
                    type="text"
                    placeholder="Nombre de Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-green-500 focus:ring-green-500 transition duration-150"
                    required
                />
                {/* Botón de envío, con texto dinámico ('Acceder' o 'Registrarme'). */}
                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-200"
                >
                    {isLogin ? 'Acceder' : 'Registrarme'}
                </button>
            </form>

            {/* Enlace para alternar entre los modos de 'login' y 'register'. */}
            <div className="mt-8 text-center">
                <button
                    // Cambia la página actual al modo opuesto.
                    onClick={() => setCurrentPage(isLogin ? 'register' : 'login')}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-semibold transition duration-150"
                >
                    {isLogin ? '¿No tienes cuenta? Regístrate aquí.' : '¿Ya tienes cuenta? Inicia sesión aquí.'}
                </button>
            </div>
        </div>
    );
};

export default AuthScreen;