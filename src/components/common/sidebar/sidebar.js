import React, { useState, useEffect } from 'react';
import './sidebar.css';
import {Link, useLocation} from 'react-router-dom';
import routes from '../../../app/routes';

export default function SideBar({ openClass }){
  const [activeLink, setActiveLink] = useState('/');
  const location = useLocation();
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location])
  const links = routes.filter(route => route.path !== '*');
  return (
    <nav className={openClass === 'open' ? 'openSidebar' : ''}>
      <img alt="logo" style={{  width: '200px', height: '120px'}} src="logo.png"/>
      <ul className="navlist">
        {links.map((link, key) =>  <li   key={key} className={link.path === activeLink ? 'active' : ''}>
            
            <Link  to={link.path} onClick={() => setActiveLink(link.path)} className="menu-item"> <i className={link.icon + ' menu-icons'} ></i>{link.label}</Link>
        </li>)}
      </ul>
    </nav>
  );
};
