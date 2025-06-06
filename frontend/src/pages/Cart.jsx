import React, { useContext, useEffect, useState, useCallback } from 'react'; // Importa useCallback
import { ShopContext } from '../context/ShopContext';
import Title from "../components/Title";
import Button from '../components/Button';
import { ShoppingCart, Trash2 } from "lucide-react";
import CartTotal from '../components/CartTotal';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importa toast per feedback utente

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateCart,
    removeFromCart,
    clearCart,
    getCartCount,
    navigate
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Nuovo stato per il caricamento

  // Effetto per trasformare cartItems in un array flat per la visualizzazione
  useEffect(() => {
    // Assume che products e cartItems possano non essere disponibili immediatamente.
    // Se products è un array vuoto o cartItems è vuoto/non un oggetto, gestisci il caricamento.
    if (!products || products.length === 0 || !cartItems || typeof cartItems !== 'object') {
      setIsLoading(true); // Imposta loading a true se i dati non sono pronti
      // Potresti voler fare una chiamata per caricare i prodotti se non sono nel contesto
      // es. if (products.length === 0) getProductsData();
      return;
    }

    const tempData = [];
    // Itera sugli itemId presenti nel cartItems
    for (const itemId in cartItems) {
      // Cerca le informazioni complete del prodotto nell'array 'products'
      const productInfo = products.find(p => p._id === itemId);

      // Se il prodotto esiste e ha delle quantità nel carrello
      if (productInfo && Object.keys(cartItems[itemId]).length > 0) {
        // Itera sulle taglie per ogni itemId
        for (const size in cartItems[itemId]) {
          const quantity = cartItems[itemId][size];
          // Aggiungi solo articoli con quantità maggiore di 0
          if (quantity > 0) {
            tempData.push({
              _id: itemId, // L'ID dell'articolo
              productData: productInfo, // Dati completi del prodotto
              size: size,
              quantity: quantity
            });
          }
        }
      } else if (!productInfo) {
        // Logga un avviso se un articolo nel carrello non corrisponde a un prodotto esistente
        console.warn(`Prodotto con ID ${itemId} nel carrello non trovato nella lista prodotti.`);
        // Potresti voler rimuovere questo articolo dal carrello se è "fantasma"
        // ma per ora, lo ignoriamo nel rendering.
      }
    }
    setCartData(tempData);
    setIsLoading(false); // Dati caricati, imposta loading a false
  }, [cartItems, products]); // Dipende da 'cartItems' e 'products'

  // Funzione per gestire il cambio di quantità dall'input (memoizzata)
  const handleQuantityChange = useCallback((itemId, size, e) => {
    const value = e.target.value;
    const newQuantity = Number(value);

    // Permetti input vuoto per un momento, poi gestisci con 0 o rimuovi
    if (value === '') {
      // Potresti voler mostrare una quantità temporanea o lasciare l'input vuoto
      // Per ora, non aggiorniamo lo stato del carrello finché non c'è un numero valido
      return;
    }

    if (isNaN(newQuantity) || newQuantity < 0) {
      toast.error('Quantità non valida. Inserisci un numero maggiore o uguale a 0.');
      return;
    }

    // Se la quantità è 0, o l'input è vuoto e l'utente toglie il focus, rimuovi l'articolo
    // La logica di rimozione/aggiornamento a 0 è gestita in updateCart nel context
    updateCart(itemId, size, newQuantity);
  }, [updateCart]);

  // Funzione per gestire il click sul pulsante di rimozione (memoizzata)
  const handleRemoveItem = useCallback((itemId, size) => {
    removeFromCart(itemId, size);
  }, [removeFromCart]);

  // Funzione per procedere al checkout (memoizzata)
  const handleProceedToCheckout = useCallback(() => {
    if (getCartCount() > 0) {
      navigate('/place-order');
    } else {
      toast.warn("Il tuo carrello è vuoto. Aggiungi prodotti per procedere al checkout.");
    }
  }, [getCartCount, navigate]);

  // Mostra un messaggio di caricamento se i prodotti non sono ancora pronti
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-[80vh] flex items-center justify-center">
        <p className="text-xl text-gray-700">Caricamento del carrello...</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 md:py-12 min-h-[80vh]'>
      <div className='mb-8'>
        <Title text1={'Il tuo'} text2={'Carrello'} />
      </div>

      {cartData.length === 0 ? (
        // Empty Cart State
        <div className="text-center py-16 sm:py-24 rounded-lg mt-8">
          <ShoppingCart className='w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-400 mb-4' />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Il tuo carrello è vuoto!</h3>
          <p className="text-md text-gray-600 mb-8 max-w-sm mx-auto">
            Sembra che tu non abbia ancora aggiunto nulla al carrello. Inizia a esplorare i nostri prodotti!
          </p>
          <Link to="/collection">
            <Button variant="primary" size="md" className="font-semibold">
              Inizia lo Shopping
            </Button>
          </Link>
        </div>
      ) : (
        // Cart with Items
        <>
          <div className='hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-4 py-3 px-2 border-b border-gray-300 font-semibold text-gray-700 text-sm md:text-base'>
            <p>Prodotto</p>
            <p className="text-center">Prezzo</p>
            <p className="text-center">Quantità</p>
            <p className="text-center">Totale</p>
            <p className="text-center">Rimuovi</p>
          </div>

          <div className="divide-y divide-gray-100">
            {cartData.map((item) => {
              const product = item.productData;
              const itemTotal = product.price * item.quantity;

              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className='grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-4 py-4 px-2 items-center text-gray-700 text-sm'
                >
                  {/* Product Info (Mobile: full width, Desktop: 2fr) */}
                  <div className="flex items-center gap-4 col-span-full sm:col-span-1">
                    <Link to={`/product/${product._id}`}>
                      <img className='w-20 h-20 object-cover rounded-md shadow-sm' src={product.images[0]} alt={product.name} />
                    </Link>
                    <div>
                      <Link to={`/product/${product._id}`} className='text-base md:text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors'>
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">Taglia: <span className="font-semibold">{item.size}</span></p>
                    </div>
                  </div>

                  {/* Price (Mobile: show label, Desktop: center) */}
                  <div className="flex justify-between items-center sm:block sm:text-center text-base font-semibold">
                    <span className="sm:hidden text-gray-500">Prezzo: </span>
                    {currency}{product.price.toFixed(2)}
                  </div>

                  {/* Quantity Input (Mobile: show label, Desktop: center) */}
                  <div className="flex justify-between items-center sm:block sm:text-center">
                    <span className="sm:hidden text-gray-500">Quantità: </span>
                    <input
                      type="number"
                      min={0} // Permetti 0 per consentire la rimozione tramite input
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, item.size, e)}
                      onBlur={(e) => { // Aggiungi onBlur per gestire l'input vuoto al focus-out
                        if (e.target.value === '') {
                          updateCart(item._id, item.size, 0);
                        }
                      }}
                      className='border border-gray-300 rounded-md max-w-[80px] text-center px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
                      aria-label={`Quantità per ${product.name} taglia ${item.size}`}
                    />
                  </div>

                  {/* Total for Item (Mobile: show label, Desktop: center) */}
                  <div className="flex justify-between items-center sm:block sm:text-center text-base font-semibold text-gray-900">
                    <span className="sm:hidden text-gray-500">Totale: </span>
                    {currency}{itemTotal.toFixed(2)}
                  </div>

                  {/* Remove Button (Mobile: centered, Desktop: centered) */}
                  <div className="flex justify-center items-center col-span-full sm:col-span-1">
                    <Button
                      onClick={() => handleRemoveItem(item._id, item.size)}
                      variant="ghost"
                      size="sm"
                      iconLeft={<Trash2 className="w-5 h-5 text-red-500" />}
                      aria-label={`Rimuovi ${product.name} taglia ${item.size} dal carrello`}
                      className="hover:bg-red-50"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Total and Action Buttons */}
          <div className='flex flex-col md:flex-row justify-end gap-8 mt-12'>
            <div className='w-full md:w-1/2 lg:w-2/5'>
              <CartTotal />
            </div>
            <div className='flex flex-col gap-4 w-full md:w-1/2 lg:w-2/5 mt-8 md:mt-0'>
              <Button onClick={handleProceedToCheckout} variant="primary" fullWidth size="lg">
                Procedi al Checkout
              </Button>
              <Link to="/collection" className="w-full">
                <Button variant="outline" fullWidth size="lg">
                  Continua lo Shopping
                </Button>
              </Link>
              <Button onClick={clearCart} variant="dangerOutline" fullWidth size="sm" className="mt-4">
                Svuota Carrello
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;