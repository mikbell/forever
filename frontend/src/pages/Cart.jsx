import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from "../components/Title";
import Button from '../components/Button';
import { ShoppingCart, Trash2 } from "lucide-react";
import CartTotal from '../components/CartTotal';
import { Link } from 'react-router-dom'; // Importa Link e useNavigate

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, removeFromCart, clearCart, getCartCount, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // Effetto per trasformare cartItems in un array flat per la visualizzazione
  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      const productInfo = products.find(p => p._id === itemId);
      if (productInfo) { // Assicurati che il prodotto esista
        for (const size in cartItems[itemId]) {
          const quantity = cartItems[itemId][size];
          if (quantity > 0) {
            tempData.push({
              _id: itemId,
              productData: productInfo, // Includi i dati completi del prodotto
              size: size,
              quantity: quantity
            });
          }
        }
      }
    }
    setCartData(tempData);
  }, [cartItems, products]); // Dipende anche da 'products' per aggiornare se i dati del prodotto cambiano

  // Funzione per gestire il cambio di quantità dall'input
  const handleQuantityChange = (itemId, size, e) => {
    const value = e.target.value;
    // Permetti input vuoto o '0' temporaneamente per UX, ma gestisci la logica in updateQuantity
    if (value === '' || value === '0') {
      updateQuantity(itemId, size, 0); // Rimuovi l'articolo se la quantità è 0 o vuota
    } else {
      const newQuantity = Number(value);
      if (!isNaN(newQuantity) && newQuantity >= 1) { // Solo numeri validi e >= 1
        updateQuantity(itemId, size, newQuantity);
      }
    }
  };

  // Funzione per gestire il click sul pulsante di rimozione
  const handleRemoveItem = (itemId, size) => {
    removeFromCart(itemId, size); // Usa la funzione removeFromCart dal contesto
  };

  const handleProceedToCheckout = () => {
    if (getCartCount() > 0) {
      navigate('/place-order'); // Reindirizza alla pagina di checkout
    } else {
      // Potresti mostrare un toast o un messaggio che il carrello è vuoto
      console.log("Il carrello è vuoto, non puoi procedere al checkout.");
    }
  };

  return (
    <div>
      <div className='mb-8'>
        <Title text1={'Il tuo'} text2={'Carrello'}/>
      </div>

      {cartData.length === 0 ? (
        // Empty Cart State
        <div className="text-center py-16 sm:py-24 rounded-lg mt-8">
          <ShoppingCart className='w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4'/>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Il tuo carrello è vuoto!</h3>
          <p className="text-md text-gray-600 mb-8 max-w-sm mx-auto">
            Sembra che tu non abbia ancora aggiunto nulla al carrello. Inizia a esplorare i nostri prodotti!
          </p>
          <Link to="/collection"> {/* Link to collection page */}
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

          <div className="divide-y divide-gray-100"> {/* Use divide-y for subtle separators */}
            {cartData.map((item) => {
              const product = item.productData;
              const itemTotal = product.price * item.quantity;

              return (
                <div
                  key={`${item._id}-${item.size}`} // Key by ID and size for uniqueness
                  className='grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-4 py-4 px-2 items-center text-gray-700 text-sm'
                >
                  {/* Product Info (Mobile: full width, Desktop: 2fr) */}
                  <div className="flex items-center gap-4 col-span-full sm:col-span-1">
                    <Link to={`/product/${product._id}`}> {/* Link to product detail page */}
                      <img className='w-20 h-20 object-cover rounded-md shadow-sm' src={product.image[0]} alt={product.name} />
                    </Link>
                    <div>
                      <Link to={`/product/${product._id}`} className='text-base md:text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors'>
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">Taglia: <span className="font-semibold">{item.size}</span></p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center sm:block sm:text-center text-base font-semibold">
                    <span className="sm:hidden text-gray-500">Prezzo: </span>
                    {currency}{product.price.toFixed(2)}
                  </div>

                  <div className="flex justify-between items-center sm:block sm:text-center">
                    <span className="sm:hidden text-gray-500">Quantità: </span>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity} // Use value for controlled input
                      onChange={(e) => handleQuantityChange(item._id, item.size, e)}
                      className='border border-gray-300 rounded-md max-w-[80px] text-center px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
                      aria-label={`Quantità per ${product.name} taglia ${item.size}`}
                    />
                  </div>

                  <div className="flex justify-between items-center sm:block sm:text-center text-base font-semibold text-gray-900">
                    <span className="sm:hidden text-gray-500">Totale: </span>
                    {currency}{itemTotal.toFixed(2)}
                  </div>

                  <div className="flex justify-center items-center col-span-full sm:col-span-1"> {/* Centered on mobile too */}
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
          <div className='flex flex-col md:flex-row justify-end gap-8 mt-12'> {/* Adjusted gap and alignment */}
            <div className='w-full md:w-1/2 lg:w-2/5'> {/* Responsive width for CartTotal */}
              <CartTotal />
            </div>
            <div className='flex flex-col gap-4 w-full md:w-1/2 lg:w-2/5 mt-8 md:mt-0'> {/* Buttons section, responsive width */}
              <Button onClick={handleProceedToCheckout} variant="primary" fullWidth size="lg">
                Procedi al Checkout
              </Button>
              <Link to="/collection" className="w-full"> {/* Link to collection page */}
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
