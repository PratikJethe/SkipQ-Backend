import * as admin from 'firebase-admin'

class FirebaseService {
  initializeFirebaseApp() {
    var serviceAccount = require("./book-token-dev-firebase-adminsdk-f0f3s-eb580aed7c.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
}

export const firebaseService = new FirebaseService()