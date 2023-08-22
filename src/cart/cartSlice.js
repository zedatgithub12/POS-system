import { createSlice } from '@reduxjs/toolkit';

const calculateGrandTotal = (items) => {
    return items.reduce((total, item) => parseInt(total) + parseInt(item.subtotal), 0);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        grandTotal: 0
    },
    reducers: {
        addItem: (state, action) => {
            const { product } = action.payload;
            const existingItem = state.items.find((item) => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
                state.grandTotal = calculateGrandTotal(state.items);
            } else {
                state.items.push({
                    id: product.id,
                    itemName: product.item_name,
                    itemCode: product.item_code,
                    brand: product.item_brand,
                    unit: product.stock_unit,
                    unitPrice: product.stock_price,
                    quantity: 1,
                    subtotal: product.stock_price
                });
                state.grandTotal = calculateGrandTotal(state.items);
            }
        },
        removeItem: (state, action) => {
            const { id } = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.items = state.items.filter((item) => item.id !== id);
                // state.grandTotal = state.grandTotal -= state.items.subtotal;
                state.grandTotal = calculateGrandTotal(state.items);
            }
        },
        incrementQuantity: (state, action) => {
            const { id } = action.payload;
            const index = state.items.findIndex((item) => item.id === id);
            state.items[index].quantity++;
            state.items[index].subtotal = state.items[index].unitPrice * state.items[index].quantity;
            state.grandTotal = calculateGrandTotal(state.items);
        },

        decrementQuantity: (state, action) => {
            const { id } = action.payload;
            const index = state.items.findIndex((item) => item.id === id);
            if (state.items[index].quantity > 1) {
                state.items[index].quantity--;
                state.items[index].subtotal = state.items[index].unitPrice * state.items[index].quantity;
                state.grandTotal = calculateGrandTotal(state.items);
            }
        },
        setGrandTotal: (state, action) => {
            state.grandTotal = action.payload;
        }
    }
});

export const { addItem, removeItem, incrementQuantity, decrementQuantity, setGrandTotal } = cartSlice.actions;

export default cartSlice.reducer;
