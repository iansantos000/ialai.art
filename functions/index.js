/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require("firebase-functions/v2/https")
// const logger = require("firebase-functions/logger")

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// LINK - new Imports
import bodyParser from "body-parser";
import express from "express";
import fileParser from "express-multipart-file-parser";
import functions from "firebase-functions";
// import { connectToMongoDB } from "./utils/mongo.js";

const api = express();
api.use(bodyParser.json()); // Parse JSON bodies
api.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
api.use(fileParser);

initializeDatabase();

import auth from "./routers/api/auth.js";
api.use(auth);

import users from "./routers/api/users.js";
api.use(users);

import integrations from "./routers/api/integrations.js";
api.use(integrations);

import automations from "./routers/api/automations.js";
api.use(automations);

import webhookInstagram from "./routers/api/webhooks/instagram.js";
api.use(webhookInstagram);

import posts from "./routers/api/posts.js";
api.use(posts);

import notifications from "./routers/api/notifications.js";
api.use(notifications);

import uteis from "./routers/api/uteis.js";
api.use(uteis);

//!SECTION ADMIN
import conteudos from "./routers/api/admin/conteudos.js";
api.use(conteudos);

//NOTE - Functions...
async function initializeDatabase() {
  try {
    // console.error("connectToMongoDB...:");
    // await connectToMongoDB();
  } catch (error) {
    console.error(
      "Error during functions app initialization: initializeDatabase:",
      error
    );
    process.exit(1);
  }
}
// export default app = functions
//     .runWith({ timeoutSeconds: 540, memory: "4GB" })
//     .https.onRequest(app)

export const app = functions.https.onRequest(api);
