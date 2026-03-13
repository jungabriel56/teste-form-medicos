# Formulário de Cadastro - Médicos e Clínicas

Aplicação web estática para cadastro de médicos e clínicas interessados em transferir a contabilidade.

## Como executar

Como é uma aplicação estática, basta abrir `index.html` no navegador ou servir via HTTP local:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Funcionalidades implementadas

- Cadastro com tipo Médico ou Clínica.
- Campos condicionais para Clínica (PJ).
- Validação de obrigatórios.
- Validação de formato de CPF, CNPJ e Email.
- Bloqueio de envio em caso de dados inválidos.
- Upload opcional de documentos.
- Armazenamento local dos cadastros (localStorage).
- Mensagem de confirmação após envio.
- Notificação interna (lista de notificações).
- Consulta de cadastros com filtros por tipo, cidade, especialidade e data.
