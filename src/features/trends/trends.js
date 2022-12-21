import React, {useState} from 'react';
import MonthSelector from '../../components/month-selector/monthSelector';
import { Toolbar } from 'primereact/toolbar';
import { TabView, TabPanel } from 'primereact/tabview';
import useTrends from '../../hooks/useTrends';
import { Chart } from 'primereact/chart';
import NoDataFound from '../../components/no-data-found/noDataFound';
import Table from '../../components/common/table/table';
export default function Trends(){
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const {categoryChartData,tagsChartData, selectedMonth, setSelectedMonth, transactionsByTagPerMonth, transactionsByCategoryPerMonth, transactionsRetrieveStatus} = useTrends();
    const monthSelectionTemplate = () =>  <MonthSelector currentYear={new Date().getFullYear()} currentMonth={selectedMonth} handleClick={setSelectedMonth}></MonthSelector>

    const tagTableConfig = {
        dataKey: 'tagId',
        headerText: 'Tags Transactions',
        itemsName: 'transactions',
        columns: [
            {field: 'tagId', label: 'Tag'},
            {field: 'amount', label: 'Amount'},
        ],
    }
    const categoryTableConfig = {
        dataKey: 'category',
        headerText: 'Category Transactions',
        itemsName: 'transactions',
        columns: [
            {field: 'category', label: 'Category'},
            {field: 'amount', label: 'Amount'},
        ],
    }

    const lightOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    };

    return (
        <>
            <Toolbar className="mb-4" left={monthSelectionTemplate}></Toolbar>
            <TabView activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)}>
                <TabPanel header="Category" >
                   {categoryChartData?.labels?.length > 0 ? (
                        <> 
                        <Chart type="pie" data={categoryChartData} options={lightOptions} style={{ height: '350px' , width: 'clamp(300px,  100%, 400px)', margin: '30px auto' }} />
                        <Table {...categoryTableConfig} value={transactionsByCategoryPerMonth}></Table>
                        </> )
                    : transactionsRetrieveStatus === 'succeeded' && <NoDataFound  name="transactions" redirectLink={'/transactions'} subTitle="We would be able to show category trends once few transacations are done." />}
                </TabPanel>
                <TabPanel header="Tags" >
                    {tagsChartData?.labels?.length > 0 ? 
                        (
                        <>
                         <Chart type="pie" data={tagsChartData} options={lightOptions} style={{ height: '350px' , width: 'clamp(300px,  100%, 400px)', margin: '30px auto' }} /> 
                         <Table {...tagTableConfig} value={transactionsByTagPerMonth}></Table>
                        </>
                        )
                    
                    : transactionsRetrieveStatus === 'succeeded' && <NoDataFound  name="transactions" redirectLink={'/transactions'} subTitle="We would be able to show tag trends once tags are associated with transactions." />}
                </TabPanel>
            </TabView>
        </>
    )
}