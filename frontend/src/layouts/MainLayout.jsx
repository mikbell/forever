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
            <ToastContainer
                position="bottom-right" // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
                autoClose={2000} // Tempo in ms prima che il toast si chiuda automaticamente (0 per non chiudere)
                hideProgressBar={true} // Nasconde la barra di progresso
                newestOnTop={false} // I nuovi toast appaiono in cima o in fondo
                closeOnClick // Chiude il toast al click
                rtl={false} // Supporto Right-To-Left
                pauseOnFocusLoss // Mette in pausa il timer del toast quando la finestra perde il focus
                draggable // Permette di trascinare il toast per chiuderlo
                pauseOnHover // Mette in pausa il timer quando il mouse è sopra il toast
                theme="light" // light, dark, colored
                toastClassName="custom-toast"
                bodyClassName="custom-toast-body"
                progressClassName="custom-toast-progress"
            />            <ScrollToTop />
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