export type LanguageCode = 'pt' | 'en' | 'fr' | 'ru' | 'zh' | 'de';

export interface TranslationDictionary {
  brandTitle: string;
  brandSubtitle: string;
  cloudConnected: string;
  reactiveEngineActive: string;
  audioActive: string;
  audioMuted: string;
  themeCockpit: string;
  themeSaas: string;
  themeMinimal: string;
  themeCustom: string;
  hideSidebar: string;
  showSidebar: string;
  languageSelect: string;
  roleSelect: string;

  // Nav items
  navMissions: string;
  navMissionsSub: string;
  navCanvas: string;
  navCanvasSub: string;
  navEvals: string;
  navEvalsSub: string;
  navVersions: string;
  navVersionsSub: string;
  navFinance: string;
  navFinanceSub: string;
  navUsers: string;
  navUsersSub: string;
  navAudit: string;
  navAuditSub: string;
  navModels: string;
  navModelsSub: string;

  // Actions
  actionRunWorkflow: string;
  actionInterrupt: string;
  actionVoiceDictate: string;
  actionVoiceStop: string;
  actionSpeakAudio: string;
  actionStopAudio: string;
  actionExportPDF: string;
  actionExportCSV: string;
  actionCopyResponse: string;
  actionCopied: string;
  actionSaveVersion: string;
  actionTestSandbox: string;
  actionRollback: string;
  actionEmitInvoice: string;
  actionInviteUser: string;
  actionRunEvals: string;
  actionAddCase: string;
  actionAdjustBudget: string;
  actionSaveCustomTheme: string;
  actionResetTheme: string;

  // Tooltip Explanations
  tooltipVoice: string;
  tooltipSpeak: string;
  tooltipRunWorkflow: string;
  tooltipExportPDF: string;
  tooltipExportCSV: string;
  tooltipSidebarToggle: string;
  tooltipThemeToggle: string;
  tooltipRoleSelector: string;
  tooltipLangSelector: string;
  tooltipAddNode: string;
  tooltipWireConnection: string;
  tooltipRollback: string;
  tooltipRunEvalSuite: string;
  tooltipEmitInvoice: string;
  tooltipInviteMember: string;
  tooltipAdjustBudget: string;

  // Section Headers & Titles
  titleWorkflowMission: string;
  titleTopology: string;
  titleUserInput: string;
  titleQuickSuggestions: string;
  titleExecutionLogs: string;
  titleConsolidatedResponse: string;
  titleCanvasPalette: string;
  titleCanvasInspector: string;
  titleSandboxPreview: string;
  titleEvalSuite: string;
  titleVersionTimeline: string;
  titleDiffComparator: string;
  titleFinanceDashboard: string;
  titleInvoicesTable: string;
  titleUserDirectory: string;
  titleAuditHistory: string;
  titleModelsCatalog: string;
  titleCustomStudio: string;

