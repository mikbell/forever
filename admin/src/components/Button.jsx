import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Button = ({
    as,
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    iconLeft,
    iconRight,
    fullWidth = false,
    disabled = false,
    onClick,
    href,
    to,
    className = '',
    isActive = false,
    ...rest
}) => {
    // Determina l'elemento da renderizzare
    let Element = 'button';
    if (to) {
        Element = Link;
    } else if (as === 'a' || href) {
        Element = 'a';
    } else if (as) {
        Element = as;
    }

    // Stili di base comuni a tutti i bottoni
    const baseStyles = `
        inline-flex items-center justify-center uppercase border
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        transition-all duration-150 ease-in-out
        disabled:cursor-not-allowed cursor-pointer active:scale-95
    `;

    // Stili per le varianti (inclusi gli stati hover/focus e disabilitato)
    const variantStyles = {
        primary: `bg-black text-white border-transparent
                  hover:bg-gray-700 focus-visible:ring-gray-500
                  active:bg-gray-800 active:ring-gray-600 active:ring-offset-1 // Active style
                  disabled:bg-gray-500 disabled:text-gray-300`,
        secondary: `bg-gray-200 text-gray-700 border-gray-200
                    hover:bg-gray-300 focus-visible:ring-gray-400
                    active:bg-gray-400 active:ring-gray-500 active:ring-offset-1 // Active style
                    disabled:bg-gray-100 disabled:text-gray-400`,
        outline: `bg-transparent text-gray-700 border-gray-300
                  hover:bg-gray-50 focus-visible:ring-blue-500
                  active:bg-blue-100 active:border-blue-600 active:ring-blue-600 active:ring-offset-1 // Active style
                  disabled:text-gray-400 disabled:border-gray-200 disabled:hover:bg-transparent`,
        ghost: `bg-transparent text-gray-700 border-transparent
                hover:bg-gray-100 focus-visible:ring-blue-500
                active:bg-gray-200 active:ring-blue-600 active:ring-offset-1 // Active style
                disabled:text-gray-400 disabled:hover:bg-transparent`,
        danger: `bg-red-600 text-white border-transparent
                 hover:bg-red-700 focus-visible:ring-red-500
                 active:bg-red-800 active:ring-red-600 active:ring-offset-1 // Active style
                 disabled:bg-red-300 disabled:text-red-100`,
        dangerOutline: `bg-transparent text-red-600 border-red-500
                        hover:bg-red-50 focus-visible:ring-red-500
                        active:bg-red-100 active:border-red-600 active:ring-red-600 active:ring-offset-1 // Active style
                        disabled:text-red-300 disabled:border-red-300 disabled:hover:bg-transparent`,
    };

    // Stili per lo stato "active" (questi sovrascrivono gli stili normali della variante)
    // Scegli uno stile che indichi chiaramente l'attivazione.
    // Esempio: bordo/sfondo/testo più scuro, o un colore diverso
    const activeStyles = {
        primary: `!bg-gray-800 !border-gray-800`,
        secondary: `!bg-gray-400 !border-gray-400 !text-gray-900`,
        outline: `!bg-blue-600 !text-white !border-blue-600`,
        ghost: `!bg-blue-500 !text-white`,
        danger: `!bg-red-800 !border-red-800`,
        dangerOutline: `!bg-red-600 !text-white !border-red-600`,
    };

    // Stili per le dimensioni (padding e dimensione testo)
    const isIconOnly = !children && (iconLeft || iconRight);
    const sizeStyles = {
        sm: `text-xs ${isIconOnly ? 'p-1.5' : 'px-3 py-1.5'}`,
        md: `text-sm ${isIconOnly ? 'p-2' : 'px-4 py-2'}`,
        lg: `text-base ${isIconOnly ? 'p-3' : 'px-5 py-2.5'}`,
    };

    // Classi per la larghezza piena
    const fullWidthStyles = fullWidth ? "w-full" : "";

    // Props specifiche per l'elemento disabilitato
    let disabledProps = {};
    if (disabled) {
        if (Element === 'a' || Element === Link) {
            disabledProps = {
                'aria-disabled': true,
                tabIndex: -1,
                style: { ...rest.style, pointerEvents: 'none' }
            };
        } else {
            disabledProps.disabled = true;
        }
    }

    // Combina tutte le classi
    const combinedClassName = [
        baseStyles,
        variantStyles[variant] || variantStyles.primary,
        sizeStyles[size] || sizeStyles.md,
        fullWidthStyles,
        isActive ? (activeStyles[variant] || '') : '', // Applica stili attivi se isActive è true
        className,
    ].join(' ').replace(/\s+/g, ' ').trim();

    // Dimensioni standard per le icone interne
    const iconSizeClasses = {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };
    const currentIconSize = iconSizeClasses[size] || iconSizeClasses.md;

    const content = (
        <>
            {iconLeft && React.cloneElement(iconLeft, {
                className: `shrink-0 ${currentIconSize} ${children ? (size === 'sm' ? "mr-1" : "mr-1.5") : ""} ${iconLeft.props.className || ''}`
            })}
            {children}
            {iconRight && React.cloneElement(iconRight, {
                className: `shrink-0 ${currentIconSize} ${children ? (size === 'sm' ? "ml-1" : "ml-1.5") : ""} ${iconRight.props.className || ''}`
            })}
        </>
    );

    // Assembla le props finali per l'elemento
    const elementProps = {
        className: combinedClassName,
        onClick: disabled ? undefined : onClick,
        type: Element === 'button' ? type : undefined,
        href: Element === 'a' ? href : undefined,
        to: Element === Link ? to : undefined,
        ...disabledProps,
        ...rest,
    };

    // Aggiungi rel="noopener noreferrer" per link esterni per sicurezza
    if (Element === 'a' && elementProps.target === '_blank' && !elementProps.rel) {
        elementProps.rel = 'noopener noreferrer';
    }

    return (
        <Element {...elementProps}>
            {content}
        </Element>
    );
};

Button.propTypes = {
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
    children: PropTypes.node,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'dangerOutline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    iconLeft: PropTypes.element,
    iconRight: PropTypes.element,
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    href: PropTypes.string,
    to: PropTypes.string,
    className: PropTypes.string,
    isActive: PropTypes.bool,
};

export default Button;