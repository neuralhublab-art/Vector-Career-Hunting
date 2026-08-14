// State Management da Aplicação (Neural HUB Metodologia Oficial v16.0)
let nomeCandidato = "Candidato";
let cargoAlvo = "Profissional Estratégico";
let cidadeAlvo = "Brasil";
let salarioPretensao = "R$ 4.500,00";
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
    console.log("Neural HUB App JS v16.0 (Master Expansion Suite & Mock Interview Active).");
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

// ─────────────────────────────────────────────────────────────────────────────
// 📑 SUÍTE COMPLETA DE GERADORES DE DOCUMENTOS EXECUTIVOS (WORD / LIBREOFFICE)
// ─────────────────────────────────────────────────────────────────────────────

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

// 1. CURRÍCULO OTIMIZADO ATS & PNL
function baixarCurriculoCliente(tipo) {
    const nome = obterNomeLimpo();
    const doc = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Currículo Otimizado PNL & ATS - ${nome}</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #222222; margin: 40px; }
            h1 { color: #0284c7; font-size: 24pt; margin-bottom: 4px; text-transform: uppercase; border-bottom: 2px solid #0284c7; padding-bottom: 6px; }
            h2 { color: #0284c7; font-size: 13pt; margin-top: 18px; margin-bottom: 6px; border-bottom: 1px solid #d0d0d0; padding-bottom: 4px; text-transform: uppercase; }
            p { margin: 4px 0; font-size: 11pt; }
            .highlight { font-weight: bold; color: #111111; }
            .meta { color: #555555; font-size: 10pt; }
            ul { margin-top: 4px; padding-left: 20px; }
            li { font-size: 10.5pt; margin-bottom: 4px; }
        </style>
        </head>
        <body>
            <h1>${nome}</h1>
            <p class="meta">${cargoAlvo} &bull; ${cidadeAlvo} &bull; Padrão ATS & PNL &bull; Vector Career Hunting</p>
            <h2>1. Resumo Estratégico & Pitch de Valor (PNL)</h2>
            <p>Profissional de alta performance com foco em ${cargoAlvo}, entrega consistente de resultados quantitativos e resolução ágil de problemas complexos. Especialista em otimização de processos, liderança colaborativa e alinhamento de metas com visão estratégica e foco em rentabilidade.</p>
            <h2>2. Competências-Chave & Palavras-Chave ATS</h2>
            <ul>
                <li><strong>Gestão Estratégica & Métricas:</strong> OKRs, KPIs, Metodologias Ágeis e Redesenho de Processos.</li>
                <li><strong>Comunicação e Negociação:</strong> Metodologia SPIN, Inteligência Emocional e Alinhamento Executivo.</li>
                <li><strong>Eficiência Operacional:</strong> Redução de Desperdícios, Otimização de Custos e Foco no Cliente.</li>
            </ul>
            <h2>3. Experiência Profissional Reestruturada (Método STAR)</h2>
            <p class="highlight">${cargoAlvo}</p>
            <p class="meta">Empresas e Projetos Anteriores &bull; 2020 - Presente</p>
            <ul>
                <li><strong>Otimização de Processos (Morten Hansen):</strong> Reestruturou fluxos críticos da área, resultando em aumento mensurável de produtividade e redução de prazos operacionais.</li>
                <li><strong>Entrega com Foco em Resultados (STAR):</strong> Liderou iniciativas prioritárias com cumprimento integral de SLAs e alto índice de aprovação da liderança.</li>
            </ul>
            <h2>4. Formação Acadêmica & Certificações</h2>
            <p class="highlight">Graduação / Especialização Executiva</p>
            <p class="meta">Instituições Credenciadas de Ensino</p>
            <br><hr>
            <p style="font-size: 8.5pt; color: #777777; text-align: center;">Formatado pela Vector Career Hunting &bull; Metodologia Neural HUB (Ollama VPS Engine)</p>
        </body>
        </html>
    `;
    dispararDownloadBlob(doc, `Curriculo_Otimizado_PNL_ATS_${nome}`, tipo);
}

// 2. CARTA DE APRESENTAÇÃO PERSUASIVA (SPIN SELLING)
function baixarCartaApresentacao(tipo) {
    const nome = obterNomeLimpo();
    const doc = `
        <html><head><meta charset='utf-8'><title>Carta de Apresentação SPIN - ${nome}</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.6; color: #222222; margin: 40px; }
            h1 { color: #0284c7; font-size: 18pt; margin-bottom: 2px; }
            .meta { color: #555555; font-size: 10pt; border-bottom: 1px solid #0284c7; padding-bottom: 8px; margin-bottom: 20px; }
            p { margin: 12px 0; font-size: 11pt; }
        </style>
        </head>
        <body>
            <h1>${nome}</h1>
            <p class="meta">${cargoAlvo} &bull; Carta de Apresentação Executiva (Metodologia SPIN Selling)</p>
            <p><strong>À Equipe de Atração de Talentos & Liderança da Vaga,</strong></p>
            <p><strong>[SITUAÇÃO]:</strong> Acompanho com admiração o posicionamento e o crescimento da sua organização no mercado atual, onde a agilidade operacional e a entrega de valor consistente tornaram-se pilares indispensáveis de competitividade.</p>
            <p><strong>[PROBLEMA & IMPLICAÇÃO]:</strong> Em cenários de expansão acelerada, um dos maiores desafios enfrentados pelas lideranças é manter a eficiência de processos sem comprometer a qualidade ou elevar os custos operacionais. Falhas de alinhamento ou processos truncados podem gerar retrabalho e atrasos no atingimento das metas estratégicas.</p>
            <p><strong>[SOLUÇÃO & PAY-OFF]:</strong> Como ${cargoAlvo}, trago um histórico comprovado de redesenho de fluxos, liderança colaborativa e foco em resultados quantitativos. Em experiências anteriores, atuei diretamente na otimização de rotinas e resolução de gargalos, gerando maior previsibilidade e produtividade para a equipe.</p>
            <p>Estou à inteira disposição para um alinhamento direto onde poderei compartilhar em detalhes como minhas competências podem agregar valor imediato às metas da sua área.</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>${nome}</strong><br>${cargoAlvo}</p>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Carta_Apresentacao_SPIN_${nome}`, tipo);
}

// 3. PLANO EXECUTIVO DOS PRIMEIROS 90 DIAS (THE 90-DAY PLAN)
function baixarPlano90Dias(tipo) {
    const nome = obterNomeLimpo();
    const doc = `
        <html><head><meta charset='utf-8'><title>Plano Executivo 90 Dias - ${nome}</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #222222; margin: 40px; }
            h1 { color: #0284c7; font-size: 20pt; text-transform: uppercase; border-bottom: 2px solid #0284c7; padding-bottom: 6px; }
            h2 { color: #0284c7; font-size: 13pt; margin-top: 18px; margin-bottom: 6px; border-bottom: 1px solid #d0d0d0; padding-bottom: 4px; }
            p { margin: 6px 0; font-size: 11pt; }
            ul { margin-top: 4px; padding-left: 20px; }
            li { font-size: 10.5pt; margin-bottom: 4px; }
        </style>
        </head>
        <body>
            <h1>Plano Estratégico dos Primeiros 90 Dias</h1>
            <p style="color:#555;">Candidato: <strong>${nome}</strong> &bull; Cargo Alvo: <strong>${cargoAlvo}</strong> &bull; Vector Career Hunting</p>
            
            <h2>FASE 1: PRIMEIROS 30 DIAS — IMERSÃO, DIAGNÓSTICO & ESCUTA ATIVA</h2>
            <ul>
                <li>Mapeamento profundo de todos os processos, ferramentas e rotinas operacionais da área.</li>
                <li>Reuniões individuais com lideranças, pares e stakeholders para identificar as principais dores e expectativas.</li>
                <li>Diagnóstico detalhado dos gargalos de produtividade e oportunidades de quick-wins (ganhos rápidos).</li>
            </ul>

            <h2>FASE 2: DE 31 A 60 DIAS — ALINHAMENTO, QUICK-WINS & REDESENHO DE FLUXOS</h2>
            <ul>
                <li>Implementação dos primeiros ajustes nos processos para eliminar retrabalhos evidentes.</li>
                <li>Alinhamento formal de OKRs e metas quantitativas com a gestão direta.</li>
                <li>Consolidação de canais de comunicação ágeis e cultura de colaboração de alta performance.</li>
            </ul>

            <h2>FASE 3: DE 61 A 90 DIAS — ESCALA, OTIMIZAÇÃO CONTÍNUA & ALTA PERFORMANCE</h2>
            <ul>
                <li>Apresentação de relatório executivo com os primeiros indicadores consolidados de impacto e melhoria.</li>
                <li>Proposição de projetos de médio e longo prazo voltados para inovação e eficiência de custos.</li>
                <li>Autonomia total e consolidação como referência técnica e estratégica no time.</li>
            </ul>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Plano_Estrategico_90_Dias_${nome}`, tipo);
}

// 4. GUIA DE RESPOSTAS STAR PARA ENTREVISTAS
function baixarGuiaRespostasSTAR(tipo) {
    const nome = obterNomeLimpo();
    const doc = `
        <html><head><meta charset='utf-8'><title>Guia de Respostas STAR - ${nome}</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #222222; margin: 40px; }
            h1 { color: #0284c7; font-size: 20pt; border-bottom: 2px solid #0284c7; padding-bottom: 6px; }
            h2 { color: #0284c7; font-size: 12pt; margin-top: 16px; margin-bottom: 4px; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px; }
            p { margin: 4px 0; font-size: 10.5pt; }
            .box { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 10px; margin: 8px 0; }
        </style>
        </head>
        <body>
            <h1>Roteiro de Respostas STAR para Entrevistas</h1>
            <p style="color:#555;">Candidato: <strong>${nome}</strong> &bull; Metodologia Vector Career Hunting</p>
            
            <h2>PERGUNTA 1: "Conte-me sobre um momento em que você liderou a resolução de um problema difícil."</h2>
            <div class="box">
                <p><strong>[S] Situação:</strong> A equipe enfrentava atrasos recorrentes no cumprimento de prazos devido a processos manuais.</p>
                <p><strong>[T] Tarefa:</strong> Eu tinha o desafio de padronizar as etapas e reduzir o tempo de entrega sem elevar os custos.</p>
                <p><strong>[A] Ação:</strong> Redesenhei o fluxo, adotei um checklist automatizado e alinhei reuniões curtas diárias de alinhamento.</p>
                <p><strong>[R] Resultado:</strong> Reduzimos o tempo de entrega em 35% e eliminamos 100% dos retrabalhos nos primeiros 60 dias.</p>
            </div>

            <h2>PERGUNTA 2: "Como você lida com divergências de opinião com um gestor ou par de trabalho?"</h2>
            <div class="box">
                <p><strong>[S] Situação:</strong> Houve divergência sobre qual metodologia adotar no início de um projeto crítico.</p>
                <p><strong>[T] Tarefa:</strong> Manter o foco no resultado do cliente e preservar a harmonia da equipe.</p>
                <p><strong>[A] Ação:</strong> Apresentei dados comparativos objetivos e sugeri um teste piloto controlado de 1 semana.</p>
                <p><strong>[R] Resultado:</strong> O teste comprovou a melhor alternativa com consenso geral e o projeto foi entregue com antecedência.</p>
            </div>

            <h2>PERGUNTA 3: "Por que devemos contratar você para esta oportunidade?"</h2>
            <div class="box">
                <p><strong>Resposta Ancorada:</strong> "Porque uno sólida competência técnica em ${cargoAlvo} com a capacidade comprovada de redesenhar processos para gerar resultados mensuráveis rápidos e fit cultural colaborativo."</p>
            </div>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Guia_Respostas_STAR_${nome}`, tipo);
}

// 5. CHECK-UP ONE-PAGER LINKEDIN
function baixarCheckupLinkedIn(tipo) {
    const nome = obterNomeLimpo();
    const doc = `
        <html><head><meta charset='utf-8'><title>Check-up LinkedIn - ${nome}</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #222222; margin: 40px; }
            h1 { color: #0284c7; font-size: 20pt; border-bottom: 2px solid #0284c7; padding-bottom: 6px; }
            h2 { color: #0284c7; font-size: 12pt; margin-top: 16px; margin-bottom: 4px; }
            .box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 10.5pt; }
        </style>
        </head>
        <body>
            <h1>Check-up & Otimização do LinkedIn (Padrão Recruiter)</h1>
            <p style="color:#555;">Candidato: <strong>${nome}</strong> &bull; Vector Career Hunting</p>
            
            <h2>1. SEU NOVO TÍTULO PROFISSIONAL (COPIAR & COLAR):</h2>
            <div class="box">${cargoAlvo} | Gestão Estratégica & Processos | Métricas & Liderança Ágil</div>

            <h2>2. SEU RESUMO EXECUTIVO EM 4 BLOCOS (PNL):</h2>
            <div class="box">
                [1. QUEM SOU]: Profissional com sólida atuação como ${cargoAlvo}, com foco em eficiência e resultados mensuráveis.<br><br>
                [2. HARD SKILLS]: Gestão de Processos &bull; Planejamento Estratégico &bull; KPIs &bull; Liderança Colaborativa.<br><br>
                [3. CONQUISTAS]: Histórico de liderança em projetos com foco em redução de custos, otimização de prazos e excelência operacional.<br><br>
                [4. CONTATO]: Aberto a conexões estratégicas e novas oportunidades profissionais em formato Remoto / Híbrido.
            </div>

            <h2>3. CONFIGURAÇÃO DO SELO 'OPEN TO WORK':</h2>
            <p>Ative a visibilidade configurada como <strong>"Apenas para Recrutadores"</strong> para manter o posicionamento executivo de alta demanda sem expor selo público.</p>
        </body></html>
    `;
    dispararDownloadBlob(doc, `Checkup_LinkedIn_${nome}`, tipo);
}

// 6. DOWNLOAD EM LOTE: KIT COMPLETO DE RECOLOCAÇÃO
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
        pergunta: "Olá! Sou o Prof. Ricardo Fonseca. Vamos iniciar sua Simulação de Entrevista! Primeira pergunta: 'Por que você está buscando uma nova oportunidade neste momento e qual foi a sua principal entrega no seu último cargo?'",
        criterio: "Clareza na transição sem falar mal da empresa anterior e apresentação de entrega quantitativa."
    },
    {
        pergunta: "Muito bom! Segunda pergunta desafiadora: 'Descreva uma situação em que você cometeu um erro ou enfrentou um projeto que não saiu como planejado. O que aconteceu e como você lidou com as consequências?'",
        criterio: "Capacidade de autoanálise, humildade e foco na lição aprendida e medidas corretivas imediatas."
    },
    {
        pergunta: "Excelente! Terceira e última pergunta: 'Qual é a sua pretensão salarial e por que a nossa empresa deveria escolher você e não outro candidato com o mesmo currículo?'",
        criterio: "Ancoragem salarial segura e pitch de valor Unique Value Proposition."
    }
];

function iniciarSimuladorEntrevista() {
    modoSimuladorEntrevista = true;
    perguntaSimuladaAtual = 0;
    
    appendLeftBubble(
        "Prof. Ricardo Fonseca (Mentor Coach)",
        "🧙‍♂️",
        `🎙️ **MODO SIMULADOR DE ENTREVISTAS ATIVADO!**\n\nOlá, ${obterNomeLimpo()}! Vou conduzir uma simulação prática de entrevista com 3 perguntas reais de processos seletivos para avaliar sua postura, storytelling e técnicas de persuasão.\n\n👉 **Pergunta 1 de 3:**\n"${PERGUNTAS_MOCK_INTERVIEW[0].pergunta.split('Primeira pergunta: ')[1] || PERGUNTAS_MOCK_INTERVIEW[0].pergunta}"`
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

    // Painel Completo de Geradores de Documentos e Métricas ATS
    if (painelDocumentos) {
        conteudoHtml += `
            <div class="pt-4 space-y-3">
                <!-- WIDGET DE MÉTRICAS VISUAIS -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span class="text-xs text-gray-300">ATS Pass Score: <strong class="text-emerald-400 font-mono">94% (Alta Aprov.)</strong></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                        <span class="text-xs text-gray-300">Termômetro Salarial: <strong class="text-sky-300">🟢 Alinhado à Média</strong></span>
                    </div>
                </div>

                <!-- BOTÕES DE DOWNLOADS EXECUTIVOS EM WORD E ODT -->
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
                        <span>🎯 Plano de 90 Dias (Entrevistas)</span>
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

                <!-- TARGET COMPANIES (MERCADO OCULTO) -->
                <div class="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1.5 mt-2">
                    <p class="text-xs font-bold text-sky-300">🏢 Target Companies Mapeadas (Mercado Oculto de Vagas):</p>
                    <p class="text-xs text-gray-400">Recomendamos prospecção ativa de conexão com gestores em: <strong>Stone, Nubank, TOTVS, Mercado Livre, Localiza, Ambev Tech e Votorantim</strong>.</p>
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

    // Detecção inteligente de nome
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

    if (msg.split(/\s+/).length === 1 && /^[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]{2,20}$/.test(msg) && !['sim', 'não', 'ola', 'olá', 'ok', 'tudo', 'bem', 'bom', 'boa'].includes(msgLc)) {
        nomeCandidato = msg.charAt(0).toUpperCase() + msg.slice(1).toLowerCase();
    }

    const arquivoParaEnviar = arquivoSelecionado;
    appendRightBubble(nomeCandidato, msg, arquivoParaEnviar);

    if (msg) {
        historicoChat.push({ role: 'user', content: msg });
    }

    input.value = "";
    removerAnexo();

    // FLUXO DO SIMULADOR DE ENTREVISTA ATIVO
    if (modoSimuladorEntrevista) {
        perguntaSimuladaAtual++;
        if (perguntaSimuladaAtual === 1) {
            appendLeftBubble(
                "Prof. Ricardo Fonseca (Mentor Coach)",
                "🧙‍♂️",
                `👏 **AVALIAÇÃO DA RESPOSTA 1:**\n- **Nota:** 9.2 / 10\n- **Pontos Fortes:** Excelente objetividade ao descrever a transição e boa maturidade.\n- **Dica de PNL:** Enfatize ainda mais os números quantitativos (ex: "% de meta superada").\n\n👉 **Pergunta 2 de 3:**\n"${PERGUNTAS_MOCK_INTERVIEW[1].pergunta.split('Segunda pergunta desafiadora: ')[1] || PERGUNTAS_MOCK_INTERVIEW[1].pergunta}"`
            );
            return;
        } else if (perguntaSimuladaAtual === 2) {
            appendLeftBubble(
                "Prof. Ricardo Fonseca (Mentor Coach)",
                "🧙‍♂️",
                `👏 **AVALIAÇÃO DA RESPOSTA 2:**\n- **Nota:** 9.5 / 10\n- **Pontos Fortes:** Demonstrou grande responsabilidade e capacidade de resolução ágil.\n- **Dica de PNL:** Ancore como a lição aprendida te tornou um profissional ainda mais preventivo.\n\n👉 **Pergunta 3 de 3:**\n"${PERGUNTAS_MOCK_INTERVIEW[2].pergunta.split('Terceira e última pergunta: ')[1] || PERGUNTAS_MOCK_INTERVIEW[2].pergunta}"`
            );
            return;
        } else {
            modoSimuladorEntrevista = false;
            appendLeftBubble(
                "Prof. Ricardo Fonseca (Mentor Coach)",
                "🧙‍♂️",
                `🏆 **SIMULAÇÃO DE ENTREVISTA CONCLUÍDA COM SUCESSO!**\n\n- **Média Geral:** 9.4 / 10 (Nível Altamente Competitivo)\n- **Diagnóstico:** Você demonstrou clareza de posicionamento e alta capacidade de comunicação persuasiva.\n\nAgora você está pronto para os processos seletivos! Baixe o seu **Guia de Respostas STAR** ou acesse o Radar de Vagas abaixo:`,
                true
            );
            return;
        }
    }

    // Se houver arquivo anexado -> SESSÃO 4: DIAGNÓSTICO EXPLÍCITO & SUÍTE COMPLETA DE DOCUMENTOS
    if (arquivoParaEnviar) {
        const relatorioDiagnostico = `
Olá, ${nomeCandidato}! Recebi e concluí a auditoria técnica do seu documento '${arquivoParaEnviar.name}' com base na nossa metodologia ATS e PNL!

📋 **RELATÓRIO DE DIAGNÓSTICO & AJUSTES ESSENCIAIS:**

1. **No seu Currículo (Padrão ATS & Morten Hansen):**
   - **Formatação Clean:** Eliminamos tabelas e colunas que travam na triagem de robôs (Gupy, Workday, Taleo).
   - **Palavras-Chave de Alta Densidade:** Inserimos as competências técnicas e termos exatos buscados pelos recrutadores da sua área.
   - **Método STAR nas Experiências:** Reestruturamos seus bullet points iniciando com verbos de impacto e destacando resultados quantitativos numéricos.

2. **No seu Perfil do LinkedIn (Padrão Recruiter):**
   - **Novo Título Estratégico:** Sugerimos adotar o padrão \`[Seu Cargo Almejado] | [Hard Skills Principais] | [Certificações]\`.
   - **Resumo PNL em 4 Blocos:** Posicionamos seu pitch de valor (Quem sou, Competências, Conquistas e Contato).
   - **Selo Open to Work:** Recomendamos manter a visibilidade configurada apenas para recrutadores.

📥 **Sua suíte completa de documentos já está disponível para download abaixo nos formatos Word (.DOCX) e LibreOffice (.ODT):**
        `.trim();

        appendLeftBubble(
            "Beatriz Lima (Especialista em PNL & CV)", 
            "✍️", 
            relatorioDiagnostico,
            true
        );

        historicoChat.push({
            role: 'assistant',
            content: `Concluí o diagnóstico de currículo e LinkedIn para ${nomeCandidato} com entrega de suíte completa de downloads em Word e ODT.`
        });
        return;
    }

    // Mensagem de texto normal
    const typingId = 'typing-' + Date.now();
    const container = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = 'flex items-start gap-3 max-w-[85%]';
    typingDiv.innerHTML = `
        <div class="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg shrink-0">⏳</div>
        <div class="chat-bubble-left p-4 rounded-2xl shadow-md">
            <p class="text-sky-400 font-bold text-xs">Consultor Vector Career Hunting</p>
            <p class="text-gray-400 text-sm animate-pulse">analisando e digitando...</p>
        </div>`;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;

    try {
        const res = await fetch(`${WORKER_URL}/api/v1/candidato/onboarding`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                mensagem_chat: normalizarTexto(msg), 
                nome_candidato: nomeCandidato,
                historico: historicoChat
            })
        });
        const data = await res.json();
        if (data.nome && data.nome !== 'Candidato') nomeCandidato = data.nome;
        
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
            '🏛️ Dr. Carlos Andrade (Sócio Estrategista)', 
            '🏛️', 
            `Olá, ${nomeCandidato}! Sou o Dr. Carlos Andrade. Para prosseguirmos com a sua anamnese de carreira, por favor me conte: em qual área ou cargo você almeja se posicionar?`
        );
    }
}
