# TadkaMode 🍳 - AI-Powered Fridge-to-Recipe Application

TadkaMode is a production-quality, responsive web application that turns available fridge ingredients into structured, step-by-step cooking recipes. 

This project goes beyond a standard AI wrapper by showcasing a resilient React architecture, decoupled Express services, strict schema validation via **Zod**, and robust error handling to mitigate unreliable LLM outputs.

---

## 🛠️ Tech Stack

### Frontend
*   **Core**: React 18, Vite (Fast Hot-Reloading Build Server)
*   **Styling**: Tailwind CSS v4 (Modern, CSS-first design workflow)
*   **State**: Custom React hooks (`useRecipeGenerator`), presentational React views
*   **Iconography**: Lucide React

### Backend
*   **Core**: Node.js, Express
*   **Database**: MongoDB (via Mongoose)
*   **Security & Logs**: Helmet (Security headers), CORS, Morgan (Request logging)
*   **Validation**: Zod (Express payload validations & LLM output validations)

### AI Engines
*   **Primary**: Groq API (`llama-3.3-70b-versatile` with response format: JSON Object)
*   **Fallback**: Google Gemini API (`gemini-1.5-flash` with JSON mimeType)

---

## 🏛️ System Architecture & Concern Separation

The codebase is built with strict architectural boundaries. Business logic is completely decoupled from components:

```
tadkamode/
├── backend/                  # Node.js + Express Backend
│   ├── config/               # DB connection and mongoose initializers
│   ├── controllers/          # HTTP request handlers & Zod body checks
│   ├── models/               # MongoDB Mongoose schemas & indexes
│   ├── routes/               # Express routing mappings
│   ├── services/             # Core business logic (AI calls & DB writes)
│   ├── utils/                # Central AppError custom classes & JSON parsers
│   └── validators/           # Zod schema definitions (LLM & client inputs)
│
├── frontend/                 # Vite + React Frontend
│   ├── src/
│   │   ├── components/       # Presentational UI components (TagInput, RecipeView, Skeletons)
│   │   ├── hooks/            # Custom hooks encapsulating state machinery (useRecipeGenerator)
│   │   ├── services/         # API HTTP fetch service wrappers with AbortSignals
│   │   └── utils/            # Real-time mixed fraction math scalers
```

---

## 🛡️ Production-Grade AI Resiliency Strategies

LLMs are inherently non-deterministic. TadkaMode implements five distinct levels of safety to guarantee the app **never crashes** and **never displays raw model conversational text**:

1.  **Dual-Engine Provider Fallback**: The primary request hits **Groq** for sub-second generation speeds. If Groq times out (exceeds 10s), returns a 429 rate limit, or fails, the service transparently catches the error and retries the request using **Gemini 1.5 Flash**.
2.  **Regular Expression JSON Repair**: If the model ignores instructions and wraps the JSON output inside markdown code blocks (e.g. ` ```json ... ``` `) or prepends greeting messages, our custom parser [jsonParser.js](backend/utils/jsonParser.js) extracts content between the first `{` and last `}` prior to parsing.
3.  **Zod Schema Type Coercion**: Models often return numbers as strings (e.g. `"servings": "3"`). We use Zod's `.coerce.number()` to automatically heal these type mismatches instead of throwing errors.
4.  **Resilient Database Writes**: Generated recipes are saved to MongoDB Atlas history. If the database connection drops, the service catches the error, logs a warning, and still returns the recipe to the user.
5.  **Race Condition Cancellation**: If a user submits multiple prompts quickly, the custom React hook aborts the active fetch request using `AbortController` and rejects the response, ensuring old queries never overwrite newer ones.

---

## 🚀 How to Run locally

### Prerequisites
*   Node.js (v18.0.0 or higher)
*   MongoDB Instance (Local server or MongoDB Atlas string)

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file from the template:
    ```bash
    cp .env.example .env
    ```
4.  Fill in your API keys and MongoDB connection string in `.env`:
    ```env
    PORT=5001
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tadkamode
    GROQ_API_KEY=your_groq_key_here
    GEMINI_API_KEY=your_gemini_key_here
    NODE_ENV=development
    ```
5.  Start the server with hot-reloading (nodemon):
    ```bash
    npm run dev
    ```

### 2. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file pointing to the backend PORT:
    ```env
    VITE_API_URL=http://localhost:5001/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open **http://localhost:5173** in your browser.

---

## 🧪 Verification & Manual Testing
*   **Mock Verification**: Click "Generate Mock Recipe" to run a complete round-trip API test. It checks the Zod validator on the backend and custom quantity scaler on the frontend using local mock schemas.
*   **Error Boundaries**: Clear all API keys from the backend `.env` and trigger a generation. The frontend will render a clean, red error card showing a `502 Bad Gateway` detailing fallback key errors.
*   **Quantity Scaling**: Click the `+` or `-` buttons on the serving selector in `RecipeView` to watch mixed fractions (`1 1/2 cups`) scale dynamically to unicode fractions (like `¾` or `3`).

---

## 📊 Internship Metadata & Disclosures

### Time Spent
*   **Total**: ~5 hours
    *   Phase 1 (Express & Zod Baseline): 1 hr
    *   Phase 2 (Resilient AI fallback & Repair): 1 hr
    *   Phase 3 (Vite, Tailwind v4 Setup & Cancellation Hook): 1 hr
    *   Phase 4 (Tag Inventory & Skeleton loader): 1 hr
    *   Phase 5 (Checklist & Mixed Fraction Scaler): 1 hr
    *   Phase 6 (MongoDB Atlas integrations & Drawer): 1 hr

### AI Usage Disclosure
This project was constructed in a pair-programming sandbox under the architectural guidance of **Antigravity AI**, a Google DeepMind agentic coding assistant. All files, custom parsers, and error boundaries were written incrementally and manually verified.

### Known Limitations
*   *Unit-Specific Scaling*: Scaling works on numeric prefixes but does not convert units (e.g. it scales "3 tsp" to "9 tsp" instead of converting to "3 tbsp").
*   *Internet dependency*: Fallbacks require external API access. Offline testing relies on the mock endpoints.

### Future Improvements
*   *Fuzzy Search Inventory*: Integrate autocomplete suggestions for common ingredients to speed up tag typing.
*   *Scale Conversion*: Automatically convert units (e.g., cups to ml, teaspoons to tablespoons) when scaling above threshold values.
