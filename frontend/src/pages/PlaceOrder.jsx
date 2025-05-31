import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import TextInput from '../components/TextInput'; // Assicurati che TextInput sia ben definito
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets'; // Assicurati che assets.stripe_logo e assets.razorpay_logo esistano
import Button from '../components/Button';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  // Stato per i dati del form (inizializzato vuoto per semplicità, in un'app reale useresti un hook per form)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '', // Aggiunto campo per l'indirizzo
    city: '',
    state: '', // Cambiato da 'Provincia' a 'State' per coerenza internazionale
    zipCode: '', // Cambiato da 'CAP' a 'ZipCode'
    country: '',
    phone: '',
  });

  const { getCartAmount, delivery_fee, getCartCount, clearCart } = useContext(ShopContext);
  const navigate = useNavigate(); // Usa useNavigate per la navigazione

  // Gestore generico per i cambiamenti degli input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Funzione per gestire l'invio dell'ordine
  const handlePlaceOrder = async (e) => {
    e.preventDefault(); // Previeni il ricaricamento della pagina

    // Validazione di base (puoi espanderla con librerie come Yup o Zod)
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipCode', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());

    if (getCartCount() === 0) {
      toast.error("Il carrello è vuoto. Aggiungi prodotti prima di procedere.");
      return;
    }

    if (missingFields.length > 0) {
      toast.error(`Compila tutti i campi obbligatori: ${missingFields.join(', ')}`);
      return;
    }

    console.log("Dati Ordine:", formData);
    console.log("Metodo di Pagamento:", paymentMethod);
    console.log("Totale Carrello:", getCartAmount() + delivery_fee);

    toast.success("Ordine effettuato con successo!");
    clearCart(); // Svuota il carrello dopo l'ordine
    navigate('/orders'); // Reindirizza alla pagina degli ordini
  };

  return (
    <form onSubmit={handlePlaceOrder} className='container mx-auto px-4 py-8 md:py-12 min-h-[80vh]'>
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

              {/* Opzione Razorpay (se applicabile alla tua regione) */}
              <div
                onClick={() => setPaymentMethod('razorpay')}
                className={`
                                    flex items-center p-4 border-2 rounded-lg cursor-pointer
                                    transition-all duration-200 ease-in-out
                                    ${paymentMethod === 'razorpay' ? 'border-blue-600 shadow-md bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                                `}
              >
                <div className={`
                                    min-w-[1.25rem] h-5 w-5 border-2 rounded-full flex-shrink-0 mr-4
                                    ${paymentMethod === 'razorpay' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}
                                `}></div>
                <img className='h-6 mr-4' src={assets.razorpay_logo} alt="Razorpay Logo" />
                <p className="text-gray-700 font-medium">Paga con Razorpay</p>
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
            <Button type='submit' fullWidth size='lg' variant='primary'>
              Paga ora
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;