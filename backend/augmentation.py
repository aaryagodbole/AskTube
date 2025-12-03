


from langchain_core.prompts import ChatPromptTemplate



def build_prompt():
    return ChatPromptTemplate.from_template(
        """
Use the following context to answer the question.

Context:
{context}

Question:
{question}
"""
    )
