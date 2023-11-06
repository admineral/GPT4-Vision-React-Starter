
# OpenAI GPT-4 Vision API Image Analyzer

This project is a sleek and user-friendly web application built with React. It utilizes the cutting-edge capabilities of OpenAI's GPT-4 Vision API to analyze images and provide detailed descriptions of their content. With a simple drag-and-drop or file upload interface, users can quickly get insights into their images.

## Features

- Drag and drop or click to upload an image
- Real-time image preview
- Secure API interaction with OpenAI's GPT-4 Vision API
- Responsive and intuitive UI
- Progress bar for upload status
- Display of analysis results in a readable format

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

Ensure you have the following installed:
- Node.js (LTS version recommended)
- npm or yarn as your package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-github-username/openai-gpt4-vision-analyzer.git
```

2. Navigate to the project directory:

```bash
cd openai-gpt4-vision-analyzer
```

3. Install the dependencies:

```bash
npm install
```
or if you're using yarn:

```bash
yarn install
```

4. Create a `.env` file in the root directory and add your OpenAI API key:

```plaintext
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

5. Start the development server:

```bash
npm start
```
or with yarn:

```bash
yarn start
```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

To analyze an image:

1. Drag and drop an image into the designated area or click the area to select an image from your device.
2. The image will be displayed as a preview.
3. Click the "Analyze Image" button to send the image for analysis.
4. View the analysis results below the upload area.

## Built With

- [React](https://reactjs.org/) - The web framework used
- [OpenAI GPT-4 Vision API](https://beta.openai.com/docs/guides/vision) - Image analysis API



## Acknowledgments

- OpenAI team for providing the GPT-4 Vision API

