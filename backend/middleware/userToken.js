import JWT from "jsonwebtoken";

const generateUserToken = (user) => {
  const token = JWT.sign(
    {
      id: user._id,
      admin: user.role.admin,
      seller: user.role.seller,
    },
    process.env.JWT_USER_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

export default generateUserToken;
