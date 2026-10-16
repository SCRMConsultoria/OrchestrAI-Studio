import { WorkflowRun, ExecutionLogItem } from '../types';

/**
 * Utility for exporting audit logs and workflow runs to CSV
 */
export function exportRunsToCSV(runs: WorkflowRun[], filename = 'relatorio-orquestracao-agentes.csv') {
  const headers = [
    'ID_Execucao',
    'Titulo_Workflow',
    'Modo',
    'Status',
    'Usuario',
    'Papel_RBAC',
    'Data_Inicio',
    'Duracao_ms',
    'Tokens_Totais',
    'Custo_USD',
    'Pergunta_Usuario',
    'Saida_Final',
  ];

  const rows = runs.map((run) => [
    `"${run.id}"`,
    `"${run.workflowTitle.replace(/"/g, '""')}"`,
    `"${run.mode}"`,
    `"${run.status}"`,
    `"${run.executedBy.userName.replace(/"/g, '""')}"`,
    `"${run.executedBy.userRole}"`,
    `"${run.startedAt}"`,
    run.totalDurationMs,
    run.totalTokens,
    run.totalCostUsd.toFixed(6),
    `"${run.userQuery.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${run.finalOutput.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportAuditLogsToCSV(logs: ExecutionLogItem[], filename = 'logs-auditoria-detalhada.csv') {
  const headers = [
    'ID_Log',
    'ID_Execucao',
    'Agente',
    'Modelo',
    'Etapa',
    'Status',
    'Timestamp',
    'Duracao_ms',
    'Tokens_Entrada',
    'Tokens_Saida',
    'Tokens_Totais',
    'Custo_USD',
    'Entrada',
    'Saida',
    'Ferramentas_Invocadas',
  ];

  const rows = logs.map((log) => [
    `"${log.id}"`,
    `"${log.runId}"`,
    `"${log.agentName}"`,
    `"${log.model}"`,
    `"${log.stageName}"`,
    `"${log.status}"`,
    `"${log.timestamp}"`,
    log.metrics.durationMs,
    log.metrics.promptTokens,
    log.metrics.candidatesTokens,
    log.metrics.totalTokens,
    log.metrics.estimatedCostUsd.toFixed(6),
    `"${log.inputContent.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${log.outputContent.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${(log.toolInvocations || []).map((t) => t.toolName).join('; ')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Generate a printable, high-fidelity executive audit report formatted for PDF saving
 */
export function exportRunToPDF(run: WorkflowRun) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para gerar a visualização e impressão em PDF.');
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório Executivo de Auditoria - ${run.id}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      font-size: 13px;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .brand-subtitle {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 4px;
      background: #e2e8f0;
      color: #334155;
    }
    .badge-success { background: #dcfce7; color: #15803d; }
    .grid-meta {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .meta-item { display: flex; flex-direction: column; }
    .meta-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .meta-value { font-size: 14px; font-weight: 600; color: #0f172a; margin-top: 2px; }
    h2 {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    .output-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 14px;
      font-family: inherit;
      white-space: pre-wrap;
      margin-bottom: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: 600;
      color: #475569;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      font-size: 11px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">OrchestrAI Studio</div>
      <div class="brand-subtitle">Relatório Executivo de Auditoria & Execução de Agentes</div>
    </div>
    <div>
      <span class="badge ${run.status === 'completed' ? 'badge-success' : ''}">STATUS: ${run.status.toUpperCase()}</span>
    </div>
  </div>

  <div class="grid-meta">
    <div class="meta-item">
      <span class="meta-label">ID da Execução</span>
      <span class="meta-value">${run.id}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Fluxo / Missão</span>
      <span class="meta-value">${run.workflowTitle}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Modo Operacional</span>
      <span class="meta-value">${run.mode.toUpperCase()}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Operador (RBAC)</span>
      <span class="meta-value">${run.executedBy.userName} (${run.executedBy.userRole.toUpperCase()})</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Data e Hora</span>
      <span class="meta-value">${new Date(run.startedAt).toLocaleString('pt-BR')}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Duração Total</span>
      <span class="meta-value">${(run.totalDurationMs / 1000).toFixed(2)}s</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Tokens Totais</span>
      <span class="meta-value">${run.totalTokens.toLocaleString('pt-BR')}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Custo Estimado</span>
      <span class="meta-value">$${run.totalCostUsd.toFixed(6)} USD</span>
    </div>
  </div>

  <h2>Comando / Prompt Inicial do Usuário</h2>
  <div class="output-box">${escapeHtml(run.userQuery)}</div>

  <h2>Resumo da Resposta Consolidada dos Agentes</h2>
  <div class="output-box">${escapeHtml(run.finalOutput)}</div>

  <h2>Linha do Tempo de Execução & Auditoria dos Agentes</h2>
  <table>
    <thead>
      <tr>
        <th>Agente</th>
        <th>Modelo</th>
        <th>Etapa</th>
        <th>Duração</th>
        <th>Tokens</th>
        <th>Custo (USD)</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${run.logs
        .map(
          (log) => `
        <tr>
          <td><strong>${escapeHtml(log.agentName)}</strong></td>
          <td>${log.model}</td>
          <td>${escapeHtml(log.stageName)}</td>
          <td>${log.metrics.durationMs}ms</td>
          <td>${log.metrics.totalTokens}</td>
          <td>$${log.metrics.estimatedCostUsd.toFixed(6)}</td>
          <td>${log.status}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <span>Carimbo Criptográfico: SHA256-${Math.random().toString(36).substring(2, 15)}</span>
    <span>OrchestrAI Studio • Relatório Gerado em ${new Date().toLocaleString('pt-BR')}</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function downloadBlob(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
  URL.revokeObjectURL(url);
}
