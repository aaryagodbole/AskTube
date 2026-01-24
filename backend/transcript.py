from youtube_transcript_api import YouTubeTranscriptApi

import re

def extract_video_id(url: str):
    pattern = r"(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})"
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    return None


def fetch_transcript(video_id):
    try:
        ytt_api = YouTubeTranscriptApi()
        transcript = ytt_api.fetch(video_id, languages=["en"])

        # converts snippets -> plain text
        text = " ".join([snippet.text for snippet in transcript])
        return text

    except Exception as e:
        print("Transcript not available:", e)
        return ""
