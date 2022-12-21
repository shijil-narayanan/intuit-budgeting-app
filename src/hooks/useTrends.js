
import {useState, useMemo} from 'react';
import { useTransactions } from './useTransactions';
import { useSelector } from 'react-redux';
import { selectTransactionSumPerTagByMonth } from '../features/transactions/transactionsSlice';

export default function useTrends(){
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const {transactionsByCategoryPerMonth,transactionsRetrieveStatus} = useTransactions({month: selectedMonth});
    const transactionsByTagPerMonth = useSelector((state) => selectTransactionSumPerTagByMonth(state, {month: selectedMonth}));
    const totalTransactionValue = transactionsByCategoryPerMonth.reduce((acc, cur) => acc + cur.amount, 0);
    const categoryChartData  = useMemo(() => ({
        labels:  transactionsByCategoryPerMonth.map(({category}) => category),
        datasets: [
            {
                data: transactionsByCategoryPerMonth.map(({amount}) => (((amount / totalTransactionValue) * 100 ) / 100 ) * 360),
                backgroundColor: [
                    "#6366F1",
                    "#66BB6A",
                    "#FFA726"
                ],
                hoverBackgroundColor: [
                    "#6366f1c9",
                    "#81C784",
                    "#FFB74D"
                ]
            }
        ]
    }), [transactionsByCategoryPerMonth, totalTransactionValue])

    const tagsChartData  = useMemo(() => ({
        labels:  transactionsByTagPerMonth.map(({tagId}) => tagId),
        datasets: [
            {
                data: transactionsByTagPerMonth.map(({amount}) => (((amount / totalTransactionValue) * 100 ) / 100 ) * 360),
                backgroundColor: [
                    "#6366F1",
                    "#66BB6A",
                    "#FFA726"
                ],
                hoverBackgroundColor: [
                    "#6366f1c9",
                    "#81C784",
                    "#FFB74D"
                ]
            }
        ]
    }), [transactionsByTagPerMonth, totalTransactionValue])

    return {
        categoryChartData,
        tagsChartData, 
        selectedMonth, 
        transactionsByCategoryPerMonth, 
        transactionsByTagPerMonth,
        transactionsRetrieveStatus,
        setSelectedMonth, 
    }

}
