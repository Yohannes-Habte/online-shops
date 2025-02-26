import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../utils/security/secreteKey";
import { handleError } from "../../utils/errorHandler/ErrorMessage";

import {
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
} from "../reducers/eventReducer";

//=========================================================================
// Action to create a new event
//=========================================================================

export const createNewEvent = (eventData) => async (dispatch) => {
  try {
    dispatch(createEventStart());

    const response = await axios.post(`${API}/events/create`, eventData, {
      withCredentials: true,
    });
    console.log("response.data.event =", response.data.event);

    dispatch(createEventSuccess(response.data.event));
    toast.success("Event created successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(createEventFailure(message));
    toast.error(message);
  }
};

//=========================================================================
// Action to fetch a single event by ID
//=========================================================================

export const fetchEventById = (eventId) => async (dispatch) => {
  try {
    dispatch(fetchEventStart());

    const response = await axios.get(`${API}/events/${eventId}`, {
      withCredentials: true,
    });

    dispatch(fetchEventSuccess(response.data.event));
  } catch (error) {
    const { message } = handleError(error);
    dispatch(fetchEventFailure(message));
    toast.error(message);
  }
};

//=========================================================================
// Action to update an event
//=========================================================================

export const updateEvent = (eventId, updatedData) => async (dispatch) => {
  try {
    dispatch(updateEventStart());

    const response = await axios.put(`${API}/events/${eventId}`, updatedData, {
      withCredentials: true,
    });

    dispatch(updateEventSuccess(response.data.event));
    toast.success("Event updated successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(updateEventFailure(message));
    toast.error(message);
  }
};

//=========================================================================
// Action to delete an event
//=========================================================================

export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    dispatch(deleteEventStart());

    await axios.delete(`${API}/events/${eventId}`, {
      withCredentials: true,
    });

    dispatch(deleteEventSuccess(eventId));
    toast.success("Event deleted successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(deleteEventFailure(message));
    toast.error(message);
  }
};

//=========================================================================
// Action to fetch all events from a specific shop
//=========================================================================

export const fetchShopEvents = () => async (dispatch) => {
  try {
    dispatch(fetchShopEventsStart());

    const response = await axios.get(`${API}/events/seller`, {
      withCredentials: true,
    });

    dispatch(fetchShopEventsSuccess(response.data.events));
  } catch (error) {
    const { message } = handleError(error);
    dispatch(fetchShopEventsFailure(message));
    toast.error(message);
  }
};

//=========================================================================
// Action to fetch all events
//=========================================================================

export const fetchAllEvents = () => async (dispatch) => {
  try {
    dispatch(fetchAllEventsStart());

    const response = await axios.get(`${API}/events`);

    dispatch(fetchAllEventsSuccess(response.data.events));
  } catch (error) {
    const { message } = handleError(error);
    dispatch(fetchAllEventsFailure(message));
    toast.error(message);
  }
};

//=========================================================================
// Action to clear event errors
//=========================================================================

export const clearEventErrorsAction = () => (dispatch) => {
  dispatch(clearEventErrors());
};
