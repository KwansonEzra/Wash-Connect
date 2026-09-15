import jwt from 'jsonwebtoken';

// Signs a JWT for the given user id and sets it as an httpOnly cookie on
// the response. Called as generateToken(res, userId) from the auth
// controllers - both arguments are required.
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateToken;