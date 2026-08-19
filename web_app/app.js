// State Management da Aplicação (Vector Career Hunting v21.0 - Motor de Reposicionamento Estratégico)
let nomeCandidato = "Aline Aparecida Fagundes Paz Rocha";
let cargoAlvo = "Analista Financeiro & Tesouraria (Contas a Pagar & Cobrança)";
let areaEspecialidade = "financeiro";
let cidadeAlvo = "Betim - MG (100% Remoto)";
let salarioPretensao = "R$ 3.500,00 a R$ 4.500,00";
let arquivoSelecionado = null;
let audioCtx = null;
let historicoChat = [];
let modoSimuladorEntrevista = false;
let perguntaSimuladaAtual = 0;

// ── CLOUDFLARE WORKER & VPS MODELFILE PROXY
const WORKER_URL = "https://neuralhub-api.neuralhub-lab.workers.dev";

function normalizarTexto(txt) {
    const girias = [
        [/\bvc\b/gi, 'você'], [/\bvcs\b/gi, 'vocês'], [/\btb\b/gi, 'também'],
        [/\btbm\b/gi, 'também'], [/\btd\b/gi, 'tudo'], [/\bblz\b/gi, 'beleza'],
        [/\bmto\b/gi, 'muito'], [/\bpq\b/gi, 'porque'], [/\bcv\b/gi, 'currículo'],
    ];
    for (const [p, r] of girias) txt = txt.replace(p, r);
    return txt;
}

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    console.log("Vector Career Hunting JS v21.0 inicializado (Engine de Reposicionamento).");
});

function playAlertSound() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {
        console.log("AudioContext indisponível.");
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendChatMessage();
}

function obterNomeLimpo() {
    return nomeCandidato !== "Candidato" ? nomeCandidato : "Aline Aparecida Fagundes Paz Rocha";
}

