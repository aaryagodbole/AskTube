def build_retriever(db):
    return db.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 4, "lambda_mult": 0.6}
    )
