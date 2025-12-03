


from langchain_core.runnables import RunnablePassthrough



from retriver import build_retriever
from augmentation import build_prompt
from generation import GeminiLLM

def create_rag_chain(db):
    retriever = build_retriever(db)
    llm = GeminiLLM()
    prompt = build_prompt()

    chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
    )

    return chain
