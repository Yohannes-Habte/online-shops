import { useEffect } from "react";
import "./Events.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  clearEventErrorsAction,
  fetchAllEvents,
} from "../../../redux/actions/event";
import EventCard from "../eventCartd/EventCard";

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(clearEventErrorsAction());
    dispatch(fetchAllEvents());

    return () => {
      if (error) {
        dispatch(clearEventErrorsAction());
      }
    };
  }, [dispatch]);

  // Find the latest event based on createdAt timestamp
  const latestEvent =
    events?.length > 0
      ? [...events].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0]
      : null;

  return (
    <section className="popular-events-wrapper">
      <h2 className="subTitle">Latest Event</h2>

      {loading ? (
        <p className="loading-message">Loading event...</p>
      ) : error ? (
        <p className="error-message">
          Error loading event. Please try again later.
        </p>
      ) : latestEvent ? (
        <article className="event-cards-wrapper">
          <EventCard data={latestEvent} />
        </article>
      ) : (
        <h4 className="no-events-message">New events are coming soon!</h4>
      )}
    </section>
  );
};

export default Events;
