import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';

import LoginPage from './components/Login/LoginPage';
import HomePage from './components/Home/HomePage';
import DisasterUpdate from './components/DisasterUpdate/DisasterUpdate';
import Report from './components/Report/Report';
import Mapping from './components/Mapping/Mapping';
import Help from './components/Help/Help';
import AlertManagement from './components/Alert/AlertManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />}/>
        <Route path="/update" element={<DisasterUpdate />}/>
        <Route path="/mapping" element={<Mapping/>}/>
        <Route path="/report" element={<Report />}/>
        <Route path="/help" element={<Help />}/>
        <Route path="/alert" element={<AlertManagement/>}/>
      </Routes>
    </Router>
  );
}

export default App;
