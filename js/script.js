// DOM Elements
const chatIcon = document.getElementById('chatIcon');
const chatContainer = document.getElementById('chatContainer');
const chatHeader = document.getElementById('chatHeader');

// Toggle Chat Visibility
chatIcon.addEventListener('click', () => {
    chatContainer.classList.add('active');
    chatContainer.classList.remove('hidden');
    chatIcon.classList.add('hidden');
    // Show suggestions when opening chat
    document.getElementById('suggestions').classList.remove('suggestions-hidden');
});

chatHeader.addEventListener('click', () => {
    chatContainer.classList.remove('active');
    chatContainer.classList.add('hidden');
    chatIcon.classList.remove('hidden');
});

// Message Handling
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const suggestions = document.getElementById('suggestions');
    const message = userInput.value.trim();

    if (!message) return;

    // Hide suggestions
    suggestions.classList.add('suggestions-hidden');

    // Add user message
    chatMessages.innerHTML += `
        <div class="message-bubble user-message">
            ${message}
        </div>
    `;
    userInput.value = '';

    try {
        // Add loading indicator
        const loadingBubble = document.createElement('div');
        loadingBubble.className = 'message-bubble bot-message';
        loadingBubble.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm text-primary me-2"></div>
                <span>Thinking...</span>
            </div>
        `;
        chatMessages.appendChild(loadingBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Get response from backend
        const response = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message })
        });
        const data = await response.json();

        // Replace loading with response
        loadingBubble.outerHTML = `
            <div class="message-bubble bot-message">
                ${data.response}
            </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
        chatMessages.innerHTML += `
            <div class="message-bubble bot-message text-danger">
                Connection error
            </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Event Listeners
document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function useSuggestion(text) {
    document.getElementById('userInput').value = text;
    sendMessage();
}