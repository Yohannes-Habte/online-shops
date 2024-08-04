import React from 'react';
import './ProfileSidebar.scss';
import { AiOutlineLogin, AiOutlineMessage } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from 'react-icons/hi';
import {
  MdDelete,
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from 'react-icons/md';
import { TbAddressBook } from 'react-icons/tb';
import { RxPerson } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteUserFailure,
  deleteUserSuccess,
  userLogoutFailure,
  userLogoutStart,
  userLogoutSuccess,
} from '../../../redux/reducers/userReducer';
import { API } from '../../../utils/security/secreteKey';

const ProfileSidebar = ({ active, setActive }) => {
  const navigate = useNavigate();
  // Global state variables
  const { currentUser, loading, error, successMessage } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  // Log out user function
  const handleLogout = async () => {
    try {
      dispatch(userLogoutStart());
      const { data } = await axios.get(
        `${API}/auths/logout/${currentUser._id}`,
        { withCredentials: true }
      );

      dispatch(userLogoutSuccess());
      toast.success(data.message);
      window.location.reload(true);
      navigate('/login');
    } catch (error) {
      dispatch(userLogoutFailure(error.response.data.message));
    }
  };

  // Delete user account
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserFailure());
      const { data } = await axios.delete(
        `${API}/auths/delete-account/${currentUser._id}`,
        { withCredentials: true }
      );
      dispatch(deleteUserSuccess());
      toast.success(data.message);
      window.location.reload(true);
      navigate('/register');
    } catch (error) {
      dispatch(deleteUserFailure(error.response.data.message));
    }
  };

  return (
    <div className="profile-infos-wrapper">
      {/* Profile section */}
      <div onClick={() => setActive(1)} className="tab-box profile">
        <RxPerson
          title="Profile"
          className={active === 1 ? 'active-icon' : 'passive-icon'}
        />
        <span className={active === 1 ? 'active' : 'passive'}>Profile</span>
      </div>

      {/* Orders section */}
      <div className="tab-box orders" onClick={() => setActive(2)}>
        <HiOutlineShoppingBag
          title="Orders"
          className={active === 2 ? 'active-icon' : 'passive-icon'}
        />
        <span className={active === 2 ? 'active' : 'passive'}>Orders</span>
      </div>

      {/* Refunds section */}
      <div className="tab-box refunds" onClick={() => setActive(3)}>
        <HiOutlineReceiptRefund
          title="Refunds"
          className={active === 3 ? 'active-icon' : 'passive-icon'}
        />
        <span className={active === 3 ? 'active' : 'passive'}>Refunds</span>
      </div>

      {/* Index section */}
      <div
        className="tab-box inbox"
        onClick={() => setActive(4) || navigate('/inbox')}
      >
        <AiOutlineMessage
          title="Inbox"
          className={active === 4 ? 'active-icon' : 'passive-icon'}
        />
        <span className={active === 4 ? 'active' : 'passive'}>Inbox</span>
      </div>

      {/* Track order section */}
      <div className="tab-box track-order" onClick={() => setActive(5)}>
        <MdOutlineTrackChanges
          title="Track Order"
          className={active === 5 ? 'active-icon' : 'passive-icon'}
        />
        <span className={active === 5 ? 'active' : 'passive'}>Track Order</span>
      </div>

      {/* Change password section */}
      <div className="tab-box changePassword" onClick={() => setActive(6)}>
        <RiLockPasswordLine
          title="Change Password"
          className={active === 6 ? 'active-icon' : 'passive-icon'}
        />
        <span className={active === 6 ? 'active' : 'passive'}>
          Change Password
        </span>
      </div>

      {/* Address section */}
      <div className="tab-box address" onClick={() => setActive(7)}>
        <TbAddressBook
          title="Address"
          className={active === 7 ? 'active-icon' : 'passive-icon'}
        />
        <span className={active === 7 ? 'active' : 'passive'}>Address</span>
      </div>

      {/* Admin dashboar section */}
      {currentUser && currentUser?.role === 'admin' && (
        <Link to="/admin/dashboard">
          <div className="tab-box dashboard" onClick={() => setActive(8)}>
            <MdOutlineAdminPanelSettings
              title="Admin Dashboard"
              className={active === 9 ? 'active-icon' : 'passive-icon'}
            />
            <span className={active === 9 ? 'active' : 'passive'}>
              Admin Dashboard
            </span>
          </div>
        </Link>
      )}

      {/* Log out  section */}
      <div className="tab-box logout" onClick={handleLogout}>
        <AiOutlineLogin
          title="Log Out"
          className={active === 10 ? 'active-icon' : 'passive-icon'}
        />
        <span className={active === 10 ? 'active' : 'passive'}>Log out</span>
      </div>

      {/* Delete Account section */}
      <div className="tab-box address" onClick={handleDeleteAccount}>
        <MdDelete
          title="Delete Acount"
          className={active === 11 ? 'active-icon' : 'passive-icon'}
        />
        <span className={active === 11 ? 'active' : 'passive'}>
          Delete Account
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;
