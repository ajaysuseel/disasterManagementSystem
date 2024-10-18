import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './components/Login';


function App(){
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
