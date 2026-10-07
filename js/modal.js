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

const TAMANHO_MAXIMO = 1000000; 

function abrirVer(tarefa) {
  tarefaAtual = tarefa;

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
  tarefaAtual.coluna = verColuna.value;
  salvar();
  renderizar();
}

function excluirTarefa() {
  tarefas = tarefas.filter(function (tarefa) {
    return tarefa.id !== tarefaAtual.id;
  });

  salvar();
  renderizar();
  fecharModal();
}

function atualizarAreaAnexo() {
  if (anexoTemp) {
    nomeArquivo.textContent = "Arquivo: " + anexoTemp.nome;
    removerUpload.style.display = "block";
  } else {
    nomeArquivo.textContent = "";
    removerUpload.style.display = "none";
  }
}

function abrirEditar(tarefa) {
  tarefaAtual = tarefa;
  inputArquivo.value = "";

  if (tarefa === null) {
    editarJanela.textContent = "Nova tarefa";
    inputTitulo.value = "";
    inputDescricao.value = "";
    inputPrioridade.value = "baixa";
    anexoTemp = null;
  } else {
    editarJanela.textContent = "Editar tarefa";
    inputTitulo.value = tarefa.titulo;
    inputDescricao.value = tarefa.descricao;
    inputPrioridade.value = tarefa.prioridade;
    anexoTemp = tarefa.anexo;
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
  tarefaAtual = null;
}

function salvarEdicao() {
  const titulo = inputTitulo.value.trim();

  if (titulo === "") {
    alert("Digite um título para a tarefa.");
    return;
  }

  if (tarefaAtual === null) {
    tarefas.push({
      id: Date.now(),
      titulo: titulo,
      descricao: inputDescricao.value.trim(),
      coluna: "aberto",
      prioridade: inputPrioridade.value,
      anexo: anexoTemp
    });
    salvar();
    renderizar();
    fecharModal();
  } else {
    tarefaAtual.titulo = titulo;
    tarefaAtual.descricao = inputDescricao.value.trim();
    tarefaAtual.prioridade = inputPrioridade.value;
    tarefaAtual.anexo = anexoTemp;
    salvar();
    renderizar();
    abrirVer(tarefaAtual);
  }
}

function cancelarEdicao() {
  if (tarefaAtual === null) {
    fecharModal();
  } else {
    abrirVer(tarefaAtual);
  }
}

function escolherArquivo() {
  const arquivo = inputArquivo.files[0];

  if (!arquivo) {
    return;
  }

  if (arquivo.size > TAMANHO_MAXIMO) {
    alert("Arquivo muito grande. Escolha um arquivo de até 1 MB.");
    inputArquivo.value = "";
    return;
  }

  const leitor = new FileReader();

  leitor.onload = function () {
    anexoTemp = { nome: arquivo.name, tipo: arquivo.type, dados: leitor.result };
    atualizarAreaAnexo();
  };

  leitor.onerror = function () {
    alert("Não foi possível ler o arquivo.");
  };

  leitor.readAsDataURL(arquivo);
}

function removerAnexo() {
  anexoTemp = null;
  inputArquivo.value = "";
  atualizarAreaAnexo();
}

function iniciarModal() {
  botaoLapis.addEventListener("click", function () {
    abrirEditar(tarefaAtual);
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