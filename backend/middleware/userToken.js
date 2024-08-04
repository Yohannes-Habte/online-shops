import JWT from 'jsonwebtoken';

// User token
export const userToken = (id) => {
  const token = JWT.sign({ id }, process.env.JWT_USER_SECRET, { expiresIn: '1h' });
  return token;
};

export default userToken;
