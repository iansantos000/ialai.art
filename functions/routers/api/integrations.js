import axios from "axios";
import express from "express";
import { ObjectId } from "mongodb";
import {
  findDocuments,
  findOneDocument,
  insertOneDocument,
  updateOneDocuments,
} from "../../database/mongo.js";
import { isUser } from "../../middlewares/checkcookie.js";
import tokens from "../../utils/tokens.js";

// import GetIntegrations from "./uteis.js";

const router = express.Router();

router.get("/api/integrations/instagramlogin", isUser, async (req, res) => {
  try {
    // console.log("integrations id: " + uid);

    const url = tokens.INSTAGRAM_LOGIN;
    res.status(200).json({ url: url });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/api/integrations/:code", isUser, async (req, res) => {
  // console.log("/api/integrations/:code", req.params.code);
  // console.log("req.decodedClaims.user_id", req.decodedClaims.user_id);

  console.log(
    "integrations/.../req.decodedClaims.user_id",
    req.decodedClaims.user_id
  );
  const code = req.params.code;
  const uid = req.decodedClaims.user_id;

  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }

  try {
    // if (GetIntegrations(uid) !== null) {
    console.log("integration OK");

    const token = await generateTokens(code);

    if (token) {
      console.log("inTOKEN...", uid);
      const insta_id = await axios.get(
        `${tokens.INSTAGRAM_BASE_URL}/me?fields=user_id,name,username&access_token=${token.access_token}`
      );

      // curl -X GET "https://graph.instagram.com/v22.0/<INSTAGRAM_SCOPED_ID> \
      // ?fields=name,username,profile_pic,follower_count,is_user_follow_business,is_business_follow_user \
      // &access_token=<INSTAGRAM_ACCESS_TOKEN>"

      console.log("insta_id.data", insta_id.data);
      const today = new Date();
      const expire_date = new Date(today);
      expire_date.setDate(today.getDate() + 60);
      const data = {
        name: "Instagram",
        creatAt: today,
        userUid: uid,
        token: token.access_token,
        expireAt: new Date(expire_date),
        instagramUserId: insta_id.data.user_id,
        instagramId: insta_id.data.id,
        instagramName: insta_id.data.name,
        instagramUserName: insta_id.data.username,
        status: true,
      };

      const create = await insertOneDocument("Integrations", data);

      console.log("creatIntegration...", create);

      return res.status(200).json({
        status: "integraçao salva salvo",
        data: create,
      });
    }
    // } else {
    //   console.log("integratio NotOK....");
    // }
    res.status(200).json({ status: "integraçao salva salvo" });
  } catch (error) {
    console.error(error.response.data);
    res.status(500).json({ error: "Internal Server Error" });
  }
  res.status(200);
});

