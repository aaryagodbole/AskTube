// root div create
const root = document.createElement("div");
root.id = "asktube-root";
document.body.appendChild(root);


root.innerHTML = `
  <div id="asktube-icon">
    <img src="${chrome.runtime.getURL("Chatbot-icon.png")}" alt="Chatbot" />
  </div>

  <div id="asktube-chat">
    <div class="asktube-header">
      <div class="asktube-header-left">
        <div class="asktube-bot-avatar">
          <img src="${chrome.runtime.getURL("robot-assistant.png")}" alt="Bot" />
        </div>
        <div class="asktube-title">
          <h2>AskTube </h2>
          <span>Your AI copilot for YouTube</span>
        </div>
      </div>
      <div class="asktube-header-right">
        <button class="asktube-icon-btn" id="asktube-fullscreen-btn" title="Maximize / Minimize">
          ☐
        </button>
        <button class="asktube-icon-btn" id="asktube-close-btn" title="Close">
          ✕
        </button>
      </div>
    </div>

    <div class="asktube-messages" id="asktube-messages"></div>

    <div class="asktube-input-bar">
      <div class="asktube-input-wrapper">
        <input
          id="asktube-input"
          class="asktube-input"
          type="text"
          placeholder="Send a message..."
        />

        

        <button class="asktube-send-btn" id="asktube-send-btn" title="Send" disabled>
          ➤
        </button>
      </div>
      <div class="asktube-status" id="asktube-status"></div>
    </div>
  </div>
`;

// helpers
const iconEl = document.getElementById("asktube-icon");
const chatEl = document.getElementById("asktube-chat");
const closeBtn = document.getElementById("asktube-close-btn");
const fullscreenBtn = document.getElementById("asktube-fullscreen-btn");
const messagesEl = document.getElementById("asktube-messages");
const inputEl = document.getElementById("asktube-input");
const sendBtn = document.getElementById("asktube-send-btn");
const micBtn = document.getElementById("asktube-mic-btn");
const statusEl = document.getElementById("asktube-status");

let isOpen = false;
let isFull = false;
let isTyping = false;

// show welcome message once
let hasWelcomed = false;

function addMessage(text, from = "bot") {
    const row = document.createElement("div");
    row.className = "asktube-message-row " + (from === "user" ? "user" : "bot");

    const avatar = document.createElement("div");
    avatar.className =
        "asktube-avatar " + (from === "user" ? "asktube-user-avatar" : "");
    if (from === "user") {
        avatar.textContent = "U";
    } else {
        const img = document.createElement("img");
        img.src = chrome.runtime.getURL("Chatbot-icon.png");
        img.alt = "Bot";
        avatar.appendChild(img);
    }

    const bubble = document.createElement("div");
    bubble.className = "asktube-bubble " + (from === "user" ? "user" : "bot");
    bubble.innerHTML = formatMarkdown(text);

    function formatMarkdown(text) {
        return text
            // Remove markdown bullets
            .replace(/^[\*\-]\s+/gm, "• ")

            // Remove bold markers
            .replace(/\*\*(.*?)\*\*/g, "$1")

            // Clean heading markdown
            .replace(/#+\s?/g, "")

            // Convert line breaks
            .replace(/\n/g, "<br>");
    }




    if (from === "user") {
        row.appendChild(bubble);
        row.appendChild(avatar);
    } else {
        row.appendChild(avatar);
        row.appendChild(bubble);
    }

    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showThinking() {
    const row = document.createElement("div");
    row.className = "asktube-message-row bot";
    row.id = "asktube-thinking-row";

    const avatar = document.createElement("div");
    avatar.className = "asktube-avatar";
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("Chatbot-icon.png");
    img.alt = "Bot";
    avatar.appendChild(img);

    const bubble = document.createElement("div");
    bubble.className = "asktube-bubble bot thinking";

    bubble.innerHTML = `
    <span class="asktube-thinking">
      <span class="asktube-dot"></span>
      <span class="asktube-dot"></span>
      <span class="asktube-dot"></span>
    </span>
  `;

    row.appendChild(avatar);
    row.appendChild(bubble);

    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeThinking() {
    const row = document.getElementById("asktube-thinking-row");
    if (row) row.remove();
}

// toggle chat
function openChat() {
    chatEl.style.display = "flex";
    isOpen = true;

    if (!hasWelcomed) {
        hasWelcomed = true;
        const welcome = "Hi! I’m AskTube . Ask me anything 🚀";
        let idx = 0;
        let current = "";
        const interval = setInterval(() => {
            if (idx >= welcome.length) {
                clearInterval(interval);
                return;
            }
            current += welcome[idx];
            if (messagesEl.lastChild) messagesEl.lastChild.remove();
            addMessage(current, "bot");
            idx++;
        }, 25);
    }
}

function closeChat() {
    chatEl.style.display = "none";
    isOpen = false;
}

iconEl.addEventListener("click", () => {
    isOpen ? closeChat() : openChat();
});

closeBtn.addEventListener("click", closeChat);

fullscreenBtn.addEventListener("click", () => {
    isFull = !isFull;
    if (isFull) {
        chatEl.classList.add("fullscreen");
    } else {
        chatEl.classList.remove("fullscreen");
    }
});

// input handling
inputEl.addEventListener("input", () => {
    sendBtn.disabled = !inputEl.value.trim() || isTyping;
});

inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

sendBtn.addEventListener("click", sendMessage);

// BACKEND-CONNECTED SEND MESSAGE
function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isTyping) return;

    // user message UI
    addMessage(text, "user");
    inputEl.value = "";
    sendBtn.disabled = true;

    isTyping = true;
    statusEl.textContent = "Thinking...";
    showThinking();

    chrome.runtime.sendMessage(
        {
            type: "ASK_BACKEND",
            payload: {
                message: text,
                video_url: window.location.href
            }
        },
        (response) => {
            removeThinking();
            isTyping = false;

            if (!response) {
                statusEl.textContent = "Error: No response from extension.";
                sendBtn.disabled = !inputEl.value.trim();
                return;
            }

            if (!response.ok) {
                statusEl.textContent = "Error: " + response.error;
                sendBtn.disabled = !inputEl.value.trim();
                return;
            }

            statusEl.textContent = "";
            const data = response.data;
            const reply =
                data.reply ||
                "No reply field found in backend response. Make sure /chat returns { reply: ... }";
            addMessage(reply, "bot");
            sendBtn.disabled = !inputEl.value.trim();
        }
    );
}



