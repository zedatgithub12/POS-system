import { configureStore } from '@reduxjs/toolkit';
import reducer from 'store/reducer';
import cartSlice from './cartSlice';

const stores = configureStore({
    reducer: {
        cart: cartSlice,
        reducer: reducer
    }
});

export default stores;
