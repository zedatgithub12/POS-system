const SalesData = [
    {
        item_name: 'Product A',
        item_code: 'A001',
        quantity: 3,
        unitPrice: 8.99,
        discount: 1.5,
        tax: 1.07,
        subtotal: 0,
        total_amount: 24.54,
        payment_method: 'cash',
        customer_name: 'Sarah Johnson',
        customer_phone: '555-123-4567',
        shop: 'XYZ Market',
        date: '2021-10-16',
        time: '10:15:00',
        additional_note: 'Please call before delivery.'
    },
    {
        item_name: 'Product B',
        item_code: 'B002',
        quantity: 1,
        unitPrice: 15.99,
        discount: 0.0,
        tax: 1.92,
        subtotal: 0,
        total_amount: 17.91,
        payment_method: 'debit_card',
        customer_name: 'Mike Smith',
        customer_phone: '555-987-6543',
        shop: 'ABC Store',
        date: '2021-10-15',
        time: '14:45:00',
        additional_note: 'Please include gift receipt.'
    },
    {
        item_name: 'Product C',
        item_code: 'C003',
        quantity: 5,
        unitPrice: 6.49,
        discount: 0.5,
        tax: 1.17,
        subtotal: 0,
        total_amount: 29.62,
        payment_method: 'credit_card',
        customer_name: 'Emily Davis',
        customer_phone: '555-555-1212',
        shop: '123 Mart',
        date: '2021-10-14',
        time: '16:30:00',
        additional_note: 'Please deliver to back door.'
    },
    {
        item_name: 'Product D',
        item_code: 'D004',
        quantity: 2,
        unitPrice: 12.99,
        discount: 0.0,
        tax: 1.56,
        subtotal: 0,
        total_amount: 27.54,
        payment_method: 'cash',
        customer_name: 'David Lee',
        customer_phone: '555-555-4321',
        shop: 'XYZ Market',
        date: '2021-10-13',
        time: '11:00:00',
        additional_note: 'Please knock loudly.'
    },
    {
        item_name: 'Product E',
        item_code: 'E005',
        quantity: 1,
        unitPrice: 19.99,
        discount: 3.0,
        tax: 2.22,
        subtotal: 0,
        total_amount: 19.21,
        payment_method: 'debit_card',
        customer_name: 'Rachel Brown',
        customer_phone: '555-123-7890',
        shop: 'ABC Store',
        date: '2021-10-12',
        time: '13:45:00',
        additional_note: 'Please leave package at front desk.'
    },
    {
        item_name: 'Product F',
        item_code: 'F006',
        quantity: 4,
        unitPrice: 7.99,
        discount: 1.0,
        tax: 1.44,
        subtotal: 0,
        total_amount: 29.36,
        payment_method: 'credit_card',
        customer_name: 'Tom Johnson',
        customer_phone: '555-555-0000',
        shop: '123 Mart',
        date: '2021-10-11',
        time: '15:30:00',
        additional_note: 'Please deliver after 5pm.'
    },
    {
        item_name: 'Product G',
        item_code: 'G007',
        quantity: 2,
        unitPrice: 14.99,
        discount: 0.0,
        tax: 1.8,

        subtotal: 0,
        total_amount: 31.78,
        payment_method: 'cash',
        customer_name: 'Lisa Davis',
        customer_phone: '555-555-1111',
        shop: 'ABC Store',
        date: '2021-10-10',
        time: '11:15:00',
        additional_note: 'Please deliver to side entrance.'
    },
    {
        item_name: 'Product H',
        item_code: 'H008',
        quantity: 3,
        unitPrice: 9.99,
        discount: 0.5,
        tax: 1.44,
        subtotal: 0,
        total_amount: 30.41,
        payment_method: 'debit_card',
        customer_name: 'Alex Lee',
        customer_phone: '555-555-2222',
        shop: 'XYZ Market',
        date: '2021-10-09',
        time: '14:00:00',
        additional_note: 'Please call when delivery is on the way.'
    },
    {
        item_name: 'Product I',
        item_code: 'I009',
        quantity: 1,
        unitPrice: 24.99,
        discount: 4.5,
        tax: 2.7,

        subtotal: 0,
        total_amount: 23.19,
        payment_method: 'credit_card',
        customer_name: 'Megan Brown',
        customer_phone: '555-555-3333',
        shop: '123 Mart',
        date: '2021-10-08',
        time: '16:30:00',
        additional_note: 'Please leave package on porch.'
    },
    {
        item_name: 'Product J',
        item_code: 'J010',
        quantity: 2,
        unitPrice: 11.99,
        discount: 0.0,
        tax: 1.44,
        subtotal: 0,
        total_amount: 25.42,
        payment_method: 'cash',
        customer_name: 'Benjamin Smith',
        customer_phone: '555-555-4444',
        shop: 'ABC Store',
        date: '2021-10-07',
        time: '12:45:00',
        additional_note: 'Please deliver to back door.'
    },
    {
        item_name: 'Product K',
        item_code: 'K011',
        quantity: 1,
        unitPrice: 29.99,
        discount: 5.0,
        tax: 3.3,

        subtotal: 0,
        total_amount: 26.29,
        payment_method: 'debit_card',
        customer_name: 'Linda Davis',
        customer_phone: '555-555-5555',
        shop: 'XYZ Market',
        date: '2021-10-06',
        time: '14:15:00',
        additional_note: 'Please deliver after 3pm.'
    },
    {
        item_name: 'Product L',
        item_code: 'L012',
        quantity: 3,
        unitPrice: 6.99,
        discount: 0.25,
        tax: 1.26,
        subtotal: 0,
        total_amount: 21.68,
        payment_method: 'credit_card',
        customer_name: 'Jack Johnson',
        customer_phone: '555-555-6666',
        shop: '123 Mart',
        date: '2021-10-05',
        time: '15:30:00',
        additional_note: 'Please knock loudly.'
    },
    {
        item_name: 'Product M',
        item_code: 'M013',
        quantity: 2,
        unitPrice: 16.99,
        discount: 0.0,
        tax: 2.04,
        subtotal: 0,
        total_amount: 35.02,
        payment_method: 'cash',
        customer_name: 'Olivia Brown',
        customer_phone: '555-555-7777',
        shop: 'ABC Store',
        date: '2021-10-04',
        time: '11:30:00',
        additional_note: 'Please call before delivery.'
    },
    {
        item_name: 'Product N',
        item_code: 'N014',
        quantity: 1,
        unitPrice: 21.99,
        discount: 2.0,
        tax: 2.16,
        subtotal: 0,
        total_amount: 22.15,
        payment_method: 'debit_card',
        customer_name: 'Sophie Lee',
        customer_phone: '555-555-8888',
        shop: 'XYZ Market',
        date: '2021-10-03',
        time: '13:45:00',
        additional_note: 'Please deliver to front desk.'
    },
    {
        item_name: 'Product O',
        item_code: 'O015',
        quantity: 4,
        unitPrice: 8.99,
        discount: 1.0,
        tax: 1.62,
        subtotal: 0,
        total_amount: 33.56,
        payment_method: 'credit_card',
        customer_name: 'William Davis',
        customer_phone: '555-555-9999',
        shop: '123 Mart',
        date: '2021-10-02',
        time: '16:30:00',
        additional_note: 'Please deliver after 6pm.'
    }
];

export default SalesData;
