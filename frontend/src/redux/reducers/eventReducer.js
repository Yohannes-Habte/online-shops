import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: null,
  error: null,
  loading: false,
};

const eventReducer = createSlice({
  name: 'event',
  initialState,
  reducers: {
    // Post event
    eventShopPostStart: (state) => {
      state.loading = true;
    },
    eventShopPostSuccess: (state, action) => {
      state.events = action.payload;
      state.loading = false;
      state.error = null;
    },
    eventShopPostFailure: (state, action) => {
      state.error = action.payload;
      state.events = null;
      state.loading = false;
    },

    // Get all events for a shop
    eventsShopFetchStart: (state) => {
      state.loading = true;
    },
    eventsShopFetchSuccess: (state, action) => {
      state.events = action.payload;
      state.loading = false;
    },
    eventsShopFetchFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Delete single event from a specific shop
    eventShopDeleteStart: (state) => {
      state.loading = true;
    },
    eventShopDeleteSuccess: (state, action) => {
      state.events = action.payload;
      state.loading = false;
    },
    eventShopDeleteFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Destructure event reducer methods under the reducers key
export const {
  // Create shop event
  eventShopPostStart,
  eventShopPostSuccess,
  eventShopPostFailure,

  // Get all shop events
  eventsShopFetchStart,
  eventsShopFetchSuccess,
  eventsShopFetchFailure,

  // Delete specific shop event
  eventShopDeleteStart,
  eventShopDeleteSuccess,
  eventShopDeleteFailure,
} = eventReducer.actions;

export default eventReducer.reducer;
