const axios = require('axios');
const { OPENAI, PROMPTS } = require('../../utils/consts');
const config = require('../config/config');
const { OpenAI } = require("openai");
OPENAI_API_KEY = config.OPENAI_API_KEY;


// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

exports.extractDetails = async (description, structuredDetails) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: PROMPTS.SET_SYSTEM_ROLE },
        { role: 'user', content: PROMPTS.EXTRACT_DETAILS(description, structuredDetails) },
      ],
      model: OPENAI.MODELS.GPT,  // Use gpt-3.5-turbo for book generation
      max_tokens: OPENAI.MAX_TOKENS.EXTRACTION,  // Limit the length of the book
      temperature: OPENAI.TEMPERATURE.STRUCTURED,
    }).then(function (response) {
      console.log(response);
      return response
    })
        .catch(function (error) {
          console.log(error);
        });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error extracting details:', error);
    throw new Error('Error extracting details');
  }
};

exports.generateBook = async (data, pages) => {
  try {
    const response = await openai.chat.completions.create({
      model: OPENAI.MODELS.GPT,
      messages: [
        { role: "system", content: PROMPTS.SET_SYSTEM_ROLE },
        { role: "user", content: PROMPTS.GENERATE_BOOK(data, pages) },
      ],
      max_tokens: OPENAI.MAX_TOKENS.BOOK_GENERATION,
      temperature: OPENAI.TEMPERATURE.STRUCTURED
    });

    console.log('The Book:' + response.choices[0].message.content)
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating book:', error);
    throw new Error('Error generating book');
  }
};

exports.generateIllustration = async (childData, sceneDescription, fallbackPrompt) => {
  try {
    const response = await openai.images.generate({
      model: OPENAI.MODELS.DALL_E,
      prompt: fallbackPrompt ? fallbackPrompt : PROMPTS.GENERATE_ILLUSTRATIONS(childData, sceneDescription),
      n: OPENAI.PAGE_ILLUSTRATION_AMOUNT,
      size: OPENAI.ILLUSTRATION_SIZE,
    });
    return response.data[0].url; // URL of the generated illustration
  } catch (error) {
    console.error('Error generating book:', error);
    throw new Error('Error generating book');
  }
};