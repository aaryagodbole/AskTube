

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

def build_vectorstore(transcript_text: str):
    # 1. Chunking
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=750,
        chunk_overlap=80
    )
    chunks = splitter.create_documents([transcript_text])

    # 2. Embeddings
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    # 3. Store in vector DB
    db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings
    )

    return db
