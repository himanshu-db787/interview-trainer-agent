// A curated dataset of role-specific interview benchmarks for our RAG layer to inject
const interviewDataset = [
  {
    jobTitle: "Full Stack Developer",
    questions: [
      "Explain the concept of middleware in Express.js and how you use it for authentication.",
      "How do you handle state management in a complex React application? Compare Context API vs Redux.",
      "What are indexes in MongoDB, and how do they improve database query performance?",
      "Explain how JSON Web Tokens (JWT) are used to handle persistent user sessions securely.",
      "What is the difference between SQL and NoSQL databases, and when would you use MongoDB over PostgreSQL?"
    ]
  },
  {
    jobTitle: "Software Engineer",
    questions: [
      "What is the difference between a process and a thread in an operating system?",
      "Explain the concept of Restful APIs and the structural purpose of different HTTP methods.",
      "How does a hash map resolve collisions internally? Discuss chaining vs open addressing.",
      "What is object-oriented programming, and can you explain the principle of Polymorphism with an example?",
      "Describe the steps involved when you type a URL into a browser address bar from a networking perspective."
    ]
  }
];

module.exports = interviewDataset;