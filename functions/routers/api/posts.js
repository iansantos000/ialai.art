import axios from "axios";
import express from "express";
import { findOneDocument } from "../../database/mongo.js";
import { isUser } from "../../middlewares/checkcookie.js";
import tokens from "../../utils/tokens.js";

const router = express.Router();

router.get("/api/posts/all", isUser, async (req, res) => {
  console.log("posts/all");
  if (req.decodedClaims == undefined) {
    return res.status(401).json({ erro: "ERRO: Autenticação necessária" });
  }
  const uid = req.decodedClaims.user_id;
  try {
    const posts = await getProfilePosts(uid);
    res.status(200).json(posts.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export const getProfilePosts = async (uid) => {
  try {
    const filter = { userUid: uid };
    const profile = await findOneDocument("Integrations", filter);

    const posts = await axios.get(
      `${tokens.INSTAGRAM_BASE_URL}/me/media?fields=id,caption,media_url,media_type,timestamp&limit=10&access_token=${profile.token}`
    );
    if (posts) return { status: 200, data: posts.data };
    console.log("🔴 Error in getting posts");
    return { status: 404 };
  } catch (error) {
    console.log("🔴 server side Error in getting posts ", error);
    return { status: 500 };
  }
};

export default router;
