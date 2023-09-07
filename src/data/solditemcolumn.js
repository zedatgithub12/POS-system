import { DateFormatter } from 'utils/functions';

export const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'stock_shop',
        headerName: 'Shop',
        width: 120
    },
    {
        field: 'updated_at',
        headerName: 'Date',
        width: 100,
        valueFormatter: (params) => {
            const formattedDate = DateFormatter(params.value);
            return formattedDate;
        }
    },
    {
        field: 'created_at',
        headerName: 'Month',
        type: 'month',
        width: 110,
        valueFormatter: (params) => {
            const formattedDate = new Date(params.value);
            const month = formattedDate.toLocaleString('en-US', { month: 'short' });
            return month;
        }
    },
    {
        field: 'item_category',
        headerName: 'Category',
        sortable: true,
        width: 128
    },
    {
        field: 'item_sub_category',
        headerName: 'Sub Category',
        sortable: true,
        width: 128
    },
    {
        field: 'item_brand',
        headerName: 'Brand',
        sortable: true,
        width: 128
    },
    {
        field: 'item_unit',
        headerName: 'UOM',
        sortable: true,
        width: 128
    },
    {
        field: 'item_sku',
        headerName: 'SKU',
        sortable: true,
        width: 128
    },
    {
        field: 'quantity',
        headerName: 'Count',
        sortable: true,
        width: 128
    },

    {
        field: 'price',
        headerName: 'Sub Total(ETB)',
        sortable: true,
        width: 128
    }
];
