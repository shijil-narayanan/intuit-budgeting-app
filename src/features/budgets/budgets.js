
import React from 'react';
import { useBudgets } from '../../hooks/useBudgets';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import Table from '../../components/common/table/table';
import { BUDGET_CATEGORIES as budgetCategories } from '../../app/config';
import useTableCrud from '../../hooks/useTableCrud';
import DeleteItemDialog from '../../components/common/dialog/delete-item/deleteItemDialog';
import UpdateItemDialog from '../../components/common/dialog/update-item/updateItemDialog';
import { useTransactions } from '../../hooks/useTransactions';
import { Card } from 'primereact/card';
import MonthSelector from '../../components/month-selector/monthSelector';


export default function Budgets(){
    const currentYear = new Date().getFullYear();
    const {budgets, addBudget, deleteBudget, updateBudget ,selectedMonth, setSelectedMonth, totalIncome, totalBudgetAmount, budgetsRetrieveStatus: budgetStatus } = useBudgets();
    const {transactionsByCategoryPerMonth, transactionsRetrieveStatus : transactionStatus} = useTransactions({month: selectedMonth});
    let emptyBudget = {
        amount: 0,
        month: selectedMonth,
        category: '',
        year: currentYear
    };
    const {item,action,toast,submitted,dialog} = useTableCrud({defaultItem: emptyBudget, itemName: 'Budget'});
    
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <i  className="pi pi-pencil mr-2 cursor-pointer" onClick={() => dialog.openUpdateItemDialog(rowData)} />
                <i className="pi pi-trash cursor-pointer" onClick={() => dialog.openDeleteItemDialog(rowData)} />
            </>
        );
    }
    const rightToolbarTemplate = () => {
        return (
            <>
                <Button label="Add Budget" icon="pi pi-plus" className="p-button-outlined mr-2" onClick={dialog.openAddItemDialog} />
            </>
        )
    }

    const leftToolbarTemplate = () => {
        const spentAmount = totalBudgetAmount - totalIncome;
        const left = totalIncome - spentAmount
        return (
            <div className="flex justify-content-sb">
                <Card className="amount-card">
                   <div className="amount-label">Income</div>
                   <div className="amount">{totalIncome} INR</div>
                </Card>
                <Card className="amount-card">
                   <div className="amount-label">Allotted</div>
                   <div className="amount">{spentAmount} INR</div>
                </Card>
                <Card className="amount-card">
                   <div className="amount-label">Left</div>
                   <div className={"amount " + classNames({ 'red': left < 0, 'green' : left > 0})}>{left} INR</div>
                </Card>
            </div>
        )
    }

    const monthSelectionTemplate = () =>  <MonthSelector currentYear={currentYear} currentMonth={selectedMonth} handleClick={setSelectedMonth}></MonthSelector>

    const tableConfig = {
        dataKey: '_id',
        headerText: 'Manage Budgets',
        itemsName: 'budgets',
        columns: [
            {field: 'category', label: 'Category', minWidth: '16rem'},
            {field: 'amount', label: 'Alloted', minWidth: '16rem'},
            {field: 'spent', label: 'Spent', minWidth: '16rem', colTemplate: ({category}) => transactionsByCategoryPerMonth.find(t => t.category === category)?.amount || 0 },
            {field: 'left', label: 'Left', minWidth: '16rem',  colTemplate: ({amount, category}) => amount - transactionsByCategoryPerMonth.find(t => t.category === category)?.amount  || 0}
        ],
        actionTemplate: { template: actionBodyTemplate,  minWidth: '8rem' }
    }

    const handleCategoryChange = (newCategory) => {
        const budget = budgets.find(({category}) => category === newCategory);
        budget ? action.setItem(budget) : action.updateItem('category', newCategory)
    }

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={monthSelectionTemplate}></Toolbar>
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <Table {...tableConfig} value={budgets} loading={transactionStatus === 'idle' && budgetStatus === 'idle'}></Table>
            </div>
            <UpdateItemDialog header="Budget Details"
                    show={dialog.isUpdateItemDialogShown} 
                    saveItem={() => action.saveItem({addItem: addBudget, updateItem: updateBudget, mandatoryFields: ['amount', 'category']})} 
                    hideDialog={dialog.hideUpdateItemDialog}>
                <div className="field">
                    <label htmlFor="detail">Category</label>
                    <Dropdown value={item.category} options={budgetCategories} onChange={(e) => handleCategoryChange(e.value)} placeholder="Select Category"/>
                    {submitted && !item.category && <small className="p-error">Category is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="detail">Amount</label>
                    <InputNumber value={item.amount} onValueChange={(e) => action.updateItem('amount', e.value)} />
                    {submitted && !item.amount && <small className="p-error">Amount is required.</small>}
                </div>
            </UpdateItemDialog>
            <DeleteItemDialog deleteItem={() => action.deleteItem(deleteBudget)} show={dialog.isDeleteItemDialogShown} hideDialog={dialog.hideDeleteItemDialog} fieldName={item.name}></DeleteItemDialog>
        </div>
    );
}