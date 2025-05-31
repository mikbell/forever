import React from 'react';
import { assets } from "../assets/assets";
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const companyLinks = [
        { name: "Home", path: "/" },
        { name: "Chi siamo", path: "/about" },
        { name: "Delivery", path: "/delivery" },
        { name: "Privacy policy", path: "/privacy" },
    ];

    const contactInfo = [
        { text: "+39-123-456-7890", href: "tel:+391234567890", label: "Chiama il nostro numero" },
        { text: "contact@foreveryou.com", href: "mailto:contact@foreveryou.com", label: "Invia una email a contact@foreveryou.com" },
    ];

    return (
        <footer className="text-gray-700 pt-16 sm:pt-20 md:pt-24" aria-labelledby="footer-heading">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 id="footer-heading" className="sr-only">Informazioni piè di pagina e navigazione</h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-10 sm:pb-12 md:pb-16">

                    <div className="md:col-span-12 lg:col-span-5">
                        <Link to="/" className="inline-block mb-5" aria-label="Homepage Forever You">
                            <img src={assets.logo} className='w-32 sm:w-36' alt="Forever You Logo" />
                        </Link>
                        <p className="text-sm text-gray-600 leading-relaxed pr-4">
                            La nostra missione è offrirti prodotti di alta qualità con un'esperienza d'acquisto impeccabile. Scopri le ultime tendenze e i classici intramontabili.
                        </p>
                    </div>

                    <div className="md:col-span-6 lg:col-span-3">
                        <h3 className='text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider'>Company</h3>
                        <ul className='flex flex-col gap-2.5 text-sm'>
                            {companyLinks.map(link => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-gray-600 hover:text-gray-900 hover:underline transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-6 lg:col-span-4">
                        <h3 className='text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider'>Get in touch</h3>
                        <ul className='flex flex-col gap-2.5 text-sm'>
                            {contactInfo.map(contact => (
                                <li key={contact.text}>
                                    <a
                                        href={contact.href}
                                        className="text-gray-600 hover:text-gray-900 hover:underline transition-colors break-words"
                                        aria-label={contact.label}
                                    >
                                        {contact.text}
                                    </a>
                                </li>
                            ))}
                            <li className="mt-2 text-gray-600">
                                Via Roma 123, Città, Italia
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-300 pt-6 pb-8 text-center">
                    <p className='text-xs text-gray-500'>
                        &copy; {currentYear} Forever You. Tutti i diritti riservati.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;