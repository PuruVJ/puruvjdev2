import admin from "firebase-admin";

const serviceAccount = require("./fb-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://puruvjdev.firebaseio.com",
});

export { admin };
