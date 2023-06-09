const getSalesDataFromIndexedDB = async () => {
    try {
        const db = indexedDB.open('salesData', 1);

        db.onupgradeneeded = (event) => {
            const objectStore = event.target.result.createObjectStore('sales', { keyPath: 'shop' });
            objectStore.createIndex('user', 'user', { unique: true });
        };

        db.onsuccess = (event) => {
            const transaction = event.target.result.transaction('sales', 'readonly');
            const objectStore = transaction.objectStore('sales');
            const salesDataRequest = objectStore.getAll();

            salesDataRequest.onsuccess = () => {
                const salesData = salesDataRequest.result;
                console.log('Sales data retrieved from IndexedDB:', salesData);
            };
        };
    } catch (error) {
        console.error('Error retrieving sales data from IndexedDB:', error);
    }
};
const saveSalesDataToIndexedDB = async (salesData) => {
    try {
        const db = indexedDB.open('salesData', 1);

        db.onupgradeneeded = (event) => {
            const objectStore = event.target.result.createObjectStore('sales', { keyPath: 'shop' });
            objectStore.createIndex('user', 'user', { unique: true });
        };

        db.onsuccess = (event) => {
            const transaction = event.target.result.transaction('sales', 'readwrite');
            const objectStore = transaction.objectStore('sales');

            objectStore.put(salesData);

            transaction.oncomplete = () => {
                console.log('Sales data saved to IndexedDB');
            };
        };
    } catch (error) {
        console.error('Error saving sales data to IndexedDB:', error);
    }
};

const saveUserDataToIndexedDB = async (userData) => {
    try {
        const db = indexedDB.open('userData', 1);

        db.onupgradeneeded = (event) => {
            const objectStore = event.target.result.createObjectStore('users', { keyPath: 'id' });
            objectStore.createIndex('email', 'email', { unique: true });
        };

        db.onsuccess = (event) => {
            const transaction = event.target.result.transaction('users', 'readwrite');
            const objectStore = transaction.objectStore('users');

            objectStore.put(userData);

            transaction.oncomplete = () => {
                console.log('User data saved to IndexedDB');
            };
        };
    } catch (error) {
        console.error('Error saving user data to IndexedDB:', error);
    }
};

const saveProductDataToIndexedDB = async (productData) => {
    try {
        const db = indexedDB.open('productData', 1);

        db.onupgradeneeded = (event) => {
            const objectStore = event.target.result.createObjectStore('products', { keyPath: 'code' });
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('category', 'category', { unique: false });
        };

        db.onsuccess = (event) => {
            const transaction = event.target.result.transaction('products', 'readwrite');
            const objectStore = transaction.objectStore('products');

            productData.forEach((product) => {
                objectStore.put(product);
            });

            transaction.oncomplete = () => {
                console.log('Product data saved to IndexedDB');
            };
        };
    } catch (error) {
        console.error('Error saving product data to IndexedDB:', error);
    }
};

const saveCategoryDataToIndexedDB = async (categoryData) => {
    try {
        const db = indexedDB.open('categoryData', 1);

        db.onupgradeneeded = (event) => {
            const objectStore = event.target.result.createObjectStore('categories', { keyPath: 'name' });
        };

        db.onsuccess = (event) => {
            const transaction = event.target.result.transaction('categories', 'readwrite');
            const objectStore = transaction.objectStore('categories');

            categoryData.forEach((category) => {
                objectStore.put(category);
            });

            transaction.oncomplete = () => {
                console.log('Category data saved to IndexedDB');
            };
        };
    } catch (error) {
        console.error('Error saving category data to IndexedDB:', error);
    }
};

const saveCustomerDataToIndexedDB = async (customerData) => {
    try {
        const db = indexedDB.open('customerData', 1);

        db.onupgradeneeded = (event) => {
            const objectStore = event.target.result.createObjectStore('customers', { keyPath: 'phone' });
            objectStore.createIndex('name', 'name', { unique: false });
        };

        db.onsuccess = (event) => {
            const transaction = event.target.result.transaction('customers', 'readwrite');
            const objectStore = transaction.objectStore('customers');

            customerData.forEach((customer) => {
                objectStore.put(customer);
            });

            transaction.oncomplete = () => {
                console.log('Customer data saved to IndexedDB');
            };
        };
    } catch (error) {
        console.error('Error saving customer data to IndexedDB:', error);
    }
};

export {
    getSalesDataFromIndexedDB,
    saveSalesDataToIndexedDB,
    saveUserDataToIndexedDB,
    saveProductDataToIndexedDB,
    saveCustomerDataToIndexedDB,
    saveCategoryDataToIndexedDB
};
