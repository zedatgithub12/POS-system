const PackageData = [
    {
        id: 1,
        reference: 'REF001',
        createdby: 'John Smith',
        name: 'Late package',
        shop: 'Ethio Mart',
        shopid: 12,

        items: [
            {
                id: 1,
                name: 'Mini',
                code: 'EC001',
                unit: '1lb',
                quantity: 3
            },
            {
                id: 2,
                name: 'Solo',
                code: 'EC001',
                unit: '1lb',
                quantity: 3
            }
        ],
        price: 2000,
        expireDate: '2023-3-01',
        status: 'In-Stock'
    },
    {
        id: 3,
        reference: 'REF001',
        createdby: 'John Smith',
        name: 'matti package',
        shop: 'Ethio Mart',
        items: [
            {
                id: 1,
                name: 'Mini',
                code: 'EC001',
                unit: '1lb',
                quantity: 3
            }
        ],
        price: 2000,
        expireDate: '2023-3-01',
        status: 'In-Stock'
    }
];

export default PackageData;
