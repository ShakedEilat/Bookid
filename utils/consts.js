// OpenAI Constants
exports.OPENAI = {
    BASE_URL: 'https://api.openai.com/v1',
    MODELS: {
        GPT: 'gpt-4',
        DALL_E: 'dall-e-3',
    },
    MAX_TOKENS: {
        BOOK_GENERATION: 1000,
        EXTRACTION: 400,
    },
    TEMPERATURE: {
        CREATIVE: 0.8,
        STRUCTURED: 0.7,
    },
    ILLUSTRATION_SIZE: "1024x1024",
    PAGE_ILLUSTRATION_AMOUNT: 1
};

// API Response Messages
exports.RESPONSE_MESSAGES = {
    SUCCESS: 'Operation completed successfully.',
    ERROR: 'An error occurred.',
    NOT_FOUND: 'Resource not found.',
    UNAUTHORIZED: 'Unauthorized access.',
};

// Error Messages
exports.ERROR_MESSAGES = {
    CHILD_PROFILE_NOT_FOUND: 'Child profile not found.',
    BOOK_GENERATION_FAILED: 'Book generation failed.',
    OPENAI_API_ERROR: 'Error occurred while interacting with OpenAI API.',
    MISSING_INPUT: 'Missing required input.',
    MISSING_NAME: 'Name is required.',
    MISSING_AGE: 'Valid age is required.',
    MISSING_GENDER: 'Gender is required.',
    AUTH_FAILED: 'Authentication failed.',
    INVALID_CREDENTIALS: 'Invalid credentials.',
    SERVER_ERROR: 'Internal server error.',
};

// Status Codes
exports.STATUS_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

// Routes Constants
exports.ROUTES = {
    AUTH: '/auth',
    CHILD_PROFILES: '/child_profiles',
    BOOKS: '/books',
};

// MongoDB Collections
exports.DB_COLLECTIONS = {
    USERS: 'users',
    CHILD_PROFILES: 'childProfiles',
    BOOKS: 'books',
};

// Free API key
exports.API_KEYS = {
    IMAGEBB: 'bb130c0090e85a72f8a4ea2bcd747087',
};

// Prompt Templates
exports.PROMPTS = {
    EXTRACT_DETAILS: (description, structuredDetails) => `
Extract key information about the child from this text: "${description}".
This are the details you already have: "${structuredDetails}"
Output as JSON:
`,
    SET_SYSTEM_ROLE: 'You are a helpful assistant that writes children\'s books. Customized for them as a book that they are the star of. You get the book details from data they give.',
    GENERATE_ILLUSTRATIONS_BETA: (data) => `Create a children's book illustration
     featuring ${data.name}, a ${data.age}-year-old ${data.gender} with ${data.appearance}, in a ${data.location ? data.location : 'glowing magical forest with shimmering trees and colorful talking animals'} and make it magical. 
The style should be vibrant, colorful, and warm, similar to classic children’s books. The child should look consistent across all illustrations, wearing [specific outfit details, e.g., "a blue jacket and red boots"]. Capture the scene with a whimsical and magical feeling, focusing on [specific action, e.g., "the child looking up in wonder at a glowing golden bird"]. Ensure all details are age-appropriate and imaginative.
`,
    GENERATE_ILLUSTRATIONS: (data, sceneDescription) => `Create a vibrant, colorful children's book illustration featuring ${data.name}, a ${data.age}-year-old ${data.gender} with ${data.appearance}. The child is wearing ${data.outfit}. 

The illustration should depict: ${sceneDescription}. 
Keep the scene simple and uncluttered. Include only the necessary elements to convey the story visually, avoiding excessive details or background complexity. 

The child should remain the central focus of the image, with consistent features and outfit across all illustrations. Use bright, soft, and vibrant colors suitable for a whimsical, magical children's book style. The image must NOT include any text or words.`,
    GENERATE_ILLUSTRATION_FALLBACK: (data) => `Create a vibrant, child-friendly and colorful children's book illustration featuring ${data.name}, a ${data.age}-year-old ${data.gender} with ${data.appearance}. The child is wearing ${data.outfit}. `,
    
    // Updated GENERATE_BOOK prompt with strict word count limits
    GENERATE_BOOK: (data, pages) => `
You are a professional children's book author creating a magical, imaginative, and engaging story for kids aged around ${data.age}.

Write a story about ${data.name}, a ${data.age}-year-old ${data.gender} with ${data.appearance}. Additional details about ${data.name}:
${data.additionalInfo}.

Additional potential information:
${data.hobbies ? 'Hobbies: ' + data.hobbies.join(', ') : ''} ${data.outfit ? 'Favorite outfit: ' + data.outfit : 'white shirt, red jacket, and jeans'} ${data.location ? 'Location: ' + data.location : ''} ${data.favoriteFood ? 'Favorite food: ' + data.favoriteFood : ''} ${data.favoriteColor ? 'Favorite color: ' + data.favoriteColor : ''} ${data.favoriteThingToDo ? 'Favorite thing to do: ' + data.favoriteThingToDo : ''} ${data.mostLovedCharacter ? 'Most loved character: ' + data.mostLovedCharacter : ''}

Story Requirements:
A warm and adventurous tone suitable for young children.
A clear beginning, middle, and happy ending.
Exciting discoveries and a moral lesson about friendship, courage, or kindness.
Rich descriptions that evoke wonder and excitement.
Structure:
Divide the story into exactly ${pages} parts (e.g., if pages = 3, write 3 parts; if pages = 4, write 4 parts).
Each part must correspond to a natural progression of the story:

Introduce ${data.name} and the setting in the first part.
Build challenges, adventures, and discoveries in subsequent parts.
Resolve the story with a heartwarming ending in the final part.
Word Count: The story should be approximately ${pages * 20} words, evenly distributed across the parts.

Word Count Requirements:
- Total Word Count: The story must be between ${pages * 20} and ${pages * 25} words.
- Each section should have no more than 25 words.
- Ensure that the total word count does not exceed ${pages * 25} words.

Formatting Rules:

Begin the output with the title of the book (as the first line).
Divide the story into exactly ${pages} distinct sections, where each section flows seamlessly into the next without explicitly marking "Part 1," "Part 2," etc. Use natural story transitions. Ensure the story ends with the line "The End!"
Example Output Format:
python
Copy code
<Title>
<Part 1>
...
The End!
Important:
- Do not add extra parts, summaries, or explanations beyond the requested number of parts (pages).
- Ensure each part aligns naturally with the story’s flow and ends smoothly before the next.
`
};
