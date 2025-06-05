import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { Menu, ChevronLeft } from "lucide-react"; 

const Navbar = ({ navbarRef, toggleSidebar }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuToggleRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
                mobileMenuToggleRef.current?.focus();
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobileMenuOpen]);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav
            ref={navbarRef}
            className='shadow-md py-4 px-4 sm:px-6 lg:px-8 font-medium bg-white text-gray-700'
        >
            <div className='container mx-auto flex items-center justify-between'>
                {/* Logo e link alla Dashboard principale */}
                <Link to="/" aria-label="Dashboard Amministratore - Torna alla pagina principale">
                    <img src={assets.logo} className='w-32 sm:w-36' alt="Logo del Sito" />
                </Link>

                {/* Pulsante per toggle sidebar (solo per mobile o se la sidebar è nascosta) */}
                <div className='flex items-center gap-3 sm:gap-4'>
                    <button
                        type="button"
                        onClick={toggleSidebar} // Assumi che questa prop venga passata dal componente padre per gestire l'apertura/chiusura della sidebar
                        aria-label="Toggle Sidebar"
                        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 cursor-pointer lg:hidden" // Mostra solo su schermi piccoli se hai una sidebar fissa su desktop
                    >
                        <Menu className='w-6 h-6 text-gray-600' />
                    </button>
                </div>

                {/* La sidebar mobile non è più una Navbar, ma un componente separato.
                    Qui si gestisce solo il toggling della sidebar. */}
                {isMobileMenuOpen && (
                    <div
                        onClick={closeMobileMenu}
                        className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
                        aria-hidden="true"
                    />
                )}
                {/* Il contenuto della sidebar mobile andrebbe in un componente separato, gestito dal genitore
                    e aperto/chiuso tramite lo stato `isMobileMenuOpen` e la prop `toggleSidebar` */}
                <div
                    id="mobile-menu-sidebar"
                    className={`fixed top-0 bottom-0 right-0 z-30 w-64 sm:w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out transform lg:hidden
                                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="mobile-menu-title"
                >
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 id="mobile-menu-title" className="text-lg font-semibold text-gray-800">Menu Amministrazione</h2>
                        <button
                            type="button"
                            onClick={closeMobileMenu}
                            aria-label="Chiudi menu"
                            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-500"
                        >
                            <ChevronLeft className='w-6 h-6 text-gray-600' />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;