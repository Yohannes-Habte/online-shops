import React from 'react';
import './ContactTools.scss';
import { FaTwitterSquare } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';
import { MdEmail } from 'react-icons/md';
import { FaLocationDot } from 'react-icons/fa6';

const ContactTools = () => {
  return (
    <article className="fast-contact-tools">
      <div className="contact-tools">
        <FiPhoneCall className="contact-icon" />
        <p className="link-container">
          <a className="link" href="tel:6031112298">
            Call us
          </a>
        </p>
      </div>

      <div className="contact-tools">
        <MdEmail className="contact-icon" />
        <p className="link-container">
          <a
            className="link"
            href="mailto:uhytmsb@gmail.com?cc=rai@gmail.com, lisa@gamil.com, &bcc=tim@gmail.com&subject=Mail from our Website&body=Some body text here"
          >
            Send Email
          </a>
        </p>
      </div>

      <div className="contact-tools">
        <FaTwitterSquare className="contact-icon" />
        <p className="link-container">
          <a className="link" href="https://twitter.com/" target="_blank">
            Tweet us
          </a>
        </p>
      </div>

      <div className="contact-tools">
        <FaLocationDot className="contact-icon" />
        <p className="link-container">
          <a
            className="link"
            href="https://www.google.com/maps/dir/53.6543232,9.7845248/pinneberg"
            target="_blank"
          >
            Straße 31, 4657 Hamburg, Germany
          </a>
        </p>
      </div>
    </article>
  );
};

export default ContactTools;
