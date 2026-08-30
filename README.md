# Promptly — Render-ready

## Render settings
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variable: `OPENAI_API_KEY` = your secret API key
- Optional: `OPENAI_MODEL` = a model available to your OpenAI project

The API key is read only on the server and is never included in browser JavaScript.
Do not commit `.env` or any API key to a public repository.

## Local
npm install
OPENAI_API_KEY=your_key npm start
