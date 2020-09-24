import admin from "firebase-admin";

const { FB_CLIENT_ID, FB_KEY, FB_CLIENT_EMAIL, FB_KEY_ID } = process.env;

admin.initializeApp({
  credential: admin.credential.cert({
    // @ts-ignore
    type: "service_account",
    project_id: "puruvjdev",
    private_key_id: FB_KEY_ID,
    private_key: FB_KEY,
    client_email: FB_CLIENT_EMAIL,
    client_id: FB_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-svz3l%40puruvjdev.iam.gserviceaccount.com",
  }),
  databaseURL: "https://puruvjdev.firebaseio.com",
});

export { admin };
