import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, images, name, price }) => {
    const { currency } = useContext(ShopContext);

    const primaryImageUrl = (images && Array.isArray(images) && images.length > 0)
        ? images[0]
        : `https://placehold.co/400x400/CCCCCC/333333?text=${encodeURIComponent(name || 'Prodotto')}`;

    return (
        <Link
            to={`/product/${id}`}
            className="group block overflow-hidden rounded-lg border border-gray-200 shadow-sm
                       hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                       focus-visible:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1" // Added subtle lift on hover
            aria-label={`Visualizza i dettagli per ${name || 'questo prodotto'}`} // Improved aria-label fallback
        >
            {/* Contenitore dell'immagine con aspect ratio fisso */}
            <div className="aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                <img
                    src={primaryImageUrl}
                    alt={name || 'Immagine del prodotto'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    // Gestore di errore per l'immagine: se l'URL non carica, mostra un placeholder generico
                    onError={(e) => {
                        e.target.onerror = null; // Evita loop infiniti di fallback
                        e.target.src = 'https://placehold.co/400x400/E0E0E0/666666?text=Immagine+non+disponibile'; // Placeholder più neutro per errore
                    }}
                />
            </div>
            {/* Dettagli del prodotto */}
            <div className="p-3 sm:p-4 bg-white">
                <h3 className="text-sm sm:text-base font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                    {name || 'Prodotto Sconosciuto'} {/* Migliorato fallback per il nome */}
                </h3>
                <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900">
                    {currency}{price !== undefined && price !== null ? price.toFixed(2) : 'N/A'} {/* Controllo più robusto per il prezzo */}
                </p>
            </div>
        </Link>
    );
};

ProductItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    images: PropTypes.arrayOf(PropTypes.string), // Assicurati che sia un array di stringhe
    name: PropTypes.string,
    price: PropTypes.number,
};

ProductItem.defaultProps = {
    images: [],
    name: 'Prodotto',
    price: 0,
};

export default ProductItem;
