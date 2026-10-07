const botaoAdd = document.getElementById("btnAdd");
const COLUNAS = ["aberto", "andamento", "concluido"];

let idArrastando = null;

function criarCard(tarefa) {
  const card = document.createElement("div");
  card.className = "card " + tarefa.prioridade;
  card.dataset.id = tarefa.id;

  const topo = document.createElement("div");
  topo.className = "cardTopo";
  const titulo = document.createElement("h3");
  titulo.textContent = tarefa.titulo;
  topo.appendChild(titulo);

  const base = document.createElement("div");
  base.className = "cardBase";
  const descricao = document.createElement("p");
  descricao.textContent = tarefa.descricao;
  base.appendChild(descricao);

  const rodape = document.createElement("div");
  rodape.className = "cardRodape";

  if (tarefa.anexo) {
    const clipe = document.createElement("span");
    clipe.className = "clipe";
    clipe.textContent = "1 📎";
    rodape.appendChild(clipe);
  }

  const etiqueta = document.createElement("span");
  montarEtiqueta(etiqueta, tarefa.prioridade);
  rodape.appendChild(etiqueta);
  base.appendChild(rodape);

  card.appendChild(topo);
  card.appendChild(base);

  card.addEventListener("click", cliqueNoCard);
  card.setAttribute("draggable", "true");
  card.addEventListener("dragstart", comecouArrastar);
  card.addEventListener("dragend", terminouArrastar);

  return card;
}

function renderizar() {
  COLUNAS.forEach(function (id) {
    document.getElementById(id).innerHTML = "";
  });

  tarefas.forEach(function (tarefa) {
    document.getElementById(tarefa.coluna).appendChild(criarCard(tarefa));
  });
}

function cliqueNoCard(evento) {
  const id = Number(evento.currentTarget.dataset.id);
  abrirVer(procurarTarefa(id));
}

function comecouArrastar(evento) {
  const card = evento.currentTarget;
  idArrastando = Number(card.dataset.id);

  // pro firefox aceitar
  evento.dataTransfer.setData("text/plain", idArrastando);

  setTimeout(function () {
    card.classList.add("arrastando");
  }, 0);
}

function terminouArrastar(evento) {
  evento.currentTarget.classList.remove("arrastando");
  idArrastando = null;

  document.querySelectorAll(".lista").forEach(function (lista) {
    lista.classList.remove("sobre");
  });
}

function soltouNaLista(evento) {
  evento.preventDefault();

  const lista = evento.currentTarget;
  lista.classList.remove("sobre");

  if (idArrastando === null) {
    return;
  }

  const idSolto = idArrastando;
  const tarefa = procurarTarefa(idSolto);
  tarefa.coluna = lista.id;

  salvar();
  renderizar();

  const cardSolto = document.querySelector('.card[data-id="' + idSolto + '"]');
  if (cardSolto) {
    cardSolto.classList.add("solto");
  }
}

function iniciarHome() {
  botaoAdd.addEventListener("click", function () {
    abrirEditar(null);
  });

  document.querySelectorAll(".lista").forEach(function (lista) {
    lista.addEventListener("dragover", function (evento) {
      evento.preventDefault();
      evento.currentTarget.classList.add("sobre");
    });

    lista.addEventListener("dragleave", function (evento) {
      if (!evento.currentTarget.contains(evento.relatedTarget)) {
        evento.currentTarget.classList.remove("sobre");
      }
    });

    lista.addEventListener("drop", soltouNaLista);
  });
}