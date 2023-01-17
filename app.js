const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: "OPENAI_API_KEY"
});
async function getCalloutText() {
    var request = require("request-promise-native");
  
    const blockId = "BLOCK_ID"
    const options = {
        method: 'GET',
        uri: `https://api.notion.com/v1/blocks/${blockId}`,
        headers: {
            'Content-Type': 'application/json',
            'Notion-Version': '2021-05-13',
            'Authorization': 'Bearer NOTION_API_KEY'
        },
        json: true
    };
  
    return request(options);
  }
const openai = new OpenAIApi(configuration);

async function generateAction(calloutText) {
    const text = calloutText.callout.text[0].plain_text;
    const baseCompletion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.7,
        max_tokens: 500,
    })
    const promptOutput = baseCompletion.data.choices.pop()
    return promptOutput.text;
}
var request = require('request');

async function send_to_notion(token, page, input) {
    request.get({
      url: "https://api.notion.com/v1/blocks/" + page + "/children",
      headers: {
          'Content-Type': 'application/json',
          'Notion-Version': '2021-05-13',
          'Authorization': 'Bearer ' + token
      },
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      }
    });
    
    var writeData = {
      "children": [
        {
          "object": "block",
          "type": "paragraph",
          "paragraph": {
            "text": [
              {
                "type": "text",
                "text": {
                  "content": input
                }
              }
            ]
          }
        }
      ]
    }
  
    request.patch({
      url: "https://api.notion.com/v1/blocks/" + page + "/children",
      headers: {
          'Content-Type': 'application/json',
          'Notion-Version': '2021-05-13',
          'Authorization': 'Bearer ' + token
      },
      json: true,
      body: writeData
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      }
    });
  }
  
async function main() {
    const calloutText = await getCalloutText()
    if (calloutText.object === 'block' && calloutText.hasOwnProperty('callout')) {
        const output = await generateAction(calloutText)
        send_to_notion("NOTION_API_KEY", "PAGE_ID", output)
        console.log(output)
    }
  }
  
main()
  
//   getCalloutText()
//   .then((response) => {
//       if (response.object === 'block') {
//           const text = response.callout.text[0].plain_text;
//           console.log(text);
//           return generateAction(text)
//       }
//   }) .then(async (generateText) => {
//     const generatedText = await generateAction(generateText)
//     // rest of your code
//     console.log(generatedText)

// })
//   .catch(error => {
//       console.log("Error: ", error);
//   });
