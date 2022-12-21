

import React from 'react';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import './noDataFound.css';
export default function NoDataFound({name,subTitle,iconClass,redirectLink}){
    return(
        <div className="no-data-content">
            {iconClass && <i className={iconClass} style={{fontSize: '3.5em', marginBottom: '15px', color:'#6c757d'}}></i>}
            <div className="no-data-found-text">No {name} found</div>
            {subTitle && <div className="subtitle-text">{subTitle}</div>}
            {redirectLink && <Link style={{'color': 'white'}}  to={redirectLink}>
                <Button className="go-to-btn" label={"Go to " + name}></Button>
            </Link>}
        </div>
    );
}