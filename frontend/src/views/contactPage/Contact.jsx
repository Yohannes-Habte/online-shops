
import './Contact.scss';
import { Helmet } from 'react-helmet-async';
import ContactForm from '../../components/contact/contactForm/ContactForm';
import ContactTools from '../../components/contact/contactTools/ContactTools';
import Header from '../../components/layouts/header/Header';
import Footer from '../../components/layouts/footer/Footer';

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
