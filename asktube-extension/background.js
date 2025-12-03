

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ASK_BACKEND") {
    const { message, video_url } = request.payload;

    const backendUrl = "http://127.0.0.1:8000/chat";

    fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message, video_url })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Backend error: " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        sendResponse({ ok: true, data });
      })
      .catch((err) => {
        console.error("Background fetch error:", err);
        sendResponse({ ok: false, error: err.message });
      });

    // async response allow
    return true;
  }
});
