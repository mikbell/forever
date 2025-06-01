import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { toast } from 'react-toastify';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { ShopContext } from '../context/ShopContext'; // Se hai logica di autenticazione qui

const Auth = () => { // Rinominato da Login a Auth per riflettere la duplice funzionalità
  const [name, setName] = useState(''); // Nuovo stato per il nome (solo per Sign up)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState(''); // Nuovo stato per l'errore del nome
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentState, setCurrentState] = useState('Login'); // Inizializzato a 'Login' per default

  const navigate = useNavigate();
  // Se hai funzioni di autenticazione nel tuo ShopContext (es. `loginUser`, `registerUser`),
  // puoi decommentarle e usarle qui invece delle simulazioni.
  // const { loginUser, registerUser } = useContext(ShopContext);

  // Funzione per resettare il form e gli errori quando si cambia stato
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setIsLoading(false);
  };

  // Gestore per il cambio di stato (Login/Sign up)
  const toggleAuthState = (state) => {
    setCurrentState(state);
    resetForm(); // Resetta il form quando si cambia modalità
  };

  const validateForm = () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');

    if (currentState === 'Sign up' && !name.trim()) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      try {
        let response;
        if (currentState === 'Login') {
          // Logica di Login
          // response = await loginUser(email, password); // Se usi ShopContext
          response = await new Promise(resolve => setTimeout(() => {
            if (email === 'test@example.com' && password === 'password123') {
              resolve({ success: true, message: 'Accesso effettuato con successo!' });
            } else {
              resolve({ success: false, message: 'Email o password non validi.' });
            }
          }, 1500));
        } else {
          // Logica di Sign up
          // response = await registerUser(name, email, password); // Se usi ShopContext
          response = await new Promise(resolve => setTimeout(() => {
            if (name.trim() && email.trim() && password.length >= 6) {
              resolve({ success: true, message: 'Registrazione effettuata con successo! Ora puoi accedere.' });
            } else {
              resolve({ success: false, message: 'Errore durante la registrazione. Riprova.' });
            }
          }, 1500));
        }

        if (response.success) {
          toast.success(response.message);
          navigate('/'); // Reindirizza alla homepage dopo successo
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error(`Errore durante ${currentState}:`, error);
        toast.error("Si è verificato un errore. Riprova più tardi.");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center'>
      <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100'>
        <div className='mb-8 text-center'>
          <p className='text-3xl font-bold text-gray-800'>{currentState}</p> {/* Titolo dinamico */}
          <p className="text-gray-600 mt-2">
            {currentState === 'Login' ? 'Accedi al tuo account per continuare.' : 'Crea un nuovo account per iniziare.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          {currentState === 'Sign up' && ( // Campo Nome solo per Sign up
            <TextInput
              id="name"
              name="name"
              label="Nome"
              type="text"
              placeholder="Il tuo nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            disabled={isLoading}
          />

          {currentState === 'Login' && ( // Opzioni Login-specifiche
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
                onClick={() => toggleAuthState('Sign up')}
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

export default Auth; // Esporta come Auth
