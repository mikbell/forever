import React, { useState } from 'react';
import Button from "./Button";
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Funzione per gestire l'invio del form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(backendUrl + '/api/user/admin', {
                email,
                password
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setToken(response.data.token);
            } else {
                toast.error(response.data.message);
            }

            console.log("Risposta del server:", response.data);

        } catch (error) {
            console.error("Errore durante il login admin:", error); // Log dettagliato dell'errore

            // Gestisci gli errori della risposta
            if (error.response) {
                toast.error(error.response.data.message);
            } else if (error.request) {
                toast.error("Si è verificato un errore durante la richiesta.");
            } else {
                toast.error("Si è verificato un errore sconosciuto.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                            placeholder="Inserisci la tua email"
                            aria-label="Indirizzo email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                            placeholder="Inserisci la tua password"
                            aria-label="Password"
                        />
                    </div>

                    <Button
                        type="submit"
                        aria-label="Accedi"
                        fullWidth
                    >
                        {isLoading ? 'Accesso in corso...' : 'Accedi'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Non hai un account?{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                        Registrati
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
