import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;


const Home = lazy(() => import('./pages/Home'));
const Create = lazy(() => import('./pages/Create'));
const Index = lazy(() => import('./pages/Index'));
const Orders = lazy(() => import('./pages/Orders'));


const App = () => {
  const navbarRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className='min-h-screen bg-gray-100'>
      <ToastContainer position="bottom-right" hideProgressBar />
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <ErrorBoundary>
          <Navbar
            navbarRef={navbarRef}
            toggleSidebar={toggleSidebar}
          />
          <div className="flex w-full">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={toggleSidebar}
              setToken={setToken}
            />
            <div className='w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base '>
              {/* Avvolge le Routes con Suspense per mostrare un fallback durante il caricamento dei componenti lazy */}
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home token={token} />} />
                  <Route path="/create" element={<Create token={token} />} />
                  <Route path="/products" element={<Index token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
}

export default App;
