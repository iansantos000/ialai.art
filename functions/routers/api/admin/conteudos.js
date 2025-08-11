import express from "express";
import { ObjectId } from "mongodb";
import { findOneDocument } from "../../../database/mongo.js";

const router = express.Router();

router.get("/api/admin/conteudo/:id", async function (req, res) {
  try {
    const id = req.params.id;

    console.log("Conteudo. id", id);

    const filter = { _id: new ObjectId(id) };
    const conteudo = await findOneDocument("Conteudos", filter);

    if (!conteudo) {
      return res.status(404).json({ error: "CONTEUDO não encontrado" });
    }

    res.json(conteudo);
  } catch (error) {
    console.error(`erro admin/CONTEUDO: ${error}`);
    res.status(500).json({ error: error });
  }
});

// router.get("/api/admin/conteudos", isAdmin, async function (req, res) {
//   console.log(`/api/admin/conteudos:...`);
//   try {
//     const collectionStorage = mongoClient.getCollection("conteudos");
//     let faqsGet = await collectionStorage.find({});
//     let conteudos = await faqsGet.toArray();
//     res.status(200).json(conteudos);
//   } catch (error) {
//     console.log(`Erro ao localizar CONTEUDO: ${error}`);
//     res.status(500).send(`Erro ao localizar os CONTEUDO: ${error}`);
//     return;
//   }
// });

// router.put("/api/admin/conteudo/:id", isAdmin, async function (req, res, next) {
//   console.log("PUT./api/admin/conteudo/:id: ", req.params.id);
//   try {
//     const id = req.params.id;
//     const dataConteudo = JSON.parse(req.body.dados);

//     console.log("dataConteudo: ", dataConteudo);

//     if (req.decodedClaims == undefined) {
//       return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
//     }

//     // console.log(`updatedData: ${JSON.stringify(updatedData)}`);
//     const collection = mongoClient.getCollection("conteudos");

//     const update = { $set: dataConteudo };
//     console.log("dataConteudo,id: ", id);
//     const filter = { _id: ObjectId(id) };
//     const options = { upsert: true };
//     const result = await collection.updateOne(filter, update, options);
//     //console.log(`modified n: ${result.modifiedCount}`);

//     let msg =
//       result.modifiedCount === 1
//         ? `CONTEUDO atualizado com sucesso. id: ${id}`
//         : `Nenhuma alteração efetuada. CONTEUDO.id: ${id}`;
//     console.log(msg);

//     return res.status(200).json({ msg });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error });
//   }
// });

export default router;
