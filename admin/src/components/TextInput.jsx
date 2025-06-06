import React from 'react';
import PropTypes from 'prop-types';

const TextInput = React.forwardRef(({
    id,
    name,
    label,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
    readOnly = false,
    className = '',
    labelClassName = '',
    ...rest
}, ref) => {
    // Stili base per l'input
    const baseInputStyles = `
        block w-full px-4 py-2 text-base text-gray-800
        border border-gray-300
        focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-200 focus:bg-blue-50
        transition-colors duration-200 ease-in-out
        placeholder-gray-400
        disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
        read-only:bg-gray-50 read-only:cursor-default
    `;

    // Stili per l'errore
    const errorInputStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
    const errorTextStyles = 'text-sm text-red-600 mt-1';

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={id || name} // Collega la label all'input
                    className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
                >
                    {label}
                </label>
            )}
            <input
                ref={ref} // Passa il ref all'elemento input
                id={id || name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                readOnly={readOnly}
                className={`${baseInputStyles} ${errorInputStyles}`}
                {...rest} // Includi tutte le altre props (es. min, max, maxLength)
            />
            {error && <p className={errorTextStyles}>{error}</p>}
        </div>
    );
});

TextInput.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired, // 'name' è cruciale per i form
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string, // Può anche essere number per type="number"
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    error: PropTypes.string, // Messaggio di errore da visualizzare
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
};

// Assegna un display name per il debugging in React DevTools
TextInput.displayName = 'TextInput';

export default TextInput;