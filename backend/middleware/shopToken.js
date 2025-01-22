import JWT from "jsonwebtoken";

const generateShopToken = (shop) => {
  const token = JWT.sign(
    {
      id: shop._id,
    },
    process.env.JWT_SHOP_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

export default generateShopToken;
