import express from "express";
import { findDocuments, insertOneDocument } from "../../database/mongo.js";
import { isUser } from "../../middlewares/checkcookie.js";

const router = express.Router();

// ANCHOR - Buscar User-pelo Id após login pelo Front
router.post("/api/notifications/", isUser, async function (req, res, next) {
  const uid = req.decodedClaims.user_id;

  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }

  // {
  //   id: 1,
  //   userId: "userId",
  //   img: avatar4,
  //   icon: null,
  //   title: "Teste notificaçoe novo",
  //   subtitle: "bla bla bla",
  //   time: "Mai 01, 10:30 AM",
  //   isSeen: true,
  //   color: null,
  // },

  const today = new Date();
  let data = JSON.parse(req.body.dados);
  data.creatAt = today;
  data.userId = uid;

  try {
    const create = await insertOneDocument("Notifications", data);

    return res.status(200).json({
      status: "Notificação salva",
      data: create,
    });
  } catch (error) {
    console.error("Error../api/auth/user/: ", error);
    res.status(500).json({ error: JSON.stringify(error) });
  }
});

router.get("/api/notifications/all", isUser, async (req, res) => {
  console.log(
    "notifications/.../req.decodedClaims.user_id",
    req.decodedClaims.user_id
  );
  const uid = req.decodedClaims.user_id;

  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }

  try {
    console.log("listing id: " + uid);

    const notifications = await GetNotifications(uid);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

async function GetNotifications(id) {
  console.log("beep.GetNotifications " + id);
  let notifications = [];
  try {
    let filter = { userId: id };
    let project = {
      userId: 1,
      creatAt: 1,
      color: 1,
      isSeen: 1,
      time: 1,
      subtitle: 1,
      title: 1,
      text: 1,
    };
    notifications = await findDocuments("Notifications", filter, project);

    return notifications;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default router;
