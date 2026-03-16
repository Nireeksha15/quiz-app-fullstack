import React, { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [userName, setUserName] = useState("");

  // load questions
  useEffect(() => {
    fetch("http://localhost:5000/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err));
  }, []);

  // select answer
  const handleOptionChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  // submit quiz
  const handleSubmit = async () => {
    const formattedAnswers = Object.keys(answers).map((qId) => ({
      question_id: Number(qId),
      option_id: answers[qId],
    }));

    const res = await fetch("http://localhost:5000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: userName,
        answers: formattedAnswers,
      }),
    });

    const data = await res.json();
    setResult(data);
  };

  // show result screen
  if (result) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Quiz Result</h2>
        <p>User: {userName}</p>
        <p>Score: {result.score}</p>
        <p>Attempt ID: {result.attemptId}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Quiz App</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      {questions.map((q) => (
        <div key={q.id} style={{ marginTop: 20 }}>
          <h4>{q.question_text}</h4>

          {q.options.map((opt) => (
            <div key={opt.id}>
              <input
                type="radio"
                name={`question-${q.id}`}
                onChange={() => handleOptionChange(q.id, opt.id)}
              />
              {opt.option_text}
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit} style={{ marginTop: 20 }}>
        Submit Quiz
      </button>
    </div>
  );
}

export default App;