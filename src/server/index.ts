import express from 'express';
import { createOpenAIClient, analyzeWithOpenAI, generatePromptWithOpenAI } from './openai';
import { rateLimit } from './middleware';

const app = express();
app.use(express.json());
app.use(rateLimit);

app.post('/api/analyze', async (req, res) => {
  try {
    const { content, settings } = req.body;
    const client = await createOpenAIClient(settings.apiKey);
    const result = await analyzeWithOpenAI(client, content, settings);
    res.json(result);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse' });
  }
});

app.post('/api/analyze-batch', async (req, res) => {
  try {
    const { news, settings } = req.body;
    const client = await createOpenAIClient(settings.apiKey);
    
    const combinedContent = news
      .map(item => `${item.title}\n${item.description}`)
      .join('\n\n');
    
    const result = await analyzeWithOpenAI(client, combinedContent, settings);
    res.json(result);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse groupée' });
  }
});

app.post('/api/generate-prompt', async (req, res) => {
  try {
    const { type, settings } = req.body;
    const client = await createOpenAIClient(settings.apiKey);
    const prompt = await generatePromptWithOpenAI(client, type, settings);
    res.json({ prompt });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du prompt' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});