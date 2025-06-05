import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

const SelectInput = React.forwardRef(({
    id,
    name,
    label,
    options, // Array di oggetti: [{ value: '...', label: '...' }]
    defaultOptionLabel = 'Seleziona un\'opzione', // Testo per l'opzione di default
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
    className = '',
    labelClassName = '',
    ...rest
}, ref) => {
    // Stili base per il select
    const baseSelectStyles = `
        block w-full px-4 py-2 text-base text-gray-800 bg-pink-50
        border border-gray-300 rounded-md
        focus:outline-none focus:ring-1 focus:ring-pink-200 focus:border-pink-200
        transition-colors duration-200 ease-in-out
        disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
        appearance-none
        pr-8 cursor-pointer
    `;

    // Stili per l'errore
    const errorSelectStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
    const errorTextStyles = 'text-sm text-red-600 mt-1';

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={id || name} // Collega la label al select
                    className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
                >
                    {label}
                </label>
            )}
            <div className="relative"> {/* Contenitore per l'icona della freccia */}
                <select
                    ref={ref} // Passa il ref all'elemento select
                    id={id || name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={`${baseSelectStyles} ${errorSelectStyles}`}
                    {...rest} // Includi tutte le altre props
                >
                    {/* Opzione di default non selezionabile */}
                    <option value="" disabled={true}>
                        {defaultOptionLabel}
                    </option>
                    {/* Mappa le opzioni passate tramite props */}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {/* Icona freccia personalizzata per migliorare l'estetica */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
            {error && <p className={errorTextStyles}>{error}</p>}
        </div>
    );
});

SelectInput.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired, // Le opzioni sono obbligatorie
    defaultOptionLabel: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    error: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
};

SelectInput.displayName = 'SelectInput';

export default SelectInput;
