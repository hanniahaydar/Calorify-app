import React, { useState, useMemo } from 'react';
import { type TMBData, type User, type Page } from '../../types/index';
import { calculateTMB } from '../../utils/helpers';
import { ACTIVITY_FACTORS } from '../../utils/constants';
import InputGroup from '../common/InputGroup'; 
import SelectGroup from '../common/SelectGroup';

// Define las propiedades que el componente recibe.
interface TMBSetupProps {
    currentUser: User; // Datos del usuario actual (no se usa directamente, pero es parte del contexto).
    updateCurrentUser: (updateFn: (prev: User) => User) => void; // Función para guardar los nuevos datos TMB.
    setCurrentPage: (page: Page) => void; // Función para navegar al dashboard.
}

// Componente TMBSetupScreen: Formulario para calcular la Tasa Metabólica Basal (TMB).
const TMBSetupScreen: React.FC<TMBSetupProps> = ({ updateCurrentUser, setCurrentPage }) => {
    // Estado inicial con valores por defecto para el cálculo de TMB.
    const [formData, setFormData] = useState<Omit<TMBData, 'dailyGoal'> & { dailyGoal?: number }>({
        age: 30, gender: 'male', weight: 70, height: 175, activity: 'moderate'
    });

    // Maneja los cambios en los campos de entrada y select.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // Convierte valores numéricos (age, weight, height) a float, el resto como string.
            [id]: id === 'age' || id === 'weight' || id === 'height'
                ? parseFloat(value) 
                : value as string 
        }));
    };

    // Calcula la TMB y el objetivo calórico diario en tiempo real.
    const calculatedBMR = useMemo(() => calculateTMB(formData), [formData]);
    const finalDailyGoal = Math.round(calculatedBMR * ACTIVITY_FACTORS[formData.activity as keyof typeof ACTIVITY_FACTORS]);

    // Maneja el envío del formulario.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Define el objeto de datos TMB final, incluyendo la meta calórica diaria.
        const finalTMBData: TMBData = {
            ...formData,
            dailyGoal: finalDailyGoal
        };

        // Actualiza el estado del usuario con los nuevos datos TMB.
        updateCurrentUser(prev => ({
            ...prev,
            tmbData: finalTMBData
        }));

        // Navega a la pantalla del dashboard.
        setCurrentPage('dashboard');
        console.log(`Meta calórica diaria calculada y guardada! ${finalDailyGoal} Kcal.`);
    };

    return (
        <div className="max-w-xl mx-auto py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Calculadora de Requerimientos Calóricos</h2>
            
            {/* Formulario principal con diseño de dos columnas. */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                
                {/* 1. EDAD (Input) */}
                <InputGroup
                    id="age"
                    label="Edad (años)"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    required
                />
                
                {/* 2. GÉNERO (Select) */}
                <SelectGroup
                    id="gender"
                    label="Género"
                    value={formData.gender}
                    onChange={handleChange}
                >
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                </SelectGroup>
                
                {/* 3. PESO (Input) */}
                <InputGroup
                    id="weight"
                    label="Peso (kg)"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                    min="30"
                    step="0.1"
                    required
                />

                {/* 4. ALTURA (Input) */}
                <InputGroup
                    id="height"
                    label="Altura (cm)"
                    type="number"
                    value={formData.height}
                    onChange={handleChange}
                    min="100"
                    required
                />

                {/* 5. NIVEL DE ACTIVIDAD (Select) */}
                <SelectGroup
                    id="activity"
                    label="Nivel de Actividad"
                    value={formData.activity as string} 
                    onChange={handleChange}
                >
                    <option value="sedentary">Sedentario (Poco o ningún ejercicio)</option>
                    <option value="light">Ligero (1-3 veces por semana)</option>
                    <option value="moderate">Moderado (3-5 veces por semana)</option>
                    <option value="intense">Intenso (6-7 veces por semana)</option>
                </SelectGroup>
                
                {/* 6. Resultados de Estimación (Visualización en tiempo real) */}
                <div className="sm:col-span-2 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400">TMB estimada (kcal/día): <span className="font-bold">{calculatedBMR}</span></p>
                    <p className="text-lg font-extrabold text-green-600 dark:text-green-400">Meta Calórica Diaria: {finalDailyGoal} kcal</p>
                </div>

                {/* 7. Botón de Envío */}
                <button
                    type="submit"
                    className="sm:col-span-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-200 mt-6"
                >
                    Guardar y Continuar
                </button>
            </form>
        </div>
    );
}

export default TMBSetupScreen;