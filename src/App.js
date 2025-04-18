import React, { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import UserPage from './UserPage';
import LoginPage from './Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const [, payload] = token.split('.');
          const decoded = JSON.parse(atob(payload));
          const exp = decoded.exp * 1000;
          if (Date.now() >= exp) {
            handleLogout();
          }
        } catch (err) {
          handleLogout();
        }
      }
    };
    checkToken();
  }, []);

  return (
    <ApolloProvider client={client}>
      {token ? (
        <>
          <div className="flex justify-end p-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
          <UserPage />
        </>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </ApolloProvider>
  );
}

export default App;
