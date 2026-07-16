# TadkaMode AI 🍳

> **Turn whatever's in your fridge into a structured, step-by-step recipe — powered by Groq + Gemini.**

TadkaMode is a frontend internship project built to demonstrate production-grade React architecture, LLM integration, structured JSON handling, robust error handling, and strong product thinking.

---

## 📸 Overview

| Feature | Details |
|---|---|
| 🧠 AI Generation | Groq `llama-3.3-70b-versatile` (primary) → Gemini `1.5-flash` (fallback) |
| 📦 History | Stored in browser `localStorage` — zero database dependency |
| ⚡ Performance | AbortController cancels stale requests; retry logic on failure |
| 🛡️ Validation | Zod validates both the API request payload and every LLM JSON response |
| 🎨 UI | React 19 + Vite 8 + Tailwind CSS v4 — dark, glassmorphic design |
| 🔐 Security | API keys never leave the backend; Helmet + CORS headers enforced |

---

## 🏗️ Architecture

```
Browser (React + Vite)
        │
        │  POST /api/recipes/generate
        ▼
  Express Backend
        │
        ├─ Zod validates request payload
        ├─ Groq API  ──── (primary, 10s timeout)
        │       └── fails? ──▶  Gemini API  (fallback, 12s timeout)
        ├─ jsonParser.js extracts JSON from raw LLM text
        └─ Zod validates response schema → returns clean JSON
        │
        ▼
  Frontend saves recipe to localStorage
  (recipeHistory.js utility — no DB needed)
```

The backend is a **pure AI proxy** — its only job is to securely call the LLM and return validated JSON. All persistence is client-side.

---

## 📁 Folder Structure

```
tadkamode/
│
├── backend/
│   ├── controllers/
│   │   └── recipe.controller.js     # Validates request, calls AI, returns JSON
│   ├── routes/
│   │   └── recipe.routes.js         # Single route: POST /api/recipes/generate
│   ├── services/
│   │   └── ai.service.js            # Groq → Gemini fallback orchestration
│   ├── utils/
│   │   ├── appError.js              # Centralised operational error class
│   │   └── jsonParser.js            # Robust LLM JSON extraction & repair
│   ├── validators/
│   │   └── recipe.validator.js      # Zod schemas for request & LLM response
│   ├── server.js                    # Express app setup
│   └── .env.example                 # Environment variable template
│
└── frontend/src/
    ├── components/
    │   ├── RecipeView.jsx            # Full interactive recipe display
    │   ├── HistoryView.jsx           # Bento grid of all past recipes
    │   ├── HistoryDrawer.jsx         # Slide-out quick access drawer
    │   ├── PantryView.jsx            # Smart pantry ingredient tracker
    │   ├── CommunityView.jsx         # Culinary blog / community feed
    │   ├── RecipeSkeleton.jsx        # Loading skeleton placeholder
    │   ├── TagInput.jsx              # Ingredient tag input component
    │   └── ShaderBackground.jsx      # Animated WebGL canvas background
    ├── hooks/
    │   └── useRecipeGenerator.js     # AbortController, retry, state machine
    ├── services/
    │   └── recipeService.js          # Thin fetch wrapper for POST /generate
    └── utils/
        ├── recipeHistory.js          # localStorage CRUD utility
        └── quantityScaler.js         # Mixed-fraction serving size scaler
```

---

## ✨ Key Features

### 🤖 AI Recipe Generation
Type or select ingredients → click **Generate** → get a fully structured recipe including title, description, prep/cook time, servings, difficulty, ingredients with quantities, step-by-step instructions, substitution suggestions, and chef tips.

### 🔄 Groq → Gemini Fallback
If Groq fails (rate limit, timeout, or API error), the backend **transparently retries** with Gemini Flash — the frontend never sees the failure.

### 🗂️ localStorage History
Every successfully generated recipe is saved to `localStorage` via `recipeHistory.js`. The History View and History Drawer both read from it — **no network request required** to browse past recipes.

```js
saveRecipe(recipe, inputIngredients)  // auto-assigns UUID + createdAt
loadRecipes()                          // returns newest-first array
deleteRecipe(id)                       // removes by UUID
clearRecipeHistory()                   // wipes all history
```

### ⚖️ Dynamic Serving Scaler
Adjust servings with `+` / `–` buttons in the recipe view. Quantities auto-scale in real time with proper mixed-fraction unicode output: `1 1/2 cups` → `¾ cup`.

### 🛡️ Production Error Handling
The app handles every failure mode gracefully:

