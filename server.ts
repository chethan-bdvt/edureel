import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on server if key is present
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health / Status check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey) });
});

// AI Learning Assistant endpoint
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { message, history = [], grade = 'Grade 6-8' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      // Fallback response for offline/keyless preview
      const fallbackReply = generateFallbackAssistantReply(message, grade);
      return res.json(fallbackReply);
    }

    const systemInstruction = `You are "Owl Master Hoot", the wise, warm, and encouraging cartoon owl mentor for LearnLoop, an educational video app for kids and students.
Hoo-hoo! You wear scholar spectacles and a graduation cap, guiding students with curiosity and delight.
Target audience grade: ${grade}.
Rules:
- Adapt explanation style and vocabulary to ${grade}. (For Nursery/Pre-K: keep it playful, rhythmic, use simple words. For Elementary: fun analogies. For Middle School: clear scientific yet exciting concepts).
- Begin occasionally with a gentle owl cheer like "Hoo-hoo!" or "Wise question, young scholar!"
- Keep responses concise (under 80 words) and energetic.
- If the student asks about a concept (e.g. photosynthesis, planets, fractions, animal sounds), include a suggested video topic they can create or watch!
Always respond in JSON format matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...history.slice(-6).map((h: { role: string; text: string }) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.text }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Friendly encouragement and concise explanation for the student.',
            },
            suggestedVideo: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                duration: { type: Type.STRING },
                subject: { type: Type.STRING },
                grade: { type: Type.STRING },
                promptTopic: { type: Type.STRING },
              },
              required: ['title', 'duration', 'subject', 'grade', 'promptTopic'],
            },
          },
          required: ['reply'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/assistant:', error);
    // Graceful fallback so UX is seamless
    const fallback = generateFallbackAssistantReply(req.body.message || 'Help', req.body.grade || 'Grade 6-8');
    return res.json(fallback);
  }
});

// Custom Video Reel Creator Endpoint (Token-optimized 720p medium quality)
app.post('/api/gemini/create-reel', async (req, res) => {
  try {
    const { topic, subject = 'Science', grade = 'Grade 6-8' } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!ai) {
      const fallback = generateFallbackReel(topic, subject, grade);
      return res.json(fallback);
    }

    const systemInstruction = `You are the curriculum director for LearnLoop. Generate an engaging, educational 60-second micro-reel lesson on "${topic}" for ${grade} in the subject of ${subject}.
Constraints:
- Concise, clear language suited to the target age/grade.
- Summary should be 2 impactful sentences.
- Exactly 3 memorable key learning points.
- Narration script must be natural and conversational for voice reading (around 45-60 words).
- Provide 1 multiple choice quiz with 3 options, indicating the correct 0-based option index.
- Choose the best animation style: 'space' | 'biology' | 'math' | 'safari' | 'science' | 'history'.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create educational reel for: "${topic}" in ${subject} (${grade})`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            narrationScript: { type: Type.STRING },
            quiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['question', 'options', 'correctIndex', 'explanation'],
            },
            animationType: {
              type: Type.STRING,
              description: 'space, biology, math, safari, science, or history',
            },
          },
          required: ['title', 'subtitle', 'summary', 'keyPoints', 'narrationScript', 'quiz', 'animationType'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/create-reel:', error);
    const fallback = generateFallbackReel(req.body.topic || 'Curious Discovery', req.body.subject || 'Science', req.body.grade || 'Grade 6-8');
    return res.json(fallback);
  }
});

// Fallback logic for sandbox / no-key operation
function generateFallbackAssistantReply(message: string, grade: string) {
  const lower = message.toLowerCase();
  let title = 'Photosynthesis Explained';
  let subject = 'Science';
  let reply = `Hoo-hoo! A wise question! In ${grade}, we learn that plants use sunlight, water, and air to make their own food. It's like cooking using pure sunshine!`;

  if (lower.includes('fraction') || lower.includes('math') || lower.includes('algebra')) {
    title = 'Fractions & Ratios in Daily Life';
    subject = 'Mathematics';
    reply = `Hoo-hoo! Owl Master love numbers! Think of fractions like sharing slices of delicious warm pizza evenly with your friends.`;
  } else if (lower.includes('space') || lower.includes('planet') || lower.includes('star')) {
    title = 'Mysteries of the Solar System';
    subject = 'Science';
    reply = `Look to the night sky! Our solar system has 8 marvelous planets. Saturn has thousands of icy rings wide enough to span thousands of miles!`;
  } else if (lower.includes('animal') || lower.includes('safari') || lower.includes('pre-k') || lower.includes('nursery')) {
    title = 'Friendly Animal Sounds Safari';
    subject = 'Nursery & Pre-K';
    reply = `Hoo-hoo! The wise owl hoots softly, the lion says Roar, and the baby elephant trumpets through the savanna!`;
  }

  return {
    reply,
    suggestedVideo: {
      title,
      duration: '1 min',
      subject,
      grade,
      promptTopic: message,
    },
  };
}

function generateFallbackReel(topic: string, subject: string, grade: string) {
  let animationType = 'science';
  const lower = (topic + ' ' + subject).toLowerCase();
  if (lower.includes('math') || lower.includes('algebra') || lower.includes('fraction')) {
    animationType = 'math';
  } else if (lower.includes('space') || lower.includes('planet') || lower.includes('solar')) {
    animationType = 'space';
  } else if (lower.includes('cell') || lower.includes('biology') || lower.includes('body')) {
    animationType = 'biology';
  } else if (lower.includes('animal') || lower.includes('pre-k') || lower.includes('nursery') || lower.includes('abc')) {
    animationType = 'safari';
  } else if (lower.includes('history') || lower.includes('world') || lower.includes('war')) {
    animationType = 'history';
  }

  return {
    title: topic.charAt(0).toUpperCase() + topic.slice(1),
    subtitle: `Explore ${topic} in under 60 seconds!`,
    summary: `${topic} is a foundational concept in ${subject} for ${grade}. Understanding this unlocks practical insights about our world!`,
    keyPoints: [
      `Key Concept 1: The building blocks of ${topic} work step-by-step.`,
      `Key Concept 2: Real-world applications connect directly to what you see every day.`,
      `Key Concept 3: Remembering this gives you an advantage in quizzes and homework!`,
    ],
    narrationScript: `Welcome to LearnLoop! Today we are exploring ${topic}. Did you know that understanding how ${topic} works is simpler than you think? Let us dive in and see how each piece connects together!`,
    quiz: {
      question: `What is the most important takeaway about ${topic}?`,
      options: [
        `It operates according to predictable rules in ${subject}.`,
        `It is completely random and cannot be studied.`,
        `It only exists in laboratory experiments.`,
      ],
      correctIndex: 0,
      explanation: `Exactly right! In ${subject}, fundamental principles guide how everything functions reliably.`,
    },
    animationType,
  };
}

// Dev vs Prod Vite Integration
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LearnLoop Full-Stack server running on http://localhost:${PORT}`);
  });
}

startServer();