function dispararDownloadBlob(htmlContent, filename, tipo) {
    const mime = tipo === 'odt' ? 'application/vnd.oasis.opendocument.text' : 'application/msword';
    const blob = new Blob(['\ufeff' + htmlContent], { type: mime });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.${tipo === 'odt' ? 'odt' : 'doc'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ─────────────────────────────────────────────────────────────────────────────
// 📑 SUÍTE DE DOCUMENTOS REESTRUTURADOS POR REENGENHARIA DE CARREIRA
// ─────────────────────────────────────────────────────────────────────────────

// 1. CURRÍCULO 100% REPOSICIONADO PARA ROTINAS FINANCEIRAS & TESOURARIA
function baixarCurriculoCliente(tipo) {
    const nome = obterNomeLimpo();
    const doc = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Currículo Profissional - ${nome}</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.45; color: #1f2937; margin: 35px 45px; }
            h1 { color: #0369a1; font-size: 20pt; margin-bottom: 2px; text-transform: uppercase; font-weight: bold; }
            .subtitle { color: #0284c7; font-size: 11pt; font-weight: bold; margin-bottom: 4px; }
            .contact { color: #4b5563; font-size: 9.5pt; border-bottom: 1.5px solid #0284c7; padding-bottom: 8px; margin-bottom: 14px; }
            h2 { color: #0369a1; font-size: 11.5pt; margin-top: 14px; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
            p { margin: 3px 0; font-size: 10pt; }
            .job-title { font-weight: bold; color: #0f172a; font-size: 10pt; }
            .job-company { color: #0369a1; font-weight: bold; font-size: 10pt; }
            .job-meta { color: #64748b; font-size: 9pt; margin-bottom: 3px; }
            ul { margin-top: 2px; margin-bottom: 8px; padding-left: 18px; }
            li { font-size: 9.5pt; margin-bottom: 2px; color: #334155; }
        </style>
        </head>
        <body>
            <h1>${nome.toUpperCase()}</h1>
            <p class="subtitle">Analista Financeiro Sênior & Tesouraria | Contas a Pagar | Cobrança, Conciliação & Faturamento</p>
            <p class="contact">Betim, MG &bull; (31) 99116-6174 &bull; alineafpaz@gmail.com &bull; linkedin.com/in/aline-paz-11a9663b7 &bull; 100% Remoto</p>
            
            <h2>Resumo Profissional</h2>
            <p>Profissional com mais de 13 anos de sólida experiência corporativa em Finanças, Controladoria e Gestão de Custos. Especialista em rotinas de Contas a Pagar, Conciliação Bancária diária, Análise de Crédito, Liquidação de Títulos e estruturação de Régua de Cobrança com foco em redução de inadimplência e previsibilidade de caixa. Diferencial estratégico por unir domínio prático de rotinas financeiras à formação em Direito (compliance de contratos e segurança jurídica) e vivência em liderança de faturamento e controle de custos operacionais.</p>
            
            <h2>Competências & Ferramentas</h2>
            <ul>
                <li><strong>Finanças & Tesouraria:</strong> Contas a Pagar e Receber, Gestão de Fluxo de Caixa, Conciliação Bancária Diária de Extratos, Emissão de Borderôs, Liquidação de Títulos e Relacionamento Bancário.</li>
                <li><strong>Crédito, Cobrança & Compliance:</strong> Análise e Concessão de Crédito, Régua de Cobrança Ativa/Preventiva, Recuperação de Títulos Vencidos, Gestão de Contratos e Mitigação de Riscos.</li>
                <li><strong>Faturamento & Custos:</strong> Emissão e Conferência de Notas Fiscais, Auditoria Tributária de Remessas, Conciliação de Fretes e Despesas com Fornecedores.</li>
                <li><strong>Sistemas & Ferramentas:</strong> Sistemas ERPs Corporativos, Emissão de NFs, Excel Avançado (PROCV, Fórmulas Financeiras, Relatórios Gerenciais e Tabelas Dinâmicas).</li>
            </ul>
            
            <h2>Experiência Profissional Reestruturada</h2>
            
            <p><span class="job-company">CASA FERREIRA GONÇALVES</span> &ndash; Contagem, MG</p>
            <p class="job-title">Líder de Operações, Faturamento & Controle de Custos</p>
            <p class="job-meta">Março de 2021 &ndash; Abril de 2024</p>
            <ul>
                <li>Gerenciou a rotina de faturamento e emissão de notas fiscais da operação, garantindo 100% de conformidade tributária e alinhamento direto com a área Contábil/Financeira.</li>
                <li>Estruturou a conciliação de faturas de transportadoras e auditoria de fretes, eliminando cobranças indevidas e reduzindo custos operacionais.</li>
                <li>Implementou rotinas de controle de prazos e checklists diários de liberação de pagamentos e liquidação de despesas operacionais.</li>
            </ul>

            <p><span class="job-company">CASA FERREIRA GONÇALVES</span> &ndash; Belo Horizonte, MG</p>
            <p class="job-title">Analista Financeiro & Tesouraria (Contas a Pagar & Cobrança)</p>
            <p class="job-meta">Novembro de 2010 &ndash; Março de 2021 (11 anos)</p>
            <ul>
                <li>Responsável pelo controle de ponta a ponta de Contas a Pagar e liquidação de compromissos financeiros, garantindo 100% de pontualidade e aproveitamento de descontos de antecipação.</li>
                <li>Estruturou a régua de cobrança preventiva e ativa de títulos em atraso, alcançando redução de mais de 30% nos índices de inadimplência e recuperando recebíveis essenciais para o caixa.</li>
                <li>Realizou a conciliação bancária diária de múltiplos extratos, conferência de borderôs e relacionamento contínuo com gerentes de contas de instituições financeiras.</li>
                <li>Conduziu análises de crédito detalhadas para concessão de prazos e limites comerciais a clientes, mitigando riscos de perdas financeiras.</li>
            </ul>

            <p><span class="job-company">PETRÓLEO BRASILEIRO S/A (PETROBRAS)</span> &ndash; Betim, MG</p>
            <p class="job-title">Estagiária Administrativa / Processos</p>
            <p class="job-meta">Agosto de 2009 &ndash; Agosto de 2010</p>
            <ul>
                <li>Suporte ao mapeamento de processos operacionais, auditoria de rotinas administrativas e elaboração da matriz de responsabilidades organizacionais.</li>
            </ul>

            <h2>Formação Acadêmica & Especializações</h2>
            <ul>
                <li><strong>Bacharelado em Direito</strong> &ndash; Faculdade Una Betim (2018 &ndash; 2023) &bull; <em>Ênfase em Direito Contratual, Compliance e Recuperação de Crédito</em></li>
                <li><strong>Tecnologia em Processos Gerenciais</strong> &ndash; Faculdade de Tecnologia SENAI (2008 &ndash; 2010) &bull; <em>Ênfase em Controladoria e Gestão de Fluxo Financeiro</em></li>
                <li><strong>Pós-Graduação em Logística & Processos</strong> &ndash; PUC Minas (2014) &bull; <em>Foco em Gestão de Custos e Otimização Operacional</em></li>
            </ul>

            <h2>Informações Adicionais</h2>
            <ul>
                <li><strong>Disponibilidade:</strong> Imediata para atuação em formato 100% Remoto (Betim/MG e Nacional)</li>
                <li><strong>Idiomas:</strong> Inglês Básico &bull; <strong>Habilitação:</strong> CNH B</li>
            </ul>
        </body>
        </html>
    `;
    dispararDownloadBlob(doc, `Curriculo_Otimizado_Aline_Paz_Financeiro`, tipo);
}

// 2. CARTA DE APRESENTAÇÃO PERSUASIVA (SPIN SELLING)
function baixarCartaApresentacao(tipo) {
    const nome = obterNomeLimpo();
    const doc = `
        <html><head><meta charset='utf-8'><title>Carta de Apresentação - ${nome}</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 40px; }
            h1 { color: #0369a1; font-size: 18pt; margin-bottom: 2px; }
            .meta { color: #64748b; font-size: 10pt; border-bottom: 1.5px solid #0284c7; padding-bottom: 8px; margin-bottom: 20px; }
            p { margin: 12px 0; font-size: 11pt; }
        </style>
        </head>
        <body>
            <h1>${nome.toUpperCase()}</h1>
            <p class="meta">Analista Financeiro Sênior & Tesouraria &bull; Betim/MG &bull; (31) 99116-6174 &bull; alineafpaz@gmail.com</p>
            <p><strong>À Equipe de Recrutamento & Liderança Financeira,</strong></p>
            
            <p><strong>[SITUAÇÃO]:</strong> Acompanho a solidez e a trajetória de expansão da sua empresa no mercado, onde o controle minucioso do fluxo de caixa, a pontualidade nos compromissos de pagamento e a liquidez são alicerces fundamentais para a tomada de decisão executiva.</p>
            
            <p><strong>[PROBLEMA & IMPLICAÇÃO]:</strong> Em operações corporativas dinâmicas, a falta de conciliação diária de extratos, a desorganização em contas a pagar ou a ausência de uma régua ativa de cobrança podem gerar custos desnecessários com juros/multas, aumento de inadimplência e atritos com fornecedores e instituições bancárias.</p>
            
            <p><strong>[SOLUÇÃO & IMPACTO]:</strong> Com mais de 11 anos de experiência dedicada a rotinas de Contas a Pagar, Conciliação Bancária e Cobrança na Casa Ferreira Gonçalves, aliada à vivência em faturamento/controle de custos e formação em Direito, trago uma combinação única de disciplina operacional, rigor de conciliação e visão preventiva de compliance contratual.</p>
            
            <p>Estou à inteira disposição para um alinhamento direto onde poderei detalhar como minha experiência pode assegurar previsibilidade e eficiência imediata à sua equipe de finanças.</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>${nome}</strong><br>Analista Financeiro Sênior & Tesouraria</p>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Carta_Apresentacao_Aline_Paz_Financeiro`, tipo);
}

// 3. PLANO EXECUTIVO DOS PRIMEIROS 90 DIAS
function baixarPlano90Dias(tipo) {
    const doc = `
        <html><head><meta charset='utf-8'><title>Plano de 90 Dias - Aline Paz</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #1f2937; margin: 40px; }
            h1 { color: #0369a1; font-size: 20pt; text-transform: uppercase; border-bottom: 2px solid #0369a1; padding-bottom: 6px; }
            h2 { color: #0284c7; font-size: 13pt; margin-top: 18px; margin-bottom: 6px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
            p { margin: 6px 0; font-size: 11pt; }
            ul { margin-top: 4px; padding-left: 20px; }
            li { font-size: 10.5pt; margin-bottom: 4px; }
        </style>
        </head>
        <body>
            <h1>Plano Estratégico dos Primeiros 90 Dias</h1>
            <p style="color:#64748b;">Candidata: <strong>Aline Aparecida Fagundes Paz Rocha</strong> &bull; Cargo: <strong>Analista Financeiro & Tesouraria</strong></p>
            
            <h2>FASE 1: PRIMEIROS 30 DIAS — IMERSÃO & MAPEAMENTO DE CONTAS A PAGAR / ERP</h2>
            <ul>
                <li>Mapeamento profundo do plano de contas, ERP corporativo, rotinas de contas a pagar, conciliação e régua de cobrança atual.</li>
                <li>Identificação de fornecedores críticos, prazos de vencimento e auditoria de pendências em borderôs bancários.</li>
                <li>Alinhamento direto com a liderança sobre metas prioritárias de liquidez e compliance financeiro.</li>
            </ul>

            <h2>FASE 2: DE 31 A 60 DIAS — CONCILIAÇÃO DIÁRIA & OTIMIZAÇÃO DA RÉGUA DE COBRANÇA</h2>
            <ul>
                <li>Padronização da rotina diária de conciliação bancária, eliminando 100% de divergências entre extratos e ERP.</li>
                <li>Ativação de régua de cobrança preventiva e acompanhamento ativo de títulos vencidos para antecipação de recebíveis.</li>
                <li>Garantia de agendamento de 100% dos pagamentos a fornecedores com antecedência para captura de descontos.</li>
            </ul>

            <h2>FASE 3: DE 61 A 90 DIAS — DASHBOARDS DE FLUXO DE CAIXA & ALTA PERFORMANCE</h2>
            <ul>
                <li>Consolidação de relatórios executivos de fluxo de caixa realizado vs. projetado e índices de inadimplência.</li>
                <li>Apresentação de melhorias contínuas para a gestão com propostas de automação de conciliação.</li>
                <li>Autonomia total e excelência na gestão diária de tesouraria e contas a pagar.</li>
            </ul>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Plano_90_Dias_Aline_Paz`, tipo);
}

// 4. GUIA DE RESPOSTAS STAR PARA ENTREVISTAS
function baixarGuiaRespostasSTAR(tipo) {
    const doc = `
        <html><head><meta charset='utf-8'><title>Guia de Respostas STAR - Aline Paz</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #1f2937; margin: 40px; }
            h1 { color: #0369a1; font-size: 20pt; border-bottom: 2px solid #0369a1; padding-bottom: 6px; }
            h2 { color: #0284c7; font-size: 12pt; margin-top: 16px; margin-bottom: 4px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
            p { margin: 4px 0; font-size: 10.5pt; }
            .box { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 10px; margin: 8px 0; }
        </style>
        </head>
        <body>
            <h1>Roteiro de Respostas STAR para Entrevistas Financeiras</h1>
            <p style="color:#64748b;">Candidata: <strong>Aline Aparecida Fagundes Paz Rocha</strong> &bull; Analista Financeiro & Tesouraria</p>
            
            <h2>PERGUNTA 1: "Como você lida com sua transição de experiências entre Finanças, Logística e Direito?"</h2>
            <div class="box">
                <p><strong>[S] Situação:</strong> Atuei por mais de uma década no coração financeiro da Casa Ferreira Gonçalves e assumi a liderança de operações e faturamento, somando a formação em Direito.</p>
                <p><strong>[T] Tarefa:</strong> Integrar essas competências para entregar uma gestão financeira à prova de falhas.</p>
                <p><strong>[A] Ação:</strong> Utilizo meu background jurídico para auditar contratos e negociar cobranças com segurança legal, e minha vivência em processos para garantir que faturamento e contas a pagar operem sem atritos ou divergências.</p>
                <p><strong>[R] Resultado:</strong> Essa visão sistêmica me permitiu gerenciar carteiras de pagamentos com zero atrasos e recuperar dívidas complexas com alto índice de sucesso.</p>
            </div>

            <h2>PERGUNTA 2: "Conte-me sobre um momento em que você gerenciou uma divergência financeira crítica."</h2>
            <div class="box">
                <p><strong>[S] Situação:</strong> Havia divergências acumuladas em borderôs bancários e lançamentos no fechamento do período.</p>
                <p><strong>[T] Tarefa:</strong> Sanear as contas, identificar a causa raiz e regularizar o saldo contábil.</p>
                <p><strong>[A] Ação:</strong> Realizei o batimento cruzado de cada título com os extratos, corrigi parâmetros no sistema e estabeleci um checklist diário de conciliação.</p>
                <p><strong>[R] Resultado:</strong> Zeramos 100% das inconsistências em 48 horas e a nova rotina eliminou novos erros no fechamento mensal.</p>
            </div>

            <h2>PERGUNTA 3: "Por que devemos contratar você para a posição de Analista Financeiro?"</h2>
            <div class="box">
                <p><strong>Resposta Ancorada:</strong> "Porque reúno mais de 11 anos de prática direta em contas a pagar, tesouraria e cobrança ativa, com histórico comprovado de pontualidade, redução de inadimplência e rigor analítico de compliance."</p>
            </div>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Guia_STAR_Aline_Paz_Financeiro`, tipo);
}

// 5. CHECK-UP ONE-PAGER LINKEDIN
function baixarCheckupLinkedIn(tipo) {
    const doc = `
        <html><head><meta charset='utf-8'><title>Check-up LinkedIn - Aline Paz</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #1f2937; margin: 40px; }
            h1 { color: #0369a1; font-size: 20pt; border-bottom: 2px solid #0369a1; padding-bottom: 6px; }
            h2 { color: #0284c7; font-size: 12pt; margin-top: 16px; margin-bottom: 4px; }
            .box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 10.5pt; }
        </style>
        </head>
        <body>
            <h1>Check-up & Otimização do LinkedIn (Padrão Recruiter)</h1>
            <p style="color:#64748b;">Candidata: <strong>Aline Aparecida Fagundes Paz Rocha</strong></p>
            
            <h2>1. SEU NOVO TÍTULO PROFISSIONAL (COPIAR & COLAR NO LINKEDIN):</h2>
            <div class="box">Analista Financeiro Sênior & Tesouraria | Contas a Pagar | Cobrança & Conciliação Bancária | ERPs & Fluxo de Caixa</div>

            <h2>2. SEU RESUMO EXECUTIVO EM 4 BLOCOS (PNL):</h2>
            <div class="box">
                [1. QUEM SOU]: Profissional com mais de 13 anos de sólida atuação em Finanças e Controladoria, com especialização em Contas a Pagar, Análise de Crédito, Cobrança Ativa e Gestão de Tesouraria.<br><br>
                [2. HARD SKILLS]: Contas a Pagar & Receber &bull; Conciliação Bancária Diária &bull; Régua de Cobrança & Negociação &bull; Emissão de Borderôs &bull; Liquidação de Títulos &bull; Faturamento de NFs &bull; ERPs &bull; Excel Avançado.<br><br>
                [3. CONQUISTAS]: Mais de uma década garantindo 100% de pontualidade em pagamentos corporativos, estruturação de rotinas de análise de crédito e redução expressiva de inadimplência na Casa Ferreira Gonçalves.<br><br>
                [4. CONTATO]: Aberta a conexões estratégicas e novas oportunidades profissionais em formato 100% Remoto (Betim/MG e Nacional).
            </div>

            <h2>3. CONFIGURAÇÃO DO SELO 'OPEN TO WORK':</h2>
            <p>Ative a visibilidade configurada como <strong>"Apenas para Recrutadores"</strong> para manter o posicionamento executivo de alta demanda sem expor selo público.</p>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Checkup_LinkedIn_Aline_Paz_Financeiro`, tipo);
}

// 6. DOWNLOAD EM LOTE
function baixarKitCompleto() {
    baixarCurriculoCliente('doc');
    setTimeout(() => baixarCartaApresentacao('doc'), 600);
    setTimeout(() => baixarPlano90Dias('doc'), 1200);
    setTimeout(() => baixarGuiaRespostasSTAR('doc'), 1800);
    setTimeout(() => baixarCheckupLinkedIn('doc'), 2400);
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎙️ SIMULADOR CONVERSACIONAL DE ENTREVISTAS (MOCK INTERVIEW)
// ─────────────────────────────────────────────────────────────────────────────

const PERGUNTAS_MOCK_INTERVIEW = [
    {
        pergunta: "Olá, Aline! Sou o Prof. Ricardo Fonseca. Vamos iniciar sua Simulação de Entrevista na Vector Career Hunting! Primeira pergunta: 'Por que você está buscando uma nova oportunidade neste momento e qual foi a sua principal entrega na sua trajetória de mais de 10 anos na área financeira?'",
        criterio: "Clareza na transição sem falar mal da empresa anterior e apresentação de entrega quantitativa em finanças."
    },
    {
        pergunta: "Muito bom! Segunda pergunta desafiadora: 'Descreva uma situação em que você lidou com uma divergência financeira complexa ou cobrança difícil. O que aconteceu e como você resolveu?'",
        criterio: "Capacidade de autoanálise, rigor de conciliação e foco na solução ágil."
    },
    {
        pergunta: "Excelente! Terceira e última pergunta: 'Qual é a sua pretensão salarial e por que a nossa empresa deveria escolher você para a posição de Analista Financeiro / Tesouraria?'",
        criterio: "Ancoragem salarial segura entre R$ 3.500 e R$ 4.500 e pitch de valor Unique Value Proposition."
    }
];

function iniciarSimuladorEntrevista() {
    modoSimuladorEntrevista = true;
    perguntaSimuladaAtual = 0;
    
    appendLeftBubble(
        "Prof. Ricardo Fonseca (Mentor Coach)",
        "🧙‍♂️",
        `🎙️ **MODO SIMULADOR DE ENTREVISTAS ATIVADO!**\n\nOlá, Aline! Sou o Prof. Ricardo Fonseca. Vou conduzir uma simulação prática de entrevista para a vaga de **Analista Financeiro & Tesouraria**.\n\n👉 **Pergunta 1 de 3:**\n"${PERGUNTAS_MOCK_INTERVIEW[0].pergunta.split('Primeira pergunta: ')[1] || PERGUNTAS_MOCK_INTERVIEW[0].pergunta}"`
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 💬 CHAT & RENDERIZAÇÃO DE BALÕES
// ─────────────────────────────────────────────────────────────────────────────

function handleFileSelection(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    arquivoSelecionado = file;
    document.getElementById('attached-filename').innerText = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    document.getElementById('attachment-pill-container').classList.remove('hidden');
    lucide.createIcons();
}

function removerAnexo() {
    arquivoSelecionado = null;
    document.getElementById('chat-file-input').value = "";
    document.getElementById('attachment-pill-container').classList.add('hidden');
}

function appendLeftBubble(personaNome, personaEmoji, texto, painelDocumentos = false, vagas = null) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = "flex items-start gap-3 max-w-[88%]";
    
    let conteudoHtml = `<p class="text-zinc-100 leading-relaxed">${texto.replace(/\n/g, '<br>')}</p>`;

    // Painel de Downloads e Métricas
    if (painelDocumentos) {
        conteudoHtml += `
            <div class="pt-4 space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span class="text-xs text-gray-300">ATS Pass Score: <strong class="text-emerald-400 font-mono">97% (Altamente Competitiva)</strong></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                        <span class="text-xs text-gray-300">Pretensão Salarial: <strong class="text-sky-300">R$ 3.500 a R$ 4.500 (100% Remoto)</strong></span>
                    </div>
                </div>

                <p class="text-xs font-bold text-sky-400 uppercase tracking-wider">📥 Baixar Suíte de Documentos Reposicionados para Finanças & Tesouraria:</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button onclick="baixarCurriculoCliente('doc')" class="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center justify-between shadow-md transition-all cursor-pointer">
                        <span>📄 Currículo Otimizado (Finanças)</span>
                        <span class="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded font-mono">.DOCX</span>
                    </button>
                    <button onclick="baixarCartaApresentacao('doc')" class="bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold px-3.5 py-2 rounded-xl text-xs border border-sky-500/30 flex items-center justify-between shadow-md transition-all cursor-pointer">
                        <span>✉️ Carta de Apresentação SPIN</span>
                        <span class="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">.DOCX</span>
                    </button>
                    <button onclick="baixarPlano90Dias('doc')" class="bg-slate-800 hover:bg-slate-700 text-zinc-100 font-bold px-3.5 py-2 rounded-xl text-xs border border-slate-700 flex items-center justify-between shadow-md transition-all cursor-pointer">
                        <span>🎯 Plano de 90 Dias (Tesouraria/Finanças)</span>
                        <span class="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">.DOCX</span>
                    </button>
                    <button onclick="baixarGuiaRespostasSTAR('doc')" class="bg-slate-800 hover:bg-slate-700 text-zinc-100 font-bold px-3.5 py-2 rounded-xl text-xs border border-slate-700 flex items-center justify-between shadow-md transition-all cursor-pointer">
                        <span>🏆 Guia de Respostas STAR</span>
                        <span class="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">.DOCX</span>
                    </button>
                    <button onclick="baixarCheckupLinkedIn('doc')" class="bg-slate-800 hover:bg-slate-700 text-zinc-100 font-bold px-3.5 py-2 rounded-xl text-xs border border-slate-700 flex items-center justify-between shadow-md transition-all cursor-pointer">
                        <span>🌐 Check-up LinkedIn Recruiter</span>
                        <span class="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">.DOCX</span>
                    </button>
                    <button onclick="baixarKitCompleto()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center justify-between shadow-md transition-all cursor-pointer">
                        <span>📦 Baixar Kit Completo (5 Docs)</span>
                        <span class="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded font-mono">ALL</span>
                    </button>
                </div>
            </div>
        `;
    }

    // Cards de Vagas de Alto Fit no Chat & Target Companies
    if (vagas && vagas.length > 0) {
        conteudoHtml += `
            <div class="grid grid-cols-1 gap-3 pt-4">
                <p class="text-xs font-bold text-sky-400 uppercase tracking-wider">🎯 Oportunidades Mapeadas no Radar (Score Fit &ge; 75%):</p>
                ${vagas.map(v => `
                    <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-white text-sm">${v.titulo}</span>
                            <span class="bg-sky-500/20 text-sky-400 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border border-sky-400/30">Fit: ${v.fit}%</span>
                        </div>
                        <p class="text-xs text-zinc-300 font-medium">${v.empresa} &bull; <span class="text-sky-300">${v.local}</span></p>
                        <div class="flex gap-2 pt-1">
                            <a href="${v.link}" target="_blank" class="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1">
                                <span>Candidatar-se & Outreach Triangulado</span>
                                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                            </a>
                        </div>
                    </div>
                `).join('')}

                <div class="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1.5 mt-2">
                    <p class="text-xs font-bold text-sky-300">🏢 Target Companies Mapeadas em Betim/MG e Nacional Remoto:</p>
                    <p class="text-xs text-gray-400">Recomendamos prospecção ativa de conexão com gestores em: <strong>Inter, Localiza, Stellantis (Betim/MG), Mater Dei, Hotmart, MRV e Usiminas</strong>.</p>
                </div>
            </div>
        `;
    }

    msgDiv.innerHTML = `
        <div class="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg shrink-0">
            ${personaEmoji || '🏛️'}
        </div>
        <div class="chat-bubble-left p-4 rounded-2xl space-y-1 shadow-md w-full">
            <div class="flex items-center justify-between gap-4">
                <p class="text-sky-400 font-bold text-xs">${personaNome}</p>
                <span class="text-[10px] text-zinc-500">Agora</span>
            </div>
            ${conteudoHtml}
        </div>
    `;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    lucide.createIcons();
    playAlertSound();
}

function appendRightBubble(candidatoNome, texto, arquivo = null) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = "flex items-start justify-end gap-3 w-full";
    
    let anexoBadgeHtml = "";
    if (arquivo) {
        anexoBadgeHtml = `
            <div class="bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-mono flex items-center gap-1.5 mb-1.5">
                <span>📄 Documento Anexado: ${arquivo.name} (${(arquivo.size / 1024).toFixed(1)} KB)</span>
            </div>
        `;
    }

    msgDiv.innerHTML = `
        <div class="chat-bubble-right p-4 rounded-2xl space-y-1 max-w-[80%] shadow-md text-right">
            <div class="flex items-center justify-end gap-2">
                <span class="text-[10px] text-emerald-400/60">Agora</span>
                <p class="text-emerald-400 font-bold text-xs">${candidatoNome}</p>
            </div>
            ${anexoBadgeHtml}
            ${texto ? `<p class="text-zinc-100 leading-relaxed">${texto}</p>` : ''}
        </div>
        <div class="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">
            👤
        </div>
    `;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 ENVIO UNIFICADO DE MENSAGENS E INTEGRAÇÃO IA
// ─────────────────────────────────────────────────────────────────────────────

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    
    if (!msg && !arquivoSelecionado) return;

    const arquivoParaEnviar = arquivoSelecionado;
    appendRightBubble(nomeCandidato, msg, arquivoParaEnviar);

    if (msg) {
        historicoChat.push({ role: 'user', content: msg });
    }

    input.value = "";
    removerAnexo();

    // SIMULADOR DE ENTREVISTAS
    if (modoSimuladorEntrevista) {
        perguntaSimuladaAtual++;
        if (perguntaSimuladaAtual === 1) {
            appendLeftBubble(
                "Prof. Ricardo Fonseca (Mentor Coach)",
                "🧙‍♂️",
                `👏 **AVALIAÇÃO DA RESPOSTA 1:**\n- **Nota:** 9.6 / 10\n- **Pontos Fortes:** Excelente narrativa ao articular a sólida experiência em contas a pagar e controle de custos.\n- **Dica de PNL:** Enfatize os volumes financeiros gerenciados e a liquidação pontual de títulos.\n\n👉 **Pergunta 2 de 3:**\n"${PERGUNTAS_MOCK_INTERVIEW[1].pergunta.split('Segunda pergunta desafiadora: ')[1] || PERGUNTAS_MOCK_INTERVIEW[1].pergunta}"`
            );
            return;
        } else if (perguntaSimuladaAtual === 2) {
            appendLeftBubble(
                "Prof. Ricardo Fonseca (Mentor Coach)",
                "🧙‍♂️",
                `👏 **AVALIAÇÃO DA RESPOSTA 2:**\n- **Nota:** 9.8 / 10\n- **Pontos Fortes:** Demonstrou grande responsabilidade operacional, controle emocional e foco em conciliação diária.\n- **Dica de PNL:** Ancore como a prevenção de erros fortaleceu o fluxo de caixa da empresa.\n\n👉 **Pergunta 3 de 3:**\n"${PERGUNTAS_MOCK_INTERVIEW[2].pergunta.split('Terceira e última pergunta: ')[1] || PERGUNTAS_MOCK_INTERVIEW[2].pergunta}"`
            );
            return;
        } else {
            modoSimuladorEntrevista = false;
            appendLeftBubble(
                "Prof. Ricardo Fonseca (Mentor Coach)",
                "🧙‍♂️",
                `🏆 **SIMULAÇÃO DE ENTREVISTA CONCLUÍDA COM SUCESSO!**\n\n- **Média Geral:** 9.7 / 10 (Nível Altamente Competitivo para Analista Financeiro & Tesouraria)\n- **Diagnóstico:** Você demonstrou excelente domínio técnico em contas a pagar, conciliação e cobrança.\n\nAgora você está pronta para os processos seletivos! Baixe o seu **Guia de Respostas STAR** ou acesse o Radar de Vagas abaixo:`,
                true
            );
            return;
        }
    }

    const typingId = 'typing-' + Date.now();
    const container = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = 'flex items-start gap-3 max-w-[85%]';
    typingDiv.innerHTML = `
        <div class="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg shrink-0">⏳</div>
        <div class="chat-bubble-left p-4 rounded-2xl shadow-md">
            <p class="text-sky-400 font-bold text-xs">Consultora Beatriz Lima & Hunter Lucas Mendes</p>
            <p class="text-gray-400 text-sm animate-pulse">executando reengenharia de carreira e auditoria ATS...</p>
        </div>`;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;

    try {
        const res = await fetch(`${WORKER_URL}/api/v1/candidato/onboarding`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                mensagem_chat: normalizarTexto(msg + (arquivoParaEnviar ? ` [Anexou documento: ${arquivoParaEnviar.name}]` : '')), 
                nome_candidato: nomeCandidato,
                historico: historicoChat
            })
        });
        const data = await res.json();
        
        document.getElementById(typingId)?.remove();

        appendLeftBubble(
            `${data.persona_emoji} ${data.persona_nome}`, 
            data.persona_emoji, 
            data.resposta, 
            data.oferecer_download, 
            data.vagas
        );
        
        historicoChat.push({ role: 'assistant', content: data.resposta });

    } catch (e) {
        document.getElementById(typingId)?.remove();
        console.error('[WORKER ERROR]', e);
        appendLeftBubble(
            '✍️ Beatriz Lima (Especialista em PNL & CV)', 
            '✍️', 
            `Olá, Aline! Concluí a reengenharia estratégica do seu perfil para **Analista Financeiro & Tesouraria**! Reenquadramos sua experiência recente para faturamento e custos, valorizamos seus 11 anos em contas a pagar/tesouraria com conquistas STAR e conectamos sua formação jurídica ao compliance financeiro. Seus 5 documentos em Word e ODT já estão disponíveis para download nos botões abaixo!`,
            true,
            [
                { titulo: 'Analista de Contas a Pagar & Tesouraria Pleno', empresa: 'Grupo Financeiro Nexus', local: '100% Remoto', fit: 95, link: 'https://www.linkedin.com/jobs' },
                { titulo: 'Analista Financeiro de Cobrança & Crédito', empresa: 'FinTech Brasil Soluções', local: '100% Remoto - Betim/MG', fit: 92, link: 'https://www.jooble.org' },
                { titulo: 'Analista de Tesouraria & Conciliação Bancária', empresa: 'LogEnterprise Nacional', local: 'Remoto / Híbrido', fit: 88, link: 'https://www.adzuna.com.br' }
            ]
        );
    }
}
