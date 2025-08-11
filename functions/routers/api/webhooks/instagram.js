import axios from "axios";
import crypto from "crypto";
import express from "express";
import { ObjectId } from "mongodb";
import {
  findOneDocument,
  updateOneDocuments,
} from "../../../database/mongo.js";
import { isUser } from "../../../middlewares/checkcookie.js";
import tokens from "../../../utils/tokens.js";
// import GetAutomationsByPostId from "../uteis.js";

const router = express.Router();

router.get("/api/webhooks/instagram", async (req, res) => {
  const hubChallenge = req.query["hub.challenge"];
  const hubMode = req.query["hub.mode"];
  const hubVerifyToken = req.query["hub.verify_token"];
  console.log("req.query", req.query);
  console.log("hubChallenge", hubChallenge);
  console.log("hubMode", hubMode);
  console.log("hubVerifyToken", hubVerifyToken);
  try {
    if (hubMode === "subscribe" && hubVerifyToken === "testing") {
      console.log("hubChallenge returns OK...");
      res.status(200).send(hubChallenge);
    } else {
      console.log("hubChallenge returns not.OK...");
      res.status(500).json({ error: error });
    }
  } catch (error) {
    console.log("get.conexao NOT.ok....");
    res.status(500).json({ error: error });
  }
});

router.post("/api/webhooks/instagram", async (req, res) => {
  try {
    const signature = req.headers["x-hub-signature-256"];
    console.log("headers: ", req.headers);
    console.log("headers.signature: ", signature);
    const hash = crypto
      .createHmac("sha256", tokens.INSTAGRAM_CLIENT_SECRET)
      .update(JSON.stringify(req.body), "utf8")
      .digest("hex");
    console.log("hash...", signature.substring(7), hash);
    if (hash == signature.substring(7)) {
      // Processa os dados do webhook
      const body = req.body;
      console.log("Comentário recebido na publição...A", body);
      body.entry.forEach((entry) => {
        if (entry.changes) {
          entry.changes.forEach((change) => {
            // console.log("bodyError..", change);
            validateField(change.field, change);
          });
        } else {
          entry.messaging.forEach((change) => {
            console.log("messaging..", change);
            validateField(change.field, change);
          });
        }
      });
      console.log("hash.ok");
      res.status(200).send("EVENT_RECEIVED");
    } else {
      const body = req.body;
      console.log("Comentário recebido na publição...B", body);
      body.entry.forEach((entry) => {
        if (entry.changes) {
          entry.changes.forEach((change) => {
            console.log("bodyError..", change);
            validateField(change.field, change);
          });
        } else {
          entry.messaging.forEach((change) => {
            console.log("messaging..", change);
            validateField(change.field, change);
          });
        }
      });
      console.log("Response Instagram EVENT_RECEIVED.. hash.Not.OK");
      res.status(200).send("EVENT_RECEIVED");
    }
    // }
  } catch (error) {
    console.log("POST.conexao NOT.ok....", error);
    res.status(500).json({ error: error });
  }
});

//👉 - Valida o tipo de webhook recebido para enviar a resposta necessária.
async function validateField(field, change) {
  switch (field) {
    case "comments":
      return sendDM(change);
      break;
    case "messages":
      return resDM(change);
      break;

    default:
      return webhookDesconhecido(change);
  }
}

async function webhookDesconhecido(change) {
  console.log("Você recebeu uma WEBHOOK não tratado....");
  console.log(change);

  // getUserData(change.sender.id);

  return {
    status: 200,
  };
}

async function resDM(change) {
  if (change.value.sender.id == "12334") {
    console.log("Você recebeu um DM de teste do instagram");
    console.log(change);
    return {
      status: 200,
    };
  }
}

