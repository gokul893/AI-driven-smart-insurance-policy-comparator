***

### How to add this to your GitHub:
1. Go to your repository on GitHub: [gokul893/AI-driven-smart-insurance-policy-comparator](https://github.com/gokul893/AI-driven-smart-insurance-policy-comparator)
2. Click the green **Add a README** button.
3. Copy the markdown code below and paste it into the editor.
4. Click **Commit changes**.

***

### Copy everything below this line:

```markdown
# AI-Driven Smart Insurance Policy Extractor

A full-stack web application designed to automate the extraction of critical data from unstructured Motor Insurance PDF policies. By leveraging a local Large Language Model (LLM) and modern web technologies, this tool intelligently reads policy documents and generates structured, downloadable CSV files for seamless ERP/CRM integration.

## 🚀 Features

* **Automated Data Extraction:** Converts unstructured Motor Insurance PDFs into strictly formatted, tabular data.
* **Local AI Processing:** Uses [Ollama](https://ollama.com/) and the `mistral` model to ensure data privacy and zero API costs.
* **In-Memory File Handling:** Securely processes uploaded PDFs in memory using `multer` without saving them to the server's local disk.
* **Legacy Library Integration:** Features custom ESM-compatible wrappers to utilize the `pdf-parse` library in a modern Node.js environment.
* **Instant CSV Generation:** Maps the AI's JSON output directly into a formatted CSV ready for download.

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS (or your specific CSS framework)
* **Backend:** Node.js, Express.js
* **File Processing:** `multer`, `pdf-parse` (v2.4.5)
* **AI Engine:** Local Ollama (`mistral` model)
* **API Communication:** `axios`

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
1. [Node.js](https://nodejs.org/) (v18 or higher)
2. [Ollama](https://ollama.com/download)

Once Ollama is installed, open a terminal and pull the Mistral model:
```bash
ollama run mistral
```

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/gokul893/AI-driven-smart-insurance-policy-comparator.git](https://github.com/gokul893/AI-driven-smart-insurance-policy-comparator.git)
   cd AI-driven-smart-insurance-policy-comparator
   ```

2. **Install dependencies:**
   Ensure you are in the root directory (where your `package.json` is located) and run:
   ```bash
   npm install
   ```

## 🏃‍♂️ Running the Application

To run this application locally, you will need to start three distinct services. 

**1. Start the Local AI Engine**
Open a new terminal and keep it running in the background:
```bash
ollama run mistral
```

**2. Start the Express Backend**
Open a second terminal window, navigate to the project folder, and start the server:
```bash
node server.js
```
*You should see: `✅ Backend Engine is running successfully on http://localhost:3000`*

**3. Start the React Frontend**
Open a third terminal window, navigate to the project folder, and start the Vite development server:
```bash
npm run dev
```

## 💡 How to Use

1. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`).
2. Navigate to the **Policy Extractor** tool.
3. Upload a valid Motor Insurance PDF.
4. Click **Extract Data**.
5. Wait ~10-20 seconds for the local LLM to read, interpret, and format the data.
6. The system will automatically download a fully populated `Extracted_Policy_[Number].csv` file.

## 🧠 Technical Highlights

**Handling Legacy CommonJS Libraries in Modern ESM:**
One of the core technical challenges solved in this project was integrating `pdf-parse` (a CommonJS module) into a modern ES Module backend. The solution involves dynamically resolving the `PDFParse` class constructor to avoid `TypeError` crashes during runtime:
```javascript
import { PDFParse } from 'pdf-parse'; 

// Example implementation inside the route
const parser = new PDFParse(); 
const result = await parser.parse(req.file.buffer); 
const rawText = result.text;
```

---
*Built by Gokul.*
```
