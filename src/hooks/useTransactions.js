import {useEffect, useState, useMemo} from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { getTransactionsAsync, addTransactionAsync, deleteTransactionAsync, updateTransactionAsync, selectTransactionsByAccountId, selectTransactionSumPerAccount, selectTransactionSumPerCategoryByMonth } from '../features/transactions/transactionsSlice';

export function useTransactions(query = {}){
    const dispatch = useDispatch();

    const [selectedAccountId, setSelectedAccountId] = useState('all');
    const transactions = useSelector((state) => selectTransactionsByAccountId(state, selectedAccountId));
    const transactionSumPerAccount = useSelector(selectTransactionSumPerAccount);
    const transactionsByCategoryPerMonth = useSelector((state) => selectTransactionSumPerCategoryByMonth(state, query));
    const transactionsTotal = useMemo(() => transactions.reduce((acc, cur) => acc + cur.amount, 0), [transactions]);
    const transactionsRetrieveStatus = useSelector((state) => state.transactions.transactionsRetrieveStatus);

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

    return {
        transactions,
        transactionSumPerAccount,
        transactionsTotal, 
        selectedAccountId,
        transactionsByCategoryPerMonth,
        transactionsRetrieveStatus, 
        addTransaction, 
        deleteTransaction, 
        updateTransaction, 
        setSelectedAccountId
    }
}

