import React from 'react';

// Define las propiedades (props) para el componente de selección desplegable.
interface SelectGroupProps {
    id: string; // Identificador único para asociar la etiqueta con el campo.
    label: string; // Texto que se muestra como etiqueta.
    value: string; // Valor seleccionado actualmente.
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Función para manejar el cambio de selección.
    children: React.ReactNode; // Las opciones (<option>) que se anidan dentro del <select>.
}

// Componente SelectGroup: Agrupa la etiqueta y el campo <select> para formularios.
const SelectGroup: React.FC<SelectGroupProps> = ({ id, label, value, onChange, children }) => (
    <div>
        {/* Etiqueta asociada al campo, con soporte para modos claro y oscuro. */}
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
        </label>
        {/* Campo de selección desplegable (<select>). */}
        <select
            id={id}
            value={value}
            onChange={onChange}
            // Estilos que definen la apariencia, incluyendo adaptabilidad a modo oscuro.
            className="w-full p-3 
                        bg-white text-gray-800 border border-gray-300 
                        dark:bg-gray-800 dark:text-white dark:border-gray-600 
                        rounded-lg focus:border-green-500 focus:ring-green-500 transition duration-150"
        >
            {/* Opciones de selección proporcionadas como contenido dinámico (children). */}
            {children}
        </select>
    </div>
);

export default SelectGroup;