import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import Button from '../components/Button';
import { Package, CalendarDays, DollarSign, MapPin } from 'lucide-react'; // Nuove icone

// Dati fittizi per gli ordini (in un'app reale, questi verrebbero da un'API)
// Assicurati che gli ID dei prodotti qui corrispondano a quelli in products.js
const dummyOrders = [
  {
    id: 'ORD-2025001',
    date: '2025-05-28',
    status: 'Consegnato',
    totalAmount: 189.99,
    items: [
      { productId: 'p1', size: 'M', quantity: 1, price: 89.99 },
      { productId: 'p3', size: 'L', quantity: 1, price: 100.00 }
    ],
    shippingAddress: {
      street: 'Via Roma 10',
      city: 'Milano',
      zip: '20100',
      country: 'Italia'
    }
  },
  {
    id: 'ORD-2025002',
    date: '2025-05-30',
    status: 'In Transito',
    totalAmount: 129.99,
    items: [
      { productId: 'p2', size: 'S', quantity: 1, price: 129.99 }
    ],
    shippingAddress: {
      street: 'Piazza Duomo 5',
      city: 'Firenze',
      zip: '50100',
      country: 'Italia'
    }
  },
  {
    id: 'ORD-2025003',
    date: '2025-06-01',
    status: 'In Elaborazione',
    totalAmount: 50.00,
    items: [
      { productId: 'p4', size: 'Unica', quantity: 2, price: 25.00 }
    ],
    shippingAddress: {
      street: 'Corso Vittorio Emanuele 20',
      city: 'Napoli',
      zip: '80100',
      country: 'Italia'
    }
  }
];


const Orders = () => {
  const { products, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Stato di caricamento

  useEffect(() => {
    // Simula il fetching degli ordini da un'API
    // In un'app reale, faresti una chiamata fetch qui
    const fetchOrders = () => {
      setIsLoading(true);
      setTimeout(() => { // Simula un ritardo di rete
        setOrders(dummyOrders); // Usa i dati fittizi
        setIsLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-16 text-center text-gray-600'>
        Caricamento ordini...
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 md:py-12'>
      <div className="mb-8">
        <Title text1="I miei" text2="Ordini" className="text-3xl md:text-4xl font-bold text-gray-800" />
      </div>

      {orders.length === 0 ? (
        // Stato Carrello Vuoto
        <div className="text-center py-16 sm:py-24 bg-gray-50 rounded-lg border border-gray-200 mt-8">
          <img src="/images/empty-orders.svg" alt="Nessun ordine" className="mx-auto h-28 w-28 text-gray-400 mb-6 opacity-80" /> {/* Placeholder for empty orders image */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Non hai ancora effettuato ordini!</h3>
          <p className="text-md text-gray-600 mb-8 max-w-sm mx-auto">
            Esplora i nostri prodotti e trova qualcosa che ti piace.
          </p>
          <Button variant="primary" size="md" className="font-semibold" to="/collection">
            Inizia lo Shopping
          </Button>
        </div>
      ) : (
        // Lista degli Ordini
        <div className="flex flex-col gap-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              {/* Dettagli Ordine Header */}
              <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b border-gray-200">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                  Ordine ID: <span className="text-blue-600">{order.id}</span>
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <p className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    Data: <span className="font-medium">{new Date(order.date).toLocaleDateString('it-IT')}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Package className="w-4 h-4 text-gray-500" />
                    Stato: <span className={`font-medium ${order.status === 'Consegnato' ? 'text-green-600' : order.status === 'In Transito' ? 'text-blue-600' : 'text-orange-500'}`}>
                      {order.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Articoli dell'Ordine */}
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => {
                  const productData = products.find(p => p._id === item.productId);
                  if (!productData) return null; // Salta se il prodotto non è trovato

                  return (
                    <div key={`${order.id}-${item.productId}-${item.size}`} className='grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_0.5fr] gap-4 py-4 items-center text-gray-700 text-sm'>
                      {/* Product Info */}
                      <div className="flex items-center gap-4 col-span-full sm:col-span-1">
                        <img src={productData.image[0]} alt={productData.name} className='w-16 h-16 object-cover rounded-md shadow-sm' />
                        <div>
                          <h4 className='text-base md:text-lg font-medium text-gray-800'>{productData.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">Taglia: <span className="font-semibold">{item.size}</span></p>
                        </div>
                      </div>

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
                  );
                })}
              </div>

              {/* Riepilogo Ordine Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-md font-semibold text-gray-800 mb-3 sm:mb-0">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Totale Ordine: <span className="text-green-600 text-xl">{currency}{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex flex-col sm:items-end text-sm text-gray-600">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Spedito a:
                  </p>
                  <p className="font-medium">{order.shippingAddress.street}</p>
                  <p className="font-medium">{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                  <p className="font-medium">{order.shippingAddress.country}</p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="outline" size="sm">
                  Visualizza Dettagli Ordine
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
