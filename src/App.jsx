import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/public/Login';
import Metricas from './pages/private/Metricas'
import Usuarios from './pages/private/Usuarios'
import Locales from './pages/private/Locales';
import Clientes from './pages/private/Clientes';
import Reclamos from './pages/private/Reclamos';
import Ajustes from './pages/private/Ajustes';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/metricas" element={<Metricas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/locales" element={<Locales />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/reclamos" element={<Reclamos />} />
          <Route path="/ajustes" element={<Ajustes />} />
          {/* <Route path="/metricas" element={<Metricas />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ajustes" element={<Ajustes />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/metricas" />} />
      </Routes>
    </Router>
  );
}

export default App;