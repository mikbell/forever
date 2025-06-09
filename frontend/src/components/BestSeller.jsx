import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
    const { products } = useContext(ShopContext);

    const bestSellerProducts = useMemo(() => {
        if (!products || products.length === 0) {
            return [];
        }
        const filtered = products.filter((item) => item.bestseller === true);
        return filtered.slice(0, 5);
    }, [products]);

    return (
        <section className="my-12 py-8 sm:my-16 sm:py-12 px-4 sm:px-6 lg:px-8" aria-labelledby="bestseller-section-title">
            <div className="text-center mb-10 md:mb-14">
                <Title
                    text1={"I nostri"}
                    text2={"Best Seller"}
                    as="h2" 
                    id="bestseller-section-title" 
                />
                <p className="max-w-xl lg:max-w-2xl mx-auto mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                    Scopri i prodotti più amati e acquistati dai nostri clienti. Qualità e stile che conquistano, scelti appositamente per te!
                </p>
            </div>

            {bestSellerProducts.length > 0 ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                    {bestSellerProducts.map((item) => (
                        <ProductItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            images={item.images}
                            price={item.price}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-lg text-gray-500">Al momento non abbiamo bestseller da mostrarti.</p>
                </div>
            )}
        </section>
    );
};

export default BestSeller;