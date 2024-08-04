import React, { useEffect, useState } from 'react';
import './CountDown.scss';

const CountDown = ({ data }) => {
  // calculateTimeLeft is a function
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // console.log('Timer', data);
  // Use Effect Hook
  useEffect(() => {
    // setTimeout function
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  function calculateTimeLeft() {
    //! The dynamic timer works only in the EventPage.jsx, but not in the Events.jsx component.  Why?
    // const difference = +new Date(2023 - 11 - 11) - +new Date();
    const difference = +new Date(data.endDate) - +new Date();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  // Timer components
  const timerComponents = Object.keys(timeLeft).map((interval, index) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <span key={index} className="timer">
        {timeLeft[interval]} {interval}
      </span>
    );
  });

  // console.log('Timer component is', timerComponents);
  return (
    <section className="event-timer">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <h3 className="time-up"> Time is up!</h3>
      )}
    </section>
  );
};

export default CountDown;
