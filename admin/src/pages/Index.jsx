import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Importa toast
import { Trash2, Edit } from 'lucide-react'; // Icone per eliminare e modificare
import { Link } from 'react-router-dom'; // Per il link di modifica
import Button from '../components/Button';

// Assicurati che backendUrl sia importato correttamente o definito globalmente
// Esempio: export const backendUrl = 'http://localhost:4000'; nel tuo App.jsx o in un file di config
import { backendUrl } from '../App'; // Assicurati che il percorso sia corretto

const Index = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [error, setError] = useState(null); // Stato per errori di fetching

  // Funzione per recuperare la lista dei prodotti
  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/api/product`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        console.log("Errore nel fetching della lista:", response.data.message);
        toast.error(`Errore nel caricamento: ${response.data.message}`);
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Errore nel fetching della lista:", err);
      toast.error("Errore di rete o del server nel caricamento dei prodotti.");
      setError("Impossibile caricare i prodotti. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  // Funzione per rimuovere un prodotto
  const removeProduct = async (productId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      return;
    }

    try {
      // Chiamata DELETE al backend
      const response = await axios.delete(`${backendUrl}/api/product/delete/${productId}`, {
        withCredentials: true // Se la tua API richiede credenziali per l'eliminazione
      });

      if (response.data.success) {
        toast.success("Prodotto eliminato con successo!");
        fetchList(); // Ricarica la lista dopo l'eliminazione
      } else {
        console.log("Errore nell'eliminazione:", response.data.message);
        toast.error(`Errore nell'eliminazione: ${response.data.message}`);
      }
    } catch (err) {
      console.error("Errore durante l'eliminazione del prodotto:", err);
      if (err.response) {
        toast.error(`Errore server: ${err.response.data.message || 'Impossibile eliminare il prodotto.'}`);
      } else {
        toast.error("Errore di rete o del server durante l'eliminazione.");
      }
    }
  };

  // Effettua il fetch della lista all'avvio del componente
  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-700">Caricamento prodotti...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-700">Nessun prodotto trovato. Inizia a crearne uno!</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <p className='text-2xl font-bold text-gray-800 mb-4'>Tutti i Prodotti</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              <th className="py-3 px-4 border-b">Immagine</th>
              <th className="py-3 px-4 border-b">Nome</th>
              <th className="py-3 px-4 border-b">Categoria</th>
              <th className="py-3 px-4 border-b">Tipo</th>
              <th className="py-3 px-4 border-b">Prezzo</th>
              <th className="py-3 px-4 border-b">Taglie</th>
              <th className="py-3 px-4 border-b">Bestseller</th>
              <th className="py-3 px-4 border-b text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {list.map((product) => (
              <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/64x64/E0E0E0/808080?text=No+Image"; // Placeholder in caso di errore
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md text-xs text-gray-500">No Img</div>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-800 font-medium">{product.name}</td>
                <td className="py-3 px-4 text-gray-600">{product.category}</td>
                <td className="py-3 px-4 text-gray-600">{product.type}</td>
                <td className="py-3 px-4 text-gray-600">€{product.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-gray-600">{product.sizes.join(', ')}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.bestseller ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {product.bestseller ? 'Sì' : 'No'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center items-center gap-2">
                    {/* Pulsante Modifica */}
                    <Button
                      to={`/admin/products/edit/${product._id}`} // Esempio di rotta per la modifica
                      aria-label={`Modifica ${product.name}`}
                      variant="secondary"
                      iconLeft={<Edit />}
                    />
                    {/* Pulsante Elimina */}
                    <Button
                      variant="danger"
                      onClick={() => removeProduct(product._id)}
                      aria-label={`Elimina ${product.name}`}
                      iconLeft={<Trash2 />}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;
