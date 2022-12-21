import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {http} from '../../utils/http/http';

const initialState = {
    budgets: [],
    budgetsRetrieveStatus: 'idle',
    budgetAddStatus: 'idle',
    budgetUpdateStatus: 'idle',
    budgetDeleteStatus: 'idle',
    getBudgetsError: null,
    addBudgetError: null,
    updateBudgetError: null,
    deleteBudgetError: null
}


export const getBudgetsAsync = createAsyncThunk(
	'budgets/getBudgetsAsync',
	async () => {
        const response = await http.get('/budgets');
        return response.data;
	}
);

export const addBudgetAsync = createAsyncThunk(
	'budgets/addBudgetAsync',
	async (payload) => {
        const response = await http.post('/budgets', payload);
		return response.data;
	}
);

export const deleteBudgetAsync = createAsyncThunk(
	'budgets/deleteBudgetAsync',
	async (payload) => {
        await http.delete(`/budgets/${payload._id}`);
        return payload;
	}
);

export const updateBudgetAsync = createAsyncThunk(
	'budgets/updateBudgetAsync',
	async (payload) => {
        await http.put(`/budgets/${payload._id}`, payload);
        return payload;
	}
);

export const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
	reducers: {},
	extraReducers(builder) {
        builder
        .addCase(getBudgetsAsync.pending, (state, action) => {
            state.budgetsRetrieveStatus = 'loading'
        })
        .addCase(getBudgetsAsync.fulfilled, (state, action) => {
            state.budgetsRetrieveStatus = 'succeeded'
            state.budgets = action.payload;
        })
        .addCase(getBudgetsAsync.rejected, (state, action) => {
            state.budgetsRetrieveStatus = 'failed'
            state.error = action.error.message
        })


        .addCase(addBudgetAsync.pending, (state, action) => {
            state.budgetAddStatus = 'adding'
        })
        .addCase(addBudgetAsync.fulfilled, (state, action) => {
            state.budgetAddStatus = 'succeeded';
            state.budgets = state.budgets.concat(action.payload)
        })
        .addCase(addBudgetAsync.rejected, (state, action) => {
            state.budgetAddStatus = 'failed';
            state.addBudgetError = action.error.message;
        })

        .addCase(deleteBudgetAsync.pending, (state, action) => {
            state.budgetDeleteStatus = 'deleting';
        })
        .addCase(deleteBudgetAsync.fulfilled, (state, action) => {
            state.budgetDeleteStatus = 'succeeded';
            state.budgets = state.budgets.filter((budget) => budget._id !== action.payload._id);
        })
        .addCase(deleteBudgetAsync.rejected, (state, action) => {
            state.budgetDeleteStatus = 'failed';
            state.deleteBudgetError = action.error.message;
        })

        .addCase(updateBudgetAsync.pending, (state, action) => {
            state.budgetUpdateStatus = 'updating';
        })
        .addCase(updateBudgetAsync.fulfilled, (state, action) => {
            const id = action.payload.id;
            delete action.payload.id;
            state.budgetUpdateStatus = 'succeeded';
            state.budgets = state.budgets.map((budget) => budget._id === id ?  {...budget, ...action.payload} : budget);
        })
        .addCase(updateBudgetAsync.rejected, (state, action) => {
            state.budgetUpdateStatus = 'failed';
            state.deleteBudgetError = action.error.message;
        })
	}
})

export const { addBudget, deleteBudget } = budgetsSlice.actions
export default budgetsSlice.reducer;

export const selectAllBudgets = (state) => state.budgets.budgets;

export const selectAllBudgetsByMonth = (state, selectedMonth) => state.budgets.budgets.filter(({month}) => month === selectedMonth);






