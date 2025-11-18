
import React, { useState, useEffect, useCallback } from 'react';
import { type User, type Page } from '../types/index'; 
// Componentes de las diferentes pantallas (Nota: Estas rutas pueden necesitar ajuste real).
import AuthScreen from './pages/AuthScreen';
import TMBSetupScreen from './pages/TMBSetupScreen';
import Dashboard from './pages/Dashboard/Dashboard';

// Importación del hook personalizado para el tema y el componente de toggle.
import { useSimpleTheme } from '../hooks/useSimpleTheme';
import ThemeToggle from './ThemeToggle'; 


const App: React.FC = () => {
    // 1. Manejo del tema (Modo Oscuro/Claro)
    // Inicializa el tema actual ('light' o 'dark') y la función para alternarlo.
    const [currentTheme, toggleTheme] = useSimpleTheme();

    // Estados principales de la aplicación.
    const [currentPage, setCurrentPage] = useState<Page>('login'); // Controla qué pantalla se muestra (login, setup, dashboard).
    const [currentUser, setCurrentUser] = useState<User | null>(null); // Almacena los datos del usuario logueado.
    const [allUsers, setAllUsers] = useState<Record<string, User>>({}); // Simulación de una base de datos de usuarios (key: username).

    // --- Cargar datos de usuarios (Simulación de DB con localStorage) ---
    useEffect(() => {
        // Carga el mapa completo de usuarios desde localStorage al iniciar.
        const storedUsers = localStorage.getItem('Calorify_users');
        if (storedUsers) {
            setAllUsers(JSON.parse(storedUsers));
        }

        // Intenta recuperar la sesión del último usuario activo.
        const storedUserId = localStorage.getItem('Calorify_current_user_id');
        if (storedUserId) {
            // Carga los datos del usuario específico.
            const user = JSON.parse(localStorage.getItem(`Calorify_user_${storedUserId}`) || 'null');
            if (user) {
                setCurrentUser(user);
                // Si el usuario tiene TMB configurada, va al dashboard, si no, al setup.
                setCurrentPage(user.tmbData ? 'dashboard' : 'tmb_setup');
            }
        } else {
            // Si no hay ID de usuario guardado, muestra el login.
            setCurrentPage('login');
        }
    }, []); // Se ejecuta solo una vez al montar el componente.
    
    // --- FUNCIÓN DE ACTUALIZACIÓN DE USUARIO (Manejo de Reactividad y Persistencia) ---
    // Memoiza la función para garantizar que no se recree innecesariamente.
    const updateCurrentUser = useCallback((updateFn: (prev: User) => User) => {
        
        let latestUpdatedUser: User | null = null;

        // 1. Actualiza el estado `currentUser` para forzar la re-renderización inmediata de la interfaz.
        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            const updatedUser = updateFn(prevUser);
            latestUpdatedUser = updatedUser; // Guarda la referencia del objeto actualizado.
            return updatedUser; 
        });
        
        // 2. Persiste los datos actualizados en el mapa `allUsers` y en `localStorage`.
        setAllUsers(prevAllUsers => {
            
            // Usa el objeto actualizado obtenido en el paso 1.
            const userToPersist = latestUpdatedUser || updateFn(prevAllUsers[currentUser!.username]); 
            
            const updatedAllUsers = {
                ...prevAllUsers,
                [userToPersist.username]: userToPersist
            };
            
            // GUARDADO SÍNCRONO: Actualiza el mapa general y el registro individual del usuario.
            localStorage.setItem('Calorify_users', JSON.stringify(updatedAllUsers));
            localStorage.setItem('Calorify_user_' + userToPersist.id, JSON.stringify(userToPersist));

            return updatedAllUsers;
        });

    }, [currentUser]); // Dependencia en currentUser para asegurar el acceso a los datos correctos en el closure.
    
    // --- LÓGICA DE AUTENTICACIÓN (Login/Register) ---
    const handleAuth = (username: string, type: 'login' | 'register') => {
        const lowerUsername = username.toLowerCase();
        
        let user: User | undefined;

        // Lógica para registrar un nuevo usuario.
        if (type === 'register' && !allUsers[lowerUsername]) {
            user = {
                id: Date.now().toString(), // ID simple basado en tiempo.
                username: lowerUsername,
                tmbData: null, // TMB inicialmente nulo (requiere setup).
                dailyLogs: {}
            };
            setAllUsers(prev => ({ ...prev, [lowerUsername]: user! })); // Añade el nuevo usuario al mapa.
        // Lógica para iniciar sesión.
        } else if (type === 'login' && allUsers[lowerUsername]) {
            user = allUsers[lowerUsername];
        }

        // Si se encuentra o crea el usuario, establece la sesión.
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('Calorify_current_user_id', user.id); // Guarda el ID de la sesión.
            localStorage.setItem(`Calorify_user_${user.id}`, JSON.stringify(user)); // Guarda el objeto completo.
            setCurrentPage(user.tmbData ? 'dashboard' : 'tmb_setup');
        } else {
            console.error(type === 'login' ? 'Usuario no encontrado.' : 'El usuario ya existe o error en registro.');
        }
    };
    
    // Función para cerrar sesión.
    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('Calorify_current_user_id'); // Elimina la sesión activa.
        setCurrentPage('login');
    };

    // --- RENDERIZADO CONDICIONAL DE PANTALLAS ---

    let content;
    if (currentUser) {
        // Muestra la pantalla de configuración o el dashboard si hay un usuario logueado.
        if (currentPage === 'tmb_setup' || currentUser.tmbData === null) {
            content = <TMBSetupScreen currentUser={currentUser} updateCurrentUser={updateCurrentUser} setCurrentPage={setCurrentPage} />;
        } else if (currentPage === 'dashboard') {
            content = <Dashboard currentUser={currentUser} updateCurrentUser={updateCurrentUser} onLogout={handleLogout} />;
        }
    } else {
        // Muestra la pantalla de autenticación si no hay usuario logueado.
        content = <AuthScreen onAuth={handleAuth} currentPage={currentPage} setCurrentPage={setCurrentPage} />;
    }

    return (
        // Contenedor raíz: Aplica el fondo y la transición de color para el modo oscuro/claro.
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            
            {/* Header / Barra de navegación */}
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-green-600 dark:text-green-400">Calorify tu App de Confianza</h1>
                    <div className="flex items-center space-x-4"> 
                        {/* Toggle para cambiar el tema (claro/oscuro) */}
                        <ThemeToggle currentTheme={currentTheme} onToggle={toggleTheme} />
                        
                        {/* Botón de Cerrar Sesión (solo visible si hay un usuario) */}
                        {currentUser && (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition"
                            >
                                Cerrar Sesión
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Contenedor principal del contenido de la página. */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-900 dark:text-gray-100">
                {content}
            </main>
            
            {/* Pie de página para mostrar estado de la aplicación. */}
            <footer className="text-center text-xs text-gray-400 dark:text-gray-600 p-4">
                {currentUser ? `Usuario: ${currentUser.username.toUpperCase()}` : 'No autenticado'} | Página: {currentPage}
            </footer>
        </div>
    );
};

export default App;