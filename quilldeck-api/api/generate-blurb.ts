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

  let result = await generateJson<BlurbPayload>(prompt, 3000);

  for (let attempt = 0; !result.ok && attempt < 2; attempt++) {
    console.error(`generate-blurb retry ${attempt + 1}:`, result.error);
    result = await generateJson<BlurbPayload>(prompt, 3000);
  }

  if (!result.ok) {
    console.error('generate-blurb failed:', result.error, '|', result.detail);
    return res.status(result.status).json({ error: result.error, detail: result.detail });
  }

  if (!Array.isArray(result.data.blurbs) || result.data.blurbs.length === 0) {
    console.error('generate-blurb: parsed JSON has no blurbs array');
    return res.status(502).json({ error: 'Model returned JSON without a blurbs array' });
  }

  return res.status(200).json(result.data);
}
