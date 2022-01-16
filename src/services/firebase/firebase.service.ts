import * as admin from 'firebase-admin'

class FirebaseService {
  initializeFirebaseApp() {
    var serviceAccount = require("../../../firebase-admin-config.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
}

export const firebaseService = new FirebaseService()