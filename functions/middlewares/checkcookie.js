import { getAuth } from "firebase-admin/auth";
import { findOneDocument } from "../database/mongo.js";
import admin from "../utils/admin.js";

let decodedClaims = "";

export const isUser = async function (req, res, next) {
  // const authToken = req.headers.token || '';
  // console.log("REQ: ", req.headers);

  // console.log("admin: ", admin);

  if (!req.headers.token) {
    console.log("", req.headers.token);
  }

  try {
    const authToken = req.headers.token;

    await getAuth()
      .verifyIdToken(authToken)
      .then((decodedToken) => {
        decodedClaims = decodedToken;
        console.log("decodedClaims.isUser: ", decodedClaims.email);
        console.log("decodedClaims.uid: ", decodedClaims.uid);
      })
      .catch((error) => {
        console.log("Error verifying token:", error);
      });
    // console.log('isUser.decodedClaims: ', decodedClaims.email)
    req.decodedClaims = decodedClaims;

    next();
  } catch (error) {
    console.log("isUser.error ", error);

    next(error);
  }
};
export const isAdmin = async function (req, res, next) {
  if (!req.headers.token) {
    console.log(
      "isUser...req.headers.token não localizado...",
      req.headers.token
    );
  }

  try {
    const authToken = req.headers.token;
    // console.log('isUser...req.headers.token', req.headers.token)
    await getAuth()
      .verifyIdToken(authToken)
      .then((decodedToken) => {
        decodedClaims = decodedToken;
        // console.log('decodedClaims.isAdmin: ', decodedClaims.email)
      })
      .catch((error) => {
        console.log("Error verifying token:", error);
      });

    req.decodedClaims = decodedClaims;

    // console.log('isAdmin...decodedClaims...', decodedClaims.uid);

    let uid = req.decodedClaims.uid;
    const filter = { _id: uid };
    const user = await findOneDocument("Users", filter);

    // console.log('isAdminUSER...', user);

    if (user.role == true) {
      next();
    }
  } catch (error) {
    console.log("isAdmin.error ", error);

    next(error);
  }
};

// const isRole = async function (req, res, next) {
// 	const authToken = req.headers.token || '';
// 	admin
// 		.auth()
// 		.verifyIdToken(authToken)
// 		.then(async (decodedClaims) => {
// 			req.decodedClaims = decodedClaims;
// 			user = await db.get("Users",decodedClaims.uid )
// 			if(user.role==true){
// 				req.isRole=true
// 			}else{
// 				req.isRole=false
// 				return res.redirect("/admin/?msg=Restrito a pessoas autorizadas");
// 			}
// 			next();
// 		})
// 		.catch(error => {
// 			// console.log(req)
// 			// console.log(authToken)
// 			// console.log(error)
// 			req.app.locals = {
// 				logged: !!req.decodedClaims,
// 			};
// 			next(error);
// 		});
// }

const hasSession = async function (req, res, next) {
  const authToken = req.cookies.token || "";

  // console.log('req.headers.token...', req.headers.token)
  if (!req.headers.token) {
    console.log(
      "hasSession...req.headers.token não localizado...",
      req.headers.token
    );
  }

  // const authToken = req.headers.token

  if (authToken != "") {
    admin
      .auth()
      .verifyIdToken(authToken)
      .then(async (decodedClaims) => {
        req.decodedClaims = decodedClaims;
        //console.log(authToken,"aki ========================")
        req.app.locals = {
          logged: !!req.decodedClaims,
        };
        next();
      })
      .catch((error) => {
        //console.log(error,"=============sssssssss")
        req.app.locals = {
          logged: !!req.decodedClaims,
        };
        next();
      });
  } else {
    //FIXME - Todo acesso de usuário não logado retorna no catch e passa mesmo assim. Criar Validação com token pelos cookies.
    const sessionCookie = req.cookies.__session || "";
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then(async (decodedClaims) => {
        req.decodedClaims = decodedClaims;
        req.app.locals = {
          logged: !!req.decodedClaims,
        };
        next();
      })
      .catch((error) => {
        req.app.locals = {
          logged: !!req.decodedClaims,
        };
        // console.log('verifySessionCookie.catch', error)
        next();
      });
  }
};

export default {
  // hasSession,
  isUser,
  // isRole,
  // isAdmin
};
