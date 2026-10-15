import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const nome = document.getElementById("cadNome");
const email = document.getElementById("cadEmail");
const senha = document.getElementById("cadSenha");
const confirmar = document.getElementById("cadConfirmar");
const erro = document.getElementById("cadErro");
const botao = document.getElementById("btnCadastrar");

const mensagens = {
  "auth/email-already-in-use": "Este e-mail já está cadastrado.",
  "auth/invalid-email": "E-mail inválido.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "auth/operation-not-allowed": "Login por e-mail/senha não está ativado no Firebase.",
  "auth/network-request-failed": "Sem conexão com o Firebase."
};

botao.addEventListener("click", function () {
  erro.textContent = "";

  const nomeValor = nome.value.trim();
  const emailValor = email.value.trim();

  if (nomeValor === "" || emailValor === "" || senha.value === "") {
    erro.textContent = "Preencha todos os campos.";
    return;
  }

  if (senha.value !== confirmar.value) {
    erro.textContent = "As senhas não são iguais.";
    return;
  }

  botao.disabled = true;

  createUserWithEmailAndPassword(auth, emailValor, senha.value)
    .then(function (credencial) {
      return updateProfile(credencial.user, { displayName: nomeValor });
    })
    .then(function () {
      location.href = "index.html";
    })
    .catch(function (e) {
      botao.disabled = false;
      erro.textContent = mensagens[e.code] || "Erro: " + e.code;
    });
});