router.get("/api/integrations/all", isUser, async (req, res) => {
  // console.log(
  //   "integrations/.../req.decodedClaims.user_id",
  //   req.decodedClaims.user_id
  // );
  const uid = req.decodedClaims.user_id;

  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }

  try {
    // console.log("integrations id: " + uid);

    const integrations = await GetIntegrations(uid);
    res.status(200).json(integrations);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post(
  "/api/integration/status/:integration/:status",
  isUser,
  async function (req, res, next) {
    if (req.decodedClaims == undefined) {
      return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
    }

    try {
      const integrationId = req.params.integration;
      const status = req.params.status;
      const newStatus = status == "true" ? true : false;
      console.log(
        "integration.status: ",
        typeof status,
        typeof newStatus,
        newStatus,
        integrationId
      );
      const filter = { _id: new ObjectId(integrationId) };
      // const filter = { _id: automationId };

      const update = {
        $set: {
          status: newStatus,
        },
      };
      console.log("automation.update: ", update);
      const options = { upsert: true };

      const result = await updateOneDocuments(
        "Integrations",
        filter,
        update,
        options
      );
      console.log("integrationStatus.result: ", result);
      return result.modifiedCount === 1
        ? res.status(200).json({ msg: "Status da INTEGRATION atualizada." })
        : res
            .status(201)
            .json({ msg: "Falha ao salvar status da INTEGRAÇÃO." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

async function GetIntegrations(uid) {
  // console.log("GetIntegrations...1", uid);

  try {
    let filter = { userUid: uid };
    let project = {
      _id: 1,
      instagramId: 1,
      instagramUserName: 1,
      creatAt: 1,
      expireAt: 1,
      status: 1,
    };
    const integration = await findDocuments("Integrations", filter, project);
    // +0console.log("GetIntegrations...", integration, typeof integration);
    return integration;
  } catch (error) {
    console.error("GetIntegrationsError: ", error);
    throw error;
  }
}

// async function onIntegrate(code) {
//   const user = await onCurrentUser();
//   console.log("onCurrentUser: ", user.id);

//   try {
//     const integration = await getIntegration(user.id);
//     console.log(
//       "getIntegration: ",
//       typeof integration,
//       integration,
//       integration?.integrations?.length
//     );

//     if (integration !== undefined) {
//       console.log("teste"); // This will only be executed if integrations is an empty array
//       // const token = await generateTokens(code);

//       console.log("TOKE.generete: ", token);

//       if (token) {
//         console.log("inTOKEN...");
//         const insta_id = await axios.get(
//           `${tokens.INSTAGRAM_BASE_URL}/me?fields=user_id&access_token=${token.access_token}`
//         );

//         const today = new Date();
//         const expire_date = today.setDate(today.getDate() + 60);
//         const create = await createIntegration(
//           user.id,
//           token.access_token,
//           new Date(expire_date),
//           insta_id.data.user_id
//         );
//         return { status: 200, data: create };
//       }
//       console.log("🔴 401");
//       return { status: 401 };
//     } else {
//       console.log("integration error");
//     }
//     console.log("🔴 404");
//     return { status: 404 };
//   } catch (error) {
//     console.log("🔴 500", error);
//     return { status: 500 };
//   }
// }

async function generateTokens(code) {
  console.log("Code.generateTokens: ", code);

  console.log("client_id", tokens.INSTAGRAM_CLIENT_ID);
  console.log("client_secret", tokens.INSTAGRAM_CLIENT_SECRET);
  console.log("grant_type", "authorization_code");
  console.log("redirect_uri", `${tokens.PUBLIC_HOST_URL}/callback/instagram`);
  console.log("code", code);

  const insta_form = new FormData();
  insta_form.append("client_id", tokens.INSTAGRAM_CLIENT_ID);
  insta_form.append("client_secret", tokens.INSTAGRAM_CLIENT_SECRET);
  insta_form.append("grant_type", "authorization_code");
  insta_form.append(
    "redirect_uri",
    `${tokens.PUBLIC_HOST_URL}/callback/instagram`
  );
  insta_form.append("code", code);

  const shortTokenRes = await axios.post(
    tokens.INSTAGRAM_TOKEN_URL,
    insta_form
  );
  console.log("shortTokenRes11:...", shortTokenRes.status);

  // GET https://graph.instagram.com/access_token
  // ?grant_type=ig_exchange_token
  // &client_secret={instagram-app-secret}
  // &access_token={short-lived-access-token}

  const token = shortTokenRes.data;
  console.log("shortTokenRes:...", token);
  if (token.permissions.length > 0) {
    console.log(token, "got permissions");
    const long_token = await axios.get(
      `${tokens.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&&client_secret=${tokens.INSTAGRAM_CLIENT_SECRET}&access_token=${token.access_token}`
    );

    //LINK -  curl -X GET \ 'https://graph.instagram.com/access_token?grant_type=ig_exchange_token&&client_secret=eb87G...&access_token=IGQVJ...'

    console.log("longTokem.DATA..", long_token.data);
    return long_token.data;
  }
}

async function GetAutomations(uid) {
  try {
    const integration = await findOneDocument("Integrations", { userUid: uid });

    console.log("integrations...", integration, typeof integration);
    return integration;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default router;
