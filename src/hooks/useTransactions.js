

import {useEffect, useState} from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { getTransactionsAsync, addTransactionAsync, deleteTransactionAsync, updateTransactionAsync, selectTransactionsByAccountId, selectTransactionSumPerAccount, selectTransactionSumPerCategoryByMonth, selectTransactionSumPerTagByMonth } from '../features/transactions/transactionsSlice';

export function useTransactions(query = {}){
    const dispatch = useDispatch();

    const [selectedAccountId, setSelectedAccountId] = useState('all');
    const transactions = useSelector((state) => selectTransactionsByAccountId(state, selectedAccountId));
    const transactionSumPerAccount = useSelector(selectTransactionSumPerAccount);
    const transactionsByCategoryPerMonth = useSelector((state) => selectTransactionSumPerCategoryByMonth(state, query));
    const transactionsByTagPerMonth = useSelector((state) => selectTransactionSumPerTagByMonth(state, query));
    const transactionsTotal = transactions.reduce((acc, cur) => acc + cur.amount, 0);
    const transactionsRetrieveStatus = useSelector((state) => state.transactions.transactionsRetrieveStatus);

    const error = useSelector((state) => state.transactions.error);

    const addTransaction = (payload) => {
        dispatch(addTransactionAsync(payload));
    }

    const deleteTransaction = (payload) => {
        dispatch(deleteTransactionAsync(payload));
    }

    const updateTransaction = (payload) => {
        dispatch(updateTransactionAsync(payload))
    }
    
    useEffect(() => {
        if (transactionsRetrieveStatus === 'idle') {
          dispatch(getTransactionsAsync())
        }
    }, [transactionsRetrieveStatus, dispatch]);

    return {transactions,transactionSumPerAccount,transactionsTotal, transactionsRetrieveStatus, error, addTransaction, deleteTransaction, updateTransaction,selectedAccountId, setSelectedAccountId, transactionsByCategoryPerMonth, transactionsByTagPerMonth}
}

