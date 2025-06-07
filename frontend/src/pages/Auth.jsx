import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { ShopContext } from '../context/ShopContext';
import apiClient from '../api/axios.js';
import axios from 'axios';

// Mappa gli errori comuni del backend a messaggi frontend più amichevoli
const backendErrorMessages = {
  'Email already registered': 'Questa email è già registrata.',
  'Invalid credentials': 'Credenziali non valide.',
  'Nome obbligatorio': 'Il nome è obbligatorio.',
  'Email non valida': 'L\'email fornita non è valida.',
  'Password troppo corta': 'La password deve contenere almeno 6 caratteri.',
};

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
  const [currentState, setCurrentState] = useState(() => {
    const initialMode = searchParams.get('mode');
    return initialMode === 'register' ? 'Register' : 'Login';
  });

  // Context values
  const { token, setToken, navigate } = useContext(ShopContext);

  const resetForm = useCallback(() => {
    setName('');
    setEmail('');
    setPassword('');
    setNameError('');
    setEmailError('');
    setPasswordError('');
  }, []);

  const toggleAuthState = useCallback((state) => {
    setCurrentState(state);
    resetForm();
    navigate(`/auth?mode=${state.toLowerCase()}`, { replace: true });
  }, [resetForm, navigate]);

  const validateForm = useCallback(() => {
    let isValid = true;
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
  }, [name, email, password, currentState]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Compila tutti i campi obbligatori e correggi gli errori.');
      return;
    }

    setIsLoading(true);

    try {
      let response;
      const payload = { email, password };
      const axiosConfig = {
        withCredentials: true // Abilita l'invio e la ricezione di cookie cross-origin
      };

      if (currentState === 'Register') {
        payload.name = name;
        response = await apiClient.post(`/api/user/register`, payload, axiosConfig);
      } else {
        response = await apiClient.post(`/api/user/login`, payload, axiosConfig);
      }

      if (response.data.success) {
        // Se il token è nel corpo della risposta (non un cookie httpOnly), salvalo.
        // Se è un cookie httpOnly, il browser lo gestirà automaticamente e non lo troverai qui.
        if (response.data.token) {
          setToken(response.data.token);
        }
        toast.success(response.data.message || `${currentState} avvenuto con successo!`);
        navigate('/');
      } else {
        // Gestione degli errori dal backend usando la mappa
        const backendMsg = response.data.message;
        const mappedError = backendErrorMessages[backendMsg] || backendMsg; // Usa il messaggio mappato o quello originale
        toast.error(mappedError);

        // Imposta errori specifici sui campi, se il backend restituisce messaggi dettagliati
        if (backendMsg === 'Email already registered' || backendMsg.includes('email')) {
          setEmailError(mappedError);
        }
        if (backendMsg.includes('credentials') || backendMsg.includes('password')) {
          setPasswordError(mappedError);
          setEmailError(mappedError); // Anche l'email può essere parte delle credenziali non valide
        }
        if (backendMsg.includes('Nome obbligatorio') || backendMsg.includes('name')) {
          setNameError(mappedError);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Backend Error:', error.response.data);
        const backendMsg = error.response.data.message;
        const mappedError = backendErrorMessages[backendMsg] || backendMsg;

        if (error.response.status === 400 && backendMsg) {
          if (backendMsg.includes('email')) {
            setEmailError(mappedError);
          }
          if (backendMsg.includes('password') || backendMsg.includes('Credenziali non valide')) {
            setPasswordError(mappedError);
          }
          if (backendMsg.includes('name')) {
            setNameError(mappedError);
          }
        }
        toast.error(mappedError || 'Errore dal server.');
      } else if (axios.isAxiosError(error) && error.request) {
        console.error('Errore di rete:', error.request);
        toast.error('Errore di rete. Controlla la tua connessione.');
      } else {
        console.error('Errore generico:', error.message);
        toast.error('Si è verificato un errore inaspettato.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const modeFromUrl = searchParams.get('mode');
    if (modeFromUrl === 'register' && currentState !== 'Register') {
      toggleAuthState('Register');
    } else if (modeFromUrl !== 'register' && currentState !== 'Login') {
      toggleAuthState('Login');
    }
  }, [searchParams, currentState, toggleAuthState]);

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