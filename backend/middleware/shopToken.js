import JWT from 'jsonwebtoken';

const sellerToken = (id) => {
  const token = JWT.sign({ id }, process.env.JWT_SHOP_SECRET, {
    expiresIn: '2h',
  });

  return token;
};

export default sellerToken;
