from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from urllib.parse import urlparse, parse_qs

from transcript import fetch_transcript
from indexing import build_vectorstore
from rag_chain import create_rag_chain

app = FastAPI()

# CORS so that Chrome extension can call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- MODELS ----------

class Query(BaseModel):
    video_id: str
    question: str
    
class ChatRequest(BaseModel):
    message: str      # user question
    video_url: str    # YouTube URL


# ---------- URL -> ID ----------

def get_video_id_from_url(url: str) -> str:
    parsed = urlparse(url)

    # short links: youtu.be/ID
    if "youtu.be" in parsed.netloc:
        return parsed.path.lstrip("/")

    # normal youtube links
    if "youtube.com" in parsed.netloc:
        # watch?v=ID
        if parsed.path == "/watch":
            qs = parse_qs(parsed.query)
            vid_list = qs.get("v")
            if vid_list:
                return vid_list[0]

        # shorts/ID
        if parsed.path.startswith("/shorts/"):
            return parsed.path.split("/shorts/")[1].split("/")[0]

    # if nothing matches, assume it's already an ID
    return url.strip()


# ---------- OLD ENDPOINT (for CLI / API) ----------

@app.post("/ask")
def ask_video(data: Query):
    transcript = fetch_transcript(data.video_id)
    db = build_vectorstore(transcript)
    chain = create_rag_chain(db)
    answer = chain.invoke(data.question)
    return {"answer": answer}


# ---------- NEW ENDPOINT (for Chrome extension ) ----------

@app.post("/chat")

def chat_endpoint(data: ChatRequest):
    video_id = get_video_id_from_url(data.video_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Could not extract video id from URL")

    transcript = fetch_transcript(video_id)

    # PREVENT CRASH: Handle empty transcript safely
    if not transcript.strip():
        return {
            "reply": "Sorry, I couldn't fetch subtitles for this video at the moment. "
            "Please try another video or refresh and try again.",
            "video_id": video_id
        }

    db = build_vectorstore(transcript)
    chain = create_rag_chain(db)

    answer = chain.invoke(data.message)

    return {"reply": answer, "video_id": video_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)