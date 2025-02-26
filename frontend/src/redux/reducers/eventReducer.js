import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentEvent: null,
  shopEvents: [],
  events: [],
  error: null,
  loading: false,
};

// Utility function to set loading state
const setLoading = (state) => {
  state.loading = true;
  state.error = null;
};

// Utility function to handle errors
const setError = (state, action) => {
  state.error = action.payload;
  state.loading = false;
};

// Utility function to handle success for single event-related actions
const setSingleEventSuccess = (state, action) => {
  state.currentEvent = action.payload;
  state.loading = false;
  state.error = null;
};

// Redux slice for event management
const eventReducer = createSlice({
  name: "event",
  initialState,
  reducers: {
    /*** Event Creation ***/
    createEventStart: setLoading,
    createEventSuccess: setSingleEventSuccess,
    createEventFailure: setError,

    /*** Fetch Single Event ***/
    fetchEventStart: setLoading,
    fetchEventSuccess: setSingleEventSuccess,
    fetchEventFailure: setError,

    /*** Update Single Event ***/
    updateEventStart: setLoading,
    updateEventSuccess: setSingleEventSuccess,
    updateEventFailure: setError,

    /*** Delete Single Event ***/
    deleteEventStart: setLoading,
    deleteEventSuccess: setSingleEventSuccess,
    deleteEventFailure: setError,

    /*** Fetch All Events from a Specific Shop ***/
    fetchShopEventsStart: setLoading,
    fetchShopEventsSuccess: (state, action) => {
      state.shopEvents = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchShopEventsFailure: setError,

    /*** Fetch All Events ***/
    fetchAllEventsStart: setLoading,
    fetchAllEventsSuccess: (state, action) => {
      state.events = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchAllEventsFailure: setError,

    /*** Clear Errors ***/
    clearEventErrors: (state) => {
      state.error = null;
    },
  },
});

// Export action creators
export const {
  createEventStart,
  createEventSuccess,
  createEventFailure,

  fetchEventStart,
  fetchEventSuccess,
  fetchEventFailure,

  updateEventStart,
  updateEventSuccess,
  updateEventFailure,

  deleteEventStart,
  deleteEventSuccess,
  deleteEventFailure,

  fetchShopEventsStart,
  fetchShopEventsSuccess,
  fetchShopEventsFailure,

  fetchAllEventsStart,
  fetchAllEventsSuccess,
  fetchAllEventsFailure,

  clearEventErrors,
} = eventReducer.actions;

// Export reducer
export default eventReducer.reducer;
