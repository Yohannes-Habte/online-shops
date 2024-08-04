import React from 'react';
import "./NotFound.scss"
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="not-found-page">
      <section className="home-page-container">
        <h1 className="title">Page Not Found! </h1>
        <p className='go-back-home-page'> <Link className='link' to={"/"}> Go back to Home Page!</Link> </p>
      </section>
    </main>
  );
};

export default NotFound;
