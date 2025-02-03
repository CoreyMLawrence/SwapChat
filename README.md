# SwapChat

SwapChat is a chat interface application that allows users to interact with different language models. It supports drag-and-drop functionality for text files and provides a clean and responsive user interface.

## Features

- **Model Selection**: Choose from a list of available language models.
- **Chat Interface**: Send and receive messages in a chat-like interface.
- **Drag-and-Drop**: Drag and drop text files to add their content to the chat context.
- **Responsive Design**: The chat container adjusts its height based on the viewport size.
- **Session Management**: Chat context is stored in session storage to maintain state across page reloads.

## Setup

### Prerequisites

- Node.js (version 14.17 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/SwapChat.git
   cd SwapChat/SwapChat
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```properties
   OPENROUTER_API_KEY=your_openrouter_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the Application

1. Start the server:

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Sending Messages**: Type your message in the input field and press Enter or click the send button.
- **Model Selection**: Use the dropdown menu to select a different language model.
- **Clearing Context**: Click the trash button to clear the chat context.
- **Drag-and-Drop**: Drag and drop a text file into the input area to add its content to the chat.
