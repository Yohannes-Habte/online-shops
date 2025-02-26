import { useEffect, useState, useMemo } from "react";
import "./CountDown.scss";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    if (!data?.endDate) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [data?.endDate]);

  function calculateTimeLeft() {
    if (!data?.endDate) return {};

    const now = new Date().getTime();
    const endDate = new Date(data.endDate).getTime();
    const difference = endDate - now;

    if (difference <= 0) {
      return { expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  const timerComponents = useMemo(() => {
    if (timeLeft.expired) {
      return <h3 className="time-up">Time is up!</h3>;
    }

    return Object.entries(timeLeft).map(([key, value]) => (
      <span key={key} className="timer">
        {value} {key}
      </span>
    ));
  }, [timeLeft]);

  return <section className="event-timer">{timerComponents}</section>;
};

export default CountDown;
