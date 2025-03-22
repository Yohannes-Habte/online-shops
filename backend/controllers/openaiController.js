import OpenAI from "openai";
import asyncHandler from "../utils/asyncHandler.js";
import OpenAIMock from "../utils/OpenAIMock.js";

// ==========================================================================
// Create OpenAI chat
// ==========================================================================
export const createOpenaiChat = asyncHandler(async (req, res) => {
  const {
    body: { stream, ...request },
    headers: { mode },
  } = req;

  let openai;

  if (mode === process.env.OPEN_AI_MOCK) {
    openai = new OpenAIMock();
  } else if (mode === process.env.OPEN_AI_PRODUCTION) {
    openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
  }

  // mode === "production"
  //   ? (openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY }))
  //   : (openai = new OpenAIMock());

  const completion = await openai.chat.completions.create({
    stream,
    ...request,
  });

  if (stream) {
    res.writeHead(200, {
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "Content-Type": "text/event-stream",
    });
    for await (const chunk of completion) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    res.end();
    res.on("close", () => res.end());
  } else {
    res.json(completion.choices[0]);
  }
});

// ==========================================================================
// Create OpenAI image
// ==========================================================================
export const createOpenaiImage = asyncHandler(async (req, res) => {
  const {
    body: { ...request },
    headers: { mode },
  } = req;

  let openai;

  if (mode === process.env.OPEN_AI_MOCK) {
    openai = new OpenAIMock();
  } else if (mode === process.env.OPEN_AI_PRODUCTION) {
    openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
  }

  const image = await openai.images.generate({
    ...request,
  });

  res.json(image.data);
});
