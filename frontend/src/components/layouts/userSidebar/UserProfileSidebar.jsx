import "./UserProfileSidebar.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdMedicalServices, MdOutlineClose } from "react-icons/md";
import { RiMoneyEuroBoxFill } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Logout from "../../../utils/globalFunctions/Logout";

const UserProfileSidebar = ({ isActive, setIsActive }) => {
  const navigate = useNavigate();
  // Global state variables
  const { signOut } = Logout();
  const { currentUser } = useSelector((state) => state.user);

  const [openUserSidebar, setOpenUserSidebar] = useState(false); // For dropdown visibility

  const handleUserSidebar = () => {
    setOpenUserSidebar(!openUserSidebar);
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div
      className={`user-profile-sidebar-wrapper ${
        openUserSidebar ? "opened-user-sidebar-menu" : ""
      } `}
    >
      {/* Hamburger icon for mobile screens */}
      <div className="user-sidebar-hamburger-menu" onClick={handleUserSidebar}>
        {openUserSidebar ? <MdOutlineClose /> : <GiHamburgerMenu />}
      </div>

      <aside className="user-sidebar-menu-container">
        <h2 className="user-profile-sidebar-title">Dashboard</h2>

        <aside
          onClick={() => setIsActive(1) || setOpenUserSidebar(false)}
          className="user-profile-sidebar-item"
        >
          <FaUser
            title="User Profile"
            className={isActive === 1 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 1 ? "active-text" : "passive-text"}>
            User Profile
          </h4>
        </aside>

        <aside
          onClick={() => setIsActive(2) || setOpenUserSidebar(false)}
          className="user-profile-sidebar-item"
        >
          <FaAddressCard
            title="User Address"
            className={isActive === 2 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 2 ? "active-text" : "passive-text"}>
            User Address
          </h4>
        </aside>

        <aside
          onClick={() => setIsActive(3) || setOpenUserSidebar(false)}
          className="user-profile-sidebar-item"
        >
          <FaAddressCard
            title="Change Password"
            className={isActive === 3 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 3 ? "active-text" : "passive-text"}>
            Change Password
          </h4>
        </aside>

        <aside
          onClick={() => setIsActive(4) || setOpenUserSidebar(false)}
          className="user-profile-sidebar-item"
        >
          <RiLockPasswordFill
            title="User Orders"
            className={isActive === 4 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 4 ? "active-text" : "passive-text"}>
            User Orders
          </h4>
        </aside>

        <aside
          onClick={() => setIsActive(5) || setOpenUserSidebar(false)}
          className="user-profile-sidebar-item"
        >
          <RiMoneyEuroBoxFill
            title="Track Order"
            className={isActive === 5 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 5 ? "active-text" : "passive-text"}>
            Track Order
          </h4>
        </aside>

        <aside
          onClick={() => setIsActive(6) || setOpenUserSidebar(false)}
          className="user-profile-sidebar-item"
        >
          <MdMedicalServices
            title="Refund Orders"
            className={isActive === 6 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 6 ? "active-text" : "passive-text"}>
            Refund Orders
          </h4>
        </aside>

        <aside
          onClick={() => setIsActive(7) || setOpenUserSidebar(false)}
          className="user-profile-sidebar-item"
        >
          <MdMedicalServices
            title="Inbox"
            className={isActive === 7 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 7 ? "active-text" : "passive-text"}>
            User Inbox
          </h4>
        </aside>

        {currentUser.role === "admin" && (
          <Link to={"/admin/dashboard"}>
            <aside
              onClick={() => setIsActive(8) || setOpenUserSidebar(false)}
              className="user-profile-sidebar-item"
            >
              <RiMoneyEuroBoxFill
                title="Admin"
                className={isActive === 8 ? "active-icon" : "passive-icon"}
              />

              <h4 className={isActive === 8 ? "active-text" : "passive-text"}>
                Admin
              </h4>
            </aside>
          </Link>
        )}

        <aside onClick={handleLogout} className="user-profile-sidebar-item">
          <IoMdLogOut
            title="Log Out"
            className={isActive === 10 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 10 ? "active-text" : "passive-text"}>
            Log Out
          </h4>
        </aside>
      </aside>
    </div>
  );
};

export default UserProfileSidebar;
