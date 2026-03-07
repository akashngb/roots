const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * Backboard.io — AI Memory + LLM Router
 * Provides persistent memory across conversations using the Assistants/Threads architecture.
 * Thread IDs and user profiles are persisted to disk via thread_map.json.
 */

const BACKBOARD_BASE = 'https://app.backboard.io/api';
const THREAD_MAP_PATH = path.join(__dirname, '../data/thread_map.json');

let sharedAssistantId = null;

// ── Disk persistence helpers ──────────────────────────────────────────────────

function loadThreadMap() {
    try {
        return JSON.parse(fs.readFileSync(THREAD_MAP_PATH, 'utf8'));
    } catch { return {}; }
}

function saveThreadMap(map) {
    fs.mkdirSync(path.dirname(THREAD_MAP_PATH), { recursive: true });
    fs.writeFileSync(THREAD_MAP_PATH, JSON.stringify(map, null, 2));
}

function getThreadId(userId) {
    const map = loadThreadMap();
    const entry = map[userId];
    if (!entry) return null;
    return typeof entry === 'string' ? entry : entry.threadId || null;
}

function setThreadId(userId, threadId) {
    const map = loadThreadMap();
    if (typeof map[userId] === 'object' && map[userId] !== null) {
        map[userId].threadId = threadId;
    } else {
        map[userId] = { threadId };
    }
    saveThreadMap(map);
}

// Save a user's profile and stage alongside their threadId
function saveUserProfile(userId, profile, stage) {
    const map = loadThreadMap();
    const existing = (typeof map[userId] === 'object' && map[userId] !== null)
        ? map[userId]
        : { threadId: map[userId] || null };
    map[userId] = { ...existing, stage, profile };
    saveThreadMap(map);
}

// Load full user data { threadId, stage, profile }
function loadUserData(userId) {
    const map = loadThreadMap();
    const entry = map[userId];
    if (!entry) return null;
    if (typeof entry === 'string') return { threadId: entry, stage: null, profile: null };
    return entry;
}

// ── Backboard API ─────────────────────────────────────────────────────────────

async function getAssistant(apiKey, systemPrompt) {
    if (sharedAssistantId) return sharedAssistantId;

    try {
        const response = await axios.get(`${BACKBOARD_BASE}/assistants`, {
            headers: { 'X-API-Key': apiKey }
        });

        let assistant = response.data.find(a => a.name === "Roots Multilingual Assistant");

        if (!assistant) {
            const createRes = await axios.post(`${BACKBOARD_BASE}/assistants`, {
                name: "Roots Multilingual Assistant",
                system_prompt: systemPrompt || `You are Roots 🌱, a warm and knowledgeable AI companion for newcomers to Canada built by 49th. You help immigrants navigate settlement — documents, healthcare, SIN, OHIP, banking, career, and community.

CRITICAL: ALWAYS respond in the exact same language the user uses (French, Spanish, etc.). Be concise, practical, and empathetic.`
            }, {
                headers: {
                    'X-API-Key': apiKey,
                    'Content-Type': 'application/json'
                }
            });
            assistant = createRes.data;
        }

        console.log('Backboard Assistant:', assistant);
        sharedAssistantId = assistant.assistant_id || assistant.id || assistant.assistantId;
        return sharedAssistantId;
    } catch (err) {
        console.error('Backboard getAssistant error:', err.response?.data || err.message);
        throw err;
    }
}

// Send a message to the Backboard AI with persistent memory context (via Threads)
async function chat(userId, message, systemPrompt) {
    const apiKey = process.env.BACKBOARD_API_KEY;
    if (!apiKey) throw new Error('BACKBOARD_API_KEY not set');

    const aid = await getAssistant(apiKey, systemPrompt);

    // Get or create a thread for this user — persisted to disk
    let threadId = getThreadId(userId);
    if (!threadId) {
        try {
            const threadRes = await axios.post(`${BACKBOARD_BASE}/assistants/${aid}/threads`, {}, {
                headers: { 'X-API-Key': apiKey }
            });
            console.log('Backboard Thread:', threadRes.data);
            threadId = threadRes.data.thread_id || threadRes.data.id || threadRes.data.threadId;
            setThreadId(userId, threadId);
        } catch (err) {
            console.error('Backboard createThread error:', err.response?.data || err.message);
            throw err;
        }
    }

    const model = process.env.BACKBOARD_MODEL || 'gemini-2.5-flash';

    try {
        const form = new FormData();
        form.append('content', message);
        form.append('model_name', model);
        form.append('llm_provider', 'google');
        form.append('stream', 'false');

        const response = await axios.post(`${BACKBOARD_BASE}/threads/${threadId}/messages`, form, {
            headers: {
                'X-API-Key': apiKey,
                ...form.getHeaders()
            }
        });

        if (response.data.status === 'FAILED') {
            throw new Error(`Backboard LLM Error: ${response.data.content}`);
        }

        console.log(`✅ Backboard API Success [Thread: ${threadId.slice(0, 8)}...]:`, response.data.content.slice(0, 50) + '...');
        return response.data.content;
    } catch (err) {
        console.error('Backboard addMessage error:', err.response?.data || err.message);
        throw err;
    }
}

async function storeMemory(userId, context) {
    return true;
}

module.exports = { chat, storeMemory, saveUserProfile, loadUserData };
