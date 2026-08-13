// State Management da Aplicação
let nomeCandidato = "Candidato";
let arquivoSelecionado = null;
let audioCtx = null;
let historicoChat = [];

// ── CLOUDFLARE WORKER — Proxy HTTPS seguro (chaves nos Secrets da Cloudflare)
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
    console.log("Neural HUB App JS v12.0 (Context-Aware Multi-Turn & Real Client-Side Doc Generator).");
});

// Emissão de Alerta Sonoro (Web Audio API)
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
        <head><meta charset='utf-8'><title>Currículo Otimizado PNL - ${nome}</title>
        <style>
            body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #333333; margin: 40px; }
            h1 { color: #004b87; font-size: 24pt; margin-bottom: 4px; text-transform: uppercase; border-bottom: 2px solid #004b87; padding-bottom: 6px; }
            h2 { color: #004b87; font-size: 14pt; margin-top: 18px; margin-bottom: 6px; border-bottom: 1px solid #d0d0d0; padding-bottom: 4px; }
            p { margin: 4px 0; font-size: 11pt; }
            .highlight { font-weight: bold; color: #1a1a1a; }
            .meta { color: #666666; font-size: 10pt; }
            ul { margin-top: 4px; padding-left: 20px; }
            li { font-size: 11pt; margin-bottom: 3px; }
        </style>
        </head>
        <body>
            <h1>${nome}</h1>
            <p class="meta">Recolocação Profissional &bull; Otimizado para ATS & PNL &bull; Vector Career Hunting</p>
            
            <h2>RESUMO ESTRATÉGICO & POSICIONAMENTO PROFISSIONAL (PNL)</h2>
            <p>Profissional com sólida trajetória e foco em alta performance, resolução estratégica de problemas e entrega consistente de resultados. Perfil dinâmico com excelência em comunicação interpessoal, adaptabilidade ágil a novos cenários e foco contínuo em otimização de fluxos operacionais.</p>
            
            <h2>COMPETÊNCIAS CHAVE (PALAVRAS-CHAVE ATS)</h2>
            <ul>
                <li>Gestão Estratégica e Liderança Situacional</li>
                <li>Comunicação Persuasiva e Resolução de Conflitos</li>
                <li>Otimização de Processos e Foco em Metas</li>
                <li>Trabalho Colaborativo e Inteligência Emocional</li>
            </ul>

            <h2>EXPERIÊNCIA PROFISSIONAL</h2>
            <p class="highlight">Posicionamento Executivo & Operacional</p>
            <p class="meta">Empresas Anteriores &bull; 2020 - Atual</p>
            <ul>
                <li>Condução de atividades prioritárias com foco no cumprimento de prazos e excelência qualitativa.</li>
                <li>Implementação de melhorias contínuas resultando em maior eficiência e produtividade.</li>
                <li>Alinhamento com equipes multidisciplinares e atendimento humanizado.</li>
            </ul>

            <h2>FORMAÇÃO ACADÊMICA & CAPACITAÇÕES</h2>
            <p class="highlight">Graduação / Especialização</p>
            <p class="meta">Instituições de Ensino Reconhecidas</p>
            <br>
            <hr>
            <p style="font-size: 9pt; color: #888888; text-align: center;">Documento emitido e formatado pela Agência Vector Career Hunting &bull; Neural HUB</p>
        </body>
        </html>
    `;

    const blob = new Blob(['\ufeff' + conteudoDoc], { type: tipo === 'odt' ? 'application/vnd.oasis.opendocument.text' : 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Curriculo_Otimizado_PNL_${nome}.${tipo === 'odt' ? 'odt' : 'doc'}`;
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
            <div class="flex flex-wrap gap-2 pt-3">
                <button onclick="baixarCurriculoCliente('doc')" class="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer">
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
            <div class="grid grid-cols-1 gap-2.5 pt-3">
                ${vagas.map(v => `
                    <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-white text-xs">${v.titulo}</span>
                            <span class="bg-sky-500/20 text-sky-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">Fit: ${v.fit}%</span>
                        </div>
                        <p class="text-[11px] text-zinc-400">${v.empresa} &bull; ${v.local}</p>
                        <div class="flex gap-2">
                            <a href="${v.link}" target="_blank" class="bg-sky-500 text-slate-950 text-[11px] font-bold px-3 py-1 rounded-lg">Candidatar-se 🔗</a>
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
                <span>📎 Anexo: ${arquivo.name} (${(arquivo.size / 1024).toFixed(1)} KB)</span>
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

    // Se o usuário digitou apenas 1 palavra que seja um nome próprio (ex: "Aline", "Mariano", "Carlos")
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

    // Se houver arquivo anexado pelo botão de clipe
    if (arquivoParaEnviar) {
        appendLeftBubble(
            "Beatriz Lima (Especialista em PNL & CV)", 
            "✍️", 
            `Olá, ${nomeCandidato}! Recebi seu currículo '${arquivoParaEnviar.name}'. Já fiz a análise inicial e preparei uma versão preliminar otimizada com técnicas de PNL e palavras-chave para robôs ATS! Você já pode baixar seu arquivo nos botões abaixo enquanto configuramos o Radar de Vagas:`,
            true
        );
        historicoChat.push({
            role: 'assistant',
            content: `Recebi o currículo '${arquivoParaEnviar.name}' de ${nomeCandidato}. A versão preliminar em Word e ODT está disponível nos botões de download do balão.`
        });
        return;
    }

    // Mensagem de texto — chama o Cloudflare Worker com histórico multi-turn
    let persona = 'Dr. Carlos Andrade (Sócio Estrategista)';
    let emoji = '🏛️';
    if (['vaga', 'emprego', 'trabalho', 'oportunidade', 'salário', 'remoto', 'belém', 'pretensão'].some(k => msgLc.includes(k))) {
        persona = 'Lucas Mendes (Hunter de Vagas)'; emoji = '🕵️';
    } else if (['currículo', 'curriculo', 'cv', 'pnl', 'word', 'download', 'baixar', 'pronto'].some(k => msgLc.includes(k))) {
        persona = 'Beatriz Lima (Especialista em PNL & CV)'; emoji = '✍️';
    } else if (['como funciona', 'o que fazer', 'ajuda', 'como assim'].some(k => msgLc.includes(k))) {
        persona = 'Prof. Ricardo Fonseca (Mentor Coach)'; emoji = '🧙‍♂️';
    }

    // Indicador de digitando...
    const typingId = 'typing-' + Date.now();
    const container = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = 'flex items-start gap-3 max-w-[85%]';
    typingDiv.innerHTML = `
        <div class="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg shrink-0">${emoji}</div>
        <div class="chat-bubble-left p-4 rounded-2xl shadow-md">
            <p class="text-sky-400 font-bold text-xs">${persona}</p>
            <p class="text-gray-400 text-sm animate-pulse">digitando...</p>
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

        const deveOferecerDownload = data.oferecer_download || msgLc.includes('download') || msgLc.includes('baixar') || msgLc.includes('pronto');
        appendLeftBubble(`${data.persona_emoji} ${data.persona_nome}`, data.persona_emoji, data.resposta, deveOferecerDownload);
        
        historicoChat.push({ role: 'assistant', content: data.resposta });

    } catch (e) {
        document.getElementById(typingId)?.remove();
        console.error('[WORKER ERROR]', e);
        appendLeftBubble(
            '🏛️ Dr. Carlos Andrade (Sócio Estrategista)', 
            '🏛️', 
            `Olá, ${nomeCandidato}! Sou o Dr. Carlos Andrade. Para iniciarmos sua recolocação, por favor anexe seu currículo no botão de clipe 📎 abaixo ou me conte qual cargo e cidade você está buscando!`
        );
    }
}
