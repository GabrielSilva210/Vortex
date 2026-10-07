import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const email = document.getElementById("loginEmail");
const senha = document.getElementById("loginSenha");
const erro = document.getElementById("loginErro");

onAuthStateChanged(auth, function (usuario) {
  if (usuario) location.href = "index.html";
});

document.getElementById("btnEntrar").addEventListener("click", function () {
  erro.textContent = "";
  signInWithEmailAndPassword(auth, email.value.trim(), senha.value).catch(function (e) {
    const mensagens = {
      "auth/invalid-credential": "E-mail ou senha incorretos.",
      "auth/invalid-email": "E-mail inválido."
    };
    erro.textContent = mensagens[e.code] || "Erro: " + e.code;
  });
});