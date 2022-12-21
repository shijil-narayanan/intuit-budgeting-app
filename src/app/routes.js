import Accounts from "../features/accounts/accounts";
import Budgets from "../features/budgets/budgets";
import Dashboard from "../features/dashboard/dashboard";
import Tags from "../features/tags/tags";
import Transactions from "../features/transactions/transactions";
import Trends from "../features/trends/trends";

const routes = [
    {
        id: 'dashboard',
        icon: 'pi pi-chart-pie',
        path: '/',
        label: 'Dashboard',
        component: <Dashboard/>
    },
    {
        id: 'accounts',
        path: '/accounts',
        icon: 'pi pi-book',
        label: 'Accounts',
        component: <Accounts/>
    },
    {
        id: 'transactions',
        path: '/transactions',
        icon: 'pi pi-money-bill',
        label: 'Transactions',
        component: <Transactions/>
    },
    {
        id: 'budgets',
        path: '/budgets',
        icon: 'pi pi-wallet',
        label: 'Budgets',
        component: <Budgets/>
    },
    {
        id: 'trends',
        path: '/trends',
        icon: 'pi pi-chart-line',
        label: 'Trends',
        component: <Trends/>
    },
    {
        id: 'tags',
        path: '/tags',
        icon: 'pi pi-tags',
        label: 'Tags',
        component: <Tags/>
    },
    {
        id: null,
        path: '*',
        component: <Dashboard/>
    }
]

export default routes;