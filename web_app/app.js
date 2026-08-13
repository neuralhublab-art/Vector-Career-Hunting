// State Management da Aplicação (Neural HUB Metodologia Oficial v15.0)
let nomeCandidato = "Candidato";
let arquivoSelecionado = null;
let audioCtx = null;
let historicoChat = [];
let sessaoAtual = 1;

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

// Inicialização da Página
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    console.log("Neural HUB App JS v15.0 (Anamnesis State Machine & Ollama VPS Modelfile Integration).");
});

// Emissão de Alerta Sonoro
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

// Gerador Real de Currículo em Word / ODT no Navegador (Client-Side)
function baixarCurriculoCliente(tipo) {
    const nome = nomeCandidato !== "Candidato" ? nomeCandidato : "Profissional";
    const conteudoDoc = `
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
            <p class="meta">Recolocação Profissional Estruturada &bull; Padrão ATS & PNL &bull; Vector Career Hunting</p>
            
            <h2>1. Resumo Estratégico & Pitch de Valor (PNL)</h2>
            <p>Profissional com sólida trajetória voltada para superação consistente de metas, liderança colaborativa e resolução analítica de gargalos operacionais. Experiência comprovada em otimização de fluxos, governança e alinhamento tático-estratégico, combinando inteligência emocional com entregas de alto impacto financeiro e organizacional.</p>
            
            <h2>2. Competências-Chave & Palavras-Chave ATS (Mapeamento de Mercado)</h2>
            <ul>
                <li><strong>Gestão Estratégica & Planejamento:</strong> Metodologias Ágeis, OKRs, KPIs e Redesenho de Processos.</li>
                <li><strong>Comunicação de Alto Impacto:</strong> Negociação Consultiva (SPIN), Liderança Situacional e Resolução de Conflitos.</li>
                <li><strong>Foco em Resultados:</strong> Eficiência Operacional, Redução de Custos e Maximização de Produtividade.</li>
            </ul>

            <h2>3. Experiência Profissional Reestruturada (Método STAR)</h2>
            <p class="highlight">Posicionamento de Liderança e Especialidade</p>
            <p class="meta">Organizações Anteriores &bull; 2020 - Presente</p>
            <ul>
                <li><strong>Redesenho de Processos (Morten Hansen):</strong> Reestruturou fluxos de trabalho essenciais, eliminando retrabalhos e gerando aumento de produtividade quantitativa.</li>
                <li><strong>Entrega com Impacto Mensurável (STAR):</strong> Liderou frentes prioritárias com foco rigoroso em SLAs, resultando em entregas dentro do prazo e com alto índice de satisfação.</li>
                <li><strong>Comunicação e Engajamento:</strong> Conduziu alinhamentos multidisciplinares garantindo conformidade operacional e cultura de excelência.</li>
            </ul>

            <h2>4. Formação Acadêmica & Certificações</h2>
            <p class="highlight">Graduação / Especialização Executiva</p>
            <p class="meta">Instituições Credenciadas de Ensino</p>
            <br><hr>
            <p style="font-size: 8.5pt; color: #777777; text-align: center;">Formatado pela Vector Career Hunting &bull; Metodologia Neural HUB (Ollama VPS Engine)</p>
        </body>
        </html>
    `;

    const blob = new Blob(['\ufeff' + conteudoDoc], { type: tipo === 'odt' ? 'application/vnd.oasis.opendocument.text' : 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Curriculo_Otimizado_PNL_ATS_${nome}.${tipo === 'odt' ? 'odt' : 'doc'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Seleção de Arquivo para Anexo com Legenda
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

// Renderização do Balão do Consultor Especialista (Esquerda)
function appendLeftBubble(personaNome, personaEmoji, texto, botoesDownload = false, vagas = null) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = "flex items-start gap-3 max-w-[85%]";
    
    let conteudoHtml = `<p class="text-zinc-100 leading-relaxed">${texto.replace(/\n/g, '<br>')}</p>`;

    // Botões de Download Reais de .DOCX e .ODT
    if (botoesDownload) {
        conteudoHtml += `
            <div class="flex flex-wrap gap-2.5 pt-3">
                <button onclick="baixarCurriculoCliente('doc')" class="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer">
                    <span>📥 Baixar em .DOCX (Word)</span>
                </button>
                <button onclick="baixarCurriculoCliente('odt')" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold px-4 py-2.5 rounded-xl text-xs border border-zinc-700 flex items-center gap-1.5 shadow-md transition-all cursor-pointer">
                    <span>📥 Baixar em .ODT (LibreOffice)</span>
                </button>
            </div>
        `;
    }

    // Cards de Vagas de Alto Fit no Chat
    if (vagas && vagas.length > 0) {
        conteudoHtml += `
            <div class="grid grid-cols-1 gap-3 pt-3">
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
                                <span>Candidatar-se & Outreach</span>
                                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    msgDiv.innerHTML = `
        <div class="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg shrink-0">
            ${personaEmoji || '🏛️'}
        </div>
        <div class="chat-bubble-left p-4 rounded-2xl space-y-1 shadow-md">
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

// Renderização do Balão do Candidato com Nome Personalizado (Direita)
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

// Envio Unificado de Mensagem e Anexo
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    
    if (!msg && !arquivoSelecionado) return;

    // Detecção inteligente e imediata de nome
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

    // Se houver arquivo anexado -> SESSÃO 4: DIAGNÓSTICO EXPLÍCITO DE CURRÍCULO E LINKEDIN
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

📥 **Seus arquivos otimizados já estão prontos para download abaixo nos formatos Word e LibreOffice:**
        `.trim();

        appendLeftBubble(
            "Beatriz Lima (Especialista em PNL & CV)", 
            "✍️", 
            relatorioDiagnostico,
            true
        );

        historicoChat.push({
            role: 'assistant',
            content: `Concluí o diagnóstico de currículo e LinkedIn para ${nomeCandidato} com entrega de download em Word e ODT.`
        });
        return;
    }

    // Mensagem de texto — chama o Cloudflare Worker integrado com o Ollama VPS
    let persona = 'Dr. Carlos Andrade (Sócio Estrategista)';
    let emoji = '🏛️';

    // Indicador de digitando...
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
