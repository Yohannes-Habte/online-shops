import { useEffect } from "react";
import "./Events.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  clearEventErrorsAction,
  fetchAllEvents,
} from "../../../redux/actions/event";
import EventCard from "../eventCart/EventCard";

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
  }, [dispatch, error]);

  // Filter events to show only ongoing ones
  const ongoingEvents =
    events?.filter((event) => event.eventStatus === "ongoing") || [];

  // Find the latest ongoing event based on createdAt timestamp
  const latestOngoingEvent = ongoingEvents.length
    ? ongoingEvents.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0]
    : null;

  return (
    <section className="popular-events-wrapper">
      <h2 className="subTitle">Latest Ongoing Event</h2>

      {loading ? (
        <p className="loading-message">Loading event...</p>
      ) : error ? (
        <p className="error-message">
          Error loading event. Please try again later.
        </p>
      ) : latestOngoingEvent ? (
        <article className="event-cards-wrapper">
          <EventCard data={latestOngoingEvent} />
        </article>
      ) : (
        <h4 className="no-events-message">
          No ongoing events at the moment. Stay tuned!
        </h4>
      )}
    </section>
  );
};

export default Events;
