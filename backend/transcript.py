from youtube_transcript_api import YouTubeTranscriptApi

def fetch_transcript(video_id):
    try:
        ytt_api = YouTubeTranscriptApi()
        transcript = ytt_api.fetch(video_id, languages=["en"])

        # converts snippets -> plain text
        text = " ".join([snippet.text for snippet in transcript])
        return text

    except Exception as e:
        print("⚠️ Transcript not available:", e)
        return ""
