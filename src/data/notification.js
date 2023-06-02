const Notification = [
    {
        id: 1,
        title: 'New Order',
        time: '2022-05-01T10:30:00Z',
        message: 'A new order has been placed',
        type: 'stock',
        itemid: 123,
        recipient: 'customer@example.com',
        status: 'Pending'
    },
    {
        id: 2,
        title: 'Payment Received',
        time: '2022-05-02T14:15:00Z',
        message: 'Payment for order #123 has been received',
        type: 'sales',
        itemid: 123,
        recipient: 'admin@example.com',
        status: 'Completed'
    },
    {
        id: 3,
        title: 'Inventory Alert',
        time: '2022-05-03T09:00:00Z',
        message: 'Item #789 is running low in inventory',
        type: 'notice',
        itemid: 789,
        recipient: 'warehouse@example.com',
        status: 'Pending'
    }
];
export default Notification;
