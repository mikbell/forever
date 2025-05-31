import React, { useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Search, X } from "lucide-react";

const SearchBar = ({ navbarHeight }) => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const inputRef = useRef(null);
    const searchBarRef = useRef(null);
    const navigate = useNavigate(); // Inizializza useNavigate

    // Effetto per gestire il focus dell'input quando la barra appare
    useEffect(() => {
        if (showSearch) {
            inputRef.current?.focus(); // Focus automatico sull'input
        } else {
            setSearch(''); // Resetta il campo di ricerca quando la barra si chiude
        }
    }, [showSearch, setSearch]);

    // Chiusura della barra di ricerca premendo ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && showSearch) {
                setShowSearch(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showSearch, setShowSearch]);

    // Chiusura della barra di ricerca cliccando all'esterno del pannello di ricerca
    useEffect(() => {
        const handleClickOutside = (event) => {
            const navbarSearchButton = document.querySelector('button[aria-label="Cerca nel sito"]');
            if (navbarSearchButton && navbarSearchButton.contains(event.target)) {
                return;
            }

            if (searchBarRef.current && !searchBarRef.current.contains(event.target) && showSearch) {
                setShowSearch(false);
            }
        };

        if (showSearch) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSearch, setShowSearch]);

    const onSubmitSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            // Reindirizza l'utente alla pagina /collection con il termine di ricerca come parametro 'q'
            navigate(`/collection?q=${encodeURIComponent(search.trim())}`);
            setShowSearch(false); // Chiudi la search bar dopo la ricerca
        }
    };

    const handleClearInput = () => {
        setSearch('');
        inputRef.current?.focus();
    };

    return (
        <div
            className={`
                sticky w-full bg-white shadow-md z-[9]
                overflow-hidden
                transition-all duration-300 ease-in-out
                ${showSearch ? 'max-h-screen py-4' : 'max-h-0 py-0'}
                ${showSearch ? 'border-b border-gray-200' : ''}
            `}
            style={{ top: `${navbarHeight}px` }}
        >
            <div
                ref={searchBarRef}
                className='
                    container mx-auto flex items-center justify-between gap-3
                    px-4 sm:px-6 lg:px-8
                '
                role="search"
                aria-label="Barra di ricerca del sito"
            >
                <form onSubmit={onSubmitSearch} className='flex-1 flex items-center border border-gray-300 rounded-full focus-within:border-gray-500 transition-colors duration-200'>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder='Cerca prodotti, categorie...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='flex-1 outline-none bg-inherit text-base px-4 py-2 rounded-l-full'
                        aria-label="Inserisci termine di ricerca"
                    />

                    {search && (
                        <X
                            onClick={handleClearInput}
                            className='w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 mr-2 transition-colors duration-200'
                            title="Cancella ricerca"
                        />
                    )}

                    <button
                        type="submit"
                        aria-label="Avvia ricerca"
                        className='p-2 rounded-full text-gray-600 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200 cursor-pointer'
                    >
                        <Search className='w-6 h-6' />
                    </button>
                </form>

                <button
                    onClick={() => setShowSearch(false)}
                    type="button"
                    aria-label="Chiudi barra di ricerca"
                    className='p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer'
                >
                    <X className='w-6 h-6 text-gray-600' />
                </button>
            </div>
        </div>
    );
}

export default SearchBar;