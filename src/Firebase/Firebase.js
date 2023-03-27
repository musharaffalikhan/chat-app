import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


const config = {
  apiKey: "AIzaSyD8BBHKDJbzMlT2_pj7LnzzNPibIwU16fU",
  authDomain: "chat-web-app-fccba.firebaseapp.com",
  databaseURL: "https://chat-web-app-fccba-default-rtdb.firebaseio.com",
  projectId: "chat-web-app-fccba",
  storageBucket: "chat-web-app-fccba.appspot.com",
  messagingSenderId: "711775084307",
  appId: "1:711775084307:web:cdcc4ea0822ed583b744e6",
};

const app = initializeApp(config);
export const auth = getAuth(app);
export const dataBase = getDatabase(app);
export const storage = getStorage(app);
