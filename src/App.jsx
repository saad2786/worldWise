import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Product from './pages/Product'
import Pricing from './pages/Pricing'
import HomePage from './pages/HomePage'
import AppLayout from './pages/AppLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import './index.css'
import CityList from './components/CityList'
import City from './components/City'
import Form from './components/Form'
import CountryList from './components/CountryList'
import { CitiesProvider } from './Context/CitiesContext'
import { AuthProvider } from './Context/AuthContext'
import ProtectedRoute from './pages/ProtectedRoute'

export default function App() {
  return (
    <CitiesProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CitiesProvider>
  )
}
