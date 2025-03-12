import { useEffect, useState } from "react";
import "./UserProfilePage.scss";
import UserSidebar from "../../../components/layouts/userSidebar/UserProfileSidebar";
import UserContents from "../../../components/user/userContent/UserContents";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const UserProfilePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = parseInt(searchParams.get("isActive")) || 1; // Default to 1
  const conversationId = searchParams.get("key"); // Get conversation ID
  const identifier = searchParams.get("identifier"); // Get identifier

  const [isActive, setIsActive] = useState(activeTab);

  useEffect(() => {
    setIsActive(activeTab);
  }, [activeTab]);

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
          <UserContents
            isActive={isActive}
            conversationId={conversationId}
            identifier={identifier}
          />
        </div>
      </section>
    </main>
  );
};

export default UserProfilePage;
