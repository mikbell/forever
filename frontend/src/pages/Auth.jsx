import React, { useState, useContext, useEffect, useCallback } from 'react'; // Importa useCallback
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const Auth = () => {
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error states for form fields
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // UI states
  const [isLoading, setIsLoading] = useState(false);

  // Inizializza con 'Login' o 'Register' basandosi sul parametro URL
  const [searchParams] = useSearchParams();
  // Utilizza una funzione per l'inizializzazione dello stato per garantire che venga eseguita solo una volta
  const [currentState, setCurrentState] = useState(() => {
    const initialMode = searchParams.get('mode');
    return initialMode === 'register' ? 'Register' : 'Login';
  });

  // Context values
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  // Utilizza useCallback per memoizzare la funzione e prevenire re-rendering inutili
  const resetForm = useCallback(() => {
    setName('');
    setEmail('');
    setPassword('');
    setNameError('');
    setEmailError('');
    setPasswordError('');
    // Non resettare isLoading qui, è gestito dal handleSubmit
  }, []); // Non ha dipendenze, quindi non cambierà mai

  // Gestore per il cambio di stato (Login/Register)
  // Utilizza useCallback per memoizzare la funzione
  const toggleAuthState = useCallback((state) => {
    setCurrentState(state);
    resetForm(); // Resetta il form quando si cambia modalità
    // Aggiorna l'URL per riflettere la modalità
    navigate(`/auth?mode=${state.toLowerCase()}`, { replace: true });
  }, [resetForm, navigate]); // Dipende da resetForm e navigate

  // Frontend form validation
  const validateForm = useCallback(() => {
    let isValid = true;
    // Resetta tutti gli errori prima di validare
    setNameError('');
    setEmailError('');
    setPasswordError('');

    if (currentState === 'Register' && !name.trim()) {
      setNameError('Il nome è obbligatorio.');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('L\'email è obbligatoria.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Inserisci un\'email valida.');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('La password è obbligatoria.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('La password deve contenere almeno 6 caratteri.');
      isValid = false;
    }

    return isValid;
  }, [name, email, password, currentState]); // Dipende dagli stati del form e dal currentState

  // Handles form submission (Login or Register)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Esegui la validazione frontend
    if (!validateForm()) {
      toast.error('Compila tutti i campi obbligatori e correggi gli errori.');
      return;
    }

    setIsLoading(true);

    try {
      let response;
      const payload = { email, password };
      if (currentState === 'Register') {
        payload.name = name; // Aggiungi il nome solo per la registrazione
        response = await axios.post(`${backendUrl}/api/user/register`, payload); // Rimosso withCredentials se non gestisci sessioni basate su cookie
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, payload); // Rimosso withCredentials
      }

      if (response.data.success) {
        setToken(response.data.token);
        navigate('/');
      } else {
        // Gestione specifica degli errori dal backend (es. email già registrata, credenziali errate)
        if (response.data.message.includes('Email already registered')) {
          setEmailError('Questa email è già registrata.');
        } else if (response.data.message.includes('Invalid credentials')) {
          setEmailError('Credenziali non valide.');
          setPasswordError('Credenziali non valide.');
        }
        toast.error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Backend Error:', error.response.data);
        // Puoi aggiungere una logica più specifica per gli errori 400, 401, ecc.
        if (error.response.status === 400 && error.response.data.message) {
          // Esempio: se il backend invia errori di validazione specifici nel messaggio
          if (error.response.data.message.includes('Email non valida')) {
            setEmailError('Email non valida.');
          } else if (error.response.data.message.includes('Password troppo corta')) {
            setPasswordError('Password troppo corta.');
          } else if (error.response.data.message.includes('Nome obbligatorio')) {
            setNameError('Il nome è obbligatorio.');
          }
        }
        toast.error(error.response.data.message || 'Errore dal server.');
      } else if (axios.isAxiosError(error) && error.request) {
        console.error('Network Error:', error.request);
        toast.error('Errore di rete. Controlla la tua connessione.');
      } else {
        console.error('General Error:', error.message);
        toast.error('Si è verificato un errore inaspettato.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to redirect if token is present (user is already logged in)
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]); // Dipende da token e navigate

  // Effect to update currentState if URL parameter changes
  useEffect(() => {
    const modeFromUrl = searchParams.get('mode');
    // Aggiorna lo stato solo se è diverso, per evitare loop o re-rendering inutili
    if (modeFromUrl === 'register' && currentState !== 'Register') {
      toggleAuthState('Register');
    } else if (modeFromUrl !== 'register' && currentState !== 'Login') {
      toggleAuthState('Login');
    }
  }, [searchParams, currentState, toggleAuthState]); // Dipende da searchParams, currentState e toggleAuthState (memoizzata)

  return (
    <div className='container mx-auto px-4 py-8 md:py-12 min-h-[80vh] flex items-center justify-center'>
      <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100'>
        <div className='mb-8 text-center'>
          <p className='text-3xl font-bold text-gray-800'>{currentState}</p>
          <p className="text-gray-600 mt-2">
            {currentState === 'Login' ? 'Accedi al tuo account per continuare.' : 'Crea un nuovo account per iniziare.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          {currentState === 'Register' && (
            <TextInput
              id="name"
              name="name"
              label="Nome"
              type="text"
              placeholder="Il tuo nome"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(''); }}
              error={nameError}
              disabled={isLoading}
            />
          )}
          <TextInput
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="La tua email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
            error={emailError}
            disabled={isLoading}
          />
          <TextInput
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="La tua password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
            error={passwordError}
            disabled={isLoading}
          />

          {currentState === 'Login' && (
            <div className="flex justify-between items-center text-sm mt-1">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2 text-gray-700 select-none">Ricordami</label>
              </div>
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
                Password dimenticata?
              </Link>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            className="mt-6 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (currentState === 'Login' ? 'Accesso in corso...' : 'Registrazione in corso...') : currentState}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          {currentState === 'Login' ? (
            <>
              Non hai un account?{' '}
              <button
                type="button"
                onClick={() => toggleAuthState('Register')}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-medium cursor-pointer"
              >
                Registrati ora
              </button>
            </>
          ) : (
            <>
              Hai già un account?{' '}
              <button
                type="button"
                onClick={() => toggleAuthState('Login')}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-medium cursor-pointer"
              >
                Accedi qui
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;