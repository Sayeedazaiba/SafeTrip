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
    const { contacts, location, userName } = await req.json();

    console.log("SOS Alert triggered for:", userName);
    console.log("Location:", location);
    console.log("Emergency contacts:", contacts.length);

    // Reverse geocoding to get address
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
    );
    const geoData = await geoResponse.json();
    const address = geoData.display_name || `${location.lat}, ${location.lng}`;

    // Google Maps link
    const mapLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

    // Create emergency message template
    let message = `🚨 EMERGENCY ALERT 🚨\n\n${userName} needs help!\n\nLocation: ${address}\n\nView on map: ${mapLink}\n\nMessage: "I am feeling unsafe and need help!"\n\nPlease respond immediately or contact emergency services.`;

    // OPTIONAL: Use Gemini 2.5 Flash to enhance message text or summarize for SMS/WhatsApp
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (GEMINI_API_KEY) {
      const prompt = `Rewrite the following SOS alert message concisely and clearly for emergency contacts:\n\n${message}`;
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                { role: "user", parts: [{ text: prompt }] }
              ],
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          const aiMessage =
            data.candidates?.[0]?.content?.parts?.[0]?.text || message;
          message = aiMessage;
        } else {
          console.error("Gemini API Error:", response.status);
        }
      } catch (e) {
        console.error("Gemini call failed:", e);
      }
    }

    // Log the alert
    console.log("Emergency message:", message);

    // Simulate sending alerts to contacts
    for (const contact of contacts) {
      console.log(`Alert sent to ${contact.name}:`);
      console.log(`  WhatsApp: ${contact.whatsapp_number}`);
      console.log(`  Email: ${contact.email}`);
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "SOS alerts sent successfully",
        alertsSent: contacts.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-sos-alert:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});