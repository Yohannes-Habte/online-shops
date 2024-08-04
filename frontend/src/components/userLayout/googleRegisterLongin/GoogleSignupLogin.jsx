import './GoogleSignupLogin.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Action from '../../../redux/reducers/userReducer';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { GoogleAuthProvider, getAuth, signInWithPopup } from '@firebase/auth';
import { app } from '../../../utils/firebase';
import { API } from '../../../utils/security/secreteKey';

const GoogleSignupLogin = ({ login, signup }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // handle google button
  const handleGoogle = async () => {
    // dispatch(Action.loginStart());
    try {
      // Google Provider
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log('Google Result', result);

      // User dataq
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        image: result.user.photoURL,
        agree: true,
      };
      const { data } = await axios.post(`${API}/auths/google`, userData);

      dispatch(Action.loginSuccess(data.user));
      navigate('/profile');
    } catch (error) {
      dispatch(Action.loginFailure(error.response.data.message));
    }
  };
  return (
    <div className="google-btn-container">
      <FcGoogle className="google-icon" />
      {/* In order to prevent submission, you need to include type button */}
      {login && (
        <button onClick={handleGoogle} type="button" className="google-btn">
          Login with Google
        </button>
      )}
      {signup && (
        <button onClick={handleGoogle} type="button" className="google-btn">
          Sign Up with Google
        </button>
      )}
    </div>
  );
};

export default GoogleSignupLogin;