async function getUserData(scopedId, token) {
  try {
    const responseDataUser = await axios.get(
      `${tokens.INSTAGRAM_BASE_URL}/${tokens.VERSION}/${scopedId}?fields=name,username,profile_pic,follower_count,is_user_follow_business,is_business_follow_user&access_token=${token}`
    );

    console.log("responseDataUser", responseDataUser.data);
    return responseDataUser.data;
  } catch (error) {
    console.log("getUserData.Error...", error);
  }
}

//👉 - sendDM - Envia DM para usuário que enviou o comentário.
async function sendDM(change) {
  if (
    change.value.from.id == "232323232" &&
    change.value.from.username == "test"
  ) {
    console.log("✅ Você recebeu um comentário de teste do instagram");
    console.log(change);
    return {
      status: 200,
    };
  }

  // console.log("Você recebeu um comentário em sua publicação");

  const automation = await GetAutomationsByPostId(change.value.media.id);
  console.log("✅ Identificado Automation ativa...", automation);

  let integration = null;
  if (automation) {
    integration = await GetIntegrations(automation.userUid);
    console.log("✅ Identificado Integration ativo", integration);
  } else {
    console.log(
      "❌ Esse post não contém automatização...",
      change.value.media.id
    );
    return {
      status: 400,
      message: "❌ Esse post não contém automtização...",
    };
  }

  if (
    integration.instagramUserId !== change.value.from.id &&
    automation.status == true
  ) {
    console.log("🟩 sendDM --> 1.0");
    try {
      //LINK -  https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/private-replies

      // if (automation.status == false) {
      //   console.log(" AUTOMAÇAO DESABILITADA...", automation.status);
      //   return {
      //     status: 200,
      //     message: "Direct message sent successfully",
      //     resData: response.data,
      //   };
      // }

      console.log("🟩 sendDM --> 1.1");

      const validatekeys = await validaKeys(
        automation.keyWords,
        change.value.text
      );

      getUserData(change.value.from.id, integration.token);

      if (validatekeys) {
        console.log("✅ sendDM --> 2.0 -> validatekeys.true");
        console.log("respondendo via DM...");
        const response = await axios.post(
          `${tokens.INSTAGRAM_BASE_URL}/${integration.instagramId}/messages`,
          {
            message: JSON.stringify({
              text: automation.resDm,
            }), // comment_id: commentId
            recipient: JSON.stringify({
              comment_id: change.value.id,
            }),
          },
          {
            headers: {
              Authorization: `Bearer ${integration.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ DM enviada com sucesso:", response.data);

        if (integration.instagramUserId !== change.value.from.id) {
          console.log("🟩 Respondendo comentário...");
          const resComent = await sendResComentario(
            integration.token,
            change.value.id,
            automation.resComment
          );
          var update = { $inc: { resInPost: 1 } };
          await updatePostRes(automation._id, update);
          console.log("✅ Comentário respondido.", resComent);
        }

        return {
          status: 200,
          message: "Direct message sent successfully",
          resData: response.data,
        };
      } else {
        var update = { $inc: { resInPost_not: 1 } };
        await updatePostRes(automation._id, update);
        console.log(
          "❌ Nenhuma palavra na mensagem... Nada enviado ou respondido..."
        );
        return {
          status: 200,
        };
      }

      // return;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error.response.data);
      // console.error(error.response.config.url);
      // console.error(error.response.config);
      if (error.response.status === 400) {
        console.error(
          "Requisição inválida. Verifique o token, ID do destinatário e a estrutura da mensagem.",
          error.response.data
        );
        return {
          status: 400,
          message:
            "Requisição inválida. Verifique o token, ID do destinatário e a estrutura da mensagem.",
          resData: error.response.data,
        };
      } else if (error.response.status === 429) {
        console.error(
          "Limite de requisições excedido. Tente novamente mais tarde."
        );
        return {
          status: 429,
          message:
            "Limite de requisições excedido. Tente novamente mais tarde.",
          resData: error.response.data,
        };
      } else {
        console.error("Erro desconhecido:", error.response.data);
        return {
          status: 500,
          message: "Erro desconhecido:",
          resData: error.response.data,
        };
      }
    }
  } else {
    console.log(
      "❌ SendDM error...",
      integration.instagramUserId,
      change.value.from.id,
      automation.status
    );
  }
}

//👉 - sendResComentario - Resposde o comentário recebido
async function sendResComentario(token, instUserId, msgRes) {
  console.log("🟩 sendResComentario...", instUserId, msgRes);
  try {
    // https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/comment-moderation

    const responseMessage = await axios.post(
      `${tokens.INSTAGRAM_BASE_URL}/${tokens.VERSION}/${instUserId}/replies`,
      {
        message: msgRes,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "✅✅Comentário respondido com sucesso...",
      responseMessage.data
    );
    return {
      status: 200,
      message: "Direct message sent successfully",
      resData: responseMessage.data,
    };
    // return;
  } catch (error) {
    // console.error("Erro ao enviar mensagem:", error.response.data);
    // console.error(error.response.config.url);
    console.error("error", error);
    if (error.response.status === 400) {
      console.error(
        "Requisição inválida. Verifique o token, ID do destinatário e a estrutura da mensagem.",
        error.response.data
      );
      return {
        status: 400,
        message:
          "Requisição inválida. Verifique o token, ID do destinatário e a estrutura da mensagem.",
        resData: error.response.data,
      };
    } else if (error.response.status === 429) {
      console.error(
        "❌❌ Limite de requisições excedido. Tente novamente mais tarde."
      );
      return {
        status: 429,
        message: "Limite de requisições excedido. Tente novamente mais tarde.",
        resData: error.response.data,
      };
    } else {
      console.error("❌ Erro desconhecido:", error.response.data);
      return {
        status: 500,
        message: "Erro desconhecido:",
        resData: error.response.data,
      };
    }
  }
}

async function updatePostRes(automationId, update) {
  const filter = { _id: new ObjectId(automationId) };
  const options = { upsert: true };
  const result = await updateOneDocuments(
    "Automations",
    filter,
    update,
    options
  );
}

//👉 - ValidaKey - verifica se as palavras frases estao na mensagem recebida.
async function validaKeys(keys, frase) {
  console.log("🟩 Localizando keys :", keys);
  return keys.some((key) => frase.toLowerCase().includes(key.toLowerCase()));
}

//👉 - GetAutomationsByPostId -> Busca User Id pelo ID da publicação que recebeu o comentário.
async function GetAutomationsByPostId(postId) {
  console.log("🟩 GetAutomationsByPostId..on...", postId);
  try {
    const automations = await findOneDocument("Automations", {
      postId: postId,
      status: true,
    });
    return automations;
  } catch (error) {
    console.error("GetAutomationsByPostId.error...: ", error);
    throw error;
  }
}

//👉 - GetIntegrations -> Busca dados da integraçao feita pelo userId
async function GetIntegrations(uid) {
  console.log("🟩 GetIntegrations.On.byUID..", uid);
  try {
    const integration = await findOneDocument("Integrations", {
      userUid: uid,
      status: true,
    });
    console.log("GetIntegrations localizada...");
    return integration;
  } catch (error) {
    console.error("GetIntegrations.naoLocalizada.error: ", error);
    throw error;
  }
} // WCPzZSy9LBd5kykcn4p9wd7UbR33

router.get("/api99/webhooks/instagram2", async (req, res) => {
  const hubChallenge = req.query["hub.challenge"];
  const hubMode = req.query["hub.mode"];
  const hubVerifyToken = req.query["hub.verify_token"];
  try {
    if (hubMode === "subscribe" && hubVerifyToken === "testing") {
      res.status(200).send(hubChallenge);
    }
    console.log("get.conexao 2 ok....");
  } catch (error) {
    console.log("get.conexao 2 NOT.ok....");
    res.status(500).json({ error: error });
  }
});

router.post("/api99/webhooks/instagram2", async (req, res) => {
  try {
    const signature = req.headers["x-hub-signature-256"];
    const hash = crypto
      .createHmac("sha256", tokens.INSTAGRAM_CLIENT_SECRET)
      .update(JSON.stringify(req.body), "utf8")
      .digest("hex");
    console.log("hash...2", signature.substring(7), hash);
    if (hash == signature.substring(7)) {
      const body = req.body;
      console.log("Processa.body..", body);
      body.entry.forEach((entry) => {
        entry.changes.forEach((change) => {
          console.log("body..2", change);
        });
      });
      console.log("hash2.ok");
      res.status(200).send("EVENT_RECEIVED");
    } else {
      const body = req.body;
      console.log("Processa.body.. e.", body);
      body.entry.forEach((entry) => {
        entry.changes.forEach((change) => {
          console.log("bodyError2..", change);
        });
      });
      console.log("hash2.Not.OK");
      res.status(200).send("INVALID_REQUEST");
    }
  } catch (error) {
    console.log("POST.conexao2 NOT.ok....", error);
    res.status(500).json({ error: error });
  }
});

router.post(
  "/api99/webhooks/instagram/subscribapp",
  isUser,
  async (req, res) => {
    console.log(
      "req.decodedClaims.user_id....subscribapp",
      req.decodedClaims.user_id
    );
    const uid = req.decodedClaims.user_id;

    if (req.decodedClaims == undefined) {
      return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
    }

    try {
      const filter = { userUid: uid };
      const profile = await findOneDocument("Integrations", filter);
      console.log(
        "subscriptions.webhooks:",
        tokens.INSTAGRAM_CLIENT_ID,
        profile.token
      );
      const subscriptions = await axios.post(
        `${tokens.INSTAGRAM_BASE_URL}/${tokens.VERSION}/${tokens.INSTAGRAM_CLIENT_ID}/subscribed_apps?subscribed_fields=feed&access_token=${profile.token}`
      );

      // "https://graph.instagram.com/subscriptions.webhooks:/1755847768034402/subscribed_apps
      // ?subscribed_fields=comments,messages
      // &access_token=EAAFB..."
      // "https://graph.facebook.com/v21.0/1755847768034402/subscribed_apps?subscribed_fields=feed&access_token=EAAFB..."
      // GET https://graph.facebook.com/17841405726653026 ?fields=mentioned_comment.comment_id(17894227972186120)

      console.log("subscriptions.webhooks:", subscriptions);
      res.status(200);
    } catch (error) {
      console.log("subscriptions.webhooks: NOT.ok....", error);
      res.status(500).json({ error: error });
    }
  }
);

router.get("/api99/webhooks/all", isUser, async (req, res) => {
  console.log("inscricoes");

  try {
    const inscricoes = await axios.get(
      `${tokens.INSTAGRAM_BASE_URL}/${tokens.INSTAGRAM_CLIENT_ID}/subscriptions?access_token=${tokens.INSTAGRAM_CLIENT_SECRET}`
    );
    // https://graph.facebook.com/v16.0/{APP_ID}/subscriptions?access_token={ACCESS_TOKEN}
    // GET graph.facebook.com/188559381496048/subscriptions

    console.log("inscricoes.webhooks:", inscricoes.data, inscricoes.response);
    res.status(200);
  } catch (error) {
    console.log("inscricoes.webhooks: NOT.ok....", error);
    res.status(500).json({ error: error });
  }
});

router.get("/api99/tests", isUser, async (req, res) => {
  console.log("req.decodedClaims.user_id....tests", req.decodedClaims.user_id);
  const uid = req.decodedClaims.user_id;

  try {
    console.log("inscricoes.webhooks:", uid);
    console.log("req.decodedClaims:", req.decodedClaims);
    res.status(200);
  } catch (error) {
    console.log("inscricoes.webhooks: NOT.ok....", error);
    res.status(500).json({ error: error });
  }
});

export default router;
