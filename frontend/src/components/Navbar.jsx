import React, { useState, useEffect, useRef, useContext } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import ResponsiveNavLink from "./ResponsiveNavLink";
import { ChevronLeft, Search, CircleUserRound, Menu, ShoppingCart } from "lucide-react";
import { ShopContext } from '../context/ShopContext';

const Navbar = ({ navbarRef }) => { // Accetta navbarRef come prop
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const mobileMenuToggleRef = useRef(null);

    const { setShowSearch, getCartCount } = useContext(ShopContext);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const navLinks = [
        { to: "/", text: "home" },
        { to: "/collection", text: "collezione" },
        { to: "/about", text: "chi siamo" },
        { to: "/contact", text: "contattaci" },
    ];

    const profileActions = [
        { label: "Il mio profilo", href: "/profile" },
        { label: "Ordini", href: "/orders" },
        { label: "Logout", action: () => { console.log("Logout eseguito"); setIsProfileDropdownOpen(false); } },
    ];

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleMobileNav = () => {
        closeMobileMenu();
    };

    return (
        <nav
            ref={navbarRef} // Assegna il ref qui
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
                        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
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
                            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                        >
                            <CircleUserRound className="w-6 h-6 text-gray-600" />
                        </button>
                        {isProfileDropdownOpen && (
                            <div
                                id="profile-dropdown"
                                className='absolute z-20 right-0 mt-2 w-48 bg-white rounded-md shadow-xl ring-1 ring-black ring-opacity-5 py-1'
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu-button"
                            >
                                {profileActions.map(item => (
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

                    <Link to="/cart" className='relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500' aria-label="Carrello, 10 articoli">
                        <ShoppingCart className='w-6 h-6 text-gray-600' />
                        <span className='absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-black text-white text-[10px] rounded-full'>
                            {getCartCount()}
                        </span>
                    </Link>

                    <button
                        ref={mobileMenuToggleRef}
                        type="button"
                        onClick={() => setIsMobileMenuOpen(prev => !prev)}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu-sidebar"
                        aria-label={isMobileMenuOpen ? "Chiudi menu navigazione" : "Apri menu navigazione"}
                        className='lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                    >
                        {isMobileMenuOpen
                            ? <ChevronLeft className='w-6 h-6 text-gray-600' />
                            : <Menu className='w-6 h-6 text-gray-600' />
                        }
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div
                        onClick={closeMobileMenu}
                        className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
                        aria-hidden="true"
                    />
                )}

                <div
                    id="mobile-menu-sidebar"
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
                            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500"
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
                                        onNavigate={handleMobileNav}
                                    />
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