import React from 'react';
import Title from '../components/Title'; // Assicurati che il percorso sia corretto
import Button from '../components/Button'; // Assicurati che il percorso sia corretto
import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Users, Handshake } from 'lucide-react'; // Icone per i valori
import { assets } from '../assets/assets';

const About = () => {
    return (
        <div className='container mx-auto px-4 py-8 md:py-12'>
            {/* Sezione Introduttiva / Hero */}
            <section className="text-center mb-16 md:mb-24">
                <Title
                    text1="Chi"
                    text2="Siamo"
                    as="h1"
                    align="center"
                    className="mb-4"
                    textContainerClassName="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900"
                    lineClassName="bg-blue-600 w-16 md:w-24 h-1.5"
                />
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    Benvenuti nel nostro mondo, dove la passione per la qualità e il design si unisce all'impegno per l'eccellenza. Scopri la storia dietro ogni prodotto.
                </p>
            </section>

            {/* Sezione La Nostra Storia / Missione */}
            <section className="flex flex-col lg:flex-row items-center gap-12 mb-16 md:mb-24">
                <div className="lg:w-1/2">
                    <img
                        src={assets.about_img}
                        alt="La Nostra Storia"
                        className="rounded-lg shadow-xl object-cover w-full h-auto"
                    />
                </div>
                <div className="lg:w-1/2">
                    <Title
                        text1="La Nostra"
                        text2="Storia"
                        as="h2"
                        className="mb-4"
                        textContainerClassName="text-3xl md:text-4xl font-bold text-gray-800"
                        lineClassName="bg-blue-500 w-12 h-1"
                    />
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Fondata nel 2020 con l'obiettivo di offrire prodotti unici e di alta qualità, la nostra azienda è cresciuta grazie alla dedizione e alla fiducia dei nostri clienti. Abbiamo iniziato come un piccolo laboratorio artigianale e ora siamo un punto di riferimento per chi cerca stile e durabilità.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Crediamo che ogni articolo debba raccontare una storia e riflettere l'impegno che mettiamo nella sua creazione. Dal design alla selezione dei materiali, ogni fase è curata nei minimi dettagli per garantirti un prodotto che ami.
                    </p>
                </div>
            </section>

            {/* Sezione I Nostri Valori */}
            <section className="mb-16 md:mb-24">
                <Title
                    text1="I Nostri"
                    text2="Valori"
                    as="h2"
                    align="center"
                    className="mb-12"
                    textContainerClassName="text-3xl md:text-4xl font-bold text-gray-800"
                    lineClassName="bg-blue-500 w-12 h-1"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100 flex flex-col items-center">
                        <Sparkles className="w-12 h-12 text-blue-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Qualità</h3>
                        <p className="text-gray-600 text-sm">
                            Ci impegniamo a offrire solo prodotti realizzati con i migliori materiali e una lavorazione impeccabile.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100 flex flex-col items-center">
                        <Leaf className="w-12 h-12 text-green-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Sostenibilità</h3>
                        <p className="text-gray-600 text-sm">
                            Promuoviamo pratiche etiche e sostenibili in ogni fase della nostra produzione.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100 flex flex-col items-center">
                        <Users className="w-12 h-12 text-purple-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Comunità</h3>
                        <p className="text-gray-600 text-sm">
                            Crediamo nel costruire relazioni solide con i nostri clienti e fornitori.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100 flex flex-col items-center">
                        <Handshake className="w-12 h-12 text-orange-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Trasparenza</h3>
                        <p className="text-gray-600 text-sm">
                            Operiamo con onestà e chiarezza in tutte le nostre interazioni.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sezione Call to Action */}
            <section className="text-center py-16 rounded-lg shadow-inner">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Hai domande o vuoi saperne di più?
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                    Siamo qui per aiutarti. Contattaci in qualsiasi momento!
                </p>
                <Link to="/contact">
                    <Button variant="primary" size="lg" className="font-semibold">
                        Contattaci
                    </Button>
                </Link>
            </section>
        </div>
    );
};

export default About;
