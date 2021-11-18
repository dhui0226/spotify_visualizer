import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback'
import Login from './Login'
import './App.css';

function App() {

  const [token, setToken] = useState('');

  console.log('hi');
  useEffect(() => {

    async function getToken() {
      const response = await fetch('/auth/token');
      console.log('response', response)
      const json = await response.json();
      console.log(json, json.access_token)
      setToken(json.access_token);
    }

    getToken();

  }, []);

  return (
    <>
        { (token === '') ? <Login/> : <WebPlayback token={token} /> }
    </>
  );
}

export default App;
