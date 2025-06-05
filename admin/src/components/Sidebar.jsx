import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importa useLocation
import { ChevronLeft, LayoutDashboard, Package, Plus, Users, ListOrdered, Tag, Settings, LogOut } from "lucide-react";

const Sidebar = ({ isOpen, onClose, setToken }) => {
    const location = useLocation(); // Ottieni l'oggetto location corrente

    // Link di navigazione per la dashboard di amministrazione
    const adminNavLinks = [
        { to: "", text: "Dashboard", icon: LayoutDashboard },
        { to: "/create", text: "Crea Prodotto", icon: Plus },
        { to: "/products", text: "Prodotti", icon: Package },
        { to: "/orders", text: "Ordini", icon: ListOrdered },
        { to: "/users", text: "Utenti", icon: Users },
        { to: "/categories", text: "Categorie", icon: Tag },
        { to: "/settings", text: "Impostazioni", icon: Settings },
    ];

    return (
        <>
            {/* Overlay per chiudere la sidebar cliccando fuori */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
                    aria-hidden="true"
                />
            )}

            {/* La Sidebar vera e propria */}
            <div
                id="admin-sidebar"
                className={`fixed top-0 bottom-0 left-0 z-30 w-64 sm:w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out transform
                            ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:shadow-none lg:h-screen lg:flex lg:flex-col lg:border-r lg:border-gray-200`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sidebar-title"
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 lg:hidden">
                    <h2 id="sidebar-title" className="text-lg font-semibold text-gray-800">Menu Amministrazione</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Chiudi menu"
                        className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-500"
                    >
                        <ChevronLeft className='w-6 h-6 text-gray-600' />
                    </button>
                </div>
                <nav className='py-2 flex-grow'>
                    <ul>
                        {adminNavLinks.map(link => {
                            // Determina se il link è attivo
                            const isActive = location.pathname === link.to;

                            return (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        onClick={onClose} // Chiudi la sidebar al click su un link (utile su mobile)
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md mx-2 my-1
                                                    ${isActive
                                                ? 'bg-gray-200 text-gray-900' // Stili per link attivo
                                                : 'text-gray-700 hover:bg-gray-100' // Stili per link normale/hover
                                            }`}
                                    >
                                        {link.icon && <link.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-gray-700' : 'text-gray-500'}`} />}
                                        {link.text}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => setToken('')}
                        className="flex items-center w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
