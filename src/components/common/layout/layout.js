

import React, {useState} from 'react';
import SideBar from '../sidebar/sidebar';
import {Routes, Route} from 'react-router-dom';
import routes from '../../../app/routes';
import './layout.css';
function Layout(){
    const [on, setOn] = useState(true);
    

    const handleOn = () => {
      setOn(!on);
    };

    return (
        <>
          <aside className={on ? 'to-right' : ''}>
            <header className="sticky header">
                <div className="flex justify-content-sb">
                    <i className="pi pi-bars cursor-pointer"  onClick={handleOn}></i>
                    <i className="pi pi-power-off cursor-pointer" onClick={() => alert('Logout feature is work in progress...')}></i>
                </div>
            </header>
            
            <div className="main-content">
                    <Routes>
                    {routes.map((route, key) => <Route key={key}  path={route.path}  element={route.component}></Route>)}
                    </Routes>
            </div>
          </aside>
          {on && <SideBar openClass="open"/>}
        </>
    );

}

export default Layout;



