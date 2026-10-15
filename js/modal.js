import { estado, salvarTarefa, excluirTarefaDb, montarEtiqueta } from "./state.js";

const modal = document.getElementById("modal");
const botaoFechar = document.getElementById("btnFechar");
const botaoLapis = document.getElementById("btnEdit");

const modoVer = document.getElementById("modoVer");
const verTitulo = document.getElementById("verTitulo");
const verPrioridade = document.getElementById("verPrioridade");
const verDescricao = document.getElementById("verDescricao");
const verAnexo = document.getElementById("verAnexo");
const verColuna = document.getElementById("verColuna");
const botaoExcluir = document.getElementById("btnExcluir");

const modoEditar = document.getElementById("modoEditar");
const editarJanela = document.getElementById("editarJanela");
const inputTitulo = document.getElementById("inputTitulo");
const inputDescricao = document.getElementById("inputDescricao");
const inputPrioridade = document.getElementById("inputPrioridade");
const areaUpload = document.getElementById("areaUpload");
const inputArquivo = document.getElementById("arquivo");
const nomeArquivo = document.getElementById("nomeArquivo");
const removerUpload = document.getElementById("removerUpload");
const botaoRemoverAnexo = document.getElementById("btnRemoverAnexo");
const botaoCancelar = document.getElementById("btnCancelar");
const botaoSalvar = document.getElementById("btnSalvar");

// o Firestore limita cada documento a ~1 MiB e o anexo vira texto base64 (+33%),
// então 700 KB de arquivo é o máximo seguro
const TAMANHO_MAXIMO = 700000;

export function abrirVer(tarefa) {
  estado.tarefaAtual = tarefa;

  verTitulo.textContent = tarefa.titulo;
  verDescricao.textContent = tarefa.descricao;
  verColuna.value = tarefa.coluna;
  montarEtiqueta(verPrioridade, tarefa.prioridade);

  verAnexo.innerHTML = "";
  if (tarefa.anexo) {
    if (tarefa.anexo.tipo.indexOf("image/") === 0) {
      const imagem = document.createElement("img");
      imagem.src = tarefa.anexo.dados;
      imagem.className = "anexoImagem";
      verAnexo.appendChild(imagem);
    }
    const link = document.createElement("a");
    link.href = tarefa.anexo.dados;
    link.download = tarefa.anexo.nome;
    link.textContent = "📎 " + tarefa.anexo.nome;
    link.className = "anexoLink";
    verAnexo.appendChild(link);
  }

  modoVer.classList.remove("escondido");
  modoEditar.classList.add("escondido");
  botaoLapis.classList.remove("escondido");
  modal.classList.remove("escondido");
}

function mudarColuna() {
  const atualizada = { ...estado.tarefaAtual, coluna: verColuna.value };
  estado.tarefaAtual = atualizada;
  salvarTarefa(atualizada);
}

function excluirTarefa() {
  excluirTarefaDb(estado.tarefaAtual.id);
  fecharModal();
}

function atualizarAreaAnexo() {
  if (estado.anexoTemp) {
    nomeArquivo.textContent = "Arquivo: " + estado.anexoTemp.nome;
    removerUpload.style.display = "block";
  } else {
    nomeArquivo.textContent = "";
    removerUpload.style.display = "none";
  }
}

export function abrirEditar(tarefa) {
  estado.tarefaAtual = tarefa;
  inputArquivo.value = "";

  if (tarefa === null) {
    editarJanela.textContent = "Nova tarefa";
    inputTitulo.value = "";
    inputDescricao.value = "";
    inputPrioridade.value = "baixa";
    estado.anexoTemp = null;
  } else {
    editarJanela.textContent = "Editar tarefa";
    inputTitulo.value = tarefa.titulo;
    inputDescricao.value = tarefa.descricao;
    inputPrioridade.value = tarefa.prioridade;
    estado.anexoTemp = tarefa.anexo;
  }

  atualizarAreaAnexo();

  modoVer.classList.add("escondido");
  modoEditar.classList.remove("escondido");
  botaoLapis.classList.add("escondido");
  modal.classList.remove("escondido");
  inputTitulo.focus();
}

function fecharModal() {
  modal.classList.add("escondido");
  estado.tarefaAtual = null;
}

function salvarEdicao() {
  const titulo = inputTitulo.value.trim();

  if (titulo === "") {
    alert("Digite um título para a tarefa.");
    return;
  }

  if (estado.tarefaAtual === null) {
    salvarTarefa({
      id: Date.now(),
      titulo: titulo,
      descricao: inputDescricao.value.trim(),
      coluna: "aberto",
      prioridade: inputPrioridade.value,
      anexo: estado.anexoTemp
    });
    fecharModal();
  } else {
    const atualizada = {
      ...estado.tarefaAtual,
      titulo: titulo,
      descricao: inputDescricao.value.trim(),
      prioridade: inputPrioridade.value,
      anexo: estado.anexoTemp
    };
    salvarTarefa(atualizada);
    abrirVer(atualizada);
  }
}

function cancelarEdicao() {
  if (estado.tarefaAtual === null) {
    fecharModal();
  } else {
    abrirVer(estado.tarefaAtual);
  }
}

function escolherArquivo() {
  const arquivo = inputArquivo.files[0];

  if (!arquivo) {
    return;
  }

  if (arquivo.size > TAMANHO_MAXIMO) {
    alert("Arquivo muito grande. Escolha um arquivo de até 700 KB.");
    inputArquivo.value = "";
    return;
  }

  const leitor = new FileReader();

  leitor.onload = function () {
    estado.anexoTemp = { nome: arquivo.name, tipo: arquivo.type, dados: leitor.result };
    atualizarAreaAnexo();
  };

  leitor.onerror = function () {
    alert("Não foi possível ler o arquivo.");
  };

  leitor.readAsDataURL(arquivo);
}

function removerAnexo() {
  estado.anexoTemp = null;
  inputArquivo.value = "";
  atualizarAreaAnexo();
}

export function iniciarModal() {
  botaoLapis.addEventListener("click", function () {
    abrirEditar(estado.tarefaAtual);
  });

  botaoSalvar.addEventListener("click", salvarEdicao);
  botaoCancelar.addEventListener("click", cancelarEdicao);
  botaoFechar.addEventListener("click", fecharModal);
  botaoExcluir.addEventListener("click", excluirTarefa);
  verColuna.addEventListener("change", mudarColuna);

  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) {
      fecharModal();
    }
  });

  areaUpload.addEventListener("click", function () {
    inputArquivo.click();
  });
  inputArquivo.addEventListener("change", escolherArquivo);
  botaoRemoverAnexo.addEventListener("click", removerAnexo);
}