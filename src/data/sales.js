const SalesData = [
    {
        id: 1,
        reference: 'REF001',
        user: {
            id: 123,
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '555-123-4567'
        },
        shop: {
            name: 'Sholla Branch',
            address: 'Sholla',
            description: 'It is the biggest shop',
            manager: 'Tesfahun Kebede',
            phone: '09237652378',
            picture: store,
            status: 'open'
        },
        customer: {
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            phone: '123-456-7890'
        },
        items: [
            {
                id: 1,
                itemName: 'Ethiopian Coffee',
                itemCode: 'EC001',
                brand: 'Ethiopian Beans',
                unit: '1lb',
                unitPrice: 10.99,
                quantity: 1,
                subtotal: 10.99
            }
        ],
        tax: 1.1,
        discount: 0,
        payment_status: 'Paid',
        payment_method: 'Credit Card',
        note: 'Please deliver to the address on file',
        grandtotal: 12.09,
        date: '2021-10-01',
        time: '14:30:00'
    },
    {
        id: 2,
        reference: 'REF002',
        user: {
            id: 123,
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '555-123-4567'
        },
        shop: 'Ethio Mart',
        customer: {
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            phone: '123-456-7890'
        },
        items: [
            {
                id: 2,
                itemName: 'Ethiopian Honey',
                itemCode: 'EH002',
                brand: 'Ethiopian Farms',
                unit: '500g',
                unitPrice: 7.99,
                quantity: 1,
                subtotal: 7.99
            },
            {
                id: 3,
                itemName: 'Ethiopian Honey',
                itemCode: 'EH002',
                brand: 'Ethiopian Farms',
                unit: '500g',
                unitPrice: 7.99,
                quantity: 1,
                subtotal: 7.99
            }
        ],
        tax: 0.8,
        discount: 0,
        payment_status: 'Paid',
        payment_method: 'Credit Card',
        note: 'Please deliver to the address on file',
        grandtotal: 8.79,
        date: '2021-10-01',
        time: '14:45:00'
    },
    {
        id: 3,
        reference: 'REF003',
        user: {
            id: 456,
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            phone: '555-987-6543'
        },
        shop: 'Ethio Mart',
        customer: {
            name: 'John Smith',
            email: 'johnsmith@example.com',
            phone: '123-456-7890'
        },
        items: [
            {
                id: 3,
                itemName: 'Ethiopian Spices',
                itemCode: 'ES003',
                brand: 'Ethiopian Farms',
                unit: '100g',
                unitPrice: 5.99,
                quantity: 1,
                subtotal: 5.99
            }
        ],
        tax: 0.6,
        discount: 0,
        payment_status: 'Paid',
        payment_method: 'Credit Card',
        note: 'Please deliver to the address on file',
        grandtotal: 6.59,
        date: '2021-10-02',
        time: '10:30:00'
    },
    {
        id: 4,
        reference: 'REF004',
        user: {
            id: 456,
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            phone: '555-987-6543'
        },
        shop: 'Ethio Mart',
        customer: {
            name: 'John Smith',
            email: 'johnsmith@example.com',
            phone: '123-456-7890'
        },
        items: [
            {
                id: 4,
                itemName: 'Ethiopian Tea',
                itemCode: 'ET004',
                brand: 'Ethiopian Tea Co.',
                unit: '50g',
                unitPrice: 3.99,
                quantity: 1,
                subtotal: 3.99
            }
        ],
        tax: 0.4,
        discount: 0,
        payment_status: 'Paid',
        payment_method: 'Credit Card',
        note: 'Please deliver to the address on file',
        grandtotal: 4.39,
        date: '2021-10-02',
        time: '11:00:00'
    }
    // {
    //     id: 5,
    //     reference: 'REF005',
    //     user: {
    //         id: 789,
    //         name: 'Jim Brown',
    //         email: 'jim.brown@example.com',
    //         phone: '555-555-1234'
    //     },
    //     shop: 'Ethio Mart',
    //     customer: {
    //         name: 'Sara Johnson',
    //         email: 'sara.johnson@example.com',
    //         phone: '123-456-7890'
    //     },
    //     item: {
    //         product: {
    //             id: 5,
    //             itemName: 'Ethiopian Wine',
    //             itemCode: 'EW005',
    //             brand: 'Ethiopian Wineries',
    //             unit: '750ml',
    //             unitPrice: 19.99
    //         },
    //         quantity: 1,
    //         subtotal: 19.99
    //     },
    //     tax: 2.0,
    //     discount: 0,
    //     payment_status: 'Paid',
    //     payment_method: 'Credit Card',
    //     note: 'Please deliver to the address on file',
    //     grandtotal: 21.99,
    //     date: '2021-10-03',
    //     time: '15:00:00'
    // },
    // {
    //     id: 6,
    //     reference: 'REF006',
    //     user: {
    //         id: 789,
    //         name: 'Jim Brown',
    //         email: 'jim.brown@example.com',
    //         phone: '555-555-1234'
    //     },
    //     shop: 'Ethio Mart',
    //     customer: {
    //         name: 'Sara Johnson',
    //         email: 'sara.johnson@example.com',
    //         phone: '123-456-7890'
    //     },
    //     item: {
    //         product: {
    //             id: 6,
    //             itemName: 'Ethiopian Candles',
    //             itemCode: 'EC006',
    //             brand: 'Ethiopian Artisans',
    //             unit: 'Set of 3',
    //             unitPrice: 12.99
    //         },
    //         quantity: 1,
    //         subtotal: 12.99
    //     },
    //     tax: 1.3,
    //     discount: 0,
    //     payment_status: 'Paid',
    //     payment_method: 'Credit Card',
    //     note: 'Please deliver to the address on file',
    //     grandtotal: 14.29,
    //     date: '2021-10-03',
    //     time: '15:30:00'
    // },
    // {
    //     id: 7,
    //     reference: 'REF007',
    //     user: {
    //         id: 789,
    //         name: 'Jim Brown',
    //         email: 'jim.brown@example.com',
    //         phone: '555-555-1234'
    //     },
    //     shop: 'Ethio Mart',
    //     customer: {
    //         name: 'Sara Johnson',
    //         email: 'sara.johnson@example.com',
    //         phone: '123-456-7890'
    //     },
    //     item: {
    //         product: {
    //             id: 7,
    //             itemName: 'Ethiopian Scarf',
    //             itemCode: 'ES007',
    //             brand: 'Ethiopian Textiles',
    //             unit: '1',
    //             unitPrice: 8.99
    //         },
    //         quantity: 1,
    //         subtotal: 8.99
    //     },
    //     tax: 0.9,
    //     discount: 0,
    //     payment_status: 'Paid',
    //     payment_method: 'Credit Card',
    //     note: 'Please deliver to the address on file',
    //     grandtotal: 9.89,
    //     date: '2021-10-04',
    //     time: '12:00:00'
    // },
    // {
    //     id: 8,
    //     reference: 'REF008',
    //     user: {
    //         id: 246,
    //         name: 'Emily Jones',
    //         email: 'emily.jones@example.com',
    //         phone: '555-987-6543'
    //     },
    //     shop: 'Ethio Mart',
    //     customer: {
    //         name: 'Bob Smith',
    //         email: 'bob.smith@example.com',
    //         phone: '123-456-7890'
    //     },
    //     item: {
    //         product: {
    //             id: 8,
    //             itemName: 'Ethiopian Blanket',
    //             itemCode: 'EB008',
    //             brand: 'Ethiopian Textiles',
    //             unit: '1',
    //             unitPrice: 29.99
    //         },
    //         quantity: 1,
    //         subtotal: 29.99
    //     },
    //     tax: 3.0,
    //     discount: 0,
    //     payment_status: 'Paid',
    //     payment_method: 'Credit Card',
    //     note: 'Please deliver to the address on file',
    //     grandtotal: 32.99,
    //     date: '2021-10-05',
    //     time: '13:30:00'
    // },
    // {
    //     id: 9,
    //     reference: 'REF009',
    //     user: {
    //         id: 246,
    //         name: 'Emily Jones',
    //         email: 'emily.jones@example.com',
    //         phone: '555-987-6543'
    //     },
    //     shop: 'Ethio Mart',
    //     customer: {
    //         name: 'Bob Smith',
    //         email: 'bob.smith@example.com',
    //         phone: '123-456-7890'
    //     },
    //     item: {
    //         product: {
    //             id: 9,
    //             itemName: 'Ethiopian Bracelet',
    //             itemCode: 'EB009',
    //             brand: 'Ethiopian Artisans',
    //             unit: '1',
    //             unitPrice: 5.99
    //         },
    //         quantity: 1,
    //         subtotal: 5.99
    //     },
    //     tax: 0.6,
    //     discount: 0,
    //     payment_status: 'Paid',
    //     payment_method: 'Credit Card',
    //     note: 'Please deliver to the address on file',
    //     grandtotal: 6.59,
    //     date: '2021-10-05',
    //     time: '14:00:00'
    // },
    // {
    //     id: 10,
    //     reference: 'REF010',
    //     user: {
    //         id: 246,
    //         name: 'Emily Jones',
    //         email: 'emily.jones@example.com',
    //         phone: '555-987-6543'
    //     },
    //     shop: 'Ethio Mart',
    //     customer: {
    //         name: 'Bob Smith',
    //         email: 'bob.smith@example.com',
    //         phone: '123-456-7890'
    //     },
    //     item: {
    //         product: {
    //             id: 10,
    //             itemName: 'Ethiopian Earrings',
    //             itemCode: 'EE010',
    //             brand: 'Ethiopian Artisans',
    //             unit: '1',
    //             unitPrice: 7.99
    //         },
    //         quantity: 1,
    //         subtotal: 7.99
    //     },
    //     tax: 0.8,
    //     discount: 0,
    //     payment_status: 'Paid',
    //     payment_method: 'Credit Card',
    //     note: 'Please deliver to the address on file',
    //     grandtotal: 8.79,
    //     date: '2021-10-06',
    //     time: '11:30:00'
    // },
    // {
    //     id: 11,
    //     reference: 'REF011',
    //     user: {
    //         id: 246,
    //         name: 'Emily Jones',
    //         email: 'emily.jones@example.com',
    //         phone: '555-987-6543'
    //     },
    //     shop: 'Ethio Mart',
    //     customer: {
    //         name: 'Bob Smith',
    //         email: 'bob.smith@example.com',
    //         phone: '123-456-7890'
    //     },
    //     item: {
    //         product: {
    //             id: 11,
    //             itemName: 'Ethiopian Necklace',
    //             itemCode: 'EN011',
    //             brand: 'Ethiopian Artisans',
    //             unit: '1',
    //             unitPrice: 12.99
    //         },
    //         quantity: 1,
    //         subtotal: 12.99
    //     },
    //     tax: 1.3,
    //     discount: 0,
    //     payment_status: 'Paid',
    //     payment_method: 'Credit Card',
    //     note: 'Please deliver to the address on file',
    //     grandtotal: 14.29,
    //     date: '2021-10-06',
    //     time: '12:00:00'
    // },
    // {
    //     id: 12,
    //     reference: 'REF012',
    //     user: {
    //         id: 369,
    //         name: 'Sarah Johnson',
    //         email: 'sarah.johnson@example.com',
    //         phone: '555-555-1234'
    //     },
    //     shop: 'Ethio Mart',
    //     customer: {
    //         name: 'Jim Brown',
    //         email: 'jim.brown@example.com',
    //         phone: '123-456-7890'
    //     },
    //     item: {
    //         product: {
    //             id: 12,
    //             itemName: 'Ethiopian Hat',
    //             itemCode: 'EH012',
    //             brand: 'Ethiopian Textiles',
    //             unit: '1',
    //             unitPrice: 9.99
    //         },
    //         quantity: 1,
    //         subtotal: 9.99
    //     },
    //     tax: 1.0,
    //     discount: 0,
    //     payment_status: 'Paid',
    //     payment_method: 'Credit Card',
    //     note: 'Please deliver to the address on file',
    //     grandtotal: 10.99,
    //     date: '2021-10-07',
    //     time: '16:30:00'
    // }
];

export default SalesData;
