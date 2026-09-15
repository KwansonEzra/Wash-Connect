import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookingItems: [],
  shippingAddress: {},
  paymentMethod: 'Cash',
  itemsPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  notifyOnComplete: true,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addBookingItem: (state, action) => {
      const item = action.payload;
      const existingItem = state.bookingItems.find(x => x.lsp === item.lsp && x.category === item.category && x.itemKey === item.itemKey);
      if (existingItem) {
        existingItem.qty += item.qty;
      } else {
        state.bookingItems.push(item);
      }
      state.itemsPrice = state.bookingItems.reduce((acc, item) => acc + item.lineTotal, 0);
      state.totalPrice = state.itemsPrice + state.taxPrice;
    },
    removeBookingItem: (state, action) => {
      state.bookingItems = state.bookingItems.filter(x => x._id !== action.payload);
      state.itemsPrice = state.bookingItems.reduce((acc, item) => acc + item.lineTotal, 0);
      state.totalPrice = state.itemsPrice + state.taxPrice;
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    calculatePrices: (state) => {
      state.itemsPrice = state.bookingItems.reduce((acc, item) => acc + item.lineTotal, 0);
      state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2)); // Assuming 15% tax
      state.totalPrice = state.itemsPrice + state.taxPrice;
    },
    setNotifyOnComplete: (state, action) => {
        state.notifyOnComplete = action.payload;
    },
    resetBooking: (state) => {
        state.bookingItems = [];
        state.shippingAddress = {};
        state.paymentMethod = 'Cash';
        state.itemsPrice = 0;
        state.taxPrice = 0;
        state.totalPrice = 0;
        state.notifyOnComplete = true;
    }
  },
});

export const { addBookingItem, removeBookingItem, saveShippingAddress, savePaymentMethod, calculatePrices, setNotifyOnComplete, resetBooking } = bookingSlice.actions;

export default bookingSlice.reducer;