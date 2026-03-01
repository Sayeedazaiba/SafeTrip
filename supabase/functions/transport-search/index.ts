import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { from, to, date, type } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    let prompt = "";

    if (type === "road") {
      prompt = `Provide a detailed road trip route analysis from ${from} to ${to}:

Include:
- Total distance in km
- Estimated time
- Fuel consumption (estimate for average car)
- CO2 emissions
- Best route description
- 3-4 recommended stops along the way
- Road conditions and traffic insights
- Sustainability score (1-10)

Format as JSON:
{
  "distance": "XXX km",
  "duration": "X hours",
  "fuelConsumption": "XX liters",
  "co2Emissions": "XX kg",
  "route": "Description",
  "stops": ["Stop 1", "Stop 2", ...],
  "conditions": "Description",
  "sustainabilityScore": number
}

Respond ONLY with JSON, no additional text.`;
    } else {
      prompt = `Find 5 real ${type} options from ${from} to ${to} on ${date}:

For each option provide:
- Real carrier name (airline/train/bus company)
- Departure time
- Arrival time
- Duration
- Realistic price in INR (Indian Rupees) - flights: ₹2500-8000, trains: ₹500-3000, buses: ₹800-2500
- Class/type of service

Format as JSON array:
[{
  "carrier": "Carrier Name",
  "departure": "HH:MM",
  "arrival": "HH:MM",
  "duration": "Xh XXm",
  "price": number,
  "class": "Economy/Business/etc"
}]

Respond ONLY with the JSON array, no additional text.`;
    }

    // Gemini 2.5 Flash API call
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
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate transport plan.";

    let result;
    try {
      // Same flexible JSON parsing as before
      const jsonMatch =
        content.match(/```json\n?([\s\S]*?)\n?```/) ||
        content.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      result = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON parse error:", e, "Content:", content);
      throw new Error("Failed to parse transport recommendations");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in transport-search function:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});