const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile";

export async function analyzeMeal(text: string) {
  const prompt = `
    You are a professional nutritionist. Analyze the following food description and return a JSON array of food items.
    Each item must have: name, calories (number), protein (number), carbs (number), fat (number), fiber (number).
    If multiple items are mentioned, provide them all. If only one, provide an array with one object.
    Output ONLY THE JSON ARRAY. NO MARKDOWN. NO BRAIN CHATTER.
    
    Text: "${text}"
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    // The model might wrap it in a root object if using json_object mode
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : (parsed.items || parsed.food_items || [parsed]);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
}

export async function generateRecipesAI(ingredients: string) {
  const prompt = `
    You are a world-class healthy chef. Based on these ingredients: "${ingredients}", suggest 2 healthy recipes.
    Return a JSON array of objects. Each object must have: 
    title, cals (number), coreEmojis (string of 3 emojis), macros (object with protein, carbs, fat, fiber as numbers), ingredients (array of strings), instructions (array of strings), 
    and img (choose the most relevant local path from: /recipes/recipe1.png, /recipes/recipe2.png, /recipes/recipe3.png, /recipes/recipe4.png, /recipes/recipe5.png, /recipes/recipe6.png, /recipes/recipe7.png, /recipes/recipe8.png, /recipes/recipe9.png, /recipes/recipe10.png).
    
    Output ONLY THE JSON ARRAY. NO MARKDOWN. NO BRAIN CHATTER.
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    const recipes = Array.isArray(parsed) ? parsed : (parsed.recipes || parsed.suggestions || [parsed]);
    return recipes;
  } catch (error) {
    console.error("AI Recipe Error:", error);
    return null;
  }
}
