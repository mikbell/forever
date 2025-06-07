import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios.js'; // Importa la tua istanza Axios configurata

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "€";
    const delivery_fee = 10;

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
            const response = await apiClient.get(`/api/product/get`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                console.error("Errore nel caricamento dei prodotti:", response.data.message);
                toast.error(`Errore nel caricamento dei prodotti: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Errore di rete durante il caricamento dei prodotti:", error);
            toast.error("Errore di rete durante il caricamento dei prodotti.");
            return [];
        }
    };


    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            getCart(token);
        } else {
            localStorage.removeItem('token');
            setCartItems({});
        }
    }, [token,]);

    // ---
    // ## Carrello
    // ---

    const getCart = async (userToken) => {
        if (!userToken) {
            setCartItems({});
            return;
        }
        try {
            const response = await apiClient.post("/api/cart/get");
            if (response.data.success) {
                setCartItems(response.data.cartData);
                console.log("Cart data fetched successfully:", response.data.cartData); // Aggiungi questo
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

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Seleziona la taglia.');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await apiClient.post("/api/cart/add", { itemId, size })
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };



    const updateCart = async (itemId, size, quantity) => {
        const currentCart = structuredClone(cartItems);
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
            if (!currentCart[itemId]) {
                currentCart[itemId] = {};
            }
            currentCart[itemId][size] = parsedQuantity;
        }

        setCartItems(currentCart);

        if (token) {
            try {
                await apiClient.post(`/api/cart/update`, { itemId, size, quantity: parsedQuantity },);
            } catch (error) {
                console.error("Error updating item quantity in backend:", error);
                toast.error("Errore durante l'aggiornamento della quantità sul server.");
                getCart(token);
            }
        }
    };

    const removeFromCart = async (itemId, size) => {
        const currentCart = structuredClone(cartItems);
        if (currentCart[itemId] && currentCart[itemId][size]) {
            delete currentCart[itemId][size];
            if (Object.keys(currentCart[itemId]).length === 0) {
                delete currentCart[itemId];
            }
            setCartItems(currentCart);
            if (token) {
                try {
                    await apiClient.post("/api/cart/remove", { itemId, size });
                } catch (error) {
                    console.error("Error removing item from cart in backend:", error);
                    toast.error("Errore durante la rimozione dell'articolo dal carrello.");
                    getCart(token); // Ricarica il carrello dal backend per assicurare consistenza
                }
            }
        }
    }

    const clearCart = async () => {
        setCartItems({}); // Svuota il carrello locale

        if (token) {
            try {
                await apiClient.post("/api/cart/clear");
                toast.success("Carrello svuotato e sincronizzato!");
            } catch (error) {
                console.error("Error clearing backend cart:", error);
                toast.error("Errore durante lo svuotamento del carrello sul server.");
                getCart(token);
            }
        } else {
            toast.success("Carrello svuotato!");
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

    // ---
    // ## Valore del Context
    // ---

    const contextValue = {
        products,
        currency,
        delivery_fee,
        search, setSearch,
        showSearch, setShowSearch,
        cartItems, setCartItems,
        addToCart,
        updateCart,
        getCartCount,
        getCartAmount,
        removeFromCart,
        clearCart,
        navigate,
        token,
        setToken,
        toggleSearch
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;