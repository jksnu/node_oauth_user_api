const util = require('../util/utils');
const jwtutil = require("../util/jwt_utils");
const fs = require('fs');
const axios = require('axios');
const jwktopem = require('jwk-to-pem');
const NodeCache = require('node-cache');

/**
 * Using memory cache for saving public key that is coming from auth api in function getPublicKeyByJose()
 * This is to avoid triggering auth route to get public key in every incoming request to user api
 * Here, default TTL(Time to Live) is 100 second.
 */
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

async function authenticate(req, res, next) {
  const loginFailedJson = {
    "status": "failed",
    "message": "Either auth token is expired or invalid. Please login again"
  };
  try {    
    const authToken = req.headers["authorization"];
    if(!authToken || authToken.indexOf('null') !== -1) {
      res.status(401).json(loginFailedJson);
    } else {
      const tokenParts = authToken.split(" ");
      const token = tokenParts[1];
      /**
       * Verifying JWT token by reading public key from public.pem
       */
      //const publicKey = getPublicKeyFromPublicPem();
      //const tokenVerifyRes = jwtutil.verifyJwt(token, publicKey); 
      //const userDecodedResult = tokenVerifyRes.decoded;

      /**
       * Here, verifying token by using public key from keys.json by using node-jose package
       */
      const publicKey = await getPublicKeyByJose(req);
      const tokenVerifyRes = jwtutil.verifyJwt(token, publicKey);
      const userDecodedResult = tokenVerifyRes.decoded.sub;

      if(!tokenVerifyRes.valid || tokenVerifyRes.expired || !userDecodedResult) {
        res.status(401).json(loginFailedJson);  
      } else {
        const userSession = util.getActiveUserSession(userDecodedResult.email);
        /**
         * Here, user details got from the incoming authrization token must be verified from DB
         * As, I have not implemented db in this POC, 
         * So I am skipping this verification
         */
        /*if(userSession && userSession.length === 1) {
          req["authUser"] = {
            email: userSession[0].email,
            id: userSession[0].identityProviderDetail.id
          }
          next();
        }else {
          res.status(401).json(loginFailedJson);
        }  */
        req["authUser"] = {
          email: userDecodedResult.email
        }
        next(); //This next() should be trigger if user details is verified from db in above commented code      
      }   
    }    
  } catch (error) {
    console.error(error);
    res.status(401).json(loginFailedJson)
  }
}

function getPublicKeyFromPublicPem() {
  try {
    const publicKey = fs.readFileSync('./certs/public.pem', "utf8");
    return publicKey;
  } catch (error) {
    throw error;
  }
}

async function getPublicKeyByJose(req) {
  try {    
    if(myCache.get("publicKey")) {
      return myCache.get("publicKey");
    }
    const { data } = await axios.get('http://localhost:7000/jwks/', {
      headers: {
        'authorization': req.headers.authorization || "",
        'origin': req.headers.origin || "",
        'host': req.headers.host || "",
        'user-agent': req.headers["user-agent"] || "",
        "x-xsrf-token": req.headers['x-xsrf-token'] || ""
      }
    });
    const [ firstKey ] = data.keys;
    const publicKey = jwktopem(firstKey);
    myCache.set("publicKey", publicKey);
    return publicKey;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  authenticate
}