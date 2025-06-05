import React, { useRef, useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const Main = ({ children }) => {

    const navbarRef = useRef(null);
    const [navbarHeight, setNavbarHeight] = useState(0);

    // Calcola l'altezza della navbar dopo il render iniziale e ad ogni resize
    useEffect(() => {
        const updateNavbarHeight = () => {
            if (navbarRef.current) {
                setNavbarHeight(navbarRef.current.offsetHeight);
            }
        };

        updateNavbarHeight(); // Calcola all'inizio
        window.addEventListener('resize', updateNavbarHeight); // Aggiorna al resize
        return () => window.removeEventListener('resize', updateNavbarHeight); // Cleanup
    }, []); // Esegui solo una volta dopo il mount e pulisci

    return (
        <>
            <ToastContainer />
            <ScrollToTop />
            <Navbar navbarRef={navbarRef} />
            <SearchBar navbarHeight={navbarHeight} />
            <div className='container mx-auto px-4 py-8 md:py-12'>
                {children}
            </div>
            <Footer />
        </>
    )
}

export default Main