| Failure | Handling |
|---|---|
| Empty / malformed JSON from LLM | `jsonParser.js` extracts `{ }` block; fallback to 502 |
| Schema mismatch (wrong types) | Zod `.coerce` heals type errors; throws validated error message |
| Network timeout | 10s (Groq) / 12s (Gemini) `Promise.race` timeout |
| Rate limiting (429) | Triggers Gemini fallback automatically |
| Empty request body | Zod returns `400 Validation Error` to client |
| Stale parallel requests | `AbortController` cancels previous in-flight fetch |
| User retries on error | `retry()` re-runs last ingredient set from hook state |

---

## 🚀 Running Locally

### Prerequisites
- Node.js **v18+**
- A [Groq API key](https://console.groq.com/) (free tier available)
- *(Optional)* A [Gemini API key](https://aistudio.google.com/) for fallback

---

### 1 — Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5001
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

Start the server:

```bash
npm run dev
# → [Server] TadkaMode backend running on port 5001 (development)
```

Verify it's alive:

```bash
curl http://localhost:5001/health
# → { "status": "healthy" }
```

---

### 2 — Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the dev server:

```bash
npm run dev
# → http://localhost:5173
```

---

## 🧪 Testing the App

| Test | How |
|---|---|
| **Generate a recipe** | Select ingredients → click Generate |
| **View history** | Click the history icon in the sidebar or drawer |
| **Delete a recipe** | Click the trash icon on any recipe card in History View |
| **Retry on error** | Clear the `GROQ_API_KEY` from `.env` and generate — observe clean error UI and retry button |
| **Serving scaler** | Use `+` / `−` on the recipe view to watch quantities auto-scale |
| **Request cancellation** | Spam the Generate button rapidly — old requests are cleanly aborted |

---

## 🛠️ Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 8.x | Build tool & dev server |
| Tailwind CSS | 4.x | Utility-first styling |
| Lucide React | 1.x | Icon library |

### Backend
| Package | Version | Purpose |
|---|---|---|
| Express | 4.x | HTTP server |
| Groq SDK | 0.3.x | Primary LLM (Llama 3.3 70B) |
| @google/generative-ai | 0.11.x | Fallback LLM (Gemini 1.5 Flash) |
| Zod | 3.x | Schema validation |
| Helmet | 7.x | HTTP security headers |
| Morgan | 1.x | Request logging |
| dotenv | 16.x | Environment config |

---

## 🔌 API Reference

### `POST /api/recipes/generate`

Generates a recipe from a list of ingredients.

**Request:**
```json
{
  "ingredients": ["eggs", "tomatoes", "paneer", "cumin"]
}
```

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "recipe": {
      "title": "Paneer & Egg Bhurji",
      "description": "A quick, protein-rich Indian scramble...",
      "prepTime": "5 mins",
      "cookTime": "10 mins",
      "servings": 2,
      "difficulty": "Easy",
      "ingredients": [
        { "name": "Paneer", "quantity": "200g", "optional": false }
      ],
      "steps": [
        { "step": 1, "instruction": "Crumble the paneer..." }
      ],
      "substitutions": [
        { "ingredient": "Paneer", "alternatives": ["Tofu", "Cottage Cheese"] }
      ],
      "tips": ["Add a squeeze of lemon at the end for brightness."]
    }
  }
}
```

**Error `400`** — missing or empty ingredients  
**Error `502`** — both AI providers failed or returned invalid JSON  

---

### `GET /health`

```json
{ "status": "healthy", "timestamp": "2026-07-16T17:30:00.000Z", "env": "development" }
```

---

## 📌 Known Limitations

- **Unit conversion**: Scaling `3 tsp` to 3× gives `9 tsp` instead of `3 tbsp`. Numeric scaling is accurate; unit normalisation is not implemented.
- **localStorage cap**: History is capped at 50 recipes (~3–5 KB each) to stay within the browser's 5 MB limit.
- **LLM non-determinism**: Groq/Gemini may occasionally return unusual ingredient combinations — the Zod validator ensures the structure is always valid even if the content is creative.

---

## 🔮 Future Improvements

- Fuzzy ingredient autocomplete (e.g. typing "tom" → suggests "Tomatoes", "Tomato Paste")
- Unit-aware serving scaler (tbsp ↔ tsp ↔ ml conversions)
- Export recipe as PDF or share via link
- Dietary filter tags (vegan, gluten-free, low-carb) passed as prompt constraints

---

## 📄 License

MIT © 2026 TadkaMode AI
