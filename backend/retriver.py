

def build_retriever(db):
    return db.as_retriever(
        search_kwargs={"k": 4}
    )
