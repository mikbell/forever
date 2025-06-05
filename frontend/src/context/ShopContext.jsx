import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "€";
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({}); // Stato locale del carrello
    const [token, setToken] = useState(localStorage.getItem('token') || ''); // Inizializza il token direttamente dal localStorage
    const navigate = useNavigate();

    // ---
    // ## Funzioni di Utilità
    // ---

    const toggleSearch = () => {
        setShowSearch(prev => !prev); // Usa il callback per aggiornare lo stato basato sul valore precedente
    };

    // ---
    // ## Caricamento Dati Iniziali
    // ---

    // Funzione per recuperare i prodotti dal backend
    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                // Logga l'errore per il debug e mostra un toast all'utente
                console.error("Error fetching products:", response.data.message);
                toast.error(`Errore nel caricamento dei prodotti: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Network error fetching products:", error);
            // Mostra un messaggio di errore generico per problemi di rete
            toast.error("Errore di rete durante il caricamento dei prodotti.");
            // Potresti voler restituire un array vuoto o lanciare l'errore a seconda della gestione desiderata
            return [];
        }
    };

    // Funzione per caricare il carrello dell'utente dal backend
    const getCart = async (userToken) => {
        if (!userToken) {
            setCartItems({});
            return;
        }
        try {
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token: userToken } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            } else {
                console.error("Error loading cart data:", response.data.message);
                toast.error("Errore nel caricamento del carrello.");
            }
        } catch (error) {
            console.error("Network error loading cart data:", error);
            toast.error("Errore di rete durante il caricamento del carrello.");
            setCartItems({});
        }
    };

    // Effetto per caricare i prodotti all'avvio del componente
    useEffect(() => {
        getProductsData();
    }, []); // Array di dipendenze vuoto per eseguirlo una sola volta al mount

    // Effetto per gestire il token e caricare il carrello quando il token cambia
    useEffect(() => {
        // Quando il componente si monta o il token cambia, carichiamo il carrello
        if (token) {
            localStorage.setItem('token', token); // Salva il token nel localStorage se presente
            getCart(token);
        } else {
            localStorage.removeItem('token'); // Rimuovi il token se l'utente si è sloggato
            setCartItems({}); // Svuota il carrello locale
        }
    }, [token, backendUrl]); // Dipende da `token` e `backendUrl`. `getCart` è stabile e non deve essere inclusa.


    // ---
    // ## Funzioni di Gestione Carrello (Locale e Backend)
    // ---

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Seleziona la taglia.');
            return;
        }

        const currentCart = structuredClone(cartItems);
        if (!currentCart[itemId]) {
            currentCart[itemId] = {};
        }
        currentCart[itemId][size] = (currentCart[itemId][size] || 0) + 1;

        setCartItems(currentCart); // Aggiorna lo stato locale immediatamente

        if (token) {
            try {
                // Invia solo i dati necessari al backend
                await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
                toast.success("Prodotto aggiunto al carrello!");
            } catch (error) {
                console.error("Error adding item to backend cart:", error);
                toast.error("Errore durante l'aggiunta al carrello sul server.");
                // Se il backend fallisce, potresti voler ripristinare lo stato precedente
                getCart(token); // Ricarica il carrello dal backend per assicurare consistenza
            }
        } else {
            toast.success("Prodotto aggiunto al carrello (locale)."); // Messaggio per utente non loggato
        }
    };


    const updateCart = async (itemId, size, quantity) => {
        const currentCart = structuredClone(cartItems);

        // Validazione della quantità
        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity < 0) {
            toast.error("Quantità non valida. Deve essere un numero non negativo.");
            return;
        }

        if (parsedQuantity === 0) {
            if (currentCart[itemId] && currentCart[itemId][size]) {
                delete currentCart[itemId][size];
                if (Object.keys(currentCart[itemId]).length === 0) {
                    delete currentCart[itemId];
                }
            }
        } else {
            // Assicurati che l'oggetto per l'articolo esista
            if (!currentCart[itemId]) {
                currentCart[itemId] = {};
            }
            currentCart[itemId][size] = parsedQuantity;
        }

        setCartItems(currentCart); // Aggiorna lo stato locale

        if (token) {
            try {
                // Manda l'aggiornamento della quantità al backend
                await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity: parsedQuantity }, { headers: { token } });
                toast.success("Quantità aggiornata.");
            } catch (error) {
                console.error("Error updating item quantity in backend:", error);
                toast.error("Errore durante l'aggiornamento della quantità sul server.");
                getCart(token); // Ricarica il carrello dal backend per assicurare consistenza
            }
        } else {
            toast.success("Quantità aggiornata (locale)."); // Messaggio per utente non loggato
        }
    };


    // ---
    // ## Calcoli Carrello
    // ---

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                totalCount += cartItems[itemId][size];
            }
        }
        return totalCount;
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId);
            if (!itemInfo) {
                console.warn(`Prodotto con ID ${itemId} non trovato nella lista dei prodotti. Questo articolo potrebbe non essere più disponibile.`);
                continue;
            }
            for (const size in cartItems[itemId]) {
                totalAmount += itemInfo.price * cartItems[itemId][size];
            }
        }
        return totalAmount;
    };

    const clearCart = async () => {
        setCartItems({}); // Svuota il carrello locale

        if (token) {
            try {
                // Invia una richiesta al backend per svuotare il carrello dell'utente
                await axios.post(`${backendUrl}/api/cart/clear-cart`, {}, { headers: { token } }); // Assumi un endpoint clear-cart
                toast.success("Carrello svuotato e sincronizzato!");
            } catch (error) {
                console.error("Error clearing backend cart:", error);
                toast.error("Errore durante lo svuotamento del carrello sul server.");
                // In caso di errore, potresti voler ricaricare il carrello dal backend per consistenza
                getCart(token);
            }
        } else {
            toast.success("Carrello svuotato!"); // Messaggio per utente non loggato
        }
    };

    // ---
    // ## Valore del Context
    // ---

    const contextValue = {
        products,
        currency,
        delivery_fee,
        search, setSearch,
        showSearch, setShowSearch,
        cartItems,
        addToCart,
        updateCart,
        getCartCount,
        getCartAmount,
        clearCart,
        navigate,
        backendUrl,
        token,
        setToken,
        setCartItems,
        toggleSearch
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;