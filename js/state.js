import { db } from "./firebase.js";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const prioridades = {
  baixa: { texto: "Baixa", icone: "❄️" },
  media: { texto: "Média", icone: "⚠️" },
  alta: { texto: "Alta", icone: "⚡" },
  urgente: { texto: "Urgente", icone: "🔥" }
};

export const estado = {
  tarefas: [],
  tarefaAtual: null,
  anexoTemp: null
};

let colecao = null;

export function iniciarDados(uid, aoMudar) {
  colecao = collection(db, "users", uid, "tarefas");

  return onSnapshot(
    colecao,
    function (snapshot) {
      estado.tarefas = snapshot.docs.map(function (d) {
        return d.data();
      });
      aoMudar();
    },
    function (erro) {
      console.error("Erro ao ler tarefas:", erro);
      alert("Não foi possível carregar as tarefas: " + erro.code);
    }
  );
}

export function salvarTarefa(tarefa) {
  return setDoc(doc(colecao, String(tarefa.id)), tarefa).catch(function (erro) {
    console.error("Erro ao salvar:", erro);
    alert("Não foi possível salvar: " + erro.code);
  });
}

export function excluirTarefaDb(id) {
  return deleteDoc(doc(colecao, String(id))).catch(function (erro) {
    console.error("Erro ao excluir:", erro);
    alert("Não foi possível excluir: " + erro.code);
  });
}

export function procurarTarefa(id) {
  return estado.tarefas.find(function (tarefa) {
    return tarefa.id === id;
  }) || null;
}

export function montarEtiqueta(elemento, prioridade) {
  elemento.className = "etiqueta " + prioridade;
  elemento.textContent = prioridades[prioridade].icone + " " + prioridades[prioridade].texto;
}