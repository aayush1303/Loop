const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
    export const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "Reference to :\n{\n   \"time\": 1550476186479,\n   \"blocks\": [\n      {\n         \"id\": \"oUq2g_tl8y\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"Editor.js\",\n            \"level\": 2\n         }\n      },\n      {\n         \"id\": \"zbGZFPM-iI\",\n         \"type\": \"paragraph\",\n         \"data\": {\n            \"text\": \"Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration.\"\n         }\n      },\n      {\n         \"id\": \"qYIGsjS5rt\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"Key features\",\n            \"level\": 3\n         }\n      },\n      {\n         \"id\": \"XV87kJS_H1\",\n         \"type\": \"list\",\n         \"data\": {\n            \"style\": \"unordered\",\n            \"items\": [\n               \"It is a block-styled editor\",\n               \"It returns clean data output in JSON\",\n               \"Designed to be extendable and pluggable with a simple API\"\n            ]\n         }\n      },\n      {\n         \"id\": \"AOulAjL8XM\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"What does it mean «block-styled editor»\",\n            \"level\": 3\n         }\n      },\n      {\n         \"id\": \"cyZjplMOZ0\",\n         \"type\": \"paragraph\",\n         \"data\": {\n            \"text\": \"Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class=\\\"cdx-marker\\\">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core.\"\n         }\n      }\n   ],\n   \"version\": \"2.8.1\"\n}\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"time\": 1688982858560,\n  \"blocks\": [\n    {\n      \"id\": \"oUq2g_tl8y\",\n      \"type\": \"header\",\n      \"data\": {\n        \"text\": \"Grocery TODO List\",\n        \"level\": 1\n      }\n    },\n    {\n      \"id\": \"zbGZFPM-iI\",\n      \"type\": \"paragraph\",\n      \"data\": {\n        \"text\": \"This is your grocery list. Add items, check them off as you buy them, and keep track of your shopping needs.\"\n      }\n    },\n    {\n      \"id\": \"qYIGsjS5rt\",\n      \"type\": \"list\",\n      \"data\": {\n        \"style\": \"unordered\",\n        \"items\": [\n          \"Milk\",\n          \"Eggs\",\n          \"Bread\",\n          \"Cheese\",\n          \"Apples\"\n        ]\n      }\n    },\n    {\n      \"id\": \"AOulAjL8XM\",\n      \"type\": \"header\",\n      \"data\": {\n        \"text\": \"Instructions\",\n        \"level\": 3\n      }\n    },\n    {\n      \"id\": \"cyZjplMOZ0\",\n      \"type\": \"paragraph\",\n      \"data\": {\n        \"text\": \"To add an item, click the \\\"+\\\" button at the end of the list. To check an item off, click the checkbox next to it.\"\n      }\n    }\n  ],\n  \"version\": \"2.8.1\"\n}\n```\n\n**Explanation:**\n\n* **\"time\"**: This field represents the timestamp when the data was generated or last modified.\n* **\"blocks\"**: This array holds the content of the editor, structured as individual blocks. \n* **\"id\"**: A unique identifier for each block.\n* **\"type\"**: The type of block, e.g., \"header\", \"paragraph\", \"list\", etc.\n* **\"data\"**: Contains specific data related to the block type.\n    * **\"text\"**: The text content of the block.\n    * **\"level\"**: Heading level for headers.\n    * **\"style\"**: List type for lists (\"unordered\" or \"ordered\").\n    * **\"items\"**: Array of items within the list.\n* **\"version\"**: The version of Editor.js used to create this data.\n\n**How to use this template:**\n\n1. **Save it as a JSON file:** Save the code above as a `.json` file, for example, `grocery-list.json`.\n2. **Load it into Editor.js:**  Use Editor.js and configure it to load the content from this JSON file. This will populate the editor with your grocery list structure.\n\nThis template provides a basic structure for a grocery TODO list. You can extend it with additional features, such as:\n\n* **Adding a \"Notes\" section:** Use a \"paragraph\" block for adding additional notes related to your shopping.\n* **Adding a \"Due date\" feature:** Use a \"code\" or \"paragraph\" block to store the due date for your shopping list.\n* **Implementing custom blocks:** Explore Editor.js plugins to create custom blocks for things like:\n    * **Quantity selection:** Use a custom block to allow selecting quantities for each item.\n    * **Price tracking:** Use a custom block to track the price of each item.\n"},
          ],
        },
      ],
    });

