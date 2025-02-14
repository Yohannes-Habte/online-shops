import { useEffect, useState } from "react";
import "./ProfilePage.scss";
import { useSelector } from "react-redux";
import UserProfile from "../../../components/user/userProfile/UserProfile";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import UserSidebar from "../../../components/layouts/userSidebar/UserSidebar";

const ProfilePage = () => {
  // State  variables
  const { currentUser, loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);

  return (
    <main className="profile-page">
      <Link to="/" className="go-back-link">
        <FaArrowAltCircleLeft /> Home
      </Link>
      <section className="profile-container">
        <h1 className="profile-title"> Details of {currentUser.name} </h1>

        <div className="sidebar-and-usrProfile-wrapper">
          <div className="user-profile-sidebar-wrapper">
            <UserSidebar active={active} setActive={setActive} />
          </div>

          <div className="user-profile-wrapper">
            <UserProfile
              currentUser={currentUser}
              loading={loading}
              active={active}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
