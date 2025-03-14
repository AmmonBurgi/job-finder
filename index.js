import DotEnv from "dotenv";
DotEnv.config();

import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

try {
    const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "user",
            content: `Where did "Hello World" originate from?`,
        }],
    });
    
    console.log(completion.choices[0].message.content);
} catch (error) {
    console.error("AI completion failed:", error);
    process.exit(1);
}

