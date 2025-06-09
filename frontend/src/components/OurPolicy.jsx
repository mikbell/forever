import React from 'react';
import PropTypes from 'prop-types';
import { ArrowDownUp, Truck, Headset } from "lucide-react";

const PolicyItem = ({ IconComponent, title, description }) => {
    return (
        <div className="flex flex-col items-center text-center w-full sm:w-auto max-w-xs px-2">
            {IconComponent && (
                <IconComponent
                    className='w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4'
                    aria-hidden="true"
                />
            )}
            <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-snug">{description}</p>
        </div>
    );
};

PolicyItem.propTypes = {
    IconComponent: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};


const OurPolicy = ({ title }) => {
    const policiesData = [
        {
            id: 'exchange',
            icon: ArrowDownUp,
            title: "Politica di Cambio Facile",
            description: "Offriamo una politica di cambio senza problemi per la tua comodità."
        },
        {
            id: 'shipping',
            icon: Truck,
            title: "Spedizione Veloce e Gratuita",
            description: "Goditi la spedizione gratuita su tutti gli ordini superiori a un certo importo."
        },
        {
            id: 'support',
            icon: Headset,
            title: "Supporto Clienti 24/7",
            description: "Il nostro team dedicato è qui per assisterti 24 ore su 24, 7 giorni su 7."
        },
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white" aria-labelledby={title ? "our-policy-section-title" : undefined}>
            <div className="container mx-auto px-4">
                {title && (
                    <h2 id="our-policy-section-title" className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-8 sm:mb-12 md:mb-16">
                        {title}
                    </h2>
                )}
                <div className='flex flex-col sm:flex-row flex-wrap justify-center items-start 
                                gap-y-10 gap-x-6 md:gap-x-8 lg:gap-x-12 
                                text-gray-700'>
                    {policiesData.map((policy) => (
                        <PolicyItem
                            key={policy.id}
                            IconComponent={policy.icon}
                            title={policy.title}
                            description={policy.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

OurPolicy.propTypes = {
    title: PropTypes.string,
};

export default OurPolicy;