// Simple ChatBot implementation
class ChatBot {
    constructor() {
        // Initialize DOM elements
        this.chatMessages = document.querySelector('.chat-messages');
        this.chatInput = document.querySelector('.chat-input');
        this.sendButton = document.querySelector('.send-button');
        
        // Bind event listeners
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSendMessage();
            }
        });
    }

    async handleSendMessage() {
        const userMessage = this.chatInput.value.trim();
        if (!userMessage) return;

        try {
            // Clear input
            this.chatInput.value = '';

            // Show user message
            this.showMessage('user', userMessage);

            // Show loading state
            this.showLoading(true);

            // Get AI response
            const aiResponse = await this.getAIResponse(userMessage);

            // Hide loading state
            this.showLoading(false);

            // Show AI response
            this.showMessage('bot', aiResponse);

        } catch (error) {
            console.error('Chat error:', error);
            this.showLoading(false);
            this.showMessage('bot', 'Sorry, I had trouble processing your request. Please try again.');
        }
    }

    async getAIResponse(message) {
        const API_KEY = 'AIzaSyAra_ol-J3Jt3zjmoL17ZUh6WmNghZ1lgE';
        const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `As a makeup and beauty expert, please provide a helpful response to: ${message}`
                                }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();

            // Check for API errors
            if (!response.ok) {
                throw new Error(data.error?.message || 'API request failed');
            }

            // Extract the response text
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('AI API Error:', error);
            throw new Error('Failed to get AI response');
        }
    }

    showMessage(type, content) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.textContent = content;

        // Add to chat
        this.chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        this.scrollToBottom();
    }

    showLoading(show) {
        // Remove existing loading indicator if any
        const existingLoader = this.chatMessages.querySelector('.loading');
        if (existingLoader) {
            existingLoader.remove();
        }

        // Add new loading indicator if needed
        if (show) {
            const loadingDiv = document.createElement('div');
            loadingDiv.classList.add('message', 'bot', 'loading');
            loadingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            this.chatMessages.appendChild(loadingDiv);
            this.scrollToBottom();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize ChatBot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.chatBot = new ChatBot();
        console.log('ChatBot initialized successfully');
    } catch (error) {
        console.error('ChatBot initialization failed:', error);
    }
}); 