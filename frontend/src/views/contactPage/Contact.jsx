import React, { useState } from 'react';
import './Contact.scss';
import { Helmet } from 'react-helmet-async';

import Header from '../../components/userLayout/header/Header';
import Footer from '../../components/userLayout/footer/Footer';
import ContactForm from '../../components/contact/contactForm/ContactForm';
import ContactTools from '../../components/contact/contactTools/ContactTools';

const Contact = () => {
  return (
    <main className="contact-page">
      <Helmet>
        <title>Contact </title>
      </Helmet>

      <Header />

      <section className="contact-page-container">
        <h1 className="contact-title">We Would Love to Hear From You</h1>

        <ContactTools />
        <ContactForm />
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
