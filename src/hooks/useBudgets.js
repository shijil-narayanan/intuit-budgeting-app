

import {useEffect, useState} from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { selectAllBudgetsByMonth, getBudgetsAsync, addBudgetAsync, deleteBudgetAsync, updateBudgetAsync } from '../features/budgets/budgetsSlice';

export function useBudgets(){
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const dispatch = useDispatch();
    const budgets = useSelector((state) => selectAllBudgetsByMonth(state, selectedMonth));
    const totalBudgetAmount = budgets.reduce((acc, cur) => acc + cur.amount, 0);
    const totalIncome = budgets.filter(budget => budget.category === 'income').reduce((acc, cur) => acc + cur.amount, 0);
    const budgetsRetrieveStatus = useSelector((state) => state.budgets.budgetsRetrieveStatus);

    const addBudget = (payload) => {
        dispatch(addBudgetAsync(payload));
    }

    const deleteBudget = (payload) => {
        dispatch(deleteBudgetAsync(payload));
    }

    const updateBudget = (payload) => {
        dispatch(updateBudgetAsync(payload))
    } 
    
    useEffect(() => {
        if (budgetsRetrieveStatus === 'idle') {
          dispatch(getBudgetsAsync())
        }
    }, [budgetsRetrieveStatus, dispatch]);

    return {
        budgets,
        selectedMonth,
        totalBudgetAmount,
        totalIncome,
        budgetsRetrieveStatus, 
        addBudget, 
        deleteBudget, 
        updateBudget,
        setSelectedMonth 
    }
}

