import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';

import LoginPage from './components/Login/LoginPage';
import HomePage from './components/Home/HomePage';
import DisasterUpdate from './components/DisasterUpdate/DisasterUpdate';
import Report from './components/Report/Report';
import Help from './components/Help/Help';
import AlertManagement from './components/Alert/AlertManagement';
import HazardUpdate from './components/HazardUpdate/HazardUpdate';
import HazardReport from './components/HazardReport/HazardReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />}/>
        <Route path="/update" element={<DisasterUpdate />}/>
        <Route path="/report" element={<Report />}/>
        <Route path="/help" element={<Help />}/>
        <Route path="/alert" element={<AlertManagement/>}/>
        <Route path="/hupdate" element={<HazardUpdate/>}/>
        <Route path="/hreport" element={<HazardReport/>}/>
      </Routes>
    </Router>
  );
}

export default App;
