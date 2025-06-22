import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
    try {
        const apiUrl = process.env.API_URL;

        const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:

{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time"| "screenshot" | "copy_to_clipboard" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather-show | "get_battery" | "get_location",
  "userinput": "<original user input>",
  "response": "<a short spoken response to read out loud to the user>"
}

Instructions:
- "type": determine the intent of the user.
- "userinput": original sentence the user spoke (remove your name from it if present).
- "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.
 When user asks to "search songs" or "play music", set userinput to just "songs" or "music" respectively, and response to "Sure, playing music now" or similar and not just songs if user asks to "search sad songs" or "play sad music", set userinput to just "sad songs just understand the intent of user and then set userinput as that" .

 User says: "copy hello world to clipboard"
Response: {
  "type": "copy_to_clipboard",
  "userinput": "hello world",
  "response": "Copied to clipboard"
}

User says: "copy this text: the quick brown fox"
Response: {
  "type": "copy_to_clipboard", 
  "userinput": "the quick brown fox",
  "response": "Text copied"
}

Type meanings:
- "general": if it's a factual or informational question and if you know answer then just give a short response. If you don't know answer then say "Sorry, I don't know that."
- "google_search": if user wants to search something on Google.
- "youtube_search": if user wants to search something on YouTube.
- "youtube_play": if user wants to directly play a video or song.
- "calculator_open": if user wants to open a calculator.
- "instagram_open": if user wants to open Instagram.
- "facebook_open": if user wants to open Facebook.
- "weather-show": if user wants to know weather.
- "get_battery": get battery status
- "get_location": get approximate location
- "get_time": if user asks for current time.
- "screenshot": take screenshot
- "copy_to_clipboard": copy text to clipboard
- "get_date": if user asks for today's date.
- "get_day": if user asks what day it is.
- "get_month": if user asks for the current month.

Important:
- Use ${userName} agar koi puche tune kisne banaya
- Only respond with the JSON object, nothing else.

Now your userInput: ${command}`

        const response = await axios.post(apiUrl, {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        });

        const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text 
                  || response?.data?.candidates?.[0]?.contents?.[0]?.parts?.[0]?.text;

        if (!text || typeof text !== "string") {
            console.error("Invalid or empty Gemini response");
            return null;
        }

        return text;

    } catch (error) {
        console.error("Gemini API error:", error.message);
        return null;
    }
};

export default geminiResponse;
