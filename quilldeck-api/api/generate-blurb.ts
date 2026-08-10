import { generateJson } from '../lib/groq';

interface BlurbPayload {
  blurbs: { variant: number; hook: string; text: string }[];
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const result = await generateJson<BlurbPayload>(prompt, 2000);

  if (!result.ok) {
    console.error('generate-blurb failed:', result.error, '|', result.detail);
    return res.status(result.status).json({ error: result.error, detail: result.detail });
  }

  // The client renders nothing when blurbs is absent, so a well-formed object
  // of the wrong shape would look identical to a silent failure.
  if (!Array.isArray(result.data.blurbs) || result.data.blurbs.length === 0) {
    console.error('generate-blurb: parsed JSON has no blurbs array');
    return res.status(502).json({ error: 'Model returned JSON without a blurbs array' });
  }

  return res.status(200).json(result.data);
}
