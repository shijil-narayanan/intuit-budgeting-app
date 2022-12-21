import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function DeleteItemDialog({show, fieldName, hideDialog, deleteItem}){

    const footer = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteItem} />
        </>
    );

    return (
        <Dialog visible={show} style={{ width: '450px' }} header="Confirm" modal footer={footer} onHide={hideDialog}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                <span>Are you sure you want to delete <b>{fieldName || ''}</b>?</span>
            </div>
        </Dialog>
    )
}