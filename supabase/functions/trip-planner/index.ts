import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { place, persons, duration } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompt = `Create a detailed travel plan for ${place} for ${persons} person(s) for ${duration} day(s). Include:

1. Must-visit tourist spots (top 5-7 attractions with brief descriptions)
2. Famous local cuisine and dishes to try (at least 5 items)
3. Recommended restaurants and eateries
4. Daily itinerary suggestions
5. Local transportation tips
6. Budget estimates (accommodation, food, activities)
7. Best time to visit each attraction
8. Safety tips specific to this location

Format the response in a clear, structured way with sections.`;

    // Gemini 2.5 Flash API call (like ai-travel-chat)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", response.status, errorText);
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    const plan =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate trip plan.";

    return new Response(
      JSON.stringify({ plan }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in trip-planner:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});