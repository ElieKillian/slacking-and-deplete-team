import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from './sablier.jpg';


function Header(){

    const location = useLocation();

    useEffect(() => {
      const currentUrl = location.pathname;
      const menuLinks = document.querySelectorAll("a.header__right__link");
  
      menuLinks.forEach((link) => {
        if (link.pathname === currentUrl) {
          link.classList.add("active");
        } else  {
          link.classList.remove("active");
        }
      });
    }, [location]);

    return(
        <header className="header">
            <div className="header__left">
              <img src={logo} alt='icone team' />
              <h1>Slacking & Deplete</h1>
            </div>
            <nav className="header__right">
                <Link to='/' className="header__right__link">Roster</Link>
                <Link to='/alts' className="header__right__link">Alts</Link>
            </nav>
        </header>
    )
};

export default Header;