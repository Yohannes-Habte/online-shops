import { useState } from "react";
import "./UserProfilePage.scss";
import UserSidebar from "../../../components/layouts/userSidebar/UserProfileSidebar";
import UserContents from "../../../components/user/userContent/UserContents";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const UserProfilePage = () => {
  const [isActive, setIsActive] = useState(1);

  return (
    <main className="user-profile-page">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <section className="user-profile-page-container">
        <Link to="/" className="go-back-link">
          <FaArrowAltCircleLeft /> Home
        </Link>

        <h1 className="user-profile-page-title"> User profile </h1>

        <div className="user-profile-wrapper">
          <UserSidebar isActive={isActive} setIsActive={setIsActive} />
          <UserContents isActive={isActive} setIsActive={setIsActive} />
        </div>
      </section>
    </main>
  );
};

export default UserProfilePage;
