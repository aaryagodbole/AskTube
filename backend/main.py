
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel

from transcript import fetch_transcript
from indexing import build_vectorstore
from rag_chain import create_rag_chain

app = FastAPI()

class Query(BaseModel):
    video_id: str
    question: str

@app.post("/ask")
def ask_video(data: Query):
    
    transcript = fetch_transcript(data.video_id)

    db = build_vectorstore(transcript)

    chain = create_rag_chain(db)

    answer = chain.invoke(data.question)

    return {"answer": answer}
