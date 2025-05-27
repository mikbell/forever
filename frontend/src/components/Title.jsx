import React from 'react';
import PropTypes from 'prop-types';

const Title = ({
    text1,
    text2,
    as: Component = 'h2',
    className = '',
    textContainerClassName = '',
    lineClassName = ''
}) => {
    return (
        <div className={`inline-flex gap-2.5 items-center mb-4 uppercase ${className}`}>
            <Component className={`text-sm sm:text-base ${textContainerClassName}`}>
                {text1 && (
                    <span className="text-gray-500 font-normal tracking-wider mr-1.5">
                        {text1}
                    </span>
                )}
                <span className='text-gray-800 font-semibold tracking-wide'>
                    {text2}
                </span>
            </Component>
            <span
                className={`block w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700 ${lineClassName}`}
            ></span>
        </div>
    );
};

Title.propTypes = {
    text1: PropTypes.string,
    text2: PropTypes.string.isRequired,
    as: PropTypes.elementType,
    className: PropTypes.string,
    textContainerClassName: PropTypes.string,
    lineClassName: PropTypes.string,
};

Title.defaultProps = {
    text1: '',
    as: 'h2',
    className: '',
    textContainerClassName: '',
    lineClassName: '',
};

export default Title;