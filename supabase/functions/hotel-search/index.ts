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
    const { destination, checkIn, checkOut, budget, travelType } =
      await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompt = `
You are a hotel booking assistant. Based on the following criteria, recommend 6 real hotels with accurate details:

Destination: ${destination}
Check-in: ${checkIn}
Check-out: ${checkOut}
Budget: $${budget}
Travel Type: ${travelType}

For each hotel, provide:
- Real hotel name
- Exact location/address in ${destination}
- Realistic price per night (within budget)
- Star rating (1-5)
- Key amenities (WiFi, Pool, Spa, Gym, Restaurant, etc.)
- Brief description highlighting what makes it suitable for ${travelType} travelers

Format as JSON array with this structure:
[{
  "name": "Hotel Name",
  "location": "Address",
  "price": number,
  "rating": number,
  "image": "https://images.unsplash.com/photo-relevant-hotel-image",
  "amenities": ["WiFi", "Pool"],
  "description": "Brief description"
}]

Respond ONLY with the JSON array. No explanations.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
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
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let hotels;
    try {
      const jsonMatch =
        content.match(/```json\n?([\s\S]*?)\n?```/) ||
        content.match(/\[[\s\S]*\]/);

      const jsonStr = jsonMatch
        ? jsonMatch[1] || jsonMatch[0]
        : content;

      hotels = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON parse error:", e, "Content:", content);
      throw new Error("Failed to parse hotel recommendations");
    }

    return new Response(JSON.stringify({ hotels }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in hotel-search function:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Unknown error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});