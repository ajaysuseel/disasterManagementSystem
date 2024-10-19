// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // Add state for name

  return (
    <UserContext.Provider value={{ email, setEmail, name, setName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
