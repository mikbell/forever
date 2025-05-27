import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);

    const imageUrl = (image && image.length > 0 && image[0])
        ? image[0]
        : `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(name || 'Prodotto')}`; // Un placeholder più informativo

    return (
        <Link
            to={`/product/${id}`}
            className="group block overflow-hidden rounded-lg border border-gray-200 shadow-sm 
                       hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
                       focus-visible:ring-offset-2 transition-all duration-300 ease-in-out"
            aria-label={`Visualizza i dettagli per ${name}`}
        >
            <div className="aspect-square overflow-hidden bg-gray-50">
                <img
                    src={imageUrl}
                    alt={name || 'Immagine del prodotto'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
            </div>
            <div className="p-3 sm:p-4 bg-white">
                <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                    {name || 'Nome Prodotto Indisponibile'}
                </h3>
                <p className="mt-1 text-base font-semibold text-gray-900">
                    {currency}{price ? price.toFixed(2) : 'N/A'}
                </p>
            </div>
        </Link>
    );
};

ProductItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    price: PropTypes.number,
};

ProductItem.defaultProps = {
    image: [],
    name: 'Prodotto',
    price: 0,
};

export default ProductItem;