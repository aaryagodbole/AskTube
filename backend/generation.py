

from langchain_core.language_models.llms import LLM
import google.generativeai as genai

import os
import google.generativeai as genai
from langchain_core.language_models.llms import LLM
from typing import List, Optional

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


class GeminiLLM(LLM):
    @property
    def _llm_type(self) -> str:
        return "gemini"

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager=None,
    ) -> str:
        model = genai.GenerativeModel("models/gemini-2.5-flash")
        res = model.generate_content(prompt)
        return res.text
