let select = document.querySelector(".select-heading");
let options = document.querySelector(".options");
let arrow = document.querySelector(".arrow img");
let option = document.querySelectorAll(".option");
let selectText = document.querySelector(".select-heading span");

select.addEventListener("click", () => {
    options.classList.toggle("active-options");
    arrow.classList.toggle("rotate");
});

option.forEach((item) => {
    item.addEventListener("click", () => {
        selectText.innerText = item.innerText;
    });
});

// Chat-bot
let prompt = document.querySelector(".prompt");
let chatBtn = document.querySelector(".input-area button");
let chatContainer = document.querySelector(".chat-container");
let userMessage = "";
let chatBox = document.querySelector(".chat-box");
let chatImage = document.querySelector(".chat-image");

chatImage.addEventListener("click", () => {
    chatBox.classList.toggle("active-chat-box");
    if (chatBox.classList.contains("active-chat-box")) {
        chatImage.src = "cross.svg";
    } else {
        chatImage.src = "chatbot.svg";
    }
});

let Api_url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAP4X15hi5o0aiOtN02o22TyMVt7UZ366s";

async function generateApiResponse(aiChatBox) {
    const textElement = aiChatBox.querySelector(".text");
    try {
        const response = await fetch(Api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: `${userMessage} in 20 words` }],
                    },
                ],
            }),
        });
        const data = await response.json();
        const apiResponse = data?.candidates[0].content.parts[0].text.trim();
        textElement.innerText = apiResponse;
    } catch (error) {
        console.log(error);
    } finally {
        aiChatBox.querySelector(".loading").style.display = "none";
    }
}

function createChatBox(html, className) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

function showLoading() {
    const html = `<p class="text"></p>
    <img src="load.gif" class="loading" width="40px">`;
    let aiChatBox = createChatBox(html, "ai-chatbox");
    chatContainer.appendChild(aiChatBox);
    generateApiResponse(aiChatBox);
}

chatBtn.addEventListener("click", () => {
    userMessage = prompt.value;
    const html = `<p class="text"></p>`;
    let userChatBox = createChatBox(html, "user-chatbox");
    userChatBox.querySelector(".text").innerText = userMessage;
    chatContainer.appendChild(userChatBox);
    prompt.value = "";
    setTimeout(showLoading, 500);
});

// Virtual Assistant
let ai = document.querySelector(".ai-image img");
let speakPage = document.querySelector(".speak-page");
let content = document.querySelector(".speak-page h1");

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "hi-GB";
    window.speechSynthesis.speak(text_speak);
}

let speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
let recognition = new speechRecognition();
recognition.onresult = (event) => {
    let currentIndex = event.resultIndex
    let transcript = event.results[currentIndex][0].transcript
    content.innerText = transcript
    speakPage.style.display = "none";
    takeCommand(transcript.toLowerCase())
}

function takeCommand(message) {
    if (message.includes("open") && message.includes("chat")) {
        speak("Chat box opened");
        chatBox.classList.add("active-chat-box")
    } else if (message.includes("close") && message.includes("chat")) {
        speak("Chat box closed");
        chatBox.classList.remove("active-chat-box")
    } else if (message.includes("back workout")) {
        speak("These are the best back workouts");
        window.open("back.html", "_self");
    } else if (message.includes("chest workout")) {
        speak("These are the best chest workouts");
        window.open("chest.html", "_self");
    } else if (message.includes("shoulder workout")) {
        speak("These are the best shoulder workouts");
        window.open("shoulder.html", "_self");
    } else if (message.includes("arms workout")) {
        speak("These are the best biceps and triceps workouts");
        window.open("biceps_triceps.html", "_self");
    } else if (message.includes("leg workout")) {
        speak("These are the best leg workouts");
        window.open("leg.html", "_self");
    } else if(message.includes("hello") || message.includes("Hey")){
        speak("Haye i am bunny, how can i help you")
    } 
}

ai.addEventListener("click", () => {
    recognition.start()
    speakPage.style.display = "flex";
});