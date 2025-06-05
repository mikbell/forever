import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const RelatedProducts = ({ category, type, productId }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();

            productsCopy = productsCopy.filter(
                (item) => item.category === category && item.type === type
            );

            if (productId) {
                productsCopy = productsCopy.filter(item => item._id !== productId);
            }

            productsCopy.sort(() => Math.random() - 0.5);

            setRelated(productsCopy.slice(0, 5));
        }
    }, [products, category, type, productId]); // Dependencies are correct

    return (
        <div className='my-24'>
            <div className="text-center text-3xl py-2">
                <Title text1="Prodotti" text2="Correlati" />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {related.map((item, index) => (
                    <ProductItem key={index} id={item._id} name={item.name} price={item.price} images={item.images} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;