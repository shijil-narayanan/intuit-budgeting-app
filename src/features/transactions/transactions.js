import React from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import Table from '../../components/common/table/table';
import useTableCrud from '../../hooks/useTableCrud';
import {useAccounts} from '../../hooks/useAccounts';
import {useTags} from '../../hooks/useTags';
import { TRANSACTION_CATEGORIES as transactionCategories } from '../../app/config';
import NoDataFound from '../../components/no-data-found/noDataFound';
import DeleteItemDialog from '../../components/common/dialog/delete-item/deleteItemDialog';
import UpdateItemDialog from '../../components/common/dialog/update-item/updateItemDialog';
import { Card } from 'primereact/card';
import { RadioButton } from 'primereact/radiobutton';
export default function Transactions(){

    const {transactions,transactionsTotal, addTransaction, deleteTransaction, updateTransaction, selectedAccountId, setSelectedAccountId} = useTransactions();
    let emptyTransaction = {
        date: '',
        category: '',
        detail: '',
        amount: 0,
        accountId: selectedAccountId === 'all' ? '' : selectedAccountId,
        tagId: '',
        type: 'spent'
    };
    const mandatoryFields = ['accountId', 'date', 'detail', 'category', 'amount'];
    const {tags} = useTags();
    const {accounts, accountsRetrieveStatus} = useAccounts();
    const accountOptions = [{name: 'All Accounts', _id: 'all'}].concat(accounts);
    const {item,action,toast,submitted,dialog} = useTableCrud({defaultItem: emptyTransaction, itemName: 'Transaction'});
    
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <i className="pi pi-pencil mr-2 cursor-pointer" onClick={() => dialog.openUpdateItemDialog(rowData)} />
                <i className="pi pi-trash cursor-pointer" onClick={() => dialog.openDeleteItemDialog(rowData)} />
            </>
        );
    }
    const rightToolBarTemplate = () => {
        return (
            <>
                <Dropdown optionLabel="name" optionValue="_id"  value={selectedAccountId} options={accountOptions} onChange={(e) => setSelectedAccountId(e.value)} className="mr-2" placeholder="Select Account"/>
                <Button label="Add Transaction" icon="pi pi-plus" className="p-button-outlined" onClick={dialog.openAddItemDialog} />
            </>
        )
    }
    

    const leftToolBarTemplate = () => (<Card className='amount-card'><div className="amount-label">Balance</div> <div className={"amount " + classNames({ 'red': transactionsTotal < 0, 'green' : transactionsTotal > 0})}>{transactionsTotal} INR</div></Card>)

    const tableConfig = {
        dataKey: '_id',
        headerText: 'Manage Transactions',
        itemsName: 'transactions',
        columns: [
            {field: 'date', label: 'Date', type: 'date', minWidth: '10rem', colTemplate: ({date}) => new Date(date).toLocaleDateString()},
            {field: 'detail', label: 'Detail', minWidth: '10rem'},
            {field: 'category', label: 'Category', minWidth: '7rem'},
            {field: 'amount', label: 'Amount', minWidth: '8rem'},
        ],
        actionTemplate: { template: actionBodyTemplate,  minWidth: '8rem' },
    }

    return (
        accounts.length ? (<>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolBarTemplate} right={rightToolBarTemplate} ></Toolbar>
                <Table {...tableConfig} value={transactions}></Table>
            </div>
            <UpdateItemDialog header="Transaction Details"
                    show={dialog.isUpdateItemDialogShown} 
                    saveItem={() => action.saveItem({addItem: addTransaction, updateItem: updateTransaction, mandatoryFields})} 
                    hideDialog={dialog.hideUpdateItemDialog}>
                       
                <div className="field">
                    <label htmlFor="detail">Accounts</label>
                    <Dropdown value={item.accountId}  optionLabel="name" optionValue="_id" options={accountOptions.slice(1)} onChange={(e) => action.updateItem('accountId', e.value)} placeholder="Select Account"/>
                    {submitted && !item.accountId && <small className="p-error">Account is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="detail">Type</label>
                    <div>
                        <RadioButton inputId="spent" name="type" value="spent" onChange={(e) => action.updateItem('type', e.value)} checked={item.type === 'spent'} />
                        <label htmlFor="spent" className="ml-1">Spent</label>    
                        <RadioButton inputId="income" name="type" value="income" onChange={(e) => action.updateItem('type', e.value)} checked={item.type === 'income'} className="ml-2" />
                        <label htmlFor="income" className="ml-1">Income</label>
                    </div>
                </div>
               
                <div className="field">
                    <label htmlFor="date">Date</label>
                    <Calendar dateFormat="dd/mm/yy" showIcon={true}  value={item.date && new Date(item.date)} onChange={(e) => action.updateItem('date', e.value)}></Calendar>
                    {submitted && !item.date && <small className="p-error">Date is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="detail">Details</label>
                    <InputText id="detail" value={item.detail} onChange={(e) => action.updateItem('detail', e.target.value)} required  className={classNames({ 'p-invalid': submitted && !item.detail })} />
                    {submitted && !item.detail && <small className="p-error">Detail is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="detail">Category</label>
                    <Dropdown value={item.category} options={transactionCategories} onChange={(e) => action.updateItem('category', e.value)} placeholder="Select Category"/>
                    {submitted && !item.category && <small className="p-error">Category is required.</small>}
                </div>

                <div className="field">
                    <label htmlFor="detail">Amount</label>
                    <InputNumber value={item.amount} onValueChange={(e) => action.updateItem('amount', (item.type ===  'spent' ? e.value * -1 : e.value))} />
                    {submitted && !item.amount && <small className="p-error">Amount is required.</small>}
                </div>
                {tags.length > 0 && <div className="field">
                    <label htmlFor="detail">Tags</label>
                    <Dropdown value={item.tagId}  optionLabel="name" optionValue="name" options={tags} onChange={(e) => action.updateItem('tagId', e.value)} placeholder="Select Tags"/>
                </div>}
            </UpdateItemDialog>
            <DeleteItemDialog deleteItem={() => action.deleteItem(deleteTransaction)} show={dialog.isDeleteItemDialogShown} hideDialog={dialog.hideDeleteItemDialog} fieldName={item.name}></DeleteItemDialog>
        </>) : 
        <>
            {accountsRetrieveStatus === 'succeeded' && <NoDataFound iconClass={'pi pi-book'} name="Accounts" subTitle="Please create Account first, then add transactions." redirectLink={'/accounts'}/>}
        </>
    );
}