  // Placeholders
  placeholderInput: string;
  placeholderCommitMsg: string;
  placeholderSandboxPrompt: string;
  placeholderSearchAudit: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  pt: {
    brandTitle: 'OrchestrAI Studio',
    brandSubtitle: 'Orquestrador Multiagente Empresarial',
    cloudConnected: 'Nuvem Conectada',
    reactiveEngineActive: 'Motor Reativo Multimodelo Ativo (Gemini · Codex · Claude)',
    audioActive: 'Áudio ativado',
    audioMuted: 'Áudio desativado',
    themeCockpit: 'Cockpit Tech',
    themeSaas: 'SaaS Clean',
    themeMinimal: 'Minimal Slate',
    themeCustom: 'Custom Studio',
    hideSidebar: 'Ocultar Barra Lateral',
    showSidebar: 'Exibir Barra Lateral',
    languageSelect: 'Idioma',
    roleSelect: 'Papel RBAC',

    navMissions: 'Orquestrador & Missões',
    navMissionsSub: 'Execução e voz em tempo real',
    navCanvas: 'Editor Visual de Nós',
    navCanvasSub: 'Drag & drop, ferramentas e guardrails',
    navEvals: 'Prévias & Evals',
    navEvalsSub: 'Sandbox e suíte de testes',
    navVersions: 'Controle de Versões',
    navVersionsSub: 'Histórico, diffs e rollback',
    navFinance: 'Financeiro & Vendas',
    navFinanceSub: 'Custos, markups e faturamento',
    navUsers: 'Gestão de Usuários',
    navUsersSub: 'Contas, cotas e papéis RBAC',
    navAudit: 'Logs & Auditoria',
    navAuditSub: 'Exportação PDF e CSV',
    navModels: 'Catálogo de Modelos',
    navModelsSub: 'Gemini, Codex, Claude e parâmetros',

    actionRunWorkflow: 'Disparar Orquestração',
    actionInterrupt: 'Interromper Execução',
    actionVoiceDictate: 'Falar comando por voz',
    actionVoiceStop: 'Parar gravação de voz',
    actionSpeakAudio: 'Ouvir em Voz Alta',
    actionStopAudio: 'Pausar Áudio',
    actionExportPDF: 'Exportar Relatório PDF',
    actionExportCSV: 'Exportar Dados CSV',
    actionCopyResponse: 'Copiar Resposta',
    actionCopied: 'Copiado!',
    actionSaveVersion: 'Salvar Nova Versão',
    actionTestSandbox: 'Testar no Sandbox',
    actionRollback: 'Restaurar Versão (Rollback)',
    actionEmitInvoice: 'Emitir Nova Fatura',
    actionInviteUser: 'Convidar Membro de Equipe',
    actionRunEvals: 'Rodar Bateria de Testes',
    actionAddCase: 'Novo Caso de Teste',
    actionAdjustBudget: 'Ajustar Cota',
    actionSaveCustomTheme: 'Salvar Customização',
    actionResetTheme: 'Redefinir Padrão',

    tooltipVoice: 'Clique para ativar o microfone e transcrever seus comandos de voz diretamente para o prompt de execução.',
    tooltipSpeak: 'Reproduz a síntese de áudio falada da resposta consolidada utilizando modelos neurais TTS de alta fidelidade.',
    tooltipRunWorkflow: 'Inicia a orquestração multiagente coordenando nós sequenciais, paralelos ou sob supervisão autônoma.',
    tooltipExportPDF: 'Gera um relatório executivo formal com carimbos criptográficos de auditoria pronto para impressão ou download em PDF.',
    tooltipExportCSV: 'Exporta todos os dados tabulares de execução, tokens e custos em arquivo CSV compatível com Excel e BI.',
    tooltipSidebarToggle: 'Alterna entre ocultar ou exibir o menu de navegação lateral para expandir a área de trabalho.',
    tooltipThemeToggle: 'Muda instantaneamente o tema visual entre Cockpit Tech, SaaS Clean, Minimal Slate e Custom Studio.',
    tooltipRoleSelector: 'Alterna o perfil de acesso RBAC ativo para simular permissões de Admin, Arquiteto, Operador, Auditor ou Financeiro.',
    tooltipLangSelector: 'Alterna o idioma de exibição do sistema entre Português, Inglês, Francês, Russo, Chinês e Alemão.',
    tooltipAddNode: 'Adiciona este nó de lógica à tela do editor visual para compor o fluxo cognitivo do agente.',
    tooltipWireConnection: 'Conecte sockets de saída com sockets de entrada para desenhar o fluxo de dados entre os nós.',
    tooltipRollback: 'Restaura a configuração deste agente exatamente ao estado do snapshot selecionado, revertendo regressões.',
    tooltipRunEvalSuite: 'Executa a bateria de testes automatizada avaliando precisão factual, toxicidade e latência via juiz LLM.',
    tooltipEmitInvoice: 'Cria uma fatura comercial calculando o markup sobre o volume de tokens faturados ao cliente corporativo.',
    tooltipInviteMember: 'Envia convite para novo usuário configurando permissões RBAC e limite orçamentário mensal de inferência.',
    tooltipAdjustBudget: 'Modifica o teto máximo mensal em dólares que o usuário pode gastar com chamadas de IA.',

    titleWorkflowMission: 'Missão Multiagente',
    titleTopology: 'Topologia do Fluxo & Agentes Envolvidos',
    titleUserInput: 'Instrução do Usuário & Comandos de Voz',
    titleQuickSuggestions: 'Sugestões Rápidas:',
    titleExecutionLogs: 'Logs de Execução em Tempo Real',
    titleConsolidatedResponse: 'Resposta Final Consolidada da Orquestração',
    titleCanvasPalette: 'Paleta de Nós da Lógica',
    titleCanvasInspector: 'Parametrização do Bloco Selecionado',
    titleSandboxPreview: 'Sandbox de Prévia ao Vivo',
    titleEvalSuite: 'Suíte de Avaliações em Linha (Evals)',
    titleVersionTimeline: 'Histórico de Releases do Agente',
    titleDiffComparator: 'Comparador Visual de Diffs',
    titleFinanceDashboard: 'Painel Financeiro, Custos & Faturamento de Vendas',
    titleInvoicesTable: 'Faturas Emitidas & Histórico de Vendas',
    titleUserDirectory: 'Gerenciamento de Contas de Usuários & RBAC',
    titleAuditHistory: 'Histórico Detalhado de Auditoria & Exportação de Relatórios',
    titleModelsCatalog: 'Catálogo Multimodelo & Parametrização Customizada',
    titleCustomStudio: 'Custom Studio: Liberdade de Criação',

    placeholderInput: 'Digite sua instrução ou clique no microfone para ditar via reconhecimento de voz...',
    placeholderCommitMsg: 'Ex: Adicionado guardrail de PII e conectado nó de busca web com Gemini 3.8.',
    placeholderSandboxPrompt: 'Digite um prompt para testar o agente imediatamente...',
    placeholderSearchAudit: 'Pesquisar por fluxo, prompt, operador ou data...',
  },
  en: {
    brandTitle: 'OrchestrAI Studio',
    brandSubtitle: 'Enterprise Multi-Agent Orchestrator',
    cloudConnected: 'Cloud Connected',
    reactiveEngineActive: 'Multi-Model Reactive Engine Active (Gemini · Codex · Claude)',
    audioActive: 'Audio Enabled',
    audioMuted: 'Audio Muted',
    themeCockpit: 'Cockpit Tech',
    themeSaas: 'SaaS Clean',
    themeMinimal: 'Minimal Slate',
    themeCustom: 'Custom Studio',
    hideSidebar: 'Hide Sidebar',
    showSidebar: 'Show Sidebar',
    languageSelect: 'Language',
    roleSelect: 'RBAC Role',

    navMissions: 'Orchestrator & Missions',
    navMissionsSub: 'Real-time execution & voice',
    navCanvas: 'Visual Node Editor',
    navCanvasSub: 'Drag & drop, tools & guardrails',
    navEvals: 'Previews & Evals',
    navEvalsSub: 'Sandbox & automated test suite',
    navVersions: 'Version Control',
    navVersionsSub: 'History, diffs & rollback',
    navFinance: 'Finance & Sales',
    navFinanceSub: 'Costs, markups & billing',
    navUsers: 'User Management',
    navUsersSub: 'Accounts, quotas & RBAC roles',
    navAudit: 'Logs & Audit',
    navAuditSub: 'PDF and CSV export',
    navModels: 'Model Catalog',
    navModelsSub: 'Gemini, Codex, Claude & parameters',

    actionRunWorkflow: 'Launch Orchestration',
    actionInterrupt: 'Interrupt Run',
    actionVoiceDictate: 'Voice Dictation',
    actionVoiceStop: 'Stop Voice Recording',
    actionSpeakAudio: 'Listen Aloud',
    actionStopAudio: 'Pause Audio',
    actionExportPDF: 'Export PDF Report',
    actionExportCSV: 'Export CSV Data',
    actionCopyResponse: 'Copy Response',
    actionCopied: 'Copied!',
    actionSaveVersion: 'Save New Version',
    actionTestSandbox: 'Test in Sandbox',
    actionRollback: 'Rollback to Version',
    actionEmitInvoice: 'Issue New Invoice',
    actionInviteUser: 'Invite Team Member',
    actionRunEvals: 'Run Evaluation Suite',
    actionAddCase: 'New Test Case',
    actionAdjustBudget: 'Adjust Quota',
    actionSaveCustomTheme: 'Save Customization',
    actionResetTheme: 'Reset to Default',

    tooltipVoice: 'Click to activate microphone and transcribe spoken instructions directly into the prompt.',
    tooltipSpeak: 'Plays synthesized audio of the agent response using high-fidelity neural TTS models.',
    tooltipRunWorkflow: 'Launches multi-agent execution orchestrating sequential, parallel or supervised nodes.',
    tooltipExportPDF: 'Generates a formal executive audit report ready for print or PDF download.',
    tooltipExportCSV: 'Exports all tabular run data, token metrics and costs to CSV file.',
    tooltipSidebarToggle: 'Toggles between hiding and showing the side navigation menu to maximize workspace.',
    tooltipThemeToggle: 'Switches the visual theme between Cockpit Tech, SaaS Clean, Minimal Slate and Custom Studio.',
    tooltipRoleSelector: 'Switches the active RBAC role to simulate Admin, Architect, Operator, Auditor or Finance permissions.',
    tooltipLangSelector: 'Switches the display language between Portuguese, English, French, Russian, Chinese, and German.',
    tooltipAddNode: 'Adds this logic block onto the visual canvas to build the cognitive agent workflow.',
    tooltipWireConnection: 'Connect output handles to input handles to route data between nodes.',
    tooltipRollback: 'Restores agent configuration to the selected historical snapshot, fixing regressions.',
    tooltipRunEvalSuite: 'Runs automated benchmark suite evaluating factual accuracy, safety and latency via LLM judge.',
    tooltipEmitInvoice: 'Creates a commercial invoice applying markup over billed token volume.',
    tooltipInviteMember: 'Invites a new user with RBAC role assignments and monthly spending caps.',
    tooltipAdjustBudget: 'Adjusts the monthly spending ceiling in USD for model inference calls.',

    titleWorkflowMission: 'Multi-Agent Mission',
    titleTopology: 'Workflow Topology & Involved Agents',
    titleUserInput: 'User Instruction & Voice Commands',
    titleQuickSuggestions: 'Quick Suggestions:',
    titleExecutionLogs: 'Real-Time Execution Logs',
    titleConsolidatedResponse: 'Final Consolidated Orchestration Response',
    titleCanvasPalette: 'Logic Node Palette',
    titleCanvasInspector: 'Selected Node Configuration',
    titleSandboxPreview: 'Live Preview Sandbox',
    titleEvalSuite: 'Inline Evaluation Suite (Evals)',
    titleVersionTimeline: 'Agent Release History',
    titleDiffComparator: 'Visual Diff Comparator',
    titleFinanceDashboard: 'Financial Dashboard, Costs & Sales Revenue',
    titleInvoicesTable: 'Issued Invoices & Sales History',
    titleUserDirectory: 'User Account Management & RBAC',
    titleAuditHistory: 'Detailed Audit Trail & Report Export',
    titleModelsCatalog: 'Multi-Model Catalog & Parameter Tuning',
    titleCustomStudio: 'Custom Studio: Creative Freedom',

    placeholderInput: 'Type your instructions or click microphone for voice dictation...',
    placeholderCommitMsg: 'E.g., Added PII guardrail and connected real-time web search with Gemini 3.8.',
    placeholderSandboxPrompt: 'Enter prompt to test the agent immediately...',
    placeholderSearchAudit: 'Search by workflow, prompt, operator or date...',
  },
  fr: {
    brandTitle: 'OrchestrAI Studio',
    brandSubtitle: 'Orchestrateur Multi-Agents d\'Entreprise',
    cloudConnected: 'Cloud Connecté',
    reactiveEngineActive: 'Moteur Réactif Multi-Modèles Actif (Gemini · Codex · Claude)',
    audioActive: 'Audio Activé',
    audioMuted: 'Audio Désactivé',
    themeCockpit: 'Cockpit Tech',
    themeSaas: 'SaaS Épuré',
    themeMinimal: 'Ardoise Minimale',
    themeCustom: 'Studio Personnalisé',
    hideSidebar: 'Masquer Barre Latérale',
    showSidebar: 'Afficher Barre Latérale',
    languageSelect: 'Langue',
    roleSelect: 'Rôle RBAC',

    navMissions: 'Orchestrateur & Missions',
    navMissionsSub: 'Exécution et voix en direct',
    navCanvas: 'Éditeur Visuel de Nœuds',
    navCanvasSub: 'Glisser-déposer, outils et garde-fous',
    navEvals: 'Aperçus & Évaluations',
    navEvalsSub: 'Bac à sable et suite de tests',
    navVersions: 'Contrôle des Versions',
    navVersionsSub: 'Historique, diffs et rollback',
    navFinance: 'Finances & Ventes',
    navFinanceSub: 'Coûts, marges et facturation',
    navUsers: 'Gestion des Utilisateurs',
    navUsersSub: 'Comptes, quotas et rôles RBAC',
    navAudit: 'Journaux & Audit',
    navAuditSub: 'Exportation PDF et CSV',
    navModels: 'Catalogue de Modèles',
    navModelsSub: 'Gemini, Codex, Claude et paramètres',

    actionRunWorkflow: 'Lancer l\'Orchestration',
    actionInterrupt: 'Interrompre l\'Exécution',
    actionVoiceDictate: 'Dictée Vocale',
    actionVoiceStop: 'Arrêter l\'Enregistrement',
    actionSpeakAudio: 'Écouter à Voix Haute',
    actionStopAudio: 'Mettre en Pause l\'Audio',
    actionExportPDF: 'Exporter Rapport PDF',
    actionExportCSV: 'Exporter Données CSV',
    actionCopyResponse: 'Copier la Réponse',
    actionCopied: 'Copié !',
    actionSaveVersion: 'Enregistrer Nouvelle Version',
    actionTestSandbox: 'Tester dans le Bac à Sable',
    actionRollback: 'Restaurer la Version',
    actionEmitInvoice: 'Émettre une Facture',
    actionInviteUser: 'Inviter un Membre',
    actionRunEvals: 'Lancer la Suite d\'Évaluation',
    actionAddCase: 'Nouveau Cas de Test',
    actionAdjustBudget: 'Ajuster le Quota',
    actionSaveCustomTheme: 'Enregistrer Thème',
    actionResetTheme: 'Réinitialiser',

    tooltipVoice: 'Cliquez pour activer le microphone et transcrire vos instructions directement.',
    tooltipSpeak: 'Lit la synthèse vocale de la réponse finale via les modèles neuronaux.',
    tooltipRunWorkflow: 'Déclenche l\'orchestration multi-agents selon la topologie choisie.',
    tooltipExportPDF: 'Génère un rapport exécutif d\'audit horodaté prêt à imprimer.',
    tooltipExportCSV: 'Exporte l\'ensemble des métriques tabulaires au format CSV.',
    tooltipSidebarToggle: 'Affiche ou masque le menu latéral pour maximiser l\'espace de travail.',
    tooltipThemeToggle: 'Bascule entre les différents thèmes visuels.',
    tooltipRoleSelector: 'Change le rôle RBAC actif pour tester les autorisations.',
    tooltipLangSelector: 'Change la langue de l\'interface parmi 6 langues.',
    tooltipAddNode: 'Ajoute ce bloc logique sur le canvas pour composer le flux.',
    tooltipWireConnection: 'Relie les nœuds entre eux pour diriger le flux de données.',
    tooltipRollback: 'Restaure immédiatement la version sélectionnée en production.',
    tooltipRunEvalSuite: 'Exécute la batterie de tests avec notation automatique par juge IA.',
    tooltipEmitInvoice: 'Génère une facture commerciale avec marge sur le volume de tokens.',
    tooltipInviteMember: 'Invite un utilisateur en lui attribuant un rôle et un plafond mensuel.',
    tooltipAdjustBudget: 'Modifie le plafond mensuel de dépenses d\'inférence.',

    titleWorkflowMission: 'Mission Multi-Agents',
    titleTopology: 'Topologie du Flux & Agents Impliqués',
    titleUserInput: 'Instruction Utilisateur & Commandes Vocales',
    titleQuickSuggestions: 'Suggestions Rapides :',
    titleExecutionLogs: 'Journaux d\'Exécution en Temps Réel',
    titleConsolidatedResponse: 'Réponse Finale Consolidée',
    titleCanvasPalette: 'Palette de Nœuds',
    titleCanvasInspector: 'Paramètres du Nœud Sélectionné',
    titleSandboxPreview: 'Aperçu en Direct',
    titleEvalSuite: 'Suite d\'Évaluations Automatisées',
    titleVersionTimeline: 'Historique des Versions de l\'Agent',
    titleDiffComparator: 'Comparateur Visuel de Différences',
    titleFinanceDashboard: 'Tableau de Bord Financier & Ventes',
    titleInvoicesTable: 'Factures Émises & Historique',
    titleUserDirectory: 'Gestion des Utilisateurs & RBAC',
    titleAuditHistory: 'Piste d\'Audit Détaillée & Exportation',
    titleModelsCatalog: 'Catalogue Multi-Modèles & Hyperparamètres',
    titleCustomStudio: 'Studio Personnalisé : Liberté Créative',

    placeholderInput: 'Tapez votre consigne ou cliquez sur le micro pour dicter...',
    placeholderCommitMsg: 'Ex: Ajout du filtre PII et connexion de la recherche web Gemini 3.8.',
    placeholderSandboxPrompt: 'Entrez une consigne pour tester l\'agent immédiatement...',
    placeholderSearchAudit: 'Rechercher par mission, prompt, opérateur ou date...',
  },
  ru: {
    brandTitle: 'OrchestrAI Studio',
    brandSubtitle: 'Корпоративный Мультиагентный Оркестратор',
    cloudConnected: 'Облако Подключено',
    reactiveEngineActive: 'Активен Мультимодельный Реактивный Движок (Gemini · Codex · Claude)',
    audioActive: 'Звук Включен',
    audioMuted: 'Звук Выключен',
    themeCockpit: 'Cockpit Tech',
    themeSaas: 'SaaS Clean',
    themeMinimal: 'Minimal Slate',
    themeCustom: 'Custom Studio',
    hideSidebar: 'Скрыть Панель',
    showSidebar: 'Показать Панель',
    languageSelect: 'Язык',
    roleSelect: 'Роль RBAC',

    navMissions: 'Оркестратор и Миссии',
    navMissionsSub: 'Исполнение и голос в реальном времени',
    navCanvas: 'Визуальный Редактор Узлов',
    navCanvasSub: 'Drag & drop, инструменты и защита',
    navEvals: 'Тесты и Оценки (Evals)',
    navEvalsSub: 'Песочница и автотесты',
    navVersions: 'Контроль Версий',
    navVersionsSub: 'История, diff и откат',
    navFinance: 'Финансы и Продажи',
    navFinanceSub: 'Затраты, наценки и счета',
    navUsers: 'Управление Пользователями',
    navUsersSub: 'Аккаунты, квоты и роли',
    navAudit: 'Логи и Аудит',
    navAuditSub: 'Экспорт PDF и CSV',
    navModels: 'Каталог Моделей',
    navModelsSub: 'Gemini, Codex, Claude и параметры',

    actionRunWorkflow: 'Запустить Оркестрацию',
    actionInterrupt: 'Прервать',
    actionVoiceDictate: 'Голосовой Ввод',
    actionVoiceStop: 'Остановить Запись',
    actionSpeakAudio: 'Озвучить Ответ',
    actionStopAudio: 'Пауза Аудио',
    actionExportPDF: 'Экспорт PDF Отчета',
    actionExportCSV: 'Экспорт CSV Данных',
    actionCopyResponse: 'Копировать Ответ',
    actionCopied: 'Скопировано!',
    actionSaveVersion: 'Сохранить Версию',
    actionTestSandbox: 'Тест в Песочнице',
    actionRollback: 'Откат Версии',
    actionEmitInvoice: 'Выставить Счет',
    actionInviteUser: 'Пригласить Участника',
    actionRunEvals: 'Запустить Тестирование',
    actionAddCase: 'Новый Тест',
    actionAdjustBudget: 'Изменить Квоту',
    actionSaveCustomTheme: 'Применить Тему',
    actionResetTheme: 'Сбросить Настройки',

    tooltipVoice: 'Нажмите для голосового ввода и транскрипции команды в текст.',
    tooltipSpeak: 'Воспроизводит озвучку итогового ответа нейросетевыми моделями.',
    tooltipRunWorkflow: 'Запускает мультиагентный пайплайн в выбранном режиме.',
    tooltipExportPDF: 'Генерирует официальный отчет аудита для печати или сохранения в PDF.',
    tooltipExportCSV: 'Экспортирует данные метрик, токенов и затрат в CSV.',
    tooltipSidebarToggle: 'Скрывает или разворачивает боковое меню.',
    tooltipThemeToggle: 'Переключает тему оформления интерфейса.',
    tooltipRoleSelector: 'Переключает активную роль для проверки прав доступа RBAC.',
    tooltipLangSelector: 'Выбор языка интерфейса из 6 доступных.',
    tooltipAddNode: 'Добавляет логический узел на рабочее поле.',
    tooltipWireConnection: 'Соединяет выходной порт одного узла с входным другого.',
    tooltipRollback: 'Мгновенно восстанавливает рабочую конфигурацию из выбранной версии.',
    tooltipRunEvalSuite: 'Запускает автоматизированную проверку качества ответов.',
    tooltipEmitInvoice: 'Формирует счет клиенту с учетом наценки на токены.',
    tooltipInviteMember: 'Добавляет пользователя с назначением роли и лимита бюджета.',
    tooltipAdjustBudget: 'Изменяет месячный лимит расходов в долларах.',

    titleWorkflowMission: 'Мультиагентная Миссия',
    titleTopology: 'Топология Пайплайна и Агенты',
    titleUserInput: 'Инструкции и Голосовые Команды',
    titleQuickSuggestions: 'Быстрые примеры:',
    titleExecutionLogs: 'Логи Исполнения в Реальном Времени',
    titleConsolidatedResponse: 'Итоговый Ответ Оркестратора',
    titleCanvasPalette: 'Палитра Узлов',
    titleCanvasInspector: 'Параметры Узла',
    titleSandboxPreview: 'Живой Тест в Песочнице',
    titleEvalSuite: 'Набор Автоматических Оценок',
    titleVersionTimeline: 'История Релизов Агента',
    titleDiffComparator: 'Сравнение Изменений (Diff)',
    titleFinanceDashboard: 'Финансовый Дашборд и Продажи',
    titleInvoicesTable: 'Выставленные Счета',
    titleUserDirectory: 'Управление Аккаунтами и RBAC',
    titleAuditHistory: 'Детальный Аудит и Экспорт Отчетов',
    titleModelsCatalog: 'Каталог Моделей и Тюнинг Параметров',
    titleCustomStudio: 'Студия Своей Темы: Полная Свобода',

    placeholderInput: 'Введите инструкции или нажмите микрофон для голосового ввода...',
    placeholderCommitMsg: 'Например: добавлен PII фильтр и веб-поиск Gemini 3.8.',
    placeholderSandboxPrompt: 'Введите промпт для мгновенной проверки агента...',
    placeholderSearchAudit: 'Поиск по миссии, промпту, оператору или дате...',
  },
  zh: {
    brandTitle: 'OrchestrAI Studio',
    brandSubtitle: '企业级多智能体编排器',
    cloudConnected: '云端已连接',
    reactiveEngineActive: '多模型响应式引擎已激活 (Gemini · Codex · Claude)',
    audioActive: '音频已启用',
    audioMuted: '音频静音',
    themeCockpit: '极客暗黑 (Cockpit)',
    themeSaas: '现代浅色 (SaaS)',
    themeMinimal: '极简板岩 (Minimal)',
    themeCustom: '自定义工坊 (Custom)',
    hideSidebar: '隐藏侧边栏',
    showSidebar: '显示侧边栏',
    languageSelect: '语言',
    roleSelect: 'RBAC 角色',

    navMissions: '编排器与任务',
    navMissionsSub: '实时执行与语音交互',
    navCanvas: '可视化节点编辑器',
    navCanvasSub: '拖拽构建、工具与防护栏',
    navEvals: '预览与自动化评估',
    navEvalsSub: '沙盒测试与评分准则',
    navVersions: '版本控制与回滚',
    navVersionsSub: '历史版本、Diff与一键回滚',
    navFinance: '财务与销售分析',
    navFinanceSub: 'Token成本、溢价与账单',
    navUsers: '用户权限管理',
    navUsersSub: '账户、配额与RBAC控制',
    navAudit: '审计日志与报告',
    navAuditSub: 'PDF与CSV导出',
    navModels: '模型中心与参数',
    navModelsSub: 'Gemini, Codex, Claude参数调优',

    actionRunWorkflow: '启动编排任务',
    actionInterrupt: '中断执行',
    actionVoiceDictate: '语音指令输入',
    actionVoiceStop: '停止语音录制',
    actionSpeakAudio: '语音播报结果',
    actionStopAudio: '暂停语音',
    actionExportPDF: '导出PDF报告',
    actionExportCSV: '导出CSV表格',
    actionCopyResponse: '复制回复',
    actionCopied: '已复制！',
    actionSaveVersion: '发布新版本',
    actionTestSandbox: '沙盒实时测试',
    actionRollback: '回滚至此版本',
    actionEmitInvoice: '开具客户账单',
    actionInviteUser: '邀请团队成员',
    actionRunEvals: '运行评估测试套件',
    actionAddCase: '新建测试用例',
    actionAdjustBudget: '调整配额',
    actionSaveCustomTheme: '保存并应用主题',
    actionResetTheme: '重置为默认',

    tooltipVoice: '点击启用麦克风，通过语音实时输入操作指令。',
    tooltipSpeak: '调用高保真神经TTS模型朗读智能体汇总结果。',
    tooltipRunWorkflow: '按设定的拓扑结构协调智能体执行任务。',
    tooltipExportPDF: '生成带有时间戳和哈希校验的正规审计报告PDF。',
    tooltipExportCSV: '将任务执行明细、Token消耗和成本导出为CSV文件。',
    tooltipSidebarToggle: '折叠或展开侧边栏以拓展工作区可视面积。',
    tooltipThemeToggle: '即时切换界面视觉主题风格。',
    tooltipRoleSelector: '切换当前生效的RBAC角色以验证权限。',
    tooltipLangSelector: '在6种国际语言间自由切换界面语言。',
    tooltipAddNode: '将此逻辑节点拖入画布以构建智能体处理流程。',
    tooltipWireConnection: '连接输出端口与输入端口以构建数据流。',
    tooltipRollback: '将智能体配置一键回滚到指定历史快照版本。',
    tooltipRunEvalSuite: '运行自动化评测集，评估准确率、毒性与延迟。',
    tooltipEmitInvoice: '根据Token用量加成生成商业账单。',
    tooltipInviteMember: '邀请新团队成员并配置月度推理预算上限。',
    tooltipAdjustBudget: '修改该账户每月的美元模型调用限额。',

    titleWorkflowMission: '多智能体编排任务',
    titleTopology: '流程拓扑与参与智能体',
    titleUserInput: '用户指令与语音输入',
    titleQuickSuggestions: '快捷提示词：',
    titleExecutionLogs: '实时执行流水日志',
    titleConsolidatedResponse: '多智能体最终汇总响应',
    titleCanvasPalette: '逻辑节点库',
    titleCanvasInspector: '所选节点参数设置',
    titleSandboxPreview: '实时沙盒预览',
    titleEvalSuite: '自动化评估套件 (Evals)',
    titleVersionTimeline: '智能体发布历史记录',
    titleDiffComparator: '差异对比器 (Diff)',
    titleFinanceDashboard: '财务看板、推理成本与销售盈利',
    titleInvoicesTable: '已出账单与客户明细',
    titleUserDirectory: '用户账户管理与RBAC权限',
    titleAuditHistory: '详细审计追踪与报表导出',
    titleModelsCatalog: '多模型矩阵与超参数配置',
    titleCustomStudio: '主题自定义工坊：自由定制',

    placeholderInput: '输入指令或点击麦克风进行语音输入...',
    placeholderCommitMsg: '例如：增加PII隐私脱敏防护并接入Gemini 3.8实时搜索。',
    placeholderSandboxPrompt: '输入测试提示词以即时验证智能体表现...',
    placeholderSearchAudit: '搜索任务、提示词、操作员或日期...',
  },
  de: {
    brandTitle: 'OrchestrAI Studio',
    brandSubtitle: 'Enterprise Multi-Agenten-Orchestrator',
    cloudConnected: 'Cloud Verbunden',
    reactiveEngineActive: 'Reaktive Multi-Modell-Engine Aktiv (Gemini · Codex · Claude)',
    audioActive: 'Audio Aktiviert',
    audioMuted: 'Audio Stummgeschaltet',
    themeCockpit: 'Cockpit Tech',
    themeSaas: 'SaaS Clean',
    themeMinimal: 'Minimal Slate',
    themeCustom: 'Custom Studio',
    hideSidebar: 'Seitenleiste Ausblenden',
    showSidebar: 'Seitenleiste Anzeigen',
    languageSelect: 'Sprache',
    roleSelect: 'RBAC-Rolle',

    navMissions: 'Orchestrator & Missionen',
    navMissionsSub: 'Echtzeitausführung & Sprache',
    navCanvas: 'Visueller Knoteneditor',
    navCanvasSub: 'Drag & Drop, Tools & Guardrails',
    navEvals: 'Vorschau & Evals',
    navEvalsSub: 'Sandbox & automatisierte Tests',
    navVersions: 'Versionskontrolle',
    navVersionsSub: 'Verlauf, Diffs & Rollback',
    navFinance: 'Finanzen & Vertrieb',
    navFinanceSub: 'Kosten, Aufschläge & Abrechnung',
    navUsers: 'Benutzerverwaltung',
    navUsersSub: 'Konten, Kontingente & Rollen',
    navAudit: 'Protokolle & Audit',
    navAuditSub: 'PDF- und CSV-Export',
    navModels: 'Modellkatalog',
    navModelsSub: 'Gemini, Codex, Claude & Parameter',

    actionRunWorkflow: 'Orchestrierung Starten',
    actionInterrupt: 'Ausführung Stoppen',
    actionVoiceDictate: 'Sprachbefehl Eingeben',
    actionVoiceStop: 'Sprachaufnahme Beenden',
    actionSpeakAudio: 'Antwort Vorlesen',
    actionStopAudio: 'Audio Pausieren',
    actionExportPDF: 'PDF-Bericht Exportieren',
    actionExportCSV: 'CSV-Daten Exportieren',
    actionCopyResponse: 'Antwort Kopieren',
    actionCopied: 'Kopiert!',
    actionSaveVersion: 'Neue Version Speichern',
    actionTestSandbox: 'In Sandbox Testen',
    actionRollback: 'Zurücksetzen (Rollback)',
    actionEmitInvoice: 'Rechnung Erstellen',
    actionInviteUser: 'Mitglied Einladen',
    actionRunEvals: 'Testsuite Ausführen',
    actionAddCase: 'Neuer Testfall',
    actionAdjustBudget: 'Budget Anpassen',
    actionSaveCustomTheme: 'Thema Speichern',
    actionResetTheme: 'Zurücksetzen',

    tooltipVoice: 'Klicken Sie hier, um das Mikrofon zu aktivieren und Spracheingaben direkt zu transkribieren.',
    tooltipSpeak: 'Liest die zusammengefasste Antwort mit hochpräziser neuronaler Sprachausgabe vor.',
    tooltipRunWorkflow: 'Startet die koordinierte Multi-Agenten-Ausführung im gewählten Modus.',
    tooltipExportPDF: 'Erstellt einen formellen Revisionsbericht mit Prüfstempel als PDF.',
    tooltipExportCSV: 'Exportiert alle tabellarischen Metriken, Token und Kosten als CSV.',
    tooltipSidebarToggle: 'Blendet das Navigationsmenü ein oder aus, um den Arbeitsbereich zu maximieren.',
    tooltipThemeToggle: 'Wechselt das Design zwischen Cockpit Tech, SaaS Clean, Minimal Slate und Custom Studio.',
    tooltipRoleSelector: 'Wechselt die aktive RBAC-Rolle, um Zugriffsrechte zu simulieren.',
    tooltipLangSelector: 'Wechselt die Anzeigesprache zwischen 6 Sprachen.',
    tooltipAddNode: 'Fügt diesen Logikbaustein dem Canvas hinzu, um den Agenten-Workflow zu definieren.',
    tooltipWireConnection: 'Verbindet Ausgänge mit Eingängen zur Datenweiterleitung.',
    tooltipRollback: 'Setzt die Agentenkonfiguration auf den ausgewählten Snapshot zurück.',
    tooltipRunEvalSuite: 'Führt automatische Qualitäts- und Sicherheitsprüfungen durch.',
    tooltipEmitInvoice: 'Erstellt eine Handelsrechnung inklusive Token-Aufschlag.',
    tooltipInviteMember: 'Lädt ein Teammitglied ein und weist Rollen und Monatsbudgets zu.',
    tooltipAdjustBudget: 'Passt die monatliche Ausgabenobergrenze in USD an.',

    titleWorkflowMission: 'Multi-Agenten-Mission',
    titleTopology: 'Ablauftopologie & Beteiligte Agenten',
    titleUserInput: 'Benutzeranweisung & Sprachbefehle',
    titleQuickSuggestions: 'Schnellvorschläge:',
    titleExecutionLogs: 'Echtzeit-Ausführungsprotokolle',
    titleConsolidatedResponse: 'Konsolidierte Gesamtausgabe',
    titleCanvasPalette: 'Logikknoten-Palette',
    titleCanvasInspector: 'Knotenkonfiguration',
    titleSandboxPreview: 'Live-Sandbox-Vorschau',
    titleEvalSuite: 'Inline-Evaluierungs-Suite (Evals)',
    titleVersionTimeline: 'Agenten-Release-Historie',
    titleDiffComparator: 'Visueller Diff-Vergleich',
    titleFinanceDashboard: 'Finanz-Dashboard & Umsätze',
    titleInvoicesTable: 'Ausgestellte Rechnungen',
    titleUserDirectory: 'Benutzerkonten & RBAC-Verwaltung',
    titleAuditHistory: 'Detaillierter Audit-Trail & Export',
    titleModelsCatalog: 'Multi-Modell-Katalog & Feineinstellung',
    titleCustomStudio: 'Custom Studio: Gestaltungsfreiheit',

    placeholderInput: 'Geben Sie Anweisungen ein oder klicken Sie auf das Mikrofon...',
    placeholderCommitMsg: 'Z.B.: PII-Guardrail hinzugefügt und Google-Suche mit Gemini 3.8 verknüpft.',
    placeholderSandboxPrompt: 'Geben Sie einen Prompt ein, um den Agenten sofort zu testen...',
    placeholderSearchAudit: 'Nach Mission, Prompt, Operator oder Datum suchen...',
  },
};
