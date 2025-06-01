import React from 'react';
import Title from '../components/Title'; // Assicurati che il percorso sia corretto
import Button from '../components/Button'; // Assicurati che il percorso sia corretto
import { Link } from 'react-router-dom';
import { Truck, Clock, Package, MapPin, Globe, DollarSign } from 'lucide-react'; // Icone per la pagina

const DeliveryPage = () => {
    return (
        <div>
            {/* Sezione Introduttiva / Hero */}
            <section className="text-center mb-12 md:mb-16">
                <Title
                    text1="Informazioni sulla"
                    text2="Spedizione"
                    as="h1"
                    align="center"
                    className="mb-4"
                    textContainerClassName="text-2xl md:text-3xl lg:text-4xl"
                    lineClassName="bg-blue-600 w-16 md:w-24 h-1.5"
                />
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    Ci impegniamo a consegnare i tuoi ordini in modo rapido e sicuro. Scopri le nostre opzioni di spedizione e i tempi di consegna stimati.
                </p>
            </section>

            {/* Sezione Opzioni di Spedizione */}
            <section className="mb-16 md:mb-24">
                <Title
                    text1="Le Nostre"
                    text2="Opzioni"
                    as="h2"
                    align="center"
                    className="mb-12"
                    textContainerClassName="text-3xl md:text-4xl font-bold text-gray-800"
                    lineClassName="bg-blue-500 w-12 h-1"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Opzione Spedizione Standard */}
                    <div className="p-8 bg-white rounded-lg shadow-lg border border-gray-100 flex flex-col items-center text-center">
                        <Truck className="w-16 h-16 text-blue-600 mb-6" />
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Spedizione Standard</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            La nostra opzione di spedizione più economica, ideale per ordini non urgenti.
                        </p>
                        <ul className="text-left text-gray-700 space-y-2 mb-6 w-full max-w-xs">
                            <li className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-500" />
                                Tempo di consegna: <span className="font-medium">3-5 giorni lavorativi</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-gray-500" />
                                Costo: <span className="font-medium">€5.99</span> (gratuita per ordini superiori a €50)
                            </li>
                        </ul>
                        <Button variant="outline" size="md">
                            Maggiori Dettagli
                        </Button>
                    </div>

                    {/* Opzione Spedizione Express */}
                    <div className="p-8 bg-white rounded-lg shadow-lg border border-gray-100 flex flex-col items-center text-center">
                        <Package className="w-16 h-16 text-green-600 mb-6" />
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Spedizione Express</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Per chi ha fretta! Ricevi il tuo ordine in tempi record.
                        </p>
                        <ul className="text-left text-gray-700 space-y-2 mb-6 w-full max-w-xs">
                            <li className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-500" />
                                Tempo di consegna: <span className="font-medium">1-2 giorni lavorativi</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-gray-500" />
                                Costo: <span className="font-medium">€9.99</span>
                            </li>
                        </ul>
                        <Button variant="primary" size="md">
                            Scegli Express
                        </Button>
                    </div>
                </div>
            </section>

            {/* Sezione Monitoraggio Ordine */}
            <section className="mb-16 md:mb-24">
                <Title
                    text1="Monitora il tuo"
                    text2="Ordine"
                    as="h2"
                    align="center"
                    className="mb-8"
                    textContainerClassName="text-3xl md:text-4xl font-bold text-gray-800"
                    lineClassName="bg-blue-500 w-12 h-1"
                />
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center max-w-2xl mx-auto">
                    <MapPin className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Una volta spedito il tuo ordine, riceverai un'email di conferma con un numero di tracking. Potrai utilizzare questo numero per monitorare lo stato della tua spedizione direttamente dal sito del corriere.
                    </p>
                    <Link to="/orders"> {/* Assumi una pagina /orders per visualizzare gli ordini */}
                        <Button variant="secondary" size="lg">
                            Visualizza i miei Ordini
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Sezione Spedizioni Internazionali */}
            <section className="mb-16 md:mb-24">
                <Title
                    text1="Spedizioni"
                    text2="Internazionali"
                    as="h2"
                    align="center"
                    className="mb-8"
                    textContainerClassName="text-3xl md:text-4xl font-bold text-gray-800"
                    lineClassName="bg-blue-500 w-12 h-1"
                />
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center max-w-2xl mx-auto">
                    <Globe className="w-16 h-16 text-orange-600 mx-auto mb-6" />
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Effettuiamo spedizioni in molti paesi del mondo. I tempi e i costi di consegna per le spedizioni internazionali possono variare a seconda della destinazione e delle normative doganali.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Eventuali dazi doganali o tasse di importazione sono a carico del destinatario. Ti consigliamo di verificare le normative locali prima di effettuare un ordine.
                    </p>
                    <Link to="/contact">
                        <Button variant="outline" size="md">
                            Contattaci per Info Internazionali
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Sezione Call to Action Finale */}
            <section className="text-center py-16 bg-blue-50 rounded-lg shadow-inner">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Hai ancora dubbi sulla spedizione?
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                    Il nostro team di supporto è a tua disposizione per qualsiasi domanda.
                </p>
                <Link to="/contact">
                    <Button variant="primary" size="lg" className="font-semibold">
                        Contatta il Supporto
                    </Button>
                </Link>
            </section>
        </div>
    );
};

export default DeliveryPage;
