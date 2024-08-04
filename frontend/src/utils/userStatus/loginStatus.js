import axios from 'axios';
import { url } from '../security/secreteKey.js';

// =================================================
// Get user login status
// =================================================
export const getLoginStatus = async () => {
  const response = await axios.get(`${url}/api/auths/loginStatus`);
  return response.data;
};
