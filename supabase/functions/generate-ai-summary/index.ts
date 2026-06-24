import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface AiResult {
  summary: string;
  score: number;
  tags: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json().catch(() => ({}));
  const recordId = body.record_id;
  if (!recordId) {
    return new Response(JSON.stringify({ error: "record_id required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: lead, error: fetchError } = await supabase
    .from("leads")
    .select("id, message, email, name, company")
    .eq("id", recordId)
    .single();

  if (fetchError || !lead) {
    console.error("Error fetching lead:", fetchError);
    return new Response(JSON.stringify({ error: "Lead not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  let aiResult: AiResult;
  try {
    aiResult = await generateSummary(lead.message);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Gemini error:", msg);
    await logEvent(supabase, lead.id, "error", { stage: "ai_summary", error: msg });
    return new Response(JSON.stringify({ error: msg }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { error: updateError } = await supabase
    .from("leads")
    .update({
      ai_summary: aiResult.summary,
      ai_score: aiResult.score,
      ai_tags: aiResult.tags,
    })
    .eq("id", lead.id);

  if (updateError) {
    console.error("Error updating lead:", updateError);
    await logEvent(supabase, lead.id, "error", {
      stage: "ai_summary_update",
      error: updateError.message,
    });
    return new Response(JSON.stringify({ error: "Update failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  await logEvent(supabase, lead.id, "summarized", {
    summary: aiResult.summary,
    score: aiResult.score,
    tags: aiResult.tags,
  });

  return new Response(
    JSON.stringify({ success: true, ...aiResult }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
});

async function generateSummary(message: string): Promise<AiResult> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY no configurada");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analiza el siguiente mensaje de un lead comercial y genera un resumen estructurado.

Mensaje: "${message}"

Responde UNICAMENTE con un objeto JSON (sin markdown, las claves en minusculas y sin acentos):
{
  "summary": "Resumen profesional de 1-2 oraciones en español (max 200 caracteres)",
  "score": numero del 0 al 100 que representa la probabilidad de conversion (basado en: claridad de necesidad, nivel de detalle, urgencia, seriedad del tono),
  "tags": ["maximo 3 tags relevantes en español"]
  }`,
          }],
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 300,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("Gemini API error:", text);
    throw new Error("Error al llamar a Gemini");
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Respuesta vacia de Gemini");

  return JSON.parse(text) as AiResult;
}

async function logEvent(
  supabase: ReturnType<typeof createClient>,
  leadId: string,
  eventType: string,
  payload: Record<string, unknown>,
) {
  const { error } = await supabase.from("lead_events").insert({
    lead_id: leadId,
    event_type: eventType,
    payload,
  });
  if (error) {
    console.error("Error logging event:", error);
  }
}
