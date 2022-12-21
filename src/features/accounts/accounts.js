
import React from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import Table from '../../components/common/table/table';
import useTableCrud from '../../hooks/useTableCrud';
import DeleteItemDialog from '../../components/common/dialog/delete-item/deleteItemDialog';
import UpdateItemDialog from '../../components/common/dialog/update-item/updateItemDialog';
import { ACCOUNT_CATEGORIES as accountCategories } from '../../app/config';
import { useTransactions } from '../../hooks/useTransactions';

export default function Accounts(){
    let emptyAccount = {
        name: '',
        category: '',
        totalAmount: 0
    };
    const {accounts, addAccount, deleteAccount, updateAccount} = useAccounts();
    const {item,action,toast,submitted,dialog} = useTableCrud({defaultItem: emptyAccount, itemName: 'Account'});
    const {transactionSumPerAccount} = useTransactions();
    
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <i  className="pi pi-pencil mr-2 cursor-pointer" onClick={() => dialog.openUpdateItemDialog(rowData)} />
                <i className="pi pi-trash cursor-pointer" onClick={() => dialog.openDeleteItemDialog(rowData)} />
            </>
        );
    }
    const addBudgetTemplate = () => {
        return (
            <>
                <Button label="Add Accounts" icon="pi pi-plus" className="p-button-outlined mr-2" onClick={dialog.openAddItemDialog} />
            </>
        )
    }

    const tableConfig = {
        dataKey: '_id',
        headerText: 'Manage Accounts',
        itemsName: 'accounts',
        columns: [
            {field: 'name', label: 'Name', minWidth: '16rem'},
            {field: 'category', label: 'Account Type', minWidth: '16rem'},
            {field: 'totalAmount', label: 'Balance (INR)', colTemplate: ({_id}) => transactionSumPerAccount[_id] || 0 }
        ],
        actionTemplate: { template: actionBodyTemplate,  minWidth: '8rem' },
        addItemTemplate: addBudgetTemplate()
    }

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />
            <div className="card">
                <Table {...tableConfig} value={accounts}></Table>
            </div>
            <UpdateItemDialog header="Account Details"
                    show={dialog.isUpdateItemDialogShown} 
                    saveItem={() => action.saveItem({addItem: addAccount, updateItem: updateAccount, mandatoryFields: ['name', 'category']})} 
                    hideDialog={dialog.hideUpdateItemDialog}>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" value={item.name} onChange={(e) => action.updateItem('name', e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !item.name })} />
                    {submitted && !item.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="name">Category</label>
                    <Dropdown value={item.category} options={accountCategories} onChange={(e) => action.updateItem('category', e.value)} placeholder="Select Category"/>
                    {submitted && !item.category && <small className="p-error">Category is required.</small>}
                </div>
            </UpdateItemDialog>
            <DeleteItemDialog deleteItem={() => action.deleteItem(deleteAccount)} show={dialog.isDeleteItemDialogShown} hideDialog={dialog.hideDeleteItemDialog} fieldName={item.name}></DeleteItemDialog>
        </div>
    );
}