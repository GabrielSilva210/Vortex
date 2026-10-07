const botaoUsuario = document.getElementById("btnUsuario");
const menuUsuario = document.getElementById("menuUsuario");
const botaoTema = document.getElementById("btnTema");

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

function iniciarPerfil() {
  botaoUsuario.addEventListener("click", alternarMenuUsuario);
  botaoTema.addEventListener("click", trocarTema);
}