
import React from 'react';
import { MONTHS as months } from '../../app/config';
import { classNames } from 'primereact/utils';
import './monthSelector.css';
export default function MonthSelector({currentMonth, handleClick, currentYear}){

    return (
        <>
        <div className="month-container">
            {months.map(({label,id}) => (<div  key={id} onClick={() => handleClick(id)} className={"month " + classNames({ 'active': id === currentMonth })} >{label} {currentYear}</div>))}
        </div>
        
       </>
    )
}