import React from 'react';
import { assets } from '../assets/assets'; // Assicurati che il percorso sia corretto
import { Link } from 'react-router-dom'; // Importa Link per il Call to Action

const Hero = () => {
    return (
        <section aria-labelledby="hero-main-title" className="flex flex-col sm:flex-row border border-gray-300 bg-white">

            {/* Hero left - Contenuto Testuale */}
            <div className="w-full sm:w-1/2 flex flex-col items-center justify-center text-center sm:text-left py-10 sm:py-16 md:py-20 lg:py-24 px-6">
                <div className="max-w-md text-[#414141]">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                        <span className='w-10 md:w-12 h-0.5 bg-[#414141]'></span> {/* Linea decorativa */}
                        <p className='uppercase font-medium text-xs md:text-sm tracking-wider'>Our Bestsellers</p>
                    </div>

                    <h1
                        id="hero-main-title"
                        className='text-4xl sm:text-5xl lg:text-6xl py-2 sm:py-3 prata-regular leading-tight'
                    >
                        Latest Arrivals
                    </h1>

                    <div className='mt-4 sm:mt-6'>
                        <Link
                            to="/collection" // Aggiorna questo al tuo percorso corretto
                            className="inline-flex items-center group gap-3 uppercase font-semibold text-sm md:text-base tracking-wide
                                       bg-[#333333] hover:bg-[#222222] text-white
                                       py-3 px-8 rounded-sm shadow-md
                                       transition-all duration-150 ease-in-out
                                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[#414141] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        >
                            Shop now
                            <span className='block w-10 md:w-12 h-0.5 bg-white
                                           transform scale-x-50 group-hover:scale-x-100 transition-transform duration-200 ease-in-out origin-left group-focus-visible:scale-x-100'></span>
                            {/* Alternativa con icona:
                            <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            */}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero right - Immagine */}
            <div className="w-full sm:w-1/2 h-64 sm:h-auto"> {/* Altezza definita per mobile, auto per desktop */}
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