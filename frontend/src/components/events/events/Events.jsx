import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearEventErrorsAction,
  fetchAllEvents,
} from "../../../redux/actions/event";
import EventCard from "../eventCart/EventCard";

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.event);
  const [hasFetched, setHasFetched] = useState(false); // 🆕 Added to track API call status

  useEffect(() => {
    // Only fetch if we haven't already tried
    if (!loading && !hasFetched) {
      dispatch(fetchAllEvents());
      setHasFetched(true); // Prevents further fetching
    }

    return () => {
      if (error) {
        dispatch(clearEventErrorsAction());
      }
    };
  }, [dispatch, loading, hasFetched]);

  const ongoingEvents = Array.isArray(events)
    ? events.filter((event) => event.eventStatus === "ongoing")
    : [];

  const latestOngoingEvent =
    ongoingEvents.length > 0
      ? [...ongoingEvents].sort(
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
          {error.message || "Error loading event. Please try again later."}
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
