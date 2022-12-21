
import './App.css';
import React from 'react';
import Layout from './components/common/layout/layout';
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Layout/>
      </BrowserRouter>
       
    </div>
  );
}

export default App;
