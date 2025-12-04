<h1 align="center">Welcome to 🚀 AskTube – AI Tutor for YouTube 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0-blue.svg?cacheSeconds=2592000" />
</p>

> It is an intelligent Chrome extension powered by a FastAPI backend and a Retrieval-Augmented Generation (RAG) pipeline. It extracts YouTube video transcripts, converts them into vector embeddings using Sentence Transformers, stores them in ChromaDB, retrieves the most relevant context using LangChain’s retrievers, and generates high-quality, tutor-style answers to your questions using an LLM.

## ✨ Features
  🎥 AI Tutor for YouTube — understands video context
   
  🔍 RAG-powered answer generation
   
  ⚡ FastAPI backend for fast responses
   
  🧠 LangChain retriever (k=4 relevant chunks)
   
  💬 Modern floating chat UI injected directly on YouTube
   
  📚 Supports long transcripts through chunking

🎧 Works on all YouTube video pages automatically

## 🏠 Screenshot
![WhatsApp Image 2025-12-03 at 22 39 11](https://github.com/user-attachments/assets/2f121413-7341-44ab-8fcc-32ec33d5f961)


## ⚙️ Installation & Setup

## 1. Backend Installation (FastAPI + RAG Engine)

Clone the repository

```sh
git clone https://github.com/aaryagodbole/AskTube.git
cd AskTube/backend

```

Create a virtual environment (recommended)

```sh
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

Install dependencies

```sh
pip install -r requirements.txt
```

Run the FastAPI server

```sh
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend now runs at:

```sh
http://127.0.0.1:8000
```

## 2. Chrome Extension Installation
Load the extension in Chrome
1) Open Chrome
2) Go to:

```sh
chrome://extensions/
```

3) Enable Developer Mode (top-right)
4) Click Load unpacked
5) Select the folder:

```sh
AskTube/extension
```
Done!

Now open YouTube, and the AskTube floating chatbot will appear automatically.

## 🧑‍💻 Author

👤 **Aarya Godbole**

* Github: [@aaryagodbole](https://github.com/aaryagodbole)
* LinkedIn: [@aarya-godbole](https://linkedin.com/in/aarya-godbole)

## ⭐ Support

If you like this project, give it a star!
Your support motivates further updates and improvements 💙

***
