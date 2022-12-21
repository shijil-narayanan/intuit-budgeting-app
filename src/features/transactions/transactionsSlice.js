import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {http} from '../../utils/http/http';

const initialState = {
    transactions: [],
    transactionsRetrieveStatus: 'idle',
    transactionAddStatus: 'idle',
    transactionUpdateStatus: 'idle',
    transactionDeleteStatus: 'idle',
    getTransactionsError: null,
    addTransactionError: null,
    updateTransactionError: null,
    deleteTransactionError: null
}


export const getTransactionsAsync = createAsyncThunk(
	'transactions/getTransactionsAsync',
	async (payload) => {
        const response = await http.get('/transactions');
        return response.data;
	}
);

export const addTransactionAsync = createAsyncThunk(
	'transactions/addTransactionAsync',
	async (payload) => {
        const response = await http.post('/transactions', payload);
		return response.data;
	}
);

export const deleteTransactionAsync = createAsyncThunk(
	'transactions/deleteTransactionAsync',
	async (payload) => {
        await http.delete(`/transactions/${payload._id}`);
        return payload;
	}
);

export const updateTransactionAsync = createAsyncThunk(
	'transactions/updateTransactionAsync',
	async (payload) => {
        await http.put(`/transactions/${payload._id}`, payload);
        return payload;
	}
);

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
	reducers: {},
	extraReducers(builder) {
        builder
        .addCase(getTransactionsAsync.pending, (state, action) => {
            state.transactionsRetrieveStatus = 'loading'
        })
        .addCase(getTransactionsAsync.fulfilled, (state, action) => {
            state.transactionsRetrieveStatus = 'succeeded'
            state.transactions = action.payload;
        })
        .addCase(getTransactionsAsync.rejected, (state, action) => {
            state.transactionsRetrieveStatus = 'failed'
            state.error = action.error.message
        })


        .addCase(addTransactionAsync.pending, (state, action) => {
            state.transactionAddStatus = 'adding'
        })
        .addCase(addTransactionAsync.fulfilled, (state, action) => {
            state.transactionAddStatus = 'succeeded';
            state.transactions = state.transactions.concat(action.payload)
        })
        .addCase(addTransactionAsync.rejected, (state, action) => {
            state.transactionAddStatus = 'failed';
            state.addTransactionError = action.error.message;
        })

        .addCase(deleteTransactionAsync.pending, (state, action) => {
            state.transactionDeleteStatus = 'deleting';
        })
        .addCase(deleteTransactionAsync.fulfilled, (state, action) => {
            state.transactionDeleteStatus = 'succeeded';
            state.transactions = state.transactions.filter((transaction) => transaction._id !== action.payload._id);
        })
        .addCase(deleteTransactionAsync.rejected, (state, action) => {
            state.transactionDeleteStatus = 'failed';
            state.deleteTransactionError = action.error.message;
        })

        .addCase(updateTransactionAsync.pending, (state, action) => {
            state.transactionUpdateStatus = 'updating';
        })
        .addCase(updateTransactionAsync.fulfilled, (state, action) => {
            const id = action.payload.id;
            delete action.payload.id;
            state.transactionUpdateStatus = 'succeeded';
            state.transactions = state.transactions.map((transaction) => transaction._id === id ?  {...transaction, ...action.payload} : transaction);
        })
        .addCase(updateTransactionAsync.rejected, (state, action) => {
            state.transactionUpdateStatus = 'failed';
            state.deleteTransactionError = action.error.message;
        })
	}
})

export const { addTransaction, deleteTransaction } = transactionsSlice.actions
export default transactionsSlice.reducer;

export const selectAllTransactions = (state) => state.transactions.transactions;

export const selectTransactionsByAccountId = (state, accountId) => accountId === 'all' ?
         state.transactions.transactions : state.transactions.transactions.filter(transaction => transaction.accountId === accountId);

/*
    output : map of transactions with account id against total balance against each account
*/
export const selectTransactionSumPerAccount = (state) => {
    const accountTransactionMap = {};
    const transactions = state.transactions.transactions.slice();
    const accountIds =  transactions.map(t => t.accountId);
    accountIds.forEach(accountId => {
        accountTransactionMap[accountId] = transactions.filter(t => t.accountId === accountId).reduce((acc, cur) => acc + cur.amount, 0)
    });
    return accountTransactionMap;
}


/*
    input : selected month
    output: array of transaction filtered by selected month with sum calculated against each category  [{category, amount}]
*/
export const selectTransactionSumPerCategoryByMonth = (state, {month}) => {
    const transactions = state.transactions.transactions.filter(({date}) => new Date(date).getMonth() === month);
    return transactions.map(({category}) => ({category , amount: transactions.filter(t => t.category === category).reduce((acc, cur) => acc + cur.amount, 0) }))
    .filter((v,index,self)=>self.findIndex(v2=>(v2.category===v.category))===index)

}

/*
    input : selected month
    output: array of transaction filtered by selected month with sum calculated against each transactions  [{tagName, amount}]
*/
export const selectTransactionSumPerTagByMonth = (state, {month}) => {
    const allTransactions = state.transactions.transactions.filter(({date}) => new Date(date).getMonth() === month);
    const totalAmount = allTransactions.reduce((acc, cur) => acc + cur.amount, 0)
    const transactionsWithTagIds = allTransactions.filter(({tagId}) => tagId);
    const transactionSumWithTagIds = transactionsWithTagIds.reduce((acc, cur) => acc + cur.amount, 0);
    const othersAmount = totalAmount - transactionSumWithTagIds;
    const transacations = transactionsWithTagIds
            .map(({tagId}) => ({tagId , amount: transactionsWithTagIds.filter(t => t.tagId === tagId).reduce((acc, cur) => acc + cur.amount, 0) }))
            .filter((v,index,self)=>self.findIndex(v2=>(v2.tagId===v.tagId))===index)
            
    return transacations.length > 0 && othersAmount > 0 ? transacations.concat({tagId: 'Others' , amount: othersAmount}) : transacations;
}

