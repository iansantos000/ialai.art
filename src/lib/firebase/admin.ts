import "server-only";
import { getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Em produção (App Hosting) usa Application Default Credentials.
// Local: `gcloud auth application-default login` ou GOOGLE_APPLICATION_CREDENTIALS.
const app = getApps().length
  ? getApp()
  : initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
