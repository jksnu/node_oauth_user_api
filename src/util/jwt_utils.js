const jwt = require('jsonwebtoken');

const verifyOptions = {
  expiresIn:  "10min",
  algorithm:  ["RS256"]
};

/**
 * This function is verifying the JWT token by using public key from public.pem file
 * @param {*} token 
 * @returns 
 */
 function verifyJwt(token, publicKey) {
  try {
    const decoded = jwt.verify(token, publicKey, verifyOptions);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}


module.exports = {
  verifyJwt
}