import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const latestProducts = useMemo(() => {
        if (!products || products.length === 0) {
            return [];
        }
        return products.slice(0, 10);
    }, [products]);

    return (
        <section className="my-12 py-8 sm:my-16 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50" aria-labelledby="latest-collection-title">
            <div className="text-center mb-10 md:mb-14">
                <Title
                    text1={"Our Latest"}
                    text2={"Collections"}
                    as="h2"
                    id="latest-collection-title"
                />
                <p className="max-w-xl lg:max-w-2xl mx-auto mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                    Esplora le nostre ultime novità, selezionate con cura per offrirti stile e qualità. Trova i pezzi perfetti per aggiornare il tuo look.
                </p>
            </div>

            {latestProducts.length > 0 ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                    {latestProducts.map((item) => (
                        <ProductItem
                            key={item.id}
                            id={item.id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-lg text-gray-500">Al momento non ci sono nuovi prodotti da mostrare.</p>
                </div>
            )}
        </section>
    );
};

export default LatestCollection;