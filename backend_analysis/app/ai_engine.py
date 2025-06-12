import os
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_with_gpt(html: str) -> dict:
    prompt = f"""
You are an expert in web accessibility and UI/UX analysis.

Given the following rendered HTML of a webpage, analyze it based on:
1. Accessibility issues (alt text, ARIA roles, semantic tags, contrast)
2. Visual layout and design alignment
3. Appropriateness of components (buttons, sections, images)
4. Suggest improvements for each section
5. Return a visual fit score (0-100)
6. Return WCAG 2.1 AA compliance score (0-100)

HTML:
{html[:12000]}  # Truncate if needed

Return JSON format:
{{
  "score": 85,
  "fit_score": 78,
  "summary": {{
    "critical": 3,
    "moderate": 4,
    "minor": 2
  }},
  "suggestions": [
    {{
      "section": "Header",
      "issue": "Low contrast for navigation text",
      "suggestion": "Use higher contrast colors as per WCAG AA"
    }},
    {{
      "section": "Images",
      "issue": "Missing alt tags",
      "suggestion": "Add descriptive alt attributes"
    }}
  ]
}}
"""

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )
    content = response['choices'][0]['message']['content']
    try:
        return eval(content)  # Or use `json.loads()` if the model returns valid JSON
    except:
        return {"error": "Invalid JSON from model", "raw": content}
