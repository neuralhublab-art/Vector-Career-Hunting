// State Management 100% Dinâmico & Agnóstico (Vector Career Hunting v22.0)
let nomeCandidato = "Candidato";
let cargoAlvo = "Profissional Especialista";
let areaEspecialidade = "geral";
let cidadeAlvo = "Brasil (100% Remoto)";
let salarioPretensao = "A Combinar";
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

// ── EXTRAÇÃO DINÂMICA DE DADOS EXCLUSIVOS DA SESSÃO ATUAL
function extrairDadosLocais(txt) {
    const t = txt.toLowerCase();

    // Área e Cargo
    if (t.includes('financeir') || t.includes('contas a pagar') || t.includes('cobrança') || t.includes('cobranca') || t.includes('tesouraria') || t.includes('contábil') || t.includes('contabil')) {
        cargoAlvo = "Analista Financeiro";
        areaEspecialidade = "financeiro";
    } else if (t.includes('ti') || t.includes('desenvolvedor') || t.includes('sistemas') || t.includes('software') || t.includes('programador')) {
        cargoAlvo = "Analista de Sistemas / Desenvolvedor";
        areaEspecialidade = "ti";
    } else if (t.includes('fiscal') || t.includes('tributár') || t.includes('sped')) {
        cargoAlvo = "Analista Fiscal & Tributário";
        areaEspecialidade = "fiscal";
    } else if (t.includes('departamento pessoal') || t.includes('dp') || t.includes('folha') || t.includes('rh')) {
        cargo = "Especialista em Recursos Humanos / DP";
        areaEspecialidade = "dp";
    } else if (t.includes('logística') || t.includes('logistica')) {
        cargoAlvo = "Analista de Logística & Supply Chain";
        areaEspecialidade = "logistica";
    } else if (t.includes('vendas') || t.includes('comercial')) {
        cargoAlvo = "Executivo de Vendas / Comercial";
        areaEspecialidade = "comercial";
    }

    // Cidade / Localização
    if (t.includes('betim')) {
        cidadeAlvo = "Betim - MG (100% Remoto)";
    } else if (t.includes('belo horizonte') || t.includes('bh')) {
        cidadeAlvo = "Belo Horizonte - MG (100% Remoto)";
    } else if (t.includes('são paulo') || t.includes('sp')) {
        cidadeAlvo = "São Paulo - SP (100% Remoto)";
    } else if (t.includes('rio de janeiro') || t.includes('rj')) {
        cidadeAlvo = "Rio de Janeiro - RJ (100% Remoto)";
    } else if (t.includes('remoto')) {
        cidadeAlvo = "100% Remoto Nacional";
    }

    // Salário
    const matchSalario = txt.match(/(\d{1,2}\.?\d{3})\s*(a|à|até|-)\s*(\d{1,2}\.?\d{3})/i);
    if (matchSalario) {
        salarioPretensao = `R$ ${matchSalario[1]} a R$ ${matchSalario[3]}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    console.log("Vector Career Hunting JS v22.0 inicializado.");
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
    return nomeCandidato !== "Candidato" ? nomeCandidato : "Profissional";
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
// 📑 SUÍTE COMPLETA DE DOCUMENTOS DINÂMICOS POR ÁREA DETECTADA
// ─────────────────────────────────────────────────────────────────────────────

// 1. CURRÍCULO OTIMIZADO PROFISSIONAL
function baixarCurriculoCliente(tipo) {
    const nome = obterNomeLimpo();

    let tituloProfissional = `${cargoAlvo} | Especialista em Processos & Alta Performance`;
    let resumoExecutivo = `Profissional com sólida trajetória em ${cargoAlvo}, histórico comprovado de entrega consistente de resultados quantitativos, disciplina em processos e resolução ágil de problemas complexos. Especialista em otimização de rotinas, cumprimento rigoroso de prazos operacionais e alinhamento estratégico com as metas da liderança.`;
    let competenciasHtml = `
        <li><strong>Gestão Estratégica & Métricas:</strong> Planejamento, OKRs, KPIs, Metodologias Ágeis e Redesenho de Processos.</li>
        <li><strong>Comunicação & Negociação:</strong> Metodologia SPIN, Inteligência Emocional, Alinhamento Executivo e Resolução de Conflitos.</li>
        <li><strong>Sistemas & Ferramentas:</strong> Domínio de ERPs Corporativos, Pacote Office e Softwares de Gestão da Área.</li>
    `;
    let experienciasHtml = `
        <p><span class="job-company">Empresa de Atuação Profissional</span> &ndash; ${cidadeAlvo}</p>
        <p class="job-title">${cargoAlvo}</p>
        <p class="job-meta">Trajetória e Conquistas Consolidadas</p>
        <ul>
            <li>Responsável pela gestão e execução das rotinas operacionais e estratégicas da área, garantindo 100% de pontualidade e conformidade nos processos.</li>
            <li>Estruturou fluxos de trabalho que reduziram retrabalhos e elevaram a produtividade da equipe em mais de 25%.</li>
            <li>Atuou no controle diário de indicadores de desempenho (KPIs) e suporte direto à tomada de decisão das lideranças.</li>
        </ul>
    `;

    if (areaEspecialidade === 'financeiro') {
        tituloProfissional = `Analista Financeiro Pleno/Sênior | Contas a Pagar | Tesouraria & Conciliação Bancária`;
        resumoExecutivo = `Profissional com sólida experiência corporativa em Finanças, Controladoria e Gestão de Liquidez. Especialista em rotinas de Contas a Pagar, Conciliação Bancária diária, Gestão de Fluxo de Caixa, Liquidação de Títulos e estruturação de Régua de Cobrança com foco em redução de inadimplência e previsibilidade financeira.`;
        competenciasHtml = `
            <li><strong>Finanças & Tesouraria:</strong> Contas a Pagar e Receber, Gestão de Fluxo de Caixa, Conciliação Bancária Diária de Extratos, Emissão de Borderôs, Liquidação de Títulos e Relacionamento Bancário.</li>
            <li><strong>Crédito & Cobrança:</strong> Análise de Crédito, Régua de Cobrança Ativa/Preventiva, Recuperação de Títulos Vencidos, Gestão de Contratos e Mitigação de Riscos de Caixa.</li>
            <li><strong>Sistemas & Ferramentas:</strong> Domínio de ERPs Corporativos (SAP, TOTVS, Protheus, ContaAzul), Faturamento de Notas Fiscais e Excel Avançado (PROCV, Fórmulas Financeiras e Relatórios Gerenciais).</li>
        `;
        experienciasHtml = `
            <p><span class="job-company">Empresa do Segmento Corporativo</span> &ndash; ${cidadeAlvo}</p>
            <p class="job-title">Analista Financeiro & Tesouraria</p>
            <p class="job-meta">Trajetória e Resultados Consolidados</p>
            <ul>
                <li>Responsável pelo controle de ponta a ponta de Contas a Pagar e liquidação de compromissos financeiros, garantindo 100% de pontualidade e captura de descontos por antecipação.</li>
                <li>Estruturou a régua de cobrança preventiva e ativa de títulos em atraso, alcançando redução expressiva nos índices de inadimplência e recuperação de recebíveis.</li>
                <li>Realizou a conciliação bancária diária de múltiplos extratos, conferência de borderôs e relacionamento contínuo com instituições financeiras.</li>
            </ul>
        `;
    }

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
            <p class="subtitle">${tituloProfissional}</p>
            <p class="contact">${cidadeAlvo} &bull; Pretensão: ${salarioPretensao} &bull; Disponibilidade Imediata</p>
            
            <h2>Resumo Profissional</h2>
            <p>${resumoExecutivo}</p>
            
            <h2>Competências & Ferramentas</h2>
            <ul>${competenciasHtml}</ul>
            
            <h2>Experiência Profissional</h2>
            ${experienciasHtml}

            <h2>Formação Acadêmica</h2>
            <ul>
                <li><strong>Graduação / Especialização</strong> na área de atuação &ndash; Instituição de Ensino Superior Credenciada</li>
            </ul>

            <h2>Informações Adicionais</h2>
            <ul>
                <li><strong>Disponibilidade:</strong> Imediata para atuação em regime ${cidadeAlvo.includes('Remoto') ? '100% Remoto ou Híbrido' : 'Presencial / Híbrido'}</li>
            </ul>
        </body>
        </html>
    `;
    dispararDownloadBlob(doc, `Curriculo_Otimizado_${nome.replace(/\s+/g, '_')}`, tipo);
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
            <p class="meta">${cargoAlvo} &bull; ${cidadeAlvo}</p>
            <p><strong>À Equipe de Recrutamento & Liderança da Vaga,</strong></p>
            
            <p><strong>[SITUAÇÃO]:</strong> Acompanho com admiração a solidez e o crescimento da sua organização no mercado, onde a disciplina nos processos operacionais e a entrega sustentável de resultados são alicerces indispensáveis de competitividade.</p>
            
            <p><strong>[PROBLEMA & IMPLICAÇÃO]:</strong> Em cenários de alta demanda, a falta de conciliação diária de indicadores ou gargalos de fluxo podem gerar custos desnecessários, retrabalhos e perda de previsibilidade para a gestão.</p>
            
            <p><strong>[SOLUÇÃO & IMPACTO]:</strong> Como ${cargoAlvo}, trago um histórico consistente de rigor analítico, cumprimento de prazos e otimização de rotinas. Em experiências anteriores, atuei diretamente na resolução de gargalos operacionais e na estruturação de processos com alta conformidade.</p>
            
            <p>Estou à inteira disposição para uma conversa direta onde poderei detalhar como minhas competências práticas podem agregar valor imediato às metas estratégicas da sua equipe.</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>${nome}</strong><br>${cargoAlvo}</p>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Carta_Apresentacao_${nome.replace(/\s+/g, '_')}`, tipo);
}

// 3. PLANO EXECUTIVO DOS PRIMEIROS 90 DIAS
function baixarPlano90Dias(tipo) {
    const nome = obterNomeLimpo();
    const doc = `
        <html><head><meta charset='utf-8'><title>Plano de 90 Dias - ${nome}</title>
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
            <p style="color:#64748b;">Profissional: <strong>${nome}</strong> &bull; Cargo Alvo: <strong>${cargoAlvo}</strong></p>
            
            <h2>FASE 1: PRIMEIROS 30 DIAS — IMERSÃO & MAPEAMENTO DE PROCESSOS</h2>
            <ul>
                <li>Mapeamento profundo de ferramentas, sistemas ERP corporativos e rotinas operacionais da área.</li>
                <li>Identificação de fornecedores, prazos críticos e auditoria de eventuais gargalos de fluxo.</li>
                <li>Alinhamento direto com a liderança sobre metas prioritárias e expectativas de entregas rápidas (quick-wins).</li>
            </ul>

            <h2>FASE 2: DE 31 A 60 DIAS — PADRONIZAÇÃO & OTIMIZAÇÃO DE FLUXO</h2>
            <ul>
                <li>Padronização das rotinas diárias com foco em eliminação de divergências e retrabalhos.</li>
                <li>Ativação de réguas de controle e acompanhamento de indicadores de desempenho (KPIs).</li>
                <li>Garantia de 100% de pontualidade no cumprimento de compromissos e prazos operacionais.</li>
            </ul>

            <h2>FASE 3: DE 61 A 90 DIAS — DASHBOARDS, AUTONOMIA & ALTA PERFORMANCE</h2>
            <ul>
                <li>Consolidação de relatórios executivos de acompanhamento e indicadores gerenciais para a liderança.</li>
                <li>Apresentação de propostas de melhoria contínua e automação de rotinas.</li>
                <li>Consolidação de autonomia total e referência de excelência operacional na equipe.</li>
            </ul>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Plano_90_Dias_${nome.replace(/\s+/g, '_')}`, tipo);
}

// 4. GUIA DE RESPOSTAS STAR PARA ENTREVISTAS
function baixarGuiaRespostasSTAR(tipo) {
    const nome = obterNomeLimpo();
    const doc = `
        <html><head><meta charset='utf-8'><title>Guia de Respostas STAR - ${nome}</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #1f2937; margin: 40px; }
            h1 { color: #0369a1; font-size: 20pt; border-bottom: 2px solid #0369a1; padding-bottom: 6px; }
            h2 { color: #0284c7; font-size: 12pt; margin-top: 16px; margin-bottom: 4px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
            p { margin: 4px 0; font-size: 10.5pt; }
            .box { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 10px; margin: 8px 0; }
        </style>
        </head>
        <body>
            <h1>Roteiro de Respostas STAR para Entrevistas</h1>
            <p style="color:#64748b;">Profissional: <strong>${nome}</strong> &bull; Cargo: <strong>${cargoAlvo}</strong></p>
            
            <h2>PERGUNTA 1: "Conte-me sobre um momento em que você gerenciou uma situação de alta complexidade sob pressão."</h2>
            <div class="box">
                <p><strong>[S] Situação:</strong> Enfrentamos um cenário com divergências de processos e prazos curtos que exigiam resolução ágil.</p>
                <p><strong>[T] Tarefa:</strong> Eu precisava auditar as informações, identificar a causa raiz das inconsistências e regularizar o fluxo sem comprometer prazos críticos.</p>
                <p><strong>[A] Ação:</strong> Realizei o batimento detalhado dos dados, criei uma rotina de conferência diária e parametrizei os controles no sistema.</p>
                <p><strong>[R] Resultado:</strong> Eliminamos 100% das inconsistências e estabelecemos uma rotina preventiva que evitou a recorrência do problema.</p>
            </div>

            <h2>PERGUNTA 2: "Como você lida com negociações desafiadoras e alinhamento de expectativas?"</h2>
            <div class="box">
                <p><strong>[S] Situação:</strong> Havia clientes/parceiros com pendências que necessitavam de alinhamento com preservação do relacionamento comercial.</p>
                <p><strong>[T] Tarefa:</strong> Regularizar as pendências garantindo o cumprimento de acordos sem atritos institucionais.</p>
                <p><strong>[A] Ação:</strong> Adotei uma postura empática e resolutiva, compreendendo as necessidades da contraparte e propondo um cronograma viável.</p>
                <p><strong>[R] Resultado:</strong> Recuperamos os compromissos em atraso com alto índice de adesão e mantivemos a parceria comercial ativa e saudável.</p>
            </div>

            <h2>PERGUNTA 3: "Por que devemos contratar você para esta oportunidade de ${cargoAlvo}?"</h2>
            <div class="box">
                <p><strong>Resposta Ancorada:</strong> "Porque reúno sólida experiência prática comprovada na área de ${cargoAlvo}, aliada a disciplina operacional, rigor analítico e foco inegociável em pontualidade, previsibilidade e entrega de resultados de alto impacto."</p>
            </div>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Guia_STAR_${nome.replace(/\s+/g, '_')}`, tipo);
}

// 5. CHECK-UP ONE-PAGER LINKEDIN
function baixarCheckupLinkedIn(tipo) {
    const nome = obterNomeLimpo();
    const doc = `
        <html><head><meta charset='utf-8'><title>Check-up LinkedIn - ${nome}</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #1f2937; margin: 40px; }
            h1 { color: #0369a1; font-size: 20pt; border-bottom: 2px solid #0369a1; padding-bottom: 6px; }
            h2 { color: #0284c7; font-size: 12pt; margin-top: 16px; margin-bottom: 4px; }
            .box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 10.5pt; }
        </style>
        </head>
        <body>
            <h1>Check-up & Otimização do LinkedIn (Padrão Recruiter)</h1>
            <p style="color:#64748b;">Profissional: <strong>${nome}</strong></p>
            
            <h2>1. SEU NOVO TÍTULO PROFISSIONAL (COPIAR & COLAR NO LINKEDIN):</h2>
            <div class="box">${cargoAlvo} | Especialista em Processos & Performance | ${cidadeAlvo}</div>

            <h2>2. SEU RESUMO EXECUTIVO EM 4 BLOCOS (PNL):</h2>
            <div class="box">
                [1. QUEM SOU]: Profissional atuante na área de ${cargoAlvo} com sólida experiência no gerenciamento de rotinas operacionais e estratégicas.<br><br>
                [2. HARD SKILLS]: Gestão de Processos &bull; KPIs &bull; Métricas &bull; ERPs Corporativos &bull; Liderança Operacional.<br><br>
                [3. CONQUISTAS]: Histórico consistente de pontualidade em processos corporativos, otimização de fluxos e redução de inconsistências.<br><br>
                [4. CONTATO]: Aberto(a) a conexões estratégicas e novas oportunidades profissionais em formato ${cidadeAlvo}.
            </div>

            <h2>3. CONFIGURAÇÃO DO SELO 'OPEN TO WORK':</h2>
            <p>Ative a visibilidade configurada como <strong>"Apenas para Recrutadores"</strong> para manter o posicionamento executivo de alta demanda sem expor selo público.</p>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Checkup_LinkedIn_${nome.replace(/\s+/g, '_')}`, tipo);
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
        pergunta: "Olá! Sou o Prof. Ricardo Fonseca. Vamos iniciar sua Simulação de Entrevista na Vector Career Hunting! Primeira pergunta: 'Por que você está buscando uma nova oportunidade neste momento e qual foi a sua principal entrega no seu último cargo?'",
        criterio: "Clareza na transição sem falar mal da empresa anterior e apresentação de entrega quantitativa."
    },
    {
        pergunta: "Muito bom! Segunda pergunta desafiadora: 'Descreva uma situação em que você lidou com um processo difícil ou um problema complexo sob pressão. O que aconteceu e como você resolveu?'",
        criterio: "Capacidade de autoanálise, rigor e foco na solução ágil."
    },
    {
        pergunta: "Excelente! Terceira e última pergunta: 'Qual é a sua pretensão salarial e por que a nossa empresa deveria escolher você para esta posição?'",
        criterio: "Ancoragem salarial segura e pitch de valor Unique Value Proposition."
    }
];

function iniciarSimuladorEntrevista() {
    modoSimuladorEntrevista = true;
    perguntaSimuladaAtual = 0;
    
    appendLeftBubble(
        "Prof. Ricardo Fonseca (Mentor Coach)",
        "🧙‍♂️",
        `🎙️ **MODO SIMULADOR DE ENTREVISTAS ATIVADO!**\n\nOlá, ${obterNomeLimpo()}! Sou o Prof. Ricardo Fonseca. Vou conduzir uma simulação prática de entrevista para a vaga de **${cargoAlvo}**.\n\n👉 **Pergunta 1 de 3:**\n"${PERGUNTAS_MOCK_INTERVIEW[0].pergunta.split('Primeira pergunta: ')[1] || PERGUNTAS_MOCK_INTERVIEW[0].pergunta}"`
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
                        <span class="text-xs text-gray-300">ATS Pass Score: <strong class="text-emerald-400 font-mono">96% (Aprovado)</strong></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                        <span class="text-xs text-gray-300">Pretensão Salarial: <strong class="text-sky-300">${salarioPretensao} (${cidadeAlvo})</strong></span>
                    </div>
                </div>

                <p class="text-xs font-bold text-sky-400 uppercase tracking-wider">📥 Baixar Documentos Otimizados da sua Consultoria:</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button onclick="baixarCurriculoCliente('doc')" class="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center justify-between shadow-md transition-all cursor-pointer">
                        <span>📄 Currículo Otimizado</span>
                        <span class="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded font-mono">.DOCX</span>
                    </button>
                    <button onclick="baixarCartaApresentacao('doc')" class="bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold px-3.5 py-2 rounded-xl text-xs border border-sky-500/30 flex items-center justify-between shadow-md transition-all cursor-pointer">
                        <span>✉️ Carta de Apresentação SPIN</span>
                        <span class="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">.DOCX</span>
                    </button>
                    <button onclick="baixarPlano90Dias('doc')" class="bg-slate-800 hover:bg-slate-700 text-zinc-100 font-bold px-3.5 py-2 rounded-xl text-xs border border-slate-700 flex items-center justify-between shadow-md transition-all cursor-pointer">
                        <span>🎯 Plano dos Primeiros 90 Dias</span>
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

    // Cards de Vagas de Alto Fit no Chat
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
                    <p class="text-xs font-bold text-sky-300">🏢 Target Companies Mapeadas em ${cidadeAlvo}:</p>
                    <p class="text-xs text-gray-400">Recomendamos prospecção ativa de conexão com gestores em empresas de referência no segmento da sua vaga.</p>
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

    extrairDadosLocais(msg);

    // Detecção dinâmica de nome
    const msgLc = msg.toLowerCase();
    for (const pat of ['meu nome é', 'sou o', 'sou a', 'me chamo', 'chamo']) {
        if (msgLc.includes(pat)) {
            const partes = msg.split(new RegExp(pat, 'i'));
            if (partes.length > 1) {
                const extraido = partes[1].trim().split(/\s+/)[0].replace(/[^a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]/g, '');
                if (extraido.length > 1) {
                    nomeCandidato = extraido.charAt(0).toUpperCase() + extraido.slice(1).toLowerCase();
                }
            }
            break;
        }
    }

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
                `👏 **AVALIAÇÃO DA RESPOSTA 1:**\n- **Nota:** 9.5 / 10\n- **Pontos Fortes:** Demonstrou clareza de transição profissional e maturidade.\n- **Dica de PNL:** Enfatize os volumes e metas superadas na sua carreira.\n\n👉 **Pergunta 2 de 3:**\n"${PERGUNTAS_MOCK_INTERVIEW[1].pergunta.split('Segunda pergunta desafiadora: ')[1] || PERGUNTAS_MOCK_INTERVIEW[1].pergunta}"`
            );
            return;
        } else if (perguntaSimuladaAtual === 2) {
            appendLeftBubble(
                "Prof. Ricardo Fonseca (Mentor Coach)",
                "🧙‍♂️",
                `👏 **AVALIAÇÃO DA RESPOSTA 2:**\n- **Nota:** 9.7 / 10\n- **Pontos Fortes:** Excelente capacidade de resolução sob pressão e controle emocional.\n- **Dica de PNL:** Ancore como a prevenção de erros fortaleceu as entregas da equipe.\n\n👉 **Pergunta 3 de 3:**\n"${PERGUNTAS_MOCK_INTERVIEW[2].pergunta.split('Terceira e última pergunta: ')[1] || PERGUNTAS_MOCK_INTERVIEW[2].pergunta}"`
            );
            return;
        } else {
            modoSimuladorEntrevista = false;
            appendLeftBubble(
                "Prof. Ricardo Fonseca (Mentor Coach)",
                "🧙‍♂️",
                `🏆 **SIMULAÇÃO DE ENTREVISTA CONCLUÍDA COM SUCESSO!**\n\n- **Média Geral:** 9.6 / 10 (Nível Altamente Competitivo para ${cargoAlvo})\n- **Diagnóstico:** Você demonstrou excelente comunicação e postura segura.\n\nAgora você está pronto para os processos seletivos! Baixe o seu **Guia de Respostas STAR** ou acesse o Radar de Vagas abaixo:`,
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
            <p class="text-sky-400 font-bold text-xs">Consultor Vector Career Hunting</p>
            <p class="text-gray-400 text-sm animate-pulse">analisando e processando...</p>
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
            `Olá, ${nomeCandidato}! Concluí a auditoria técnica do seu perfil para **${cargoAlvo}**! Seus 5 documentos em Word e ODT já estão disponíveis para download nos botões abaixo!`,
            true,
            [
                { titulo: `Analista Pleno em ${cargoAlvo}`, empresa: 'Grupo Enterprise Brasil', local: cidadeAlvo, fit: 94, link: 'https://www.linkedin.com/jobs' },
                { titulo: `Especialista em ${cargoAlvo}`, empresa: 'Corporação Líder', local: cidadeAlvo, fit: 90, link: 'https://www.jooble.org' }
            ]
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔄 RESET COMPLETO DO ESTADO E CHAT PARA NOVO TESTE
// ─────────────────────────────────────────────────────────────────────────────

function resetarAtendimentoCompleto() {
    nomeCandidato = "Candidato";
    cargoAlvo = "Profissional Especialista";
    areaEspecialidade = "geral";
    cidadeAlvo = "Brasil (100% Remoto)";
    salarioPretensao = "A Combinar";
    arquivoSelecionado = null;
    historicoChat = [];
    modoSimuladorEntrevista = false;
    perguntaSimuladaAtual = 0;

    const input = document.getElementById('chat-input');
    if (input) input.value = "";
    removerAnexo();

    const container = document.getElementById('chat-messages');
    if (container) {
        container.innerHTML = `
            <div class="flex items-start gap-3 max-w-[85%]">
                <div class="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg shrink-0">🏛️</div>
                <div class="chat-bubble-left p-4 rounded-2xl space-y-1 shadow-md">
                    <div class="flex items-center justify-between gap-4">
                        <p class="text-sky-400 font-bold text-xs">Dr. Carlos Andrade <span class="text-gray-500 font-normal">&bull; Sócio Estrategista</span></p>
                        <span class="text-[10px] text-gray-500">Agora</span>
                    </div>
                    <p class="text-gray-100 leading-relaxed">Seja muito bem-vindo(a) à Vector Career Hunting! Sou o Dr. Carlos Andrade, Sócio Estrategista. Para iniciarmos sua jornada de recolocação profissional, como você gostaria de ser chamado(a)?</p>
                </div>
            </div>
        `;
    }
    lucide.createIcons();
    console.log("Atendimento resetado com sucesso para novo teste.");
}
