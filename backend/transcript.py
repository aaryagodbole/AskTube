from youtube_transcript_api import YouTubeTranscriptApi

def fetch_transcript(video_id):
    api = YouTubeTranscriptApi()

    transcript = api.fetch(video_id)

    # Convert snippets into clean text
    raw = transcript.to_raw_data()
    full_text = " ".join([s["text"] for s in raw])

    return full_text
