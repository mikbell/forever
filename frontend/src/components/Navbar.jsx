import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'; // Importa useCallback
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import ResponsiveNavLink from "./ResponsiveNavLink";
import { ChevronLeft, Search, CircleUserRound, Menu, ShoppingCart } from "lucide-react";
import { ShopContext } from '../context/ShopContext';

const Navbar = ({ navbarRef }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    // Riferimenti per chiudere i menu cliccando fuori
    const profileDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null); // Nuovo riferimento per il menu mobile sidebar

    // Get necessary values from ShopContext
    const { getCartCount, navigate, token, setToken, setCartItems, setShowSearch } = useContext(ShopContext);

    // ---
    // ## Funzioni di Utilità
    // ---

    // Funzione di logout memoizzata con useCallback
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken('');
        setCartItems({}); // Svuota il carrello locale al logout
        navigate('/auth');
        setIsProfileDropdownOpen(false); // Chiude il dropdown dopo il logout
    }, [setToken, setCartItems, navigate]); // Dipendenze per useCallback

    // Funzione per chiudere il menu mobile
    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    // ---
    // ## Effetti Collaterali (useEffect)
    // ---

    // Effect to close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Controlla se il click è avvenuto all'interno del dropdown o del suo bottone di toggle
            // Aggiungi un controllo per il bottone di toggle del profilo per evitare che chiuda il menu subito dopo l'apertura
            const profileToggleButton = profileDropdownRef.current?.previousElementSibling; // Assumendo che il bottone sia il fratello precedente
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target) &&
                profileToggleButton && !profileToggleButton.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []); // Non ci sono dipendenze che cambiano, quindi si esegue solo al mount/unmount

    // Effect to close mobile menu on Escape key press or click outside
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && isMobileMenuOpen) {
                closeMobileMenu();
                // Rimettere il focus sul pulsante che ha aperto il menu per accessibilità
                document.getElementById('mobile-menu-toggle-button')?.focus();
            }
        };

        const handleClickOutside = (event) => {
            // Se il menu è aperto e il click non è dentro al menu o sul suo pulsante di toggle
            const mobileToggleButton = document.getElementById('mobile-menu-toggle-button');
            if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
                mobileToggleButton && !mobileToggleButton.contains(event.target)) {
                closeMobileMenu();
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen, closeMobileMenu]); // Dipende da isMobileMenuOpen e closeMobileMenu

    // ---
    // ## Dati e Funzioni di Render
    // ---

    // Navigation links for the main menu and mobile menu
    const navLinks = [
        { to: "/", text: "home" },
        { to: "/collection", text: "collezione" },
        { to: "/about", text: "chi siamo" },
        { to: "/contact", text: "contattaci" },
    ];

    // Dynamic profile dropdown actions based on authentication status
    // Memoizzata con useCallback per evitare ricreazione ad ogni render
    const getProfileActions = useCallback(() => {
        if (token) {
            // User is logged in
            return [
                { label: "Il mio profilo", href: "/profile" },
                { label: "Ordini", href: "/orders" },
                { label: "Logout", action: logout }, // Usa la funzione di logout memoizzata
            ];
        } else {
            // User is logged out
            return [
                { label: "Login", href: "/auth?mode=login" }, // Link to your combined Auth page
                { label: "Registrati", href: "/auth?mode=register" }, // Link to your combined Auth page
            ];
        }
    }, [token, logout]); // Dipende dal token e dalla funzione logout

    // Funzione da passare a ResponsiveNavLink per chiudere il menu mobile dopo la navigazione
    const handleMobileNavLinkClick = useCallback(() => {
        closeMobileMenu();
    }, [closeMobileMenu]);

    return (
        <nav
            ref={navbarRef}
            className='sticky z-10 w-full top-0 shadow-md py-4 px-4 sm:px-6 lg:px-8 font-medium bg-white text-gray-700'
        >
            <div className='container mx-auto flex items-center justify-between'>
                <Link to="/" aria-label="Homepage - Torna alla pagina principale">
                    <img src={assets.logo} className='w-32 sm:w-36' alt="Logo del Sito" />
                </Link>

                <ul className='hidden lg:flex items-center gap-1'>
                    {navLinks.map(link => (
                        <li key={link.to}>
                            <ResponsiveNavLink to={link.to} text={link.text} />
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={() => setShowSearch(true)}
                        type="button"
                        aria-label="Cerca nel sito"
                        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 cursor-pointer"
                    >
                        <Search className="w-6 h-6 text-gray-600" />
                    </button>

                    <div className='relative' ref={profileDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsProfileDropdownOpen(prev => !prev)}
                            aria-expanded={isProfileDropdownOpen}
                            aria-controls="profile-dropdown"
                            aria-label="Menu utente"
                            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 cursor-pointer"
                        >
                            <CircleUserRound className="w-6 h-6 text-gray-600" />
                        </button>
                        {isProfileDropdownOpen && (
                            <div
                                id="profile-dropdown"
                                className='absolute z-20 right-0 mt-2 w-48 border border-gray-300 bg-white rounded-md shadow-xl py-1' // Aggiunto padding y
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu-button" // Questo id non è definito nel tuo bottone, dovrebbe puntare all'id del bottone che lo apre
                            >
                                {getProfileActions().map(item => (
                                    item.href ? (
                                        <Link
                                            key={item.label}
                                            to={item.href}
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <button
                                            key={item.label}
                                            onClick={item.action}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            {item.label}
                                        </button>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    <Link to="/cart" className='relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500' aria-label={`Carrello, ${getCartCount()} articoli`}>
                        <ShoppingCart className='w-6 h-6 text-gray-600' />
                        {getCartCount() > 0 && ( // Only show count if greater than 0
                            <span className='absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 bg-black text-white text-[11px] font-semibold rounded-full'>
                                {getCartCount()}
                            </span>
                        )}
                    </Link>

                    <button
                        id="mobile-menu-toggle-button" // Aggiunto un ID per accessibilità
                        type="button"
                        onClick={() => setIsMobileMenuOpen(prev => !prev)}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu-sidebar"
                        aria-label={isMobileMenuOpen ? "Chiudi menu navigazione" : "Apri menu navigazione"}
                        className='lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500'
                    >
                        {isMobileMenuOpen
                            ? <ChevronLeft className='w-6 h-6 text-gray-600' />
                            : <Menu className='w-6 h-6 text-gray-600' />
                        }
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div
                        onClick={closeMobileMenu} // Il click sull'overlay chiude il menu
                        className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
                        aria-hidden="true"
                    />
                )}

                <div
                    id="mobile-menu-sidebar"
                    ref={mobileMenuRef} // Associa il ref al div del menu
                    className={`fixed top-0 bottom-0 right-0 z-30 w-64 sm:w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out transform lg:hidden
                                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="mobile-menu-title"
                >
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 id="mobile-menu-title" className="text-lg font-semibold text-gray-800">Menu</h2>
                        <button
                            type="button"
                            onClick={closeMobileMenu}
                            aria-label="Chiudi menu"
                            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-500"
                        >
                            <ChevronLeft className='w-6 h-6 text-gray-600' />
                        </button>
                    </div>
                    <nav className='py-2'>
                        <ul>
                            {navLinks.map(link => (
                                <li key={`mobile-${link.to}`}>
                                    <ResponsiveNavLink
                                        to={link.to}
                                        text={link.text}
                                        variant='mobile'
                                        onNavigate={handleMobileNavLinkClick} // Usa la funzione memoizzata
                                    />
                                </li>
                            ))}
                            {/* Aggiungi le azioni del profilo anche nel menu mobile per completezza */}
                            {getProfileActions().map(item => (
                                <li key={`mobile-profile-${item.label}`}>
                                    {item.href ? (
                                        <Link
                                            to={item.href}
                                            onClick={handleMobileNavLinkClick}
                                            className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => { item.action(); handleMobileNavLinkClick(); }}
                                            className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            {item.label}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;