import React, { useEffect, useState } from 'react';
import './Footer.scss';
import { NavLink } from 'react-router-dom';
import { FaLinkedin } from 'react-icons/fa';
import { FaFacebookSquare } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaTwitterSquare } from 'react-icons/fa';
import { FaPhoneSquare } from 'react-icons/fa';
import { MdOutlineMessage } from 'react-icons/md';
import { FaLocationDot } from 'react-icons/fa6';
import { API } from '../../../utils/security/secreteKey';
import PageLoader from '../../../utils/loader/PageLoader';
import axios from 'axios';
import { toast } from 'react-toastify';

const Footer = () => {
  // Local State variables
  const [email, setEmail] = useState('');
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Display footer data
  useEffect(() => {
    const getFooterInfo = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/data/footer`);
        setData(data.footerInfo);
        setLoading(false);
      } catch (error) {
        setError(toast.error(error.response.data.message));
        setLoading(false);
      }
    };
    getFooterInfo();
  }, []);

  // NavLink stayling
  const NavLinkStyling = ({ isActive }) =>
    isActive ? 'ActiveLink' : 'passiveLink';

  // Copyright date
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className="footer">
      <section className="subscription">
        <h3 className="subtTitle">
          Subscribe to be informed immediately about offers, news and events
        </h3>
        <form action="" className="form">
          <div className="input-container">
            <MdEmail className="icon" />
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="input-field"
            />
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <span className="input-highlight"></span>
          </div>
          <button className="subscribe-btn">Subscribe</button>
        </form>
      </section>

      {loading ? (
        <PageLoader />
      ) : error ? (
        <p className="error-message"> {error} </p>
      ) : (
        <div className="footer-sections-container">
          <section className="footer-sitemap">
            <h2 className="footer-subTitle"> {data?.sitemap} </h2>

            <ul className="footer-items">
              <li className="footer-item">
                <NavLink to="/best-sellings" className={NavLinkStyling}>
                  {data?.bestSelling}
                </NavLink>
              </li>

              <li className="footer-item">
                <NavLink to="/products" className={NavLinkStyling}>
                  {data?.products}
                </NavLink>
              </li>

              <li className="footer-item">
                <NavLink to="/events" className={NavLinkStyling}>
                  {data?.events}
                </NavLink>
              </li>

              <li className="footer-item">
                <NavLink to="/contact" className={NavLinkStyling}>
                  {data?.contact}
                </NavLink>
              </li>
            </ul>
          </section>

          <section className="footer-company">
            <h2 className="footer-subTitle"> {data?.company} </h2>

            <ul className="footer-items">
              <li className="footer-item">
                <NavLink to="/story" className={NavLinkStyling}>
                  {data?.story}
                </NavLink>
              </li>

              <li className="footer-item">
                <NavLink to="/team" className={NavLinkStyling}>
                  {data?.employees}
                </NavLink>
              </li>

              <li className="footer-item">
                <NavLink to="/awards" className={NavLinkStyling}>
                  {data?.award}
                </NavLink>
              </li>

              <li className="footer-item">
                <NavLink to="/clients" className={NavLinkStyling}>
                  {data?.client}
                </NavLink>
              </li>
            </ul>
          </section>

          <section className="footer-social">
            <h2 className="footer-subTitle"> {data?.social} </h2>

            <ul className="footer-items">
              <li className="footer-item">
                <a
                  href="https://www.linkedin.com/in/yohannes-habtemariam/"
                  target="_blank"
                >
                  <FaLinkedin className="footer-icon" /> {data?.linkedIn}
                </a>
              </li>

              <li className="footer-item">
                <a
                  href="https://www.facebook.com/profile.php?id=100009710022882"
                  target="_blank"
                >
                  <FaFacebookSquare className="footer-icon" /> {data?.facebook}
                </a>
              </li>

              <li className="footer-item">
                <a href="https://www.youtube.com/" target="_blank">
                  <FaYoutube className="footer-icon" /> {data?.youtube}
                </a>
              </li>

              <li className="footer-item">
                <a href="https://twitter.com/" target="_blank">
                  <FaTwitterSquare className="footer-icon" /> {data?.twitter}
                </a>
              </li>
            </ul>
          </section>

          <section className="footer-contact">
            <h2 className="footer-subTitle"> Contact </h2>

            <ul className="footer-items">
              <li className="footer-item">
                <a href="mailto:uelandrae@gmail.com">
                  <MdEmail className="footer-icon" /> {data?.email}
                </a>
              </li>

              <li className="footer-item">
                <a href="tel:123-456-7890">
                  <FaPhoneSquare className="footer-icon" /> {data?.phone}
                </a>
              </li>

              <li className="footer-item">
                <a href="tel:6031112298">
                  <FaLocationDot className="footer-icon" /> {data?.location}
                </a>
              </li>

              <li className="footer-item">
                <NavLink to="/contact">
                  <MdOutlineMessage className="footer-icon" /> {data?.comment}
                </NavLink>
              </li>
            </ul>
          </section>
        </div>
      )}

      <p className="copyright"> &copy; {year} All Rights Reserved!</p>
    </footer>
  );
};

export default Footer;
