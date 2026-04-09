import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code, context, settings } = await req.json();

    if (!code || typeof code !== "string" || code.length > 50000) {
      return new Response(JSON.stringify({ error: "Invalid code input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const depth = settings?.depth || "standard";
    const lang = settings?.outputLanguage || "English";
    const includeExamples = settings?.includeExamples !== false;
    const includeDiagrams = settings?.includeDiagrams !== false;
    const includePatterns = settings?.includePatterns !== false;
    const includeComplexity = settings?.includeComplexity !== false;

    const systemPrompt = `You are an expert technical documentation generator. Analyze the given source code and produce comprehensive documentation in ${lang}.

Documentation depth: ${depth}
${context ? `Additional context from the user: ${context}` : ""}

You MUST respond with ONLY valid JSON (no markdown, no backticks, no explanation) matching this exact structure:
{
  "projectName": "string - inferred project/module name",
  "summary": "string - 1-2 sentence summary",
  "language": "string - programming language",
  "complexity": ${includeComplexity ? "number 1-10" : "0"},
  "techStack": ["string - detected libraries/frameworks"],
  "apiReference": [
    {
      "name": "string",
      "type": "function|class|endpoint|component",
      "signature": "string - full signature",
      "description": "string - what it does",
      "params": [{"name":"string","type":"string","description":"string","required":boolean}],
      "returns": "string",
      "example": "string - usage code example"
    }
  ],
  "codeExplanation": {
    "overview": "string - detailed overview",
    "keyComponents": [{"name":"string","role":"string","details":"string"}],
    "dataFlow": "string - how data moves through the system",
    "designPatterns": ${includePatterns ? '["string - detected patterns"]' : "[]"}
  },
  "architecture": {
    "type": "string - Monolith/MVC/Microservices/etc",
    "layers": [{"name":"string","responsibility":"string","components":["string"]}],
    "dependencies": [{"from":"string","to":"string","reason":"string"}],
    "diagram": ${includeDiagrams ? '"string - ASCII architecture diagram"' : '""'}
  },
  "usageExamples": ${includeExamples ? '[{"title":"string","description":"string","language":"string","code":"string"}]' : "[]"},
  "readme": "string - full markdown README with: Project Name, Description, Features, Installation, Usage, API Docs, Contributing, License sections"
}

Be thorough and accurate. Generate ${depth === "comprehensive" ? "very detailed" : depth === "quick" ? "concise" : "balanced"} documentation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this code and generate documentation:\n\n${code}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const usage = data.usage;

    // Parse JSON from response, handling possible markdown wrapping
    let parsed;
    try {
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response:", content?.substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to parse AI response. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      docs: parsed,
      tokenUsage: usage ? { input: usage.prompt_tokens, output: usage.completion_tokens } : undefined,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-docs error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
