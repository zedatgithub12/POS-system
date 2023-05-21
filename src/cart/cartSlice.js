import { createSlice } from '@reduxjs/toolkit';

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

            if (!existingItem) {
                state.items.push({
                    id: product.id,
                    itemName: product.name,
                    itemCode: product.code,
                    brand: product.brand,
                    unit: product.unit,
                    unitPrice: product.price,
                    quantity: 1,
                    subtotal: product.price
                });
                state.grandTotal = state.items.reduce((total, item) => total + item.subtotal, 0);
            }
        },
        removeItem: (state, action) => {
            const { id } = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.items = state.items.filter((item) => item.id !== id);
                // state.grandTotal = state.grandTotal -= state.items.subtotal;
                state.grandTotal = state.items.reduce((total, item) => total + item.subtotal, 0);
            }
        },
        incrementQuantity: (state, action) => {
            const { id } = action.payload;
            const index = state.items.findIndex((item) => item.id === id);
            state.items[index].quantity++;
            state.items[index].subtotal = state.items[index].unitPrice * state.items[index].quantity;
            state.grandTotal = state.items.reduce((total, item) => total + item.subtotal, 0);
        },

        decrementQuantity: (state, action) => {
            const { id } = action.payload;
            const index = state.items.findIndex((item) => item.id === id);
            if (state.items[index].quantity > 1) {
                state.items[index].quantity--;
                state.items[index].subtotal = state.items[index].unitPrice * state.items[index].quantity;
                state.grandTotal = state.items.reduce((total, item) => (total += item.subtotal), 0);
            }
        },
        setGrandTotal: (state, action) => {
            state.grandTotal = action.payload;
        }
    }
});

export const { addItem, removeItem, incrementQuantity, decrementQuantity, setGrandTotal } = cartSlice.actions;

export default cartSlice.reducer;
