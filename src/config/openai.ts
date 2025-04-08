import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
if (!apiKey) {
  console.error("Require OpenAi api key");
  alert("Require OpenAi api key")
}

let proxy = import.meta.env.VITE_OPENAI_API_PROXY_KEY;
if (!proxy)
  proxy = "https://api.openai.com/v1";

export const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: proxy,
  dangerouslyAllowBrowser: true
});