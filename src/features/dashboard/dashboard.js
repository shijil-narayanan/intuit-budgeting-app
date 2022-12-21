

import {useAccounts} from '../../hooks/useAccounts';
import { useTransactions } from '../../hooks/useTransactions';
import './dashboard.css';
import { useBudgets } from '../../hooks/useBudgets';
import Trends from '../trends/trends';
import { Link } from 'react-router-dom';

export default function Dashboard(){
    const {accounts, accountsRetrieveStatus} = useAccounts();
    const {budgets, budgetsRetrieveStatus} = useBudgets();
    const {transactionSumPerAccount} = useTransactions();
    return (
        <>
            <div className="flex justify-content-sb">
                <div className="entity-card" style={{width: '100%'}}>
                    <div className="entity-label">Accounts</div>
                    {accounts.length > 0 && accounts.slice(0,3).map(account =>(
                        <div className="flex justify-content-sb account-item" key={account._id}>
                            <div className="account-name">{account.name}</div>
                            <div className="account-amount">{transactionSumPerAccount[account._id] || 0} INR</div>
                        </div>
                    ))}
                    {!accounts.length && accountsRetrieveStatus === 'succeeded' && <div className="no-data-found">No accounts added yet.</div>}
                    <Link to={'/accounts'} className="go-to-link">Go to accounts</Link>
                </div>
                <div className="entity-card"  style={{width: '100%'}}>
                    <div className="entity-label">Budgets</div>
                    {budgets.length > 0 && budgets.slice(0,3).map(budget =>(
                        <div className="flex justify-content-sb budget-item" key={budget._id}>
                            <div className="budget-name">{budget.category}</div>
                            <div className="budget-amount">{budget.amount} INR</div>
                        </div>
                    ))}
                    {!budgets.length && budgetsRetrieveStatus === 'succeeded' && <div className="no-data-found">No budgets added yet for current month.</div>}
                    <Link  to={'/budgets'} className="go-to-link">Go to budgets</Link>
                </div>
            </div>
            <div className="entity-card">
                <div className="entity-label">Spending Trends</div>
                <Trends/>
            </div>
        </>
    )
}