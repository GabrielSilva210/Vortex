import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyAhV-GTdJ1XXVsASaheRoSl7AfFjjZ2QVk",
  authDomain: "vortex-ca9eb.firebaseapp.com",
  projectId: "vortex-ca9eb",
  appId: "1:516201876782:web:ee3086eb3ead3c6c103ebf"
});

export const auth = getAuth(app);
export const db = getFirestore(app);