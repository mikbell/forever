import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const ResponsiveNavLink = ({ text, to, icon, variant = 'default', onNavigate }) => { // 'default' | 'mobile'

    const handleClick = () => {
        if (onNavigate) {
            onNavigate();
        }
        // La navigazione avverrà comunque tramite NavLink
    };

    if (variant === 'mobile') {
        return (
            <NavLink
                to={to}
                onClick={handleClick}
                className={({ isActive }) =>
                    `flex items-center gap-3 w-full text-left py-3 px-4 border-b border-gray-200
                    transition-colors duration-150 ease-in-out
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-500 
                    ${isActive
                        ? 'bg-gray-100 text-gray-700 font-semibold border-l-4 border-l-gray-600'
                        : 'text-gray-700  hover:bg-gray-100 hover:text-gray-900'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        {icon && React.cloneElement(icon, {
                            className: `w-5 h-5 shrink-0 ${isActive ? 'text-gray-600 text-gray-400' : 'text-gray-500 text-gray-400'}`,
                        })}
                        <span className="flex-grow">{text}</span>
                    </>
                )}
            </NavLink>
        );
    }

    return (
        <NavLink
            to={to}
            className={
                `flex flex-col items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 rounded-md p-2 transition-colors duration-150 ease-in-out`
            }
        >
            {({ isActive }) => (
                <>
                    {icon && React.cloneElement(icon, {
                        className: `w-5 h-5 mb-0.5 transition-colors duration-150 ease-in-out ${isActive
                            ? 'text-gray-600 text-gray-400'
                            : 'text-gray-600 text-gray-400 group-hover:text-gray-800 group-hover:text-gray-200'
                            }`,
                    })}
                    <p className={`uppercase text-sm font-medium transition-colors duration-150 ease-in-out ${isActive
                        ? 'text-gray-600 '
                        : 'text-gray-700  group-hover:text-gray-900'
                        }`}>
                        {text}
                    </p>
                    <hr
                        className={`w-3/5 border-none h-[2px] transition-all duration-150 ease-in-out ${isActive
                            ? 'bg-gray-600 scale-x-100'
                            : 'bg-gray-400 scale-x-0 group-hover:scale-x-100 group-hover:bg-gray-500'
                            }`}
                    />
                </>
            )}
        </NavLink>
    );
};

ResponsiveNavLink.propTypes = {
    text: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.element,
    variant: PropTypes.oneOf(['default', 'mobile']),
};

ResponsiveNavLink.defaultProps = {
    icon: null,
    variant: 'default',
};

export default ResponsiveNavLink;