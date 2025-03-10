import { UserInboxPage } from "../../../routes/user/UserRoutes";
import Address from "../address/Address";
import UserOrders from "../allOrders/UserOrders";
import ChangePassword from "../changePassword/ChangePassword";
import AllRefundOrders from "../refunds/AllRefundOrders";
import TrackOrderTable from "../trackOrderTable/TrackOrderTable";
import UserProfile from "../userProfile/UserProfile";
import "./UserContents.scss";

const UserContents = ({ isActive }) => {
  return (
    <div className="user-profile-contents-container">
      {isActive === 1 && <UserProfile />}

      {isActive === 2 && <Address />}

      {isActive === 3 && <ChangePassword />}

      {isActive === 4 && <UserOrders />}

      {isActive === 5 && <TrackOrderTable />}

      {isActive === 6 && <AllRefundOrders />}

       {isActive === 7 && <UserInboxPage />} 
    </div>
  );
};

export default UserContents;
