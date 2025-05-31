import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Star, ShoppingCart } from 'lucide-react';
import Button from '../components/Button';
import RelatedProducts from '../components/RelatedProducts';
import Title from '../components/Title'; // Assuming you have a Title component

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null); // Initialize with null for proper loading state
  const [mainImage, setMainImage] = useState(''); // Renamed for clarity
  const [selectedSize, setSelectedSize] = useState(''); // Renamed for clarity
  const [activeTab, setActiveTab] = useState('description'); // For Description/Reviews tabs

  useEffect(() => {
    const foundProduct = products.find(item => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setMainImage(foundProduct.image[0]);
    } else {
      setProductData(null);
    }
  }, [productId, products]);

  if (!productData) {
    return <div className="flex justify-center items-center h-64 text-gray-600">Caricamento prodotto...</div>;
  }

  return (
    <div className='animate-fadeIn'>
      <div className='flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-20'>

        <div className='flex-1 flex flex-col-reverse gap-4 md:flex-row md:gap-4 lg:gap-6'>
          <div className='flex md:flex-col overflow-x-auto md:overflow-y-auto justify-start md:justify-start md:w-28 w-full gap-3 md:gap-4 no-scrollbar'>
            {productData.image.map((imgSrc, index) => (
              <img
                key={index}
                onClick={() => setMainImage(imgSrc)}
                src={imgSrc}
                alt={`Product thumbnail ${index + 1}`}
                className={`
                                    w-20 h-20 md:w-full md:h-auto object-cover shadow-sm cursor-pointer
                                    transition-all duration-200 ease-in-out
                                `}
              />
            ))}
          </div>
          <div className='flex-grow md:w-auto h-auto min-h-[300px] flex items-center justify-center bg-gray-100 overflow-hidden'>
            <img
              className='w-full h-auto max-h-[600px] object-contain transition-transform duration-300 ease-in-out transform hover:scale-105'
              src={mainImage}
              alt={productData.name}
            />
          </div>
        </div>

        <div className='flex-1 p-2 md:p-0'>
          <h1 className='font-bold text-3xl md:text-4xl leading-tight mb-2 text-gray-800'>{productData.name}</h1>

          {/* Ratings */}
          <div className="flex items-center gap-1 text-yellow-500 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" /> // Fill stars
            ))}
            <p className='ml-2 text-sm text-gray-600'>(122 Recensioni)</p>
          </div>

          {/* Price */}
          <p className='mt-3 text-4xl font-extrabold text-gray-900'>
            {currency}{productData.price.toFixed(2)} {/* Format price */}
          </p>

          {/* Description */}
          <p className='mt-6 text-gray-700 leading-relaxed md:w-4/5'>
            {productData.description}
          </p>

          {/* Size Selection */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div className="my-8">
              <p className='text-lg font-semibold text-gray-800 mb-3'>Seleziona Taglia</p>
              <div className='flex flex-wrap gap-3'> {/* Use flex-wrap for smaller screens */}
                {productData.sizes.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedSize(item)}
                    isActive={item === selectedSize}
                    variant='secondary'
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={() => addToCart(productData._id, selectedSize)}
            disabled={!selectedSize && productData.sizes && productData.sizes.length > 0}
            iconRight={<ShoppingCart />}
            className="mt-6 px-8"
          >
            Aggiungi al carrello
          </Button>

          <hr className='mt-8 mb-6 border-t border-gray-200 sm:w-4/5' />

          {/* Additional Info / Guarantees */}
          <div className='text-sm text-gray-600 flex flex-col gap-2'>
            <p className="flex items-center gap-2"><span className="font-semibold text-gray-800">Garanzia:</span> Prodotto 100% originale.</p>
            <p className="flex items-center gap-2"><span className="font-semibold text-gray-800">Pagamento:</span> Contanti alla consegna disponibile per questo prodotto.</p>
            <p className="flex items-center gap-2"><span className="font-semibold text-gray-800">Reso:</span> Reso e scambio entro 7 giorni.</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews Tabs Section */}
      <div className='mt-20'>
        <div className='flex border-b border-gray-200'>
          <button
            onClick={() => setActiveTab('description')}
            className={`
                            px-6 py-3 text-base font-semibold border-b-2
                            ${activeTab === 'description' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}
                            transition-colors duration-200 focus:outline-none cursor-pointer
                        `}
          >
            Descrizione
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`
                            px-6 py-3 text-base font-semibold border-b-2
                            ${activeTab === 'reviews' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}
                            transition-colors duration-200 focus:outline-none cursor-pointer
                        `}
          >
            Recensioni (122)
          </button>
        </div>
        <div className="p-6 bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg text-sm text-gray-700 leading-relaxed">
          {activeTab === 'description' && (
            <div className="flex flex-col gap-4">
              <p>{productData.description}</p> {/* Using actual description here */}
              {/* You can add more detailed description paragraphs if available in productData */}
              <p>Questo prodotto è realizzato con materiali di alta qualità per garantire durata e comfort. Perfetto per ogni occasione, combina stile e funzionalità in un design unico.</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
              {/* Placeholder for reviews content */}
              <p>Non ci sono ancora recensioni per questo prodotto. Sii il primo a lasciare una recensione!</p>
              {/* In a real app, you'd map through productData.reviews here */}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className='mt-24'> {/* Increased top margin for separation */}
        <RelatedProducts category={productData.category} type={productData.type} productId={productData._id} />
      </div>
    </div>
  );
};

export default Product;