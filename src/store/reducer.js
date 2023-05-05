import cartSlice from 'cart/cartSlice';
import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    cart: cartSlice
});

export default reducer;
