const inputQuestion = document.getElementById("inputQuestion");
const result = document.getElementById("result");

inputQuestion.addEventListener("keypress", (e) => {
  if (inputQuestion.value && e.key === "Enter") SendQuestion();
});

const OPENAI_API_KEY = "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";
const localStorageKey = "chatGPTHistory";
let chatHistory = [];

function loadChatHistory() {
  const chatHistoryString = localStorage.getItem(localStorageKey);

  if (chatHistoryString) {
    chatHistory = JSON.parse(chatHistoryString);

    chatHistory.forEach((message) => {
      addMessageToResult(message);
    });
  }
}

function saveChatHistory() {
  localStorage.setItem(localStorageKey, JSON.stringify(chatHistory));
}

function addMessageToResult(message) {
  if (result.value) result.value += "\n";
  result.value += `${message.sender}: ${message.text}`;
  result.scrollTop = result.scrollHeight;
}

function SendQuestion() {
  const sQuestion = inputQuestion.value;

  if (sQuestion.trim() === "") {
    return;
  }

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: sQuestion,
      max_tokens: 2048, // tamanho da resposta
      temperature: 0.7, // criatividade na resposta
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.error?.message) {
        addMessageToResult({
          sender: "Chat GPT",
          text: `Error: ${json.error.message}`,
        });
      } else if (json.choices?.[0].text) {
        const text = json.choices[0].text || "Sem resposta";

        addMessageToResult({ sender: "VN-IA", text });
      }
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
      inputQuestion.value = "";
      inputQuestion.disabled = false;
      inputQuestion.focus();

      chatHistory.push({ sender: "Eu", text: sQuestion });
      saveChatHistory();
    });

  inputQuestion.value = "Carregando...";
  inputQuestion.disabled = true;
}

loadChatHistory();
