import { configureStore } from '@reduxjs/toolkit';
import tagReducer from '../features/tags/tagsSlice';
import transactionReducer from '../features/transactions/transactionsSlice';
import accountReducer from '../features/accounts/accountsSlice';
import budgetReducer from '../features/budgets/budgetsSlice';
export default configureStore({
  reducer: {
    accounts: accountReducer,
    tags: tagReducer,
    transactions: transactionReducer,
    budgets: budgetReducer
  },
});
