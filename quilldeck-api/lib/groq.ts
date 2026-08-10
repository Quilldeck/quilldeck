// Shared Groq client for the Quilldeck endpoints.
//
// Both endpoints ask the model for JSON and then parse it, and that parse is
// the most fragile step in the API. The model periodically answers with prose
// ("I'd be happy to help..."), Groq sometimes returns an error envelope or an
// empty body instead of a completion, and a long generation can be cut off by
// max_tokens mid-object. Each of those used to surface as a generic 500 whose
// message pointed at the wrong cause, so the guard lives here once instead of
// being reimplemented per endpoint.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export type GroqResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; detail: string };

// Diagnostic snippets go to the logs and to the client, so keep them short.
function snippet(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > 300 ? `${clean.slice(0, 300)}...` : clean;
}

function fail(status: number, error: string, detail: string): GroqResult<never> {
  return { ok: false, status, error, detail: snippet(detail) };
}

function parseOrNull(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Pull the outermost JSON object out of a model reply and parse it. Tolerates
 * markdown fences and leading or trailing chatter around the object.
 */
export function extractJsonObject<T>(text: string, truncated: boolean): GroqResult<T> {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  // Guard the indices explicitly. When the reply contains no brace at all both
  // are -1, and slice(-1, 0) quietly returns '' rather than anything obviously
  // wrong -- JSON.parse('') then reports "Unexpected end of JSON input", which
  // reads like truncation and sends you looking in the wrong place.
  if (start === -1 || end <= start) {
    return truncated
      ? fail(502, 'Model response was cut off before it produced any JSON', text)
      : fail(502, 'Model replied with prose instead of JSON', text);
  }

  const parsed = parseOrNull(text.slice(start, end + 1));
  if (parsed === null) {
    return truncated
      ? fail(502, 'Model response was cut off mid-JSON', text)
      : fail(502, 'Model returned malformed JSON', text);
  }

  return { ok: true, data: parsed as T };
}

/** Prompt Groq for a JSON object, returning a typed result rather than throwing. */
export async function generateJson<T>(prompt: string, maxTokens: number): Promise<GroqResult<T>> {
  if (!process.env.GROQ_API_KEY) {
    return fail(500, 'Server is not configured: GROQ_API_KEY is missing', '');
  }

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        // Constrain the model to emit a JSON object, which stops the
        // conversational replies the parse guard below otherwise has to catch.
        // Groq requires the prompt itself to mention JSON; both callers build
        // prompts that do, and Groq answers 400 if that ever stops being true.
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    // Read the body as text first. An empty body or an HTML error page (gateway
    // timeout, rate-limit page) makes response.json() throw the same
    // "Unexpected end of JSON input" the parse guard above is meant to explain.
    const body = await response.text();

    if (!response.ok) {
      return fail(502, `Groq returned HTTP ${response.status}`, body);
    }

    const payload = parseOrNull(body);
    if (payload === null) {
      return fail(502, 'Groq returned a non-JSON response envelope', body);
    }

    const choice = payload?.choices?.[0];
    const content = choice?.message?.content;
    if (typeof content !== 'string' || content.trim() === '') {
      return fail(502, 'Groq returned no completion text', body);
    }

    return extractJsonObject<T>(content, choice?.finish_reason === 'length');
  } catch (error: any) {
    return fail(502, 'Could not reach Groq', error?.message ?? String(error));
  }
}
