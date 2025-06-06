import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/axios.js';
import { Truck, User, DollarSign, ListOrdered } from 'lucide-react';

const Orders = () => {
  // Stati per ordini, caricamento ed errori
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funzione per caricare TUTTI gli ordini
  const fetchAllOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // L'endpoint corretto per un admin dovrebbe essere '/all' o simile
      const response = await apiClient.get("/api/order/all");
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Impossibile caricare gli ordini.");
        setError("Errore nel caricamento degli ordini.");
      }
    } catch (err) {
      console.error('Errore durante il caricamento degli ordini:', err);
      const errorMessage = err.response?.data?.message || "Errore di rete o del server.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect per chiamare fetchAllOrders quando il componente viene montato
  useEffect(() => {
    fetchAllOrders();
  }, []); // L'array vuoto assicura che venga eseguito solo una volta

  // Funzione per gestire il cambio di stato di un ordine
  const handleStatusChange = async (orderId, newStatus) => {
    const originalOrders = [...orders];
    const updatedOrders = orders.map(order =>
      order._id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    try {
      const response = await apiClient.put(`/api/order/update`, {
        orderId,
        status: newStatus,
      });
      if (response.data.success) {
        toast.success("Stato dell'ordine aggiornato!");
      } else {
        setOrders(originalOrders);
        toast.error(response.data.message || "Impossibile aggiornare lo stato.");
      }
    } catch (err) {
      setOrders(originalOrders);
      toast.error("Errore durante l'aggiornamento dello stato.");
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Caricamento ordini...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Errore: {error}</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <ListOrdered className="w-8 h-8 text-gray-700" />
        <h1 className="text-3xl font-bold text-gray-800">Pannello Ordini</h1>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow">Nessun ordine trovato.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Articoli</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Indirizzo</th>
                <th className="px-6 py-3 text-center">Importo</th>
                <th className="px-6 py-3 text-center">Stato</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <ul className="list-disc list-inside">
                      {order.items.map(item => (
                        <li key={item._id} className="truncate">
                          {item.name} ({item.size}) - <span className="font-semibold">x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">{order.userId.name}</p>
                        <p className="text-xs text-gray-500">{order.userId.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {order.address.street}, {order.address.city}, {order.address.zipCode}, {order.address.country}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-800">
                    €{order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                    >
                      <option value="In Lavorazione">In Lavorazione</option>
                      <option value="In Transito">In Transito</option>
                      <option value="Consegnato">Consegnato</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;