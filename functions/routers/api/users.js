import express from "express";
import { findOneDocument, updateOneDocuments } from "../../database/mongo.js";
import { isUser } from "../../middlewares/checkcookie.js";

const router = express.Router();

router.get("/api/user", isUser, async function (req, res) {
  try {
    console.log("user beep beep", req.decodedClaims.uid);
    let uid = req.decodedClaims.uid;
    const filter = { _id: uid };
    const user = await findOneDocument("Users", filter);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: JSON.stringify(error) });
  }
});

//Update this
router.post("/api/user", isUser, async function (req, res) {
  try {
    let data = req.body;
    let uid = req.decodedClaims.uid;

    const filter = { _id: uid };
    const current = await findOneDocument("Users", filter);

    if (current.email == undefined) {
      data.email = req.decodedClaims.email;
    }

    // const filter = { _id: new ObjectId(uid) };
    // const filter = { _id: automationId };

    // const update = {
    //   $set: {
    //     status: newStatus,
    //   },
    // };
    const update = {
      $set: data,
    };
    console.log("userData.update: ", update);
    const options = { upsert: true };

    const result = await updateOneDocuments("Users", filter, update, options);

    // const filter = { _id: uid };
    // const options = { upsert: true };
    // const result = await usersCollection.updateOne(filter, update, options);

    // let user = await usersCollection.findOne({ _id: uid });

    console.log("userData.result: ", result);
    return result.modifiedCount === 1
      ? res.status(200).json({ msg: "Dados atualizados com sucesso." })
      : res.status(201).json({ msg: "Falha ao atualizar os dados." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API
router.get("/api/user/cards/list", isUser, async function (req, res) {
  // console.log('/api/user/cards');
  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }
  try {
    const uid = req.decodedClaims.user_id;
    const filter = { _id: uid };
    const user = await findOneDocument("Users", filter);
    //   console.log(`user: ${JSON.stringify(user)}`);
    //   console.log(`user.cards: ${JSON.stringify(user.cards)}`);
    const cards = user.cards.length > 0 ? user.cards : [];
    //   console.log(`cards: ${JSON.stringify(cards)}`);
    return res.status(200).json(cards);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.get("/api/user/addresses/list", isUser, async function (req, res) {
  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }
  try {
    const uid = req.decodedClaims.user_id;
    const filter = { _id: uid };
    const user = await findOneDocument("Users", filter);
    // console.log(`user: ${JSON.stringify(user)}`);
    const homeAddress = user.homeAddress != undefined ? user.homeAddress : {};
    const billingAddress =
      user.billingAddress != undefined ? user.billingAddress : [];

    const addresses = {
      home: homeAddress,
      billing: billingAddress,
    };
    console.log(`addresses: ${JSON.stringify(addresses)}`);
    res.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" + error });
  }
});

router.put("/api/user/adresses/add", isUser, async function (req, res) {
  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }

  try {
    const uid = req.decodedClaims.user_id;
    const newAddress = req.body.billingAddress;
    // const index = req.body.index;
    const filter = { _id: uid };
    const user = await findOneDocument("Users", filter);
    const billingAddresses =
      user.billingAddress != undefined ? user.billingAddress : [];

    if (billingAddresses.length > 1) {
      return res.status(201).json({
        msg: "Máximo de 2 endereços de cobrança. Por favor, remova um endereço antes de adicionar outro.",
      });
    }
    let thereAreAddresses =
      Array.isArray(billingAddresses) && billingAddresses.length > 0;
    if (!thereAreAddresses) {
      let updatedData = [newAddress];

      const update = {
        $set: { billingAddress: updatedData },
      };
      const options = { upsert: true };
      const result = await updateOneDocuments("Users", filter, update, options);

      // const result = await mongoClient.updateOne(
      //   "users",
      //   { _id: id },
      //   { $set: { billingAddress: updatedData } }
      // );
      return result.modifiedCount === 1
        ? res.status(200).json({ msg: "Endereço adicionado." })
        : res.status(201).json({ msg: "Falha ao gravar novo endereço." });
    } else if (billingAddresses.length > 1) {
      return res.status(201).json({
        msg: "Máximo de 2 endereços de cobrança. Por favor, remova um endereço antes de adicionar outro.",
      });
    } else {
      let addressExists = billingAddresses.some(
        (existingAdressess) =>
          JSON.stringify(existingAdressess) === JSON.stringify(newAddress)
      );

      if (!addressExists) {
        let updatedData = billingAddresses.concat(newAddress);
        const update = {
          $set: { billingAddress: updatedData },
        };
        const options = { upsert: true };
        const result = await updateOneDocuments(
          "Users",
          filter,
          update,
          options
        );

        return result.modifiedCount === 1
          ? res.status(200).json({ msg: "Endereço adicionado." })
          : res.status(201).json({ msg: "Falha ao gravar novo endereço." });
      } else {
        return res.status(201).json({ msg: "Endereço já existente." });
      }
    }

    return;
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" + error });
  }
});

router.delete("/api/user/card/:position", isUser, async function (req, res) {
  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }
  try {
    const id = req.decodedClaims.user_id;
    const position = req.params.position;
    const user = await mongoClient.findOne("users", { _id: id });

    user.cards.splice(position, 1);

    const result = await mongoClient.updateOne(
      "users",
      { _id: id },
      { $set: { cards: user.cards } }
    );
    if (result.modifiedCount === 1) {
      return res.status(200).json({ msg: "Cartão removido com sucesso" });
    } else {
      return res.status(201).json({ msg: "Nenhum cartão removido" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erro ao remover cartão." });
  }
});

router.delete("/api/user/address/:position", isUser, async function (req, res) {
  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }
  try {
    const id = req.decodedClaims.user_id;
    const position = req.params.position;
    const user = await mongoClient.findOne("users", { _id: id });
    user.billingAddress.splice(position, 1);
    const result = await mongoClient.updateOne(
      "users",
      { _id: id },
      { $set: { billingAddress: user.billingAddress } }
    );
    if (result.modifiedCount === 1) {
      return res.status(200).json({ msg: "Endereço removido com sucesso" });
    } else {
      return res.status(201).json({ msg: "Nenhum endereço removido" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erro ao remover endereço." });
  }
});

export default router;
