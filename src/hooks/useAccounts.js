

import {useEffect} from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { selectAllAccounts, getAccountsAsync, addAccountAsync, deleteAccountAsync, updateAccountAsync } from '../features/accounts/accountsSlice';

export function useAccounts(){
    const dispatch = useDispatch();
    const accounts = useSelector(selectAllAccounts);
    const accountsRetrieveStatus = useSelector((state) => state.accounts.accountsRetrieveStatus);

    const addAccount = (payload) => {
        dispatch(addAccountAsync(payload));
    }

    const deleteAccount = (payload) => {
        dispatch(deleteAccountAsync(payload));
    }

    const updateAccount = (payload) => {
        dispatch(updateAccountAsync(payload))
    } 


    useEffect(() => {
        if (accountsRetrieveStatus === 'idle') {
          dispatch(getAccountsAsync())
        }
    }, [accountsRetrieveStatus, dispatch]);

    return {accounts, accountsRetrieveStatus, addAccount, deleteAccount, updateAccount}
}

