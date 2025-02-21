import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCXxhezW8LFWM8s78g5uwzcxS6B1MW12vg",
  authDomain: "task-manager-dedd7.firebaseapp.com",
  projectId: "task-manager-dedd7",
  storageBucket: "task-manager-dedd7.firebasestorage.app",
  messagingSenderId: "1096003664802",
  appId: "1:1096003664802:web:477ff86ccfdbd1cc4dd0fb"
};

export const app = initializeApp(firebaseConfig);