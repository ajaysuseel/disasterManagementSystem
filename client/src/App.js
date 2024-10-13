import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import HomePage from './components/Home/HomePage';
import DisasterUpdate from './components/DisasterUpdate/DisasterUpdate';
import DisasterReport from './components/DisasterUpdate/DisasterUpdate';
import DisasterMapping from './components/DisasterUpdate/DisasterUpdate';
import Help from './components/DisasterUpdate/DisasterUpdate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />}/>
        <Route path="/update" element={<DisasterUpdate />}/>
        <Route path="/mapping" element={<DisasterMapping/>}/>
        <Route path="/report" element={<DisasterReport />}/>
        <Route path="/help" element={<Help />}/>
      </Routes>
    </Router>
  );
}

export default App;
