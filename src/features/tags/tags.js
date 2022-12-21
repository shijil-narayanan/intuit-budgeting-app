
import React from 'react';
import { useTags } from '../../hooks/useTags';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import './tags.css';
import Table from '../../components/common/table/table';
import useTableCrud from '../../hooks/useTableCrud';
import DeleteItemDialog from '../../components/common/dialog/delete-item/deleteItemDialog';
import UpdateItemDialog from '../../components/common/dialog/update-item/updateItemDialog';

export default function Tags(){
    let emptyTag = {
        name: ''
    };
    const {tags, addTag, deleteTag, updateTag} = useTags();
    const {item,action,toast,submitted,dialog} = useTableCrud({defaultItem: emptyTag, itemName: 'Tag'});
    
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <i  className="pi pi-pencil mr-2 cursor-pointer" onClick={() => dialog.openUpdateItemDialog(rowData)} />
                <i className="pi pi-trash cursor-pointer" onClick={() => dialog.openDeleteItemDialog(rowData)} />
            </>
        );
    }
    const addTagTemplate = () => {
        return (
            <>
                <Button label="Add Tags" icon="pi pi-plus" className="p-button-outlined mr-2" onClick={dialog.openAddItemDialog} />
            </>
        )
    }

    const tableConfig = {
        dataKey: '_id',
        headerText: 'Manage Tags',
        itemsName: 'tags',
        columns: [
            {field: 'name', label: 'Name'}
        ],
        actionTemplate: { template: actionBodyTemplate },
        addItemTemplate: addTagTemplate()
    }

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />
            <div className="card">
                <Table {...tableConfig} value={tags}></Table>
            </div>
            <UpdateItemDialog header="Tag Details"
                    show={dialog.isUpdateItemDialogShown} 
                    saveItem={() => action.saveItem({addItem: addTag, updateItem: updateTag, mandatoryFields: ['name']})} 
                    hideDialog={dialog.hideUpdateItemDialog}>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" value={item.name} onChange={(e) => action.updateItem('name', e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !item.name })} />
                    {submitted && !item.name && <small className="p-error">Name is required.</small>}
                </div>
            </UpdateItemDialog>
            <DeleteItemDialog deleteItem={() => action.deleteItem(deleteTag)} show={dialog.isDeleteItemDialogShown} hideDialog={dialog.hideDeleteItemDialog} fieldName={item.name}></DeleteItemDialog>
        </div>
    );
}