import express from "express";
// import { ObjectId } from 'mongodb'
import { ObjectId } from "mongodb";

import {
  findDocuments,
  findOneDocument,
  insertOneDocument,
  updateOneDocuments,
} from "../../database/mongo.js";
import { isUser } from "../../middlewares/checkcookie.js";

const router = express.Router();

//NOTE - Cria automação !
router.post("/api/automation/", isUser, async function (req, res, next) {
  const uid = req.decodedClaims.user_id;

  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }

  const today = new Date();
  let data = JSON.parse(req.body.dados);
  data.creatAt = today;
  data.userUid = uid;
  data.status = false;
  try {
    const create = await insertOneDocument("Automations", data);

    return res.status(200).json({
      status: "Automação salva",
      data: create,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//NOTE - Altera status da automaçao -> Ativo // Inativo
router.post(
  "/api/automation/status/:automation/:status",
  isUser,
  async function (req, res, next) {
    if (req.decodedClaims == undefined) {
      return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
    }

    try {
      const automationId = req.params.automation;
      const status = req.params.status;
      const newStatus = status === "true" ? true : false;
      console.log(
        "automation.status: ",
        typeof status,
        typeof newStatus,
        newStatus,
        automationId
      );
      const filter = { _id: new ObjectId(automationId) };
      // const filter = { _id: automationId };

      const update = {
        $set: {
          status: newStatus,
        },
      };
      console.log("automation.update: ", update);
      const options = { upsert: true };

      const result = await updateOneDocuments(
        "Automations",
        filter,
        update,
        options
      );
      console.log("automationsStatus.result: ", result);
      return result.modifiedCount === 1
        ? res.status(200).json({ msg: "Status da automação atualizada." })
        : res.status(201).json({ msg: "Falha ao salvar status da automação." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/api/automations/all", isUser, async (req, res) => {
  console.log(
    "automations/.../req.decodedClaims.user_id",
    req.decodedClaims.user_id
  );
  const uid = req.decodedClaims.user_id;

  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }

  try {
    console.log("listing id: " + uid);

    const automations = await GetAutomations(uid);
    res.status(200).json(automations);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/api/automations/:id", isUser, async (req, res) => {
  console.log(
    "automations/.../req.decodedClaims.user_id",
    req.decodedClaims.user_id
  );

  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }

  const idautomationId = req.params.id;
  try {
    console.log("listing id: " + idautomationId);
    const filter = { _id: idautomationId };
    const automations = await findOneDocument("Automations", filter);
    res.status(200).json(automations);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export async function GetAutomations(id) {
  console.log("beep.GetAutomations " + id);
  let automations = [];
  try {
    let filter = { userUid: id };
    let project = {
      _id: 1,
      name: 1,
      category: 1,
      postImgUrl: 1,
      creatAt: 1,
      status: 1,
      keyWords: 1,
      resDm: 1,
      resComment: 1,
    };
    automations = await findDocuments("Automations", filter, project);

    return automations;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default router;
