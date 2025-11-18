import React from 'react';

// Define las propiedades (props) que el componente de entrada de datos acepta.
interface InputGroupProps {
    id: string; // Identificador único para asociar la etiqueta con el input.
    label: string; // Texto visible de la etiqueta.
    type: 'text' | 'number' | 'password'; // Tipo de campo de entrada.
    value: string | number; // Valor actual del campo.
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; // Función que maneja los cambios de valor.
    min?: string | number; // Valor mínimo (usado principalmente en inputs de tipo 'number').
    step?: string | number; // Incremento de pasos (usado principalmente en inputs de tipo 'number').
    required?: boolean; // Indica si el campo es obligatorio.
}

// Componente InputGroup: Agrupa la etiqueta y el campo de entrada para formularios.
const InputGroup: React.FC<InputGroupProps> = (props) => (
    <div>
        {/* Etiqueta asociada al campo de formulario, con estilos para modo claro y oscuro. */}
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {props.label}
        </label>
        {/* Campo de entrada de texto (input). */}
        <input
            {...props} // Desestructura y pasa todas las demás props (value, onChange, type, min, etc.) directamente al input.
            className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-500 focus:ring-green-500 transition duration-150"
        />
    </div>
);

export default InputGroup;