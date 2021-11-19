import { firebaseService } from "../../services/firebase/firebase.service";
import { mongoConnect } from "../mongodb";

class InitializeBackend {
  async initializeBackend() {
    await mongoConnect();
    firebaseService.initializeFirebaseApp();
  }
}


export const initializeBackend = new InitializeBackend()