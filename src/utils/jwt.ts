const jwt = require('jsonwebtoken');
const JWT_SECRET = '3s6v9y$B&E)H+MbQeThWmZq4t7w!z%C*F-JaNcRfUjXn2r5u8x/A?D(G+KbPeSgV';

export const createToken = async (payload: object, expiresIn: string) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET || JWT_SECRET, {
    expiresIn,
    algorithm: 'HS256',
  });

  return token;
};

export const jwtVerify = async (token: string) =>
  new Promise(resolve => {
    jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET, async (err, decoded) => {
      if (err) {
        return resolve(err);
      }
      return resolve(decoded);
    });
  });
