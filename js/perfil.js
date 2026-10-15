import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const botaoUsuario = document.getElementById("btnUsuario");
const menuUsuario = document.getElementById("menuUsuario");
const botaoTema = document.getElementById("btnTema");
const botaoSair = document.querySelector(".sair");

function alternarMenuUsuario() {
  menuUsuario.classList.toggle("escondido");
}

function trocarTema() {
  document.body.classList.toggle("claro");

  if (document.body.classList.contains("claro")) {
    botaoTema.textContent = "Tema escuro";
  } else {
    botaoTema.textContent = "Tema claro";
  }

  menuUsuario.classList.add("escondido");
}

export function iniciarPerfil(usuario) {
  const nome = usuario.displayName || usuario.email.split("@")[0];

  botaoUsuario.textContent = nome.charAt(0).toUpperCase();
  document.querySelector(".menuNome").textContent = nome;
  document.querySelector(".menuEmail").textContent = usuario.email;

  botaoUsuario.addEventListener("click", alternarMenuUsuario);
  botaoTema.addEventListener("click", trocarTema);

  botaoSair.addEventListener("click", function () {
    signOut(auth).then(function () {
      location.href = "login.html";
    });
  });
}