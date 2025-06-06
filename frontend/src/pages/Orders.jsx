import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import Button from '../components/Button';
import { Package, CalendarDays, CreditCard, MapPin, RefreshCw } from 'lucide-react';
import apiClient from '../../api/axios';
import { toast } from 'react-toastify'; // Aggiunto per feedback errori
import { Link } from 'react-router-dom';

const Orders = () => {
  const { token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Inizia come true

  const loadOrders = async () => {
    if (!token) {
      setOrders([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true); // Imposta il loading all'inizio della chiamata manuale
    try {
      const response = await apiClient.get(`/api/order/user-orders`);
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message || "Impossibile caricare gli ordini.");
      }
    } catch (error) {
      console.error('Errore durante il caricamento degli ordini:', error);
      toast.error("Errore di rete nel caricamento degli ordini.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);


  if (isLoading) {
    return (
      <div className='text-center text-gray-600'>
        Caricamento ordini...
      </div>
    );
  }

  return (
    <div >
      <div className="mb-8 flex justify-between items-center">
        <Title text1="I miei" text2="Ordini" />
        <Button
          variant="ghost"
          size="icon"
          onClick={loadOrders}
          disabled={isLoading}
          aria-label="Aggiorna ordini"
        >
          <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 sm:py-24 bg-gray-50 rounded-lg border border-gray-200 mt-8">
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* --> PASSO 3: Logica di visualizzazione corretta */}
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 shadow-lg border border-gray-300">
              {/* Dettagli Ordine Header */}
              <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b border-gray-200">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                  Ordine #{order._id}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <p className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    Data: <span className="font-medium">{new Date(order.date).toLocaleDateString('it-IT')}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Package className="w-4 h-4 text-gray-500" />
                    Stato: <span className={`font-medium ${order.status === 'Consegnato' ? 'text-green-600' : 'text-orange-500'}`}>{order.status}</span>
                  </p>
                </div>
              </div>

              {/* Articoli dell'Ordine */}
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item._id} className='grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_0.5fr] gap-4 py-4 items-center text-gray-700 text-sm'>
                    {/* Product Info - Usa direttamente i dati dall'oggetto 'item' */}
                    <Link to={`/product/${item._id}`}>
                      <div className="flex items-center gap-4 col-span-full sm:col-span-1">
                        <img src={item.images[0]} alt={item.name} className='w-16 h-16 object-cover rounded-md shadow-sm' />
                        <div>
                          <h4 className='text-base md:text-lg font-medium text-gray-800'>{item.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">Taglia: <span className="font-semibold">{item.size}</span></p>
                        </div>
                      </div>
                    </Link>
                    {/* Price */}
                    <div className="flex justify-between items-center sm:block sm:text-center text-base font-semibold">
                      <span className="sm:hidden text-gray-500">Prezzo: </span>
                      {currency}{item.price.toFixed(2)}
                    </div>
                    {/* Quantity */}
                    <div className="flex justify-between items-center sm:block sm:text-center text-base">
                      <span className="sm:hidden text-gray-500">Quantità: </span>
                      <span className="font-semibold">{item.quantity}</span>
                    </div>
                    {/* Item Total */}
                    <div className="flex justify-between items-center sm:block sm:text-center text-base font-semibold text-gray-900">
                      <span className="sm:hidden text-gray-500">Totale Articolo: </span>
                      {currency}{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Riepilogo Ordine Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 mt-4 border-t border-gray-200">
                <div>
                  <div className="flex flex-col sm:items-end text-sm text-gray-600">
                    <p className="flex items-center gap-1"><CreditCard className="w-4 h-4 text-gray-500" /> Metodo di pagamento: {order.paymentMethod}</p>
                  </div>
                  <div className="flex items-center gap-2 text-md font-semibold text-gray-800 mb-3 sm:mb-0">
                    Totale Ordine: <span className=" text-xl">{currency}{order.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end text-sm text-gray-600">
                  <p className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-500" /> Spedito a:</p>
                  <p className="font-medium">{order.address.street}</p>
                  <p className="font-medium">{order.address.city}, {order.address.zipCode}</p>
                  <p className="font-medium">{order.address.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;