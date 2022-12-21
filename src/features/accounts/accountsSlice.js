import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {http} from '../../utils/http/http';

const initialState = {
    accounts: [],
    accountsRetrieveStatus: 'idle',
    accountAddStatus: 'idle',
    accountUpdateStatus: 'idle',
    accountDeleteStatus: 'idle',
    getAccountsError: null,
    addAccountError: null,
    updateAccountError: null,
    deleteAccountError: null
}


export const getAccountsAsync = createAsyncThunk(
	'accounts/getAccountsAsync',
	async (payload) => {
        console.log('payload', payload)
        const response = await http.get('/accounts');
        return response.data;
	}
);

export const addAccountAsync = createAsyncThunk(
	'accounts/addAccountAsync',
	async (payload) => {
        const response = await http.post('/accounts', payload);
		return response.data;
	}
);

export const deleteAccountAsync = createAsyncThunk(
	'accounts/deleteAccountAsync',
	async (payload) => {
        await http.delete(`/accounts/${payload._id}`);
        return payload;
	}
);

export const updateAccountAsync = createAsyncThunk(
	'accounts/updateAccountAsync',
	async (payload) => {
        await http.put(`/accounts/${payload._id}`, payload);
        return payload;
	}
);

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
	reducers: {},
	extraReducers(builder) {
        builder
        .addCase(getAccountsAsync.pending, (state, action) => {
            state.accountsRetrieveStatus = 'loading'
        })
        .addCase(getAccountsAsync.fulfilled, (state, action) => {
            state.accountsRetrieveStatus = 'succeeded'
            state.accounts = action.payload;
        })
        .addCase(getAccountsAsync.rejected, (state, action) => {
            state.accountsRetrieveStatus = 'failed'
            state.error = action.error.message
        })


        .addCase(addAccountAsync.pending, (state, action) => {
            state.accountAddStatus = 'adding'
        })
        .addCase(addAccountAsync.fulfilled, (state, action) => {
            state.accountAddStatus = 'succeeded';
            state.accounts = state.accounts.concat(action.payload)
        })
        .addCase(addAccountAsync.rejected, (state, action) => {
            state.accountAddStatus = 'failed';
            state.addAccountError = action.error.message;
        })

        .addCase(deleteAccountAsync.pending, (state, action) => {
            state.accountDeleteStatus = 'deleting';
        })
        .addCase(deleteAccountAsync.fulfilled, (state, action) => {
            state.accountDeleteStatus = 'succeeded';
            state.accounts = state.accounts.filter((account) => account._id !== action.payload._id);
        })
        .addCase(deleteAccountAsync.rejected, (state, action) => {
            state.accountDeleteStatus = 'failed';
            state.deleteAccountError = action.error.message;
        })

        .addCase(updateAccountAsync.pending, (state, action) => {
            state.accountUpdateStatus = 'updating';
        })
        .addCase(updateAccountAsync.fulfilled, (state, action) => {
            const id = action.payload.id;
            delete action.payload.id;
            state.accountUpdateStatus = 'succeeded';
            state.accounts = state.accounts.map((account) => account._id === id ?  {...account, ...action.payload} : account);
        })
        .addCase(updateAccountAsync.rejected, (state, action) => {
            state.accountUpdateStatus = 'failed';
            state.deleteAccountError = action.error.message;
        })
	}
})

export const { addAccount, deleteAccount } = accountsSlice.actions
export default accountsSlice.reducer;

export const selectAllAccounts = (state) => state.accounts.accounts;


