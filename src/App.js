import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback'
import Login from './Login'
import './App.css';

function App() {

  const [token, setToken] = useState('');

  async function getToken() {
    const response = await fetch('/auth/token');
    console.log('response', response)
    let json = await response.json();
    console.log('json', json.access_token)
    setToken(json.access_token);
  }

  useEffect(() => {
    getToken();

  }, []);

  return (
    <>
        { (token === '') ? <Login/> : <WebPlayback token={token} /> }
    </>
  );
}

export default App;
