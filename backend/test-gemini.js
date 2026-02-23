const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: 'AIzaSyDn9n16r2vaIFpEj16M3TnKI_vKIQueT34' });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello'
    });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}
run();
