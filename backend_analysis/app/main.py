from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import httpx, os, uuid, json
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env and API key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class AnalyzeRequest(BaseModel):
    url: str | None = None
    code: str | None = None

@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    try:
        # Step 1: Get HTML from URL or code
        if request.url:
            async with httpx.AsyncClient() as client:
                response = await client.get(request.url, timeout=10)
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to fetch the URL.")
            html = response.text
        elif request.code:
            html = request.code
        else:
            raise HTTPException(status_code=400, detail="Provide a URL or HTML code.")

        # Step 2: Clean HTML content
        soup = BeautifulSoup(html, "html.parser")
        for tag in soup(["script", "style", "meta", "link"]):
            tag.decompose()
        visible_text = soup.get_text(separator=' ', strip=True)[:10000]

        # Step 3: Prompt with per-component suggestions
        prompt = f"""
You are an expert in web accessibility and UI/UX analysis.

Analyze the following webpage content for the following 10 components:
1. Layout & Structure
2. Accessibility
3. Visual Design & Aesthetics
4. Navigation & UX
5. Performance
6. SEO Basics
7. Interactivity & Behavior
8. Security
9. Code Quality
10. Brand Consistency

Return a valid JSON object with:
- `score`: total score out of 100
- `components`: a list of 10 objects, each with:
  - `name`: name of the component
  - `score`: out of 100
  - `summary`: number of issues by severity
  - `suggestion`: a general tip to improve this component
  - `issues`: a list of detailed issues with:
    - `id`, `title`, `description`, `severity`, `snippet`, `location`, `suggestion`

Only return JSON. Do not explain anything.

Here is the webpage content:
\"\"\"{visible_text}\"\"\"
"""

        # Step 4: Call Gemini
        model = genai.GenerativeModel("gemini-1.5-flash")
        result = model.generate_content(prompt)
        response_text = result.text.strip()

        # Step 5: Strip markdown if needed
        if response_text.startswith("```json"):
            response_text = response_text.strip("```json").strip("```").strip()
        elif response_text.startswith("```"):
            response_text = response_text.strip("```").strip()

        # Step 6: Parse JSON
        analysis_data = json.loads(response_text)

        # Step 7: Add UUIDs to issues
        for component in analysis_data.get("components", []):
            for issue in component.get("issues", []):
                issue["id"] = str(uuid.uuid4())

        return {"analysis": analysis_data}

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse Gemini response as JSON.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
