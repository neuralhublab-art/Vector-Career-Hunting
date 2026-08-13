// State Management da Aplicação
let nomeCandidato = "Candidato";
let arquivoSelecionado = null;
let audioCtx = null;

// ── CLOUDFLARE WORKER — Proxy HTTPS seguro (chaves nunca expostas no frontend)
// Worker 24/7 na edge global da Cloudflare. Sem Mixed Content. Sem chaves no JS.
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
    console.log("Neural HUB App JS v10.0 (Cloudflare Worker Secure Proxy).");
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
    
    let conteudoHtml = `<p class="text-zinc-200 leading-relaxed">${texto.replace(/\n/g, '<br>')}</p>`;

    // Botões de Download de .DOCX e .ODT
    if (botoesDownload) {
        conteudoHtml += `
            <div class="flex flex-wrap gap-2 pt-3">
                <a href="/api/v1/curriculo/download/docx?nome=${nomeCandidato}" target="_blank" class="bg-brand-500 hover:bg-brand-600 text-zinc-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all">
                    <span>📥 Baixar em .DOCX (Word)</span>
                </a>
                <a href="/api/v1/curriculo/download/odt?nome=${nomeCandidato}" target="_blank" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold px-3.5 py-2 rounded-xl text-xs border border-zinc-700 flex items-center gap-1.5 shadow-md transition-all">
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
                            <span class="bg-brand-500/20 text-brand-500 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">Fit: ${v.fit}%</span>
                        </div>
                        <p class="text-[11px] text-zinc-400">${v.empresa} &bull; ${v.local}</p>
                        <div class="flex gap-2">
                            <a href="${v.link}" target="_blank" class="bg-brand-500 text-zinc-950 text-[11px] font-bold px-3 py-1 rounded-lg">Candidatar-se 🔗</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    msgDiv.innerHTML = `
        <div class="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-lg shrink-0">
            ${personaEmoji || '🤖'}
        </div>
        <div class="chat-bubble-left p-4 rounded-2xl space-y-1 shadow-md">
            <div class="flex items-center justify-between gap-4">
                <p class="text-brand-500 font-bold text-xs">${personaNome}</p>
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
            <div class="bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs text-brand-500 font-mono flex items-center gap-1.5 mb-1.5">
                <span>📎 Anexo: ${arquivo.name} (${(arquivo.size / 1024).toFixed(1)} KB)</span>
            </div>
        `;
    }

    msgDiv.innerHTML = `
        <div class="chat-bubble-right p-4 rounded-2xl space-y-1 max-w-[80%] shadow-md text-right">
            <div class="flex items-center justify-end gap-2">
                <span class="text-[10px] text-emerald-400/60">Agora</span>
                <p class="text-brand-500 font-bold text-xs">${candidatoNome}</p>
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

    // Detecta nome se se apresentar
    if (msg.toLowerCase().includes("chamo") || msg.toLowerCase().includes("nome é")) {
        const partes = msg.split(/chamo|nome é/i);
        if (partes.length > 1) {
            const extraido = partes[1].trim().split(" ")[0];
            if (extraido.length > 1) nomeCandidato = extraido;
        }
    }

    const arquivoParaEnviar = arquivoSelecionado;
    appendRightBubble(nomeCandidato, msg, arquivoParaEnviar);

    input.value = "";
    removerAnexo();

    // Se houver arquivo anexado
    if (arquivoParaEnviar) {
        const formData = new FormData();
        formData.append("file", arquivoParaEnviar);
        formData.append("legenda", msg || "Anexo para análise");
        formData.append("nome_candidato", nomeCandidato);

        try {
            const res = await fetch(`${WORKER_URL}/api/v1/curriculo/upload-multiformato`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.nome_candidato) nomeCandidato = data.nome_candidato;
            appendLeftBubble(`${data.persona_emoji} ${data.persona_nome}`, data.persona_emoji, data.resposta, true);
            if (data.vagas_encontradas) {
                setTimeout(() => {
                    appendLeftBubble("🕵️ Lucas Mendes (Hunter de Vagas)", "🕵️", `${nomeCandidato}, já identifiquei estas oportunidades de alto fit para o seu perfil!`, false, data.vagas_encontradas);
                }, 1000);
            }
        } catch (e) {
            appendLeftBubble("✍️ Beatriz Lima (Especialista em CV)", "✍️", `Olá, ${nomeCandidato}! Recebi seu arquivo '${arquivoParaEnviar.name}'. Nossa equipe já está analisando e preparando tudo para você!`, true);
        }
        return;
    }

    // Mensagem de texto — chama o Cloudflare Worker (HTTPS seguro, sem chaves no frontend)
    const msg_lc = msg.toLowerCase();
    let persona, emoji;
    if (['vaga', 'emprego', 'trabalho', 'oportunidade'].some(k => msg_lc.includes(k))) {
        persona = 'Lucas Mendes (Hunter de Vagas)'; emoji = '🕵️';
    } else if (['currículo', 'curriculo', 'cv'].some(k => msg_lc.includes(k))) {
        persona = 'Beatriz Lima (Especialista em CV)'; emoji = '✍️';
    } else if (['como funciona', 'o que fazer', 'ajuda'].some(k => msg_lc.includes(k))) {
        persona = 'Prof. Ricardo Fonseca (Mentor Coach)'; emoji = '🧙‍♂️';
    } else {
        persona = 'Dr. Carlos Andrade (Sócio Estrategista)'; emoji = '🏛️';
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
            body: JSON.stringify({ mensagem_chat: normalizarTexto(msg), nome_candidato: nomeCandidato })
        });
        const data = await res.json();
        if (data.nome && data.nome !== 'Candidato') nomeCandidato = data.nome;
        document.getElementById(typingId)?.remove();
        appendLeftBubble(`${data.persona_emoji} ${data.persona_nome}`, data.persona_emoji, data.resposta);
    } catch (e) {
        document.getElementById(typingId)?.remove();
        console.error('[WORKER ERROR]', e);
        appendLeftBubble('🏛️ Dr. Carlos Andrade', '🏛️', `Olá, ${nomeCandidato}! Estamos com uma instabilidade momentânea. Por favor, tente novamente em instantes!`);
    }
}
