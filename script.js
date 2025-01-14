// Function to create a popup alert
function showAlert(message) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  // Create popup container
  const popup = document.createElement("div");
  popup.className = "popup";

  // Add message to popup
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  popup.appendChild(messageElement);

  // Add close button to popup
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => {
    popup.classList.add("closing"); // Add the closing animation class
    setTimeout(() => {
      document.body.removeChild(overlay);
      document.body.removeChild(popup);
    }, 500); // Wait for the closing animation to finish (500ms)
  });
  popup.appendChild(closeButton);

  // Add overlay and popup to the body
  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}

// Function to handle file input and process the JSON data
document
  .getElementById("jsonFileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) {
      showAlert("No file selected. Please choose a JSON file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const jsonData = JSON.parse(e.target.result);
        processChatData(jsonData);
      } catch (error) {
        showAlert(
          "Invalid JSON file. Please ensure the file is properly formatted."
        );
        document.getElementById("jsonFileInput").value = ""; // Clear the file input
      }
    };

    reader.onerror = function () {
      showAlert(
        "Error reading file. Please try again or check the file format."
      );
      document.getElementById("jsonFileInput").value = ""; // Clear the file input
    };

    reader.readAsText(file);
  });

// Function to process chat data and log the name of the person being chatted with
function processChatData(jsonData) {
  if (jsonData.participants != null) {
    showSuccessMessage(jsonData);

    // Remove the header and file input elements
    document.querySelector("h1").remove();
    document.querySelector('input[type="file"]').remove();
  } else {
    throw new Error();
  }
}

// Function to show the success message in the centered div
function showSuccessMessage(jsonData) {
  // Get the success message div and set its content
  const successMessageDiv = document.getElementById("successMessage");

  if (jsonData.participants.length == 2) {
    successMessageDiv.textContent = `Chatting with ${jsonData.participants[1].name} & ${jsonData.participants[0].name}`;
  } else {
    // TODO: Make it work for group chats
  }

  // TODO: Add the results based on the chat data

  // Call the ChatGPT API to analyze the chat data and provide insights
  async function getChatGPTResponse(chatData) {
    const apiKey =
      "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"; // Replace with your actual API key
    const apiUrl = "https://api.openai.com/v1/engines/gpt-4.0-mini/completions";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "when json data is uploaded, understand it while keeping in mind the data has two elements, the first being the list of participants as a dictionary with their names as the one element in the dictionary, and the second being a list of messages exchanged with the sender's name, timestamp in ms of the message sent and the content of the message",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'after understanding the provided json data, respond back with answers to the questions:\n- most frequent topic discussed\n- most used emoji along with the text showing how many times it appeared next to it like "x5" for 5 times (only 1 emoji and doesn\'t include reactions to messages)\n- most frequent time of the day and respond with the time period in words like morning or afternoon or even dinner time instead of the actual time (get creative with the response for time of the day)\n- overall chat sentiment in 2 words like how you responded with "positive" and "friendly"\n- name of the person with the fastest response time\n- longest streak of consecutive days chatting\n- chat personalities for participants in the format "name: chat personality with the emoji"',
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'from now onwards always respond with the analysis in json with the following format:\n\n{\n  "most_frequent_topic_discussed": ["Traveling", "University Life"],\n  "most_used_emoji": {\n    "emoji": "❤️",\n    "count": 4\n  },\n  "most_frequent_time_of_day": "Late-night chats, often around dinner time and post-dinner hours",\n  "overall_chat_sentiment": ["Positive", "Casual"],\n  "fastest_responder":  "Person 1",\n  "longest_streak_of_consecutive_days_chatting": 5,\n  "chat_personalities": {\n    "Person 1": "Late-Night Texter 🌙",\n    "Person 2": "Relaxed Conversationalist 😎"\n  }\n}\n\ndon\'t include the top and bottom lines for the json response.\n\nanalyze the message timestamps to determine the fastest responder based on the average response time in future analyses.\n',
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: JSON.stringify(chatData),
              },
            ],
          }
        ],
        response_format: {
          type: "text",
        },
        temperature: 1,
        max_completion_tokens: 300,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to fetch data from ChatGPT API");
    }

    const data = await response.json();
    return data.choices[0].text.trim();
  }

  getChatGPTResponse(jsonData)
    .then((response) => {
      // const resultsDiv = document.createElement('div');
      // resultsDiv.className = 'results';
      // resultsDiv.textContent = `ChatGPT Analysis: ${response}`;
      // document.body.appendChild(resultsDiv);
      console.log(response);
    })
    .catch((error) => {
      showAlert(`Error: ${error.message}`);
    });

  successMessageDiv.style.display = "block";
}
