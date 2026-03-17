// AI Makeup Assistant Chat Bot
const API_KEY = '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';
const API_URL = 'https://huggingface.co/settings/tokens/69b9b7fddcf046e5efcb2eed';

// DOM Elements
let chatMessages;
let userInput;
let sendMessageBtn;
let chatStatus;
let suggestionButtons;
let clearChatBtn;
let saveChatBtn;

// Chat History
let chatHistory = [];

// Makeup and Beauty Related Keywords
const beautyKeywords = [
    'makeup', 'cosmetic', 'beauty', 'skin', 'face', 'hair', 'nail', 'lipstick', 'foundation',
    'concealer', 'powder', 'blush', 'bronzer', 'highlighter', 'eyeshadow', 'mascara', 'eyeliner',
    'brow', 'lip', 'gloss', 'contour', 'primer', 'setting spray', 'moisturizer', 'cleanser',
    'toner', 'serum', 'cream', 'lotion', 'sunscreen', 'acne', 'wrinkle', 'pore', 'dark circle',
    'spot', 'pigmentation', 'tone', 'complexion', 'oily', 'dry', 'combination', 'sensitive',
    'mature', 'young', 'anti-aging', 'hydration', 'exfoliate', 'mask', 'treatment', 'routine',
    'product', 'brand', 'natural', 'organic', 'chemical', 'ingredient', 'application', 'technique',
    'tutorial', 'tip', 'trick', 'hack', 'trend', 'style', 'look', 'glam', 'natural look',
    'evening look', 'bridal', 'party', 'everyday', 'waterproof', 'long-lasting', 'matte', 'dewy',
    'shimmery', 'metallic', 'nude', 'bold', 'dramatic', 'subtle', 'professional'
];

// Check if query is beauty-related
function isBeautyRelated(query) {
    query = query.toLowerCase();
    return beautyKeywords.some(keyword => query.includes(keyword.toLowerCase())) ||
           query.includes('how to') || query.includes('what is') || query.includes('recommend');
}

// Initialize chat
function initializeChat() {
    chatMessages = document.getElementById('ai-chat-messages');
    userInput = document.getElementById('ai-user-input');
    sendMessageBtn = document.getElementById('ai-send-message');
    chatStatus = document.getElementById('chat-status');
    suggestionButtons = document.querySelectorAll('.suggestion-btn');
    clearChatBtn = document.querySelector('.feature-btn[title="Clear Chat"]');
    saveChatBtn = document.querySelector('.feature-btn[title="Save Chat"]');

    // Event listeners
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', handleSendMessage);
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    // Suggestion buttons
    if (suggestionButtons) {
        suggestionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const text = button.textContent.trim();
                userInput.value = text;
                handleSendMessage();
            });
        });
    }

    // Clear and Save buttons
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearChat);
    }

    if (saveChatBtn) {
        saveChatBtn.addEventListener('click', saveChat);
    }

    // Add welcome message
    addWelcomeMessage();
}

// Add welcome message
function addWelcomeMessage() {
    const welcomeMsg = "Hello! I'm your AI Makeup Assistant. I can help you with makeup tips, product recommendations, and beauty advice. What would you like to know about makeup or skincare?";
    addMessage(welcomeMsg, 'bot');
    updateStatus('Ready to help');
}

// Handle send message
async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Disable input
    setInputState(true);
    userInput.value = '';

    // Check if beauty-related
    if (!isBeautyRelated(message)) {
        addMessage(message, 'user');
        addMessage("I'm your AI Makeup Assistant. Please ask me about makeup, skincare, or beauty-related topics!", 'bot');
        updateStatus('Ready to help');
        setInputState(false);
        return;
    }

    try {
        addMessage(message, 'user');
        updateStatus('Processing...');

        const loadingDiv = createLoadingIndicator();
        chatMessages.appendChild(loadingDiv);

        const contextPrompt = `As an AI Makeup Assistant, provide a clear, step-by-step response about: ${message}. 
        Please format your response as follows:
        1. Start with a brief one-line introduction if needed
        2. Break down the answer into numbered steps
        3. Keep each step short and focused
        4. Add any important tips at the end
        5. Use simple, clear language
        Focus only on makeup and beauty information. Be concise and specific.`;

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: contextPrompt
                    }]
                }]
            })
        });

        const data = await response.json();
        
        // Remove loading indicator
        if (loadingDiv.parentNode) {
            chatMessages.removeChild(loadingDiv);
        }

        if (data.error) {
            console.error('API Response Error:', data.error);
            addMessage('Error: ' + data.error.message, 'bot', true);
            updateStatus('Error', true);
        } else if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            addMessage(aiResponse, 'bot');
            updateStatus('Ready to help');
        } else {
            throw new Error('Invalid response format');
        }

    } catch (error) {
        console.error('Request Error:', error);
        addMessage('An error occurred. Please try again.', 'bot', true);
        updateStatus('Error', true);
    } finally {
        setInputState(false);
    }
}

// Add message to chat
function addMessage(text, sender, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}${isError ? ' error' : ''}`;
    
    if (sender === 'bot' && !isError) {
        const formattedText = formatBotResponse(text);
        messageDiv.innerHTML = formattedText;
    } else {
        const messageText = document.createElement('p');
        messageText.textContent = text;
        messageDiv.appendChild(messageText);
    }
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    setTimeout(() => {
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);

    // Store in chat history
    chatHistory.push({ text, sender });
}

// Format bot responses
function formatBotResponse(text) {
    text = text.replace(/\*\*/g, '');
    text = text.replace(/\s+/g, ' ').trim();

    const sections = text.split(/(?:\d+\.|Step [0-9]+:)/).filter(Boolean);
    let formattedHtml = '';

    if (sections.length > 1) {
        formattedHtml = '<div class="steps-container">';
        sections.forEach((section, index) => {
            if (section.trim()) {
                formattedHtml += `
                    <div class="step-item">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-content">${section.trim()}</div>
                    </div>`;
            }
        });
        formattedHtml += '</div>';
    } else {
        const paragraphs = text.split('\n').filter(Boolean);
        paragraphs.forEach(para => {
            if (para.toLowerCase().includes('tip:') || 
                para.toLowerCase().includes('note:') || 
                para.toLowerCase().includes('important:')) {
                formattedHtml += `<div class="key-point">${para.trim()}</div>`;
            } else {
                formattedHtml += `<p class="content-paragraph">${para.trim()}</p>`;
            }
        });
    }

    return formattedHtml;
}

// Create loading indicator
function createLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot loading';
    loadingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    return loadingDiv;
}

// Update status
function updateStatus(status, isError = false) {
    if (chatStatus) {
        chatStatus.textContent = status;
        chatStatus.style.color = isError ? '#dc3545' : '#4CAF50';
        chatStatus.style.opacity = '0';
        requestAnimationFrame(() => {
            chatStatus.style.transition = 'opacity 0.3s ease';
            chatStatus.style.opacity = '1';
        });
    }
}

// Set input state
function setInputState(disabled) {
    if (userInput) userInput.disabled = disabled;
    if (sendMessageBtn) sendMessageBtn.disabled = disabled;
    if (suggestionButtons) {
        suggestionButtons.forEach(button => button.disabled = disabled);
    }
}

// Clear chat
function clearChat() {
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
    chatHistory = [];
    addWelcomeMessage();
}

// Save chat
function saveChat() {
    const chatData = JSON.stringify(chatHistory, null, 2);
    const blob = new Blob([chatData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `makeup-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChat);
