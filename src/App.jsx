import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ManufacturerDashboard from './pages/manufacturer/Dashboard';
import UserDashboard from './pages/user/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manufacturer/dashboard/*" element={<ManufacturerDashboard />} />
          <Route path="/user/dashboard/*" element={<UserDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
