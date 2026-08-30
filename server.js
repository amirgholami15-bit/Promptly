import express from "express";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "256kb" }));
app.use(express.static("public"));

let client = null;
if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(client) });
});

app.post("/api/generate", async (req, res) => {
  try {
    if (!client) {
      return res.status(503).json({
        error: "OPENAI_API_KEY هنوز در Environment Variables تنظیم نشده است."
      });
    }

    const idea = typeof req.body?.idea === "string" ? req.body.idea.trim() : "";
    if (!idea) return res.status(400).json({ error: "ایده را وارد کنید." });
    if (idea.length > 6000) return res.status(400).json({ error: "ایده بیش از حد طولانی است." });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions:
        "You are Promptly, an expert prompt engineer. Convert the user's idea into a precise, professional AI prompt. Preserve the original intent, add useful context, constraints, output format, and quality requirements when appropriate. Return only the final prompt. Do not explain your work.",
      input: idea
    });

    res.json({ prompt: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطا در ارتباط با هوش مصنوعی. تنظیمات سرور را بررسی کنید." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(PORT, () => {
  console.log(`Promptly listening on port ${PORT}`);
});