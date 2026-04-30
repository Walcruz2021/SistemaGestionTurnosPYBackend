import express from 'express';
const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  const response = await fetch('N8N_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await response.json();

  res.json(data);
});

export default router