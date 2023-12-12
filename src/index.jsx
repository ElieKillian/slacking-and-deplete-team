import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// CSS
import './index.scss';
// pages
import Home from './pages/home';
import Main from './pages/main';
import Alts from './pages/alts';
// composants
import Header from './composants/header';
import Footer from './composants/footer';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Router>
      <div className='router'>
        <div>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/main' element={<Main />} />
          <Route path='/alts' element={<Alts />} />
        </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  </React.StrictMode>
);
