import { createContext, useEffect, useState } from "react";
import { products as productsData } from '../assets/assets';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext();

const getDefaultCart = () => {
    let cart = {};
    return cart;
};

const ShopContextProvider = (props) => {
    const currency = "€";
    const delivery_fee = 10; // Changed to a number for calculations

    // State for all products, simulating an API fetch
    const [products, setProducts] = useState([]);

    // State for search functionality
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // State for cart items, initialized from localStorage
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cartItems');
            return storedCart ? JSON.parse(storedCart) : getDefaultCart();
        } catch (error) {
            console.error("Failed to parse cart from localStorage:", error);
            return getDefaultCart();
        }
    });
    const navigate = useNavigate();


    useEffect(() => {
        setProducts(productsData);
    }, []);

    // Effect to save cartItems to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (error) {
            console.error("Failed to save cart to localStorage:", error);
            toast.error("Impossibile salvare il carrello. Riprova più tardi.");
        }
    }, [cartItems]); // Dependency on cartItems ensures it runs on every cart update

    const addToCart = (itemId, size) => {
        if (!size) {
            toast.error('Seleziona la taglia');
            return;
        }

        // Create a deep copy to avoid direct state mutation
        const newCartItems = structuredClone(cartItems);

        // Ensure the item exists in the cart structure
        if (!newCartItems[itemId]) {
            newCartItems[itemId] = {};
        }

        // Increment quantity for the specific size
        newCartItems[itemId][size] = (newCartItems[itemId][size] || 0) + 1;

        setCartItems(newCartItems);
        toast.success("Prodotto aggiunto al carrello!");
    };

    const removeFromCart = (itemId, size) => {
        const newCartItems = structuredClone(cartItems);

        if (newCartItems[itemId] && newCartItems[itemId][size]) {
            newCartItems[itemId][size] -= 1;
            if (newCartItems[itemId][size] <= 0) {
                delete newCartItems[itemId][size];
                // If no more sizes for this item, remove the item entry
                if (Object.keys(newCartItems[itemId]).length === 0) {
                    delete newCartItems[itemId];
                }
            }
        }
        setCartItems(newCartItems);
        toast.info("Prodotto rimosso dal carrello.");
    };

    const updateQuantity = (itemId, size, quantity) => {
        const newCartItems = structuredClone(cartItems);

        if (newCartItems[itemId] && newCartItems[itemId][size] !== undefined) {
            const parsedQuantity = parseInt(quantity, 10);
            if (!isNaN(parsedQuantity) && parsedQuantity >= 0) {
                if (parsedQuantity === 0) {
                    delete newCartItems[itemId][size];
                    if (Object.keys(newCartItems[itemId]).length === 0) {
                        delete newCartItems[itemId];
                    }
                } else {
                    newCartItems[itemId][size] = parsedQuantity;
                }
                setCartItems(newCartItems);
                toast.success("Quantità aggiornata.");
            } else {
                toast.error("Quantità non valida.");
            }
        } else {
            toast.error("Impossibile aggiornare la quantità.");
        }
    };

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
                console.warn(`Product with ID ${itemId} not found in products list.`);
                continue; // Skip this item if info is missing
            }
            for (const size in cartItems[itemId]) {
                totalAmount += itemInfo.price * cartItems[itemId][size];
            }
        }
        return totalAmount;
    };

    // Clear cart function
    const clearCart = () => {
        setCartItems({});
        toast.success("Carrello svuotato!");
    };

    const contextValue = {
        products,
        currency,
        delivery_fee,
        search, setSearch,
        showSearch, setShowSearch,
        cartItems,
        addToCart,
        removeFromCart, // Added removeFromCart
        updateQuantity,
        getCartCount,
        getCartAmount,
        clearCart,
        navigate
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
