const form = document.getElementById('cadastro-form');
const tipoCadastro = document.getElementById('tipoCadastro');
const dadosClinica = document.getElementById('dadosClinica');
const dadosResponsavel = document.getElementById('dadosResponsavel');
const erros = document.getElementById('erros');
const confirmacao = document.getElementById('confirmacao');
const listaCadastros = document.getElementById('listaCadastros');
const notificacoes = document.getElementById('notificacoes');

const filtros = {
  tipo: document.getElementById('filtroTipo'),
  cidade: document.getElementById('filtroCidade'),
  especialidade: document.getElementById('filtroEspecialidade'),
  data: document.getElementById('filtroData')
};

function carregarCadastros() {
  return JSON.parse(localStorage.getItem('cadastros') || '[]');
}

function salvarCadastros(cadastros) {
  localStorage.setItem('cadastros', JSON.stringify(cadastros));
}

function validarCPF(cpf) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf.trim());
}

function validarCNPJ(cnpj) {
  return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj.trim());
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setClinicaFieldsRequired(ativo) {
  ['nomeResponsavel', 'cargoResponsavel', 'razaoSocial', 'nomeFantasia', 'cnpj', 'dataAbertura', 'regimeTributario', 'numeroFuncionarios', 'faturamentoMensal']
    .forEach((nome) => {
      const campo = form.elements[nome];
      if (!campo) return;
      campo.required = ativo;
    });
}

tipoCadastro.addEventListener('change', () => {
  const isClinica = tipoCadastro.value === 'clinica';
  dadosClinica.classList.toggle('hidden', !isClinica);
  dadosResponsavel.classList.toggle('hidden', !isClinica);
  setClinicaFieldsRequired(isClinica);
});

function formatDate(isoDate) {
  if (!isoDate) return '-';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

function renderCadastros() {
  const cadastros = carregarCadastros();
  const tipo = filtros.tipo.value;
  const cidade = filtros.cidade.value.trim().toLowerCase();
  const especialidade = filtros.especialidade.value.trim().toLowerCase();
  const data = filtros.data.value;

  const filtrados = cadastros.filter((item) => {
    const okTipo = !tipo || item.tipoCadastro === tipo;
    const okCidade = !cidade || item.cidade.toLowerCase().includes(cidade);
    const okEspecialidade = !especialidade || item.especialidade.toLowerCase().includes(especialidade);
    const okData = !data || item.dataCadastro === data;
    return okTipo && okCidade && okEspecialidade && okData;
  });

  if (!filtrados.length) {
    listaCadastros.innerHTML = '<p>Nenhum cadastro encontrado.</p>';
    return;
  }

  listaCadastros.innerHTML = filtrados.map((item) => `
    <article>
      <strong>${item.nomeCompleto}</strong> (${item.tipoCadastro === 'clinica' ? 'Clínica' : 'Médico'})<br>
      Cidade: ${item.cidade}/${item.estado} | Especialidade: ${item.especialidade}<br>
      Serviço: ${item.tipoServico} | Cadastro: ${formatDate(item.dataCadastro)}
    </article>
  `).join('');
}

function adicionarNotificacao(item) {
  const li = document.createElement('li');
  li.textContent = `Novo cadastro recebido: ${item.nomeCompleto} (${item.tipoCadastro}) em ${formatDate(item.dataCadastro)}.`;
  notificacoes.prepend(li);
}

Object.values(filtros).forEach((input) => input.addEventListener('input', renderCadastros));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  erros.innerHTML = '';
  confirmacao.classList.add('hidden');

  const dados = Object.fromEntries(new FormData(form).entries());
  const mensagens = [];

  if (!validarCPF(dados.cpf || '')) mensagens.push('CPF inválido. Use o formato 000.000.000-00.');
  if ((dados.tipoCadastro === 'clinica') && !validarCNPJ(dados.cnpj || '')) mensagens.push('CNPJ inválido. Use o formato 00.000.000/0000-00.');
  if (!validarEmail(dados.email || '')) mensagens.push('Email inválido.');

  if (!form.checkValidity()) mensagens.push('Preencha todos os campos obrigatórios.');

  if (mensagens.length) {
    erros.innerHTML = mensagens.map((msg) => `<p>• ${msg}</p>`).join('');
    return;
  }

  dados.dataCadastro = new Date().toISOString().slice(0, 10);
  const cadastros = carregarCadastros();
  cadastros.push(dados);
  salvarCadastros(cadastros);

  confirmarEnvio(dados);
  renderCadastros();
  form.reset();
  tipoCadastro.dispatchEvent(new Event('change'));
});

function confirmarEnvio(dados) {
  confirmacao.textContent = 'Cadastro enviado com sucesso! Nossa equipe foi notificada.';
  confirmacao.classList.remove('hidden');
  adicionarNotificacao(dados);
}

renderCadastros();
