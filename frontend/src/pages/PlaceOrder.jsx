import React, { useContext, useState, useMemo, useEffect } from 'react';
import Title from '../components/Title';
import TextInput from '../components/TextInput';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import Button from '../components/Button';
import { ShopContext } from '../context/ShopContext';
import apiClient from '../../api/axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { delivery_fee, navigate, cartItems, getCartAmount, products, setCartItems, token } = useContext(ShopContext); // Aggiunto token

  // --> 1. Stato di loading per prevenire doppi click
  const [isLoading, setIsLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  // --> 5. Ottimizzazione: crea una mappa dei prodotti per un accesso istantaneo
  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach(product => map.set(product._id, product));
    return map;
  }, [products]);

  // Effetto per reindirizzare se il carrello è vuoto o l'utente non è loggato
  useEffect(() => {
    if (!token) {
      toast.info("Effettua il login per procedere con l'ordine.");
      navigate('/login');
    } else if (getCartAmount() === 0) {
      toast.info("Il tuo carrello è vuoto.");
      navigate('/cart');
    }
  }, [token, getCartAmount, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // --> 1. Attiva il loading

    // --> 2. Validazione dei dati
    for (const field in formData) {
      if (formData[field] === '') {
        toast.error("Per favore, compila tutti i campi di spedizione.");
        setIsLoading(false);
        return; // Interrompi l'esecuzione
      }
    }

    try {
      let orderItems = [];
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = productMap.get(itemId); // --> 5. Usa la mappa per O(1) lookup
            if (itemInfo) {
              // Creiamo un nuovo oggetto per non mutare quello originale
              const orderItem = {
                ...itemInfo,
                size: size,
                quantity: cartItems[itemId][size],
              };
              orderItems.push(orderItem);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Qualcosa è andato storto, il carrello sembra vuoto.");
        setIsLoading(false);
        return;
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      // In base al metodo di pagamento scelto
      if (paymentMethod === 'cod') {
        const response = await apiClient.post("/api/order/place", orderData);
        if (response.data.success) {
          toast.success("Ordine effettuato con successo!");
          setCartItems({});
          navigate('/orders');
        } else {
          toast.error(response.data.message || "Impossibile effettuare l'ordine.");
        }
      } else if (paymentMethod === 'stripe') {
        // --> 4. Logica per Stripe
        const response = await apiClient.post('/api/order/stripe', orderData);
        if (response.data.success) {
          // Reindirizza l'utente all'URL di checkout di Stripe
          window.location.replace(response.data.session_url);
        }
      }
    } catch (error) {
      // --> 3. Gestione migliorata degli errori
      const errorMessage = error.response?.data?.message || "Si è verificato un errore di rete. Riprova più tardi.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // --> 1. Disattiva il loading in ogni caso (successo o errore)
    }
  };

  return (
    <form onSubmit={handleSubmit} className='container mx-auto px-4 py-8 md:py-12 min-h-[80vh]'>
      <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'> {/* Modificato da sm:flex-row a lg:flex-row per layout a due colonne su schermi più grandi */}

        {/* Sezione Dati di Spedizione */}
        <div className='flex flex-col gap-6 w-full lg:w-3/5'> {/* Larghezza responsiva */}
          <div className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>
            <Title text1={"Informazioni di"} text2={"Spedizione"} />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <TextInput
              name='firstName'
              label='Nome'
              type='text'
              placeholder='Il tuo nome'
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextInput
              name='lastName'
              label='Cognome'
              type='text'
              placeholder='Il tuo cognome'
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <TextInput
            name='email'
            label='Email'
            type='email'
            placeholder='La tua email'
            value={formData.email}
            onChange={handleChange}
          />
          <TextInput
            name='street'
            label='Indirizzo'
            type='text'
            placeholder='Via, numero civico, int.'
            value={formData.street}
            onChange={handleChange}
          />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <TextInput
              name='city'
              label='Città'
              type='text'
              placeholder='La tua città'
              value={formData.city}
              onChange={handleChange}
            />
            <TextInput
              name='state'
              label='Provincia'
              type='text'
              placeholder='La tua provincia'
              value={formData.state}
              onChange={handleChange}
            />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <TextInput
              name='zipCode'
              label='CAP'
              type='text' // Cambiato a text per gestire CAP con zeri iniziali
              placeholder='Il tuo CAP'
              value={formData.zipCode}
              onChange={handleChange}
            />
            <TextInput
              name='country'
              label='Nazione'
              type='text'
              placeholder='La tua nazione'
              value={formData.country}
              onChange={handleChange}
            />
          </div>
          <TextInput
            name='phone'
            label='Telefono'
            type='tel' // Tipo 'tel' per telefoni
            placeholder='Il tuo numero di telefono'
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Sezione Riepilogo Ordine e Pagamento */}
        <div className='w-full lg:w-2/5 flex flex-col gap-8 mt-8 lg:mt-0'> {/* Larghezza responsiva e spaziatura */}
          {/* Riepilogo Ordine */}
          <div>
            <CartTotal />
          </div>

          {/* Metodo di Pagamento */}
          <div className="mt-8">
            <div className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>
              <Title text1={"Metodo di"} text2={"Pagamento"} />
            </div>
            <div className="flex flex-col gap-4"> {/* Spaziatura verticale tra le opzioni */}
              {/* Opzione Stripe */}
              <div
                onClick={() => setPaymentMethod('stripe')}
                className={`
                                    flex items-center p-4 border-2 rounded-lg cursor-pointer
                                    transition-all duration-200 ease-in-out
                                    ${paymentMethod === 'stripe' ? 'border-blue-600 shadow-md bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                                `}
              >
                <div className={`
                                    min-w-[1.25rem] h-5 w-5 border-2 rounded-full flex-shrink-0 mr-4
                                    ${paymentMethod === 'stripe' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}
                                `}></div>
                <img className='h-6 mr-4' src={assets.stripe_logo} alt="Stripe Logo" />
                <p className="text-gray-700 font-medium">Paga con Carta (Stripe)</p>
              </div>

              {/* Opzione Contanti alla Consegna (COD) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`
                                    flex items-center p-4 border-2 rounded-lg cursor-pointer
                                    transition-all duration-200 ease-in-out
                                    ${paymentMethod === 'cod' ? 'border-blue-600 shadow-md bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                                `}
              >
                <div className={`
                                    min-w-[1.25rem] h-5 w-5 border-2 rounded-full flex-shrink-0 mr-4
                                    ${paymentMethod === 'cod' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}
                                `}></div>
                <p className="text-gray-700 font-medium">Pagamento alla consegna (COD)</p>
              </div>
            </div>
          </div>

          {/* Pulsante di Checkout */}
          <div className='w-full mt-8'>
            <div className='w-full mt-8'>
              <Button type='submit' fullWidth size='lg' variant='primary' disabled={isLoading}>
                {isLoading ? 'Elaborazione...' : 'Paga ora'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;