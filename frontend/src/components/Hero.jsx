import React from 'react';
import { assets } from '../assets/assets';
import Button from './Button';

const Hero = () => {
    return (
        <section aria-labelledby="hero-main-title" className="flex flex-col sm:flex-row border border-gray-300 bg-white">

            {/* Hero left - Contenuto Testuale */}
            <div className="w-full sm:w-1/2 flex flex-col items-center justify-center text-center sm:text-left py-10 sm:py-16 md:py-20 lg:py-24 px-6">
                <div className="max-w-md text-[#414141]">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                        <span className='w-10 md:w-12 h-0.5 bg-[#414141]'></span> {/* Linea decorativa */}
                        <p className='uppercase font-medium text-xs md:text-sm tracking-wider'>I nostri best seller</p>
                    </div>

                    <h1
                        id="hero-main-title"
                        className='text-4xl sm:text-5xl lg:text-6xl py-2 sm:py-3 prata-regular leading-tight'
                    >
                        Ultimi Arrivi
                    </h1>

                    <div className='mt-4 sm:mt-6'>
                        <Button
                            to="/collection"
                            variant="primary"
                            size="md"
                            iconRight={
                                <span
                                    className='block w-10 md:w-12 h-[2px] bg-white 
                                               transform scale-x-50 group-hover:scale-x-100 
                                               transition-transform duration-200 ease-in-out origin-left 
                                               group-focus-visible:scale-x-100'
                                />
                            }
                            className="uppercase tracking-wide 
                                       py-3 px-8  
                                       text-sm md:text-base 
                                       group"
                        >
                            Scopri di più
                        </Button>
                    </div>
                </div>
            </div>

            {/* Hero right - Immagine */}
            <div className="w-full sm:w-1/2 h-64 sm:h-auto">
                <img
                    src={assets.hero_img}
                    alt="Modella che indossa i capi della nuova collezione 'Latest Arrivals'"
                    className='w-full h-full object-cover'
                />
            </div>

        </section>
    );
}

export default Hero;