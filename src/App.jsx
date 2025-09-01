import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Usuarios from './pages/Usuarios/Usuarios';
import Buses from './pages/Buses/Buses';
import Rutas from './pages/Rutas/Rutas';
import Planillas from './pages/Planillas/Planillas';
import Tiquetes from './pages/Tiquetes/Tiquetes';
import PlanillaBus from './pages/PlanillaBus/PlanillaBus';
import PlanillaDistribucion from './pages/PlanillaDistribucion/PlanillaDistribucion';
import Login from './pages/Login/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="buses" element={<Buses />} />
            <Route path="rutas" element={<Rutas />} />
            <Route path="planillas" element={<Planillas />} />
            <Route path="tiquetes" element={<Tiquetes />} />
            <Route path="planilla-bus" element={<PlanillaBus />} />
            <Route path="planilla-distribucion" element={<PlanillaDistribucion />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
