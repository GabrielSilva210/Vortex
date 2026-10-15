import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { iniciarDados } from "./state.js";
import { renderizar, iniciarHome } from "./home.js";
import { iniciarPerfil } from "./perfil.js";
import { iniciarModal } from "./modal.js";

let iniciado = false;

onAuthStateChanged(auth, function (usuario) {
  if (!usuario) {
    location.href = "login.html";
    return;
  }

  if (iniciado) {
    return;
  }
  iniciado = true;

  iniciarPerfil(usuario);
  iniciarModal();
  iniciarHome();
  iniciarDados(usuario.uid, renderizar);
});