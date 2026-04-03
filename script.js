// script.js

// Step 1: Apni API key yahan daalo
const API_KEY = "sk-ant-xxxxxxxxxxxxxxxx"; // Anthropic se lo

// Step 2: Main function — button click hone pe chalega
async function analyzeReview() {

  // Review text lao textarea se
  const review = document.getElementById("reviewInput").value.trim();

  // Agar kuch likha nahi toh rok do
  if (!review) {
    alert("Please paste a review first!");
    return;
  }

  // Loading dikhao, results chhupao
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");
  document.getElementById("analyzeBtn").disabled = true;

  // Anthropic ko kya bolna hai — prompt
  const prompt = `Analyze this product review and return ONLY JSON, no extra text:

Review: "${review}"

Return exactly this JSON:
{
  "sentiment": "positive or neutral or negative",
  "rating": 4.2,
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2"],
  "recommendations": ["rec 1", "rec 2"]
}`;

  try {
    // Anthropic API call karo
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });
// Response ko JavaScript object mein badlo
    const data = await response.json();

    // AI ka jawab nikalo
    const text = data.content[0].text;

    // JSON parse karo (backticks hate agar ho)
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    // Results screen pe dikhao
    showResults(result);

  } catch (error) {
    alert("Something went wrong. Check console for details.");
    console.error(error);
  } finally {
    // Loading hata do, button wapas enable karo
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("analyzeBtn").disabled = false;
  }
}

// Step 3: Results ko HTML mein daalo
function showResults(data) {

  // Sentiment
  document.getElementById("sentiment").textContent = data.sentiment;

  // Rating
  document.getElementById("rating").textContent = data.rating + " / 5";

  // Pros list banana
  const prosList = document.getElementById("pros");
  prosList.innerHTML = "";
  data.pros.forEach(pro => {
    prosList.innerHTML += `<li>${pro}</li>`;
  });

  // Cons list banana
  const consList = document.getElementById("cons");
  consList.innerHTML = "";
  data.cons.forEach(con => {
    consList.innerHTML += `<li>${con}</li>`;
  });

  // Recommendations list banana
  const recsList = document.getElementById("recommendations");
  recsList.innerHTML = "";
  data.recommendations.forEach(rec => {
    recsList.innerHTML += `<li>${rec}</li>`;
  });

  // Results dikhao
  document.getElementById("results").classList.remove("hidden");
}