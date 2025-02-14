// Select DOM elements
const authContainer = document.getElementById('auth-container');
const signupSection = document.getElementById('signup-section');
const loginSection = document.getElementById('login-section');
const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');
const themeToggle = document.getElementById('theme-toggle');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
// Check local storage for user preference
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️'; // Sun icon for light mode
} else {
    document.body.classList.remove('dark-mode');
    themeToggle.textContent = '🌙'; // Moon icon for dark mode
}

// Toggle dark mode
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark); // Save preference
});

let currentUserId = null;

// Switch to Login Section
document.getElementById('switch-to-login').addEventListener('click', () => {
    signupSection.style.display = 'none';
    loginSection.style.display = 'block';
});

// Switch to Signup Section
document.getElementById('switch-to-signup').addEventListener('click', () => {
    loginSection.style.display = 'none';
    signupSection.style.display = 'block';
});
// ************************************
document.addEventListener("DOMContentLoaded", function () {
    let dropdown = document.querySelector(".dropdown");
    let dropdownMenu = document.querySelector(".dropdown-menu");
    let timeout;

    dropdown.addEventListener("mouseenter", function () {
        clearTimeout(timeout);
        dropdownMenu.style.visibility = "visible";
        dropdownMenu.style.opacity = "1";
        dropdownMenu.style.transform = "translateY(0)";
    });

    dropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(function () {
            dropdownMenu.style.visibility = "hidden";
            dropdownMenu.style.opacity = "0";
            dropdownMenu.style.transform = "translateY(-10px)";
        }, 300); // Waits 300ms before hiding
    });

    dropdownMenu.addEventListener("mouseenter", function () {
        clearTimeout(timeout);
    });

    dropdownMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(function () {
            dropdownMenu.style.visibility = "hidden";
            dropdownMenu.style.opacity = "0";
            dropdownMenu.style.transform = "translateY(-10px)";
        }, 300);
    });
});


// Handle Signup
document.getElementById('signup-btn').addEventListener('click', async () => {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }
    try {
        const response = await fetch('http://127.0.0.1:5000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.uid) {
            alert(data.message); // Display success message
            currentUserId = data.uid;
            showChatInterface();
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert('An error occurred while signing up. Please try again.');
        console.error(error);
    }
});
let lastMessageDate = null; // To track date separators

// Handle Login
document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }
    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred');
        }
        const data = await response.json();
        alert(data.message); // Display success message
        currentUserId = data.uid; // Set the user ID
        console.log("Current User ID:", currentUserId); // Log the user ID
        showChatInterface();
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error(error);
    }
});

// Show Chat Interface and Fetch Chat History
async function showChatInterface() {
    authContainer.style.display = 'none';
    chatContainer.style.display = 'flex';
    try {
        console.log("Fetching chat history for user ID:", currentUserId); // Debug log
        // Fetch past chat history
        const response = await fetch(`http://127.0.0.1:5000/chat/${currentUserId}/history`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.chats && data.chats.length > 0) {
            data.chats.forEach(chat => appendMessage(chat.sender, chat.message));
        } else {
            console.log("No chat history found."); // Log for debugging
        }
    } catch (error) {
        alert('An error occurred while fetching chat history.');
        console.error(error);
    }
}
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        sendMessage();
    }
});
// Send Message
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Append user message to chat box
    appendMessage('user', message);
    userInput.value = '';
    try {
        const response = await fetch(`http://127.0.0.1:5000/chat/${currentUserId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred');
        }
        const data = await response.json();
        appendMessage('ai', data.response);
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error(error);
    }
}
fetch(`/chat/${user_id}/history`)
    .then(response => response.json())
    .then(data => {
        if (!data.chats || data.chats.length === 0) {
            console.log("No chat history found.");
            return;
        }
        console.log("Chat history:", data.chats);
    })
    .catch(error => console.error("Error fetching chat history:", error));

// Append Messages to Chat Box
function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    
    const timestamp = new Date();
    const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = timestamp.toLocaleDateString();

    if (lastMessageDate !== dateString) {
        // Insert date separator when a new day starts
        const dateSeparator = document.createElement('div');
        dateSeparator.classList.add('date-separator');
        dateSeparator.textContent = dateString;
        chatBox.appendChild(dateSeparator);
        lastMessageDate = dateString;
    }

    const messageText = document.createElement('span');
    messageText.textContent = message;
    
    const timeStampElement = document.createElement('span');
    timeStampElement.classList.add('timestamp');
    timeStampElement.textContent = timeString;
    
    messageElement.appendChild(messageText);
    messageElement.appendChild(timeStampElement);
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
}
    