import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 30

const SYSTEM_PROMPT = `You are Kang, an AI Mood-to-Place Finder for Australia. When users describe their mood or situation, you suggest 3-5 real Australian places that match their vibe.

For each suggestion, provide:
1. The place name as plain text (no markdown formatting)
2. A short, friendly explanation of why it fits their mood
3. The Google Maps URL on a separate line

Use a warm, conversational tone like you're chatting with a friend. Include emojis where appropriate.

Example response format:
"Sounds like you're in a celebratory mood! 🎉 Here are some fantastic places in Australia:

1. Quay Restaurant, Sydney — Award-winning fine dining with stunning harbour views, perfect for special celebrations!
https://www.google.com/maps/search/?api=1&query=Quay+Restaurant+Sydney+Australia

2. Crown Casino, Melbourne — Vibrant atmosphere with dining, shows, and excitement for birthday fun!
https://www.google.com/maps/search/?api=1&query=Crown+Casino+Melbourne+Australia

3. Bondi Beach, Sydney — Iconic beach perfect for celebrating with friends and good vibes!
https://www.google.com/maps/search/?api=1&query=Bondi+Beach+Sydney+Australia"

Always suggest real, well-known Australian places and provide the Google Maps URLs on separate lines.`

const genAI = new GoogleGenerativeAI("AIzaSyBX95EfyVhH-0LRepIbcxRWLlEv-JMgo2g")

export async function POST(req: Request) {
  try {
    console.log("[v0] Chat API called")
    const { messages } = await req.json()
    console.log("[v0] Received messages:", messages.length)

    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content || messages[messages.length - 1]?.text || ""

    console.log("[v0] User message:", userMessage)

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}`

    console.log("[v0] Sending to Gemini")
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log("[v0] Gemini response received")

    return new Response(
      JSON.stringify({
        role: "assistant",
        content: text,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
