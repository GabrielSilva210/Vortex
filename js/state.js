const CHAVE_STORAGE = "tarefas-v2";

const prioridades = {
  baixa: { texto: "Baixa", icone: "❄️" },
  media: { texto: "Média", icone: "⚠️" },
  alta: { texto: "Alta", icone: "⚡" },
  urgente: { texto: "Urgente", icone: "🔥" }
};

const tarefasPadrao = [
  { id: 1, titulo: "Implementar retry na API de pagamentos", descricao: "Adicionar mecanismo de retry para falhas temporárias", coluna: "aberto", prioridade: "baixa", anexo: null },
  { id: 2, titulo: "Corrigir memory leak no dashboard", descricao: "Investigar aumento de consumo de memória no dashboard", coluna: "aberto", prioridade: "media", anexo: null },
  { id: 3, titulo: "Corrigir timezone", descricao: "Padronizar tratamento de datas entre frontend e backend", coluna: "aberto", prioridade: "urgente", anexo: null },
  { id: 4, titulo: "Otimizar consulta de pedidos", descricao: "Investigar lentidão no carregamento de pedidos", coluna: "andamento", prioridade: "urgente", anexo: null },
  { id: 5, titulo: "Refatorar serviço de autenticação", descricao: "Separar responsabilidades do módulo de autenticação", coluna: "andamento", prioridade: "alta", anexo: null },
  { id: 6, titulo: "Processamento de pedidos duplicados", descricao: "Corrigir inconsistência de estoque em compras simultâneas", coluna: "concluido", prioridade: "urgente", anexo: null },
  { id: 7, titulo: "Lentidão na listagem", descricao: "Otimizar carregamento da lista de produtos", coluna: "concluido", prioridade: "media", anexo: null }
];

function carregarTarefas() {
  try {
    const salvas = localStorage.getItem(CHAVE_STORAGE);
    if (salvas) {
      return JSON.parse(salvas);
    }
  } catch (erro) {
    console.error("Erro ao ler as tarefas salvas:", erro);
  }
  return tarefasPadrao;
}

let tarefas = carregarTarefas();
let tarefaAtual = null; 
let anexoTemp = null;  

function salvar() {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas));
  } catch (erro) {
    alert("Não foi possível salvar. O armazenamento está cheio, tente um anexo menor.");
  }
}

function procurarTarefa(id) {
  return tarefas.find(function (tarefa) {
    return tarefa.id === id;
  }) || null;
}

function montarEtiqueta(elemento, prioridade) {
  elemento.className = "etiqueta " + prioridade;
  elemento.textContent = prioridades[prioridade].icone + " " + prioridades[prioridade].texto;
}