🚀 AskTube – AI Tutor for YouTube
Your intelligent AI copilot that explains any YouTube video with real contextual understanding.

AskTube is a Chrome extension + FastAPI backend powered by a Retrieval-Augmented Generation (RAG) pipeline.
It reads YouTube transcripts, retrieves relevant context, and answers your questions about the video you’re watching — instantly.

🔥 Features
🎥 AI Tutor for YouTube

AskTube analyzes the active video and provides explanations, clarifications, and topic breakdowns — like a personal tutor.

🧠 RAG-Powered Answering

Extracts transcript

Splits + embeds text

Stores as vectors

Retrieves relevant chunks

Feeds into LLM for contextual responses

🧩 Beautiful Floating Chat Interface

Modern dark UI

Animated thinking dots

Expand/collapse

Smooth chat bubbles

⚡ Fast & Lightweight Backend

Built with FastAPI

Transcript retrieval from YouTube

Chroma vector database

Sentence Transformer embeddings

🏗 Architecture Overview
 ┌──────────────────────────┐
 │  Chrome Extension (UI)   │
 │  content.js + style.css  │
 └──────────────┬───────────┘
                │
                ▼
       ┌─────────────────┐
       │ background.js   │
       │ (POST to /chat) │
       └─────────────────┘
                │
                ▼
      ┌─────────────────────┐
      │ FastAPI Backend     │
      │ main.py             │
      └─────────┬───────────┘
                │
                ▼
      ┌─────────────────────┐
      │ RAG Engine          │
      │ transcript → vector │
      │ retriever → LLM     │
      └─────────────────────┘

📁 Project Structure
AskTube/
│
├── backend/
│   ├── main.py
│   ├── transcript.py
│   ├── indexing.py
│   ├── retriver.py
│   ├── augmentation.py
│   ├── rag_chain.py
│   ├── requirements.txt
│
└── extension/
    ├── manifest.json
    ├── background.js
    ├── content.js
    ├── style.css
    ├── Chatbot-icon.png
    └── robot-assistant.png

🖥 Backend Documentation
🔹 main.py – FastAPI server

Handles routes, CORS, video ID extraction, and request flow.


Endpoints:
Method	Path	Description
POST	/ask	Raw backend query (CLI/testing)
POST	/chat	Main AskTube endpoint for Chrome extension
🔹 transcript.py – Transcript Fetcher

Fetches subtitle text using YouTubeTranscriptApi, joins snippets into a single plain-text string.


🔹 indexing.py – Chunking & Embeddings

Splits transcript

Creates MiniLM embeddings

Stores vectors in ChromaDB


🔹 retriver.py – Retriever

Returns top-4 relevant chunks.


🔹 augmentation.py – Custom Prompt

Defines AskTube’s teaching style:

No markdown

No bullet points unless asked

Friendly tutor


🔹 rag_chain.py – RAG Assembly

Builds the final chain:

retriever → prompt → LLM


Uses GeminiLLM() (your wrapper).


🧩 Chrome Extension Documentation
🟧 manifest.json – Extension Config

Registers content scripts, background worker, icons, and YouTube matching.


🟧 background.js – Backend Messenger

Receives message → sends POST to FastAPI → returns response.


🟧 content.js – Full Chat UI + Logic

Injects a floating chatbot:

HTML DOM injection

Avatar setup

Message rendering

Thinking animation

Connection to backend via background.js

🟧 style.css – Premium Chat Styling

A fully custom glossy dark UI:

Floating circle icon

Rounded chat panel

Scroll styling

Bubble designs

Typing animation

📡 Messaging Flow (Detailed)
User types → content.js
            ↓
chrome.runtime.sendMessage()
            ↓
background.js → POST http://127.0.0.1:8000/chat
            ↓
Backend → transcript → vectorstore → RAG → answer
            ↓
background.js → content.js
            ↓
Chat window displays bot reply

⚙️ Installation & Setup
1️⃣ Backend Setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload


Runs at:

http://127.0.0.1:8000

2️⃣ Install Chrome Extension

Open Chrome

Go to chrome://extensions

Enable Developer Mode

Click Load unpacked

Select the /extension folder

Visit any YouTube video → floating bot appears

🔥 API Usage
POST /chat

Request:

{
  "message": "Explain the main topic.",
  "video_url": "https://youtube.com/watch?v=XYZ123"
}


Response:

{
  "reply": "...",
  "video_id": "XYZ123"
}

🧯 Troubleshooting
❌ "Transcript not available"

Backend handles gracefully and returns a friendly warning.


❌ No bot icon appears

Ensure extension is enabled

Check content script logs

YouTube layout may be cached → refresh

❌ Backend request fails

Check:

Backend running at 127.0.0.1:8000

Host permissions in manifest.json


❌ Bot keeps saying "No reply field"

Ensure backend returns:

{ "reply": "text" }

🤝 Contributing

Pull requests welcome!
Improve UI, add features, support more LLMs, or optimize RAG.

📜 License

Add your license here (MIT recommended).
