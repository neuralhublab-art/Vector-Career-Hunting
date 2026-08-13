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
    console.log("Neural HUB App JS v11.0 (Cloudflare Worker Context-Aware Proxy).");
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
function appendLeftBubble(personaNome, personaEmoji, texto, botoesDownload = null, vagas = null) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = "flex items-start gap-3 max-w-[85%]";
    
    let conteudoHtml = `<p class="text-zinc-100 leading-relaxed">${texto.replace(/\n/g, '<br>')}</p>`;

    // Botões de Download de .DOCX e .ODT
    if (botoesDownload) {
        conteudoHtml += `
            <div class="flex flex-wrap gap-2 pt-3">
                <a href="#download" onclick="alert('Download em preparação!')" class="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all">
                    <span>📥 Baixar em .DOCX (Word)</span>
                </a>
                <a href="#download" onclick="alert('Download em preparação!')" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold px-3.5 py-2 rounded-xl text-xs border border-zinc-700 flex items-center gap-1.5 shadow-md transition-all">
                    <span>📥 Baixar em .ODT (LibreOffice)</span>
                </a>
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

    // Detecta nome se o candidato se apresentar
    const msgLc = msg.toLowerCase();
    for (const pat of ['meu nome é', 'sou o', 'sou a', 'chamo']) {
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

    // Registra no histórico local
    if (msg) {
        historicoChat.push({ role: 'user', content: msg });
    }

    input.value = "";
    removerAnexo();

    // Se houver arquivo anexado
    if (arquivoParaEnviar) {
        appendLeftBubble(
            "Beatriz Lima (Especialista em PNL & CV)", 
            "✍️", 
            `Olá, ${nomeCandidato}! Recebi seu currículo '${arquivoParaEnviar.name}'. Já estou realizando a varredura das experiências e aplicando a reescrita com técnicas de PNL e ATS para os robôs de RH. Em qual cidade ou área você prefere focar a busca de vagas?`,
            true
        );
        historicoChat.push({
            role: 'assistant',
            content: `Recebi seu currículo '${arquivoParaEnviar.name}'. Estou aplicando a otimização PNL e ATS.`
        });
        return;
    }

    // Mensagem de texto — chama o Cloudflare Worker com histórico multi-turn
    let persona = 'Dr. Carlos Andrade (Sócio Estrategista)';
    let emoji = '🏛️';
    if (['vaga', 'emprego', 'trabalho', 'oportunidade', 'salário'].some(k => msgLc.includes(k))) {
        persona = 'Lucas Mendes (Hunter de Vagas)'; emoji = '🕵️';
    } else if (['currículo', 'curriculo', 'cv', 'pnl', 'word'].some(k => msgLc.includes(k))) {
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
        appendLeftBubble(`${data.persona_emoji} ${data.persona_nome}`, data.persona_emoji, data.resposta);
        
        // Registra resposta do assistente no histórico
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
