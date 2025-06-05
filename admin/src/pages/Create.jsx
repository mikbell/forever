import React, { useState, useRef, useEffect } from 'react';
import { Upload, XCircle } from "lucide-react";
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import TextArea from '../components/TextArea'; // Assicurati che TextArea sia un componente valido
import SelectInput from '../components/SelectInput'; // Assicurati che SelectInput sia un componente valido
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App';

const Create = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isBestseller, setIsBestseller] = useState(false);

  // Stato per le immagini: array di oggetti { file: File, preview: string }
  const [images, setImages] = useState([null, null, null, null]); // Fino a 4 immagini
  const fileInputRefs = useRef([
    useRef(null), useRef(null), useRef(null), useRef(null)
  ]);

  // Stato per la gestione del submit
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Dati per i SelectInput
  const categories = [
    { value: 'Men', label: 'Uomo' },
    { value: 'Women', label: 'Donna' },
    { value: 'Unisex', label: 'Unisex' },
    { value: 'Kids', label: 'Bambino' },
    { value: 'Other', label: 'Altro' },
  ];

  const types = [
    { value: 'Topwear', label: 'Maglieria e Top' },
    { value: 'Bottomwear', label: 'Pantaloni e Gonne' },
    { value: 'Winterwear', label: 'Capispalla Invernali' },
    { value: 'Footwear', label: 'Calzature' },
    { value: 'Accessories', label: 'Accessori' },
    { value: 'Jewellery', label: 'Gioielli' },
    { value: 'Other', label: 'Altro' },
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Cleanup delle URL delle immagini quando il componente si smonta o le immagini cambiano
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img && img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  // Gestione del caricamento delle immagini
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Validazione tipo file (opzionale ma consigliato)
      if (!file.type.startsWith('image/')) {
        toast.error('Carica solo file immagine (es. JPG, PNG, GIF).');
        return;
      }
      // Validazione dimensione file (opzionale)
      if (file.size > 5 * 1024 * 1024) { // 5 MB
        toast.error('L\'immagine non deve superare i 5MB.');
        return;
      }

      const newImages = [...images];
      if (newImages[index] && newImages[index].preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages[index] = {
        file: file,
        preview: URL.createObjectURL(file)
      };
      setImages(newImages);
      setFormErrors(prev => ({ ...prev, images: undefined }));
    }
  };

  // Gestione della rimozione delle immagini
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    if (newImages[index] && newImages[index].preview) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    newImages[index] = null;
    setImages(newImages);
    if (fileInputRefs.current[index] && fileInputRefs.current[index].current) {
      fileInputRefs.current[index].current.value = '';
    }
  };

  // Gestione della selezione delle taglie
  const handleSizeToggle = (size) => {
    setSelectedSizes(prevSizes =>
      prevSizes.includes(size)
        ? prevSizes.filter(s => s !== size)
        : [...prevSizes, size].sort((a, b) => {
          const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
          return order.indexOf(a) - order.indexOf(b);
        })
    );
    setFormErrors(prev => ({ ...prev, sizes: undefined }));
  };

  // Validazione del form
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Il nome del prodotto è obbligatorio.';
    if (!description.trim()) errors.description = 'La descrizione è obbligatoria.';
    if (!category) errors.category = 'Seleziona una categoria.';
    if (!type) errors.type = 'Seleziona un tipo.';
    if (!price || isNaN(price) || parseFloat(price) <= 0) errors.price = 'Il prezzo deve essere un numero positivo.';
    if (selectedSizes.length === 0) errors.sizes = 'Seleziona almeno una taglia.';

    const hasImage = images.some(img => img !== null);
    if (!hasImage) {
      errors.images = 'Carica almeno un\'immagine del prodotto.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestione del submit del form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      toast.error('Compila tutti i campi obbligatori e correggi gli errori.');
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('description', description);
    formDataToSend.append('category', category);
    formDataToSend.append('type', type);
    formDataToSend.append('price', parseFloat(price));
    // FIX: Invia l'array di taglie come stringa JSON
    formDataToSend.append('sizes', JSON.stringify(selectedSizes));
    formDataToSend.append('bestseller', isBestseller);

    // Allega i file immagine
    images.forEach((img, index) => {
      if (img && img.file) {
        // I nomi dei campi devono corrispondere a quelli attesi da Multer nel backend
        formDataToSend.append(`image${index + 1}`, img.file);
      }
    });

    // Debugging di FormData (solo per vedere cosa c'è dentro, non il contenuto dei file)
    // for (let pair of formDataToSend.entries()) {
    //     console.log(pair[0] + ', ' + pair[1]);
    // }

    try {
      const response = await axios.post(`${backendUrl}/api/product/create`, formDataToSend, {
        headers: {
          // 'Content-Type': 'multipart/form-data' // Axios lo imposta automaticamente con FormData
        },
        withCredentials: true // Importante per inviare i cookie di autenticazione
      });

      console.log('Risposta dal backend:', response.data);

      if (response.data.success) {
        toast.success('Prodotto creato con successo!');
        // Resetta il form dopo il successo
        setName('');
        setDescription('');
        setCategory('');
        setCategory(''); // Doppia chiamata, forse un errore di copia/incolla
        setType('');
        setPrice('');
        setSelectedSizes([]);
        setIsBestseller(false);
        setImages([null, null, null, null]);
        fileInputRefs.current.forEach(ref => {
          if (ref.current) ref.current.value = '';
        });
        setFormErrors({});
      } else {
        toast.error(`Errore: ${response.data.message || 'Qualcosa è andato storto.'}`);
      }
    } catch (error) {
      if (error.response) {
        console.error('Errore risposta server:', error.response.data);
        const errorMessage = error.response.data.message || 'Errore sconosciuto dal server.';
        toast.error(`Errore: ${errorMessage}`);
        // Se il backend restituisce errori di validazione specifici, puoi gestirli qui
        // Esempio: setFormErrors(error.response.data.errors);
      } else if (error.request) {
        console.error('Errore richiesta (nessuna risposta):', error.request);
        toast.error('Nessuna risposta dal server. Controlla la connessione.');
      } else {
        console.error('Errore Axios:', error.message);
        toast.error('Errore durante la creazione del prodotto. Riprova.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col w-full items-start gap-6 p-4 md:p-6 bg-white rounded-lg shadow-md'>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Crea Nuovo Prodotto</h2>

      {/* Sezione Carica Immagine */}
      <div className='w-full'>
        <p className='block text-sm font-medium text-gray-700 mb-2'>Carica immagini del prodotto (max 4)</p>
        <div className='flex flex-wrap gap-4'>
          {images.map((img, index) => (
            <div key={index} className="relative">
              <label htmlFor={`image${index + 1}`} className="cursor-pointer">
                <div className='w-24 h-24 flex items-center justify-center p-2 border border-dashed border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors duration-150 rounded-md overflow-hidden'>
                  {img && img.preview ? (
                    <img src={img.preview} alt={`Anteprima immagine ${index + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-500" />
                  )}
                </div>
                <input
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                  ref={fileInputRefs.current[index]}
                  disabled={loading}
                />
              </label>
              {img && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs shadow-md hover:bg-red-600 transition-colors"
                  aria-label={`Rimuovi immagine ${index + 1}`}
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {formErrors.images && <p className="text-sm text-red-600 mt-1">{formErrors.images}</p>}
      </div>

      {/* Campi di input */}
      <div className='w-full'>
        <TextInput
          id="product-name"
          name="name"
          label='Nome Prodotto'
          placeholder='Inserisci il nome del prodotto'
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setFormErrors(prev => ({ ...prev, name: undefined }));
          }}
          error={formErrors.name}
          required
          disabled={loading}
        />
      </div>
      <div className='w-full'>
        <TextArea
          id="product-description"
          name="description"
          label='Descrizione'
          placeholder='Inserisci la descrizione dettagliata del prodotto'
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setFormErrors(prev => ({ ...prev, description: undefined }));
          }}
          error={formErrors.description}
          required
          disabled={loading}
        />
      </div>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
        <SelectInput
          id="product-category"
          name="category"
          label='Categoria'
          options={categories}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setFormErrors(prev => ({ ...prev, category: undefined }));
          }}
          error={formErrors.category}
          required
          disabled={loading}
        />
        <SelectInput
          id="product-type"
          name="type"
          label='Tipo'
          options={types}
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setFormErrors(prev => ({ ...prev, type: undefined }));
          }}
          error={formErrors.type}
          required
          disabled={loading}
        />
      </div>
      <div className='w-full'>
        <TextInput
          id="product-price"
          name="price"
          label='Prezzo (€)'
          type="number"
          placeholder='25.00'
          value={price}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '' || /^\d*\.?\d*$/.test(val)) {
              setPrice(val);
              setFormErrors(prev => ({ ...prev, price: undefined }));
            }
          }}
          error={formErrors.price}
          required
          disabled={loading}
          step="0.01"
          min="0"
        />
      </div>

      {/* Sezione Taglie */}
      <div className='w-full'>
        <p className='block text-sm font-medium text-gray-700 mb-2'>Taglie disponibili</p>
        <div className='flex flex-wrap gap-2'>
          {availableSizes.map(size => (
            <Button
              key={size}
              type="button"
              variant={selectedSizes.includes(size) ? 'primary' : 'secondary'}
              onClick={() => handleSizeToggle(size)}
              disabled={loading}
              className="px-4 py-2 rounded-md"
            >
              {size}
            </Button>
          ))}
        </div>
        {formErrors.sizes && <p className="text-sm text-red-600 mt-1">{formErrors.sizes}</p>}
      </div>

      {/* Checkbox Bestseller */}
      <div className='flex items-center gap-2 mt-2'>
        <input
          type="checkbox"
          id="bestseller"
          checked={isBestseller}
          onChange={(e) => setIsBestseller(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          disabled={loading}
        />
        <label className='cursor-pointer text-gray-700' htmlFor="bestseller">Prodotto Bestseller</label>
      </div>

      {/* Pulsante Salva */}
      <Button
        type='submit'
        disabled={loading}
        className="mt-6"
      >
        {loading ? 'Salvataggio...' : 'Salva Prodotto'}
      </Button>
    </form>
  );
}

export default Create;
