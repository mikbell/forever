import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Auth from './pages/Auth'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Delivery from './pages/Delivery'
import PrivacyPolicy from './pages/PrivacyPolicy'
import MainLayout from './layouts/MainLayout'

const App = () => {
  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path='/delivery' element={<Delivery />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
        </Routes>
      </MainLayout>
    </>
  )
}

export default App