# Problem Statement No.22 – AI Interview Trainer Agent

An advanced, full-stack Interview Trainer Agent powered by Retrieval-Augmented Generation (RAG) designed to prepare users for competitive job interviews. The application personalizes assessment structures dynamically based on candidate session data and ensures a holistic grading strategy.

> ⚠️ **Evaluator Notice: Initial Load Time (Cold Start)**
> Please note that the backend for this application is deployed on Render's free tier. If the server has been inactive for 15 minutes, the **first login or request may take 2 to 3 minutes** to process while the server wakes up. Once active, all subsequent generations and feedback pipelines will be instantaneous. Thank you for your patience!
>
> — *Himanshu Das Biswas*

## 🚀 Key Features
* **Personalized Assessment Streams:** Dynamically builds context using the candidate's profile context (e.g., Himanshu Das Biswas) and injected system credentials.
* **Holistic Assessment Mix:** Leverages the IBM Granite Foundational Model to generate a comprehensive mix of core technical questions, behavioral scenarios, industry expectations, and HR guidelines.
* **Enterprise RAG Grounding:** Infuses domain-specific reference interview patterns directly into the prompt framework to ensure highly relevant role-based tracking.
* **Interactive Coaching Analytics:** Displays concise model answer benchmarks alongside real-time diagnostic improvement tips inside an ultra-premium neon dark UI workspace.

## 🛠️ Technology Stack
* **Frontend:** React.js, Lucide React Icons, Modern Bento-Grid Custom Midnight CSS UI
* **Backend:** Node.js, Express.js, REST APIs
* **Database:** MongoDB Atlas (Persistent session storage, history tracking, and user data lifecycle management)
* **AI Engine & Cloud Services:** IBM Cloud Infrastructure, IBM watsonx.ai Runtime Environment
* **Core Model:** IBM Granite Foundational Model (`granite-3-0-8b-instruct`)
* **Cloud Architecture Foundations:** Built with cloud design methodologies aligned with AWS standards.

## ⚙️ How to Run Locally

### 1. Clone the repository
```bash
git clone [https://github.com/himanshu-db787/interview-trainer-agent.git](https://github.com/himanshu-db787/interview-trainer-agent.git)
