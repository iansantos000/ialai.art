import axios from "axios";
import express from "express";
import { findOneDocument } from "../../database/mongo.js";

const router = express.Router();

router.get("/api/ceptoaddress/:cep", async function (req, res) {
  // if (req.decodedClaims == undefined) {
  //     return res.status(401).json({ "erro": "ERRO: Autenticação necessária" });
  //   }
  console.log("CEP: ");
  try {
    const cep = req.params.cep;

    if (cep) {
      return await axios
        .get(`http://viacep.com.br/ws/${cep}/json/`)
        .then(async (response) => {
          return res.status(200).json(response.data);
        })
        .catch((error) => {
          return res.status(500).json({ erro: error });
        });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

export const GetIntegrations = async function (uid) {
  console.log("GetIntegrations...1", uid);
  try {
    const integration = await findOneDocument("Integrations", {
      userUid: uid,
    });

    console.log("GetIntegrations...", integration, typeof integration);
    return integration;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function GetAutomationsByPostId(postId) {
  try {
    const automations = await findOneDocument("Automations", {
      postId: postId,
    });

    console.log("GetAutomationsByPostId...", automations, typeof automations);
    return automations;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function geraCodigo() {
  try {
    const codigos = mongoClient.getCollection("geracao_codigos");
    const filter = { _id: "users" };
    const update = { $inc: { numero_atual: 1 } };
    const options = { returnDocument: "after" };

    const result = await codigos.findOneAndUpdate(filter, update, options);

    if (result && result.value) {
      const contador_codigo = result.value.numero_atual;
      return contador_codigo;
    } else {
      return 0;
    }
  } catch (error) {
    return -1;
  }
}

export default router;
