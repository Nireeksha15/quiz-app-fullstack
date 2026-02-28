const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   TEST ROUTE
========================= */
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      message: "Server running",
      time: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

/* =========================
   GET QUESTIONS API
========================= */
app.get("/questions", async (req, res) => {
  try {
    const questions = await db.query(`
      SELECT q.id, q.question_text,
      json_agg(
        json_build_object(
          'id', o.id,
          'option_text', o.option_text
        )
      ) AS options
      FROM questions q
      JOIN options o ON q.id = o.question_id
      GROUP BY q.id
    `);

    res.json(questions.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   SUBMIT QUIZ API
========================= */
app.post("/submit", async (req, res) => {
  try {
    const { user_name, answers } = req.body;

    // create quiz attempt
    const attemptResult = await db.query(
      "INSERT INTO quiz_attempts (user_name) VALUES ($1) RETURNING id",
      [user_name]
    );

    const attemptId = attemptResult.rows[0].id;
    let score = 0;

    for (const ans of answers) {
      const { question_id, option_id } = ans;

      // check if selected option is correct
      const correct = await db.query(
        "SELECT is_correct FROM options WHERE id = $1 AND question_id = $2",
        [option_id, question_id]
      );

      if (correct.rows.length && correct.rows[0].is_correct) {
        // concurrency safe: only first winner inserted
        const winner = await db.query(
          `INSERT INTO question_winners (question_id, attempt_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [question_id, attemptId]
        );

        if (winner.rowCount > 0) {
          score++;
        }
      }
    }

    // update score
    await db.query(
      "UPDATE quiz_attempts SET score = $1 WHERE id = $2",
      [score, attemptId]
    );

    res.json({
      message: "Quiz submitted",
      score,
      attemptId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   GET RESULT API
========================= */
app.get("/result/:id", async (req, res) => {
  try {
    const attemptId = req.params.id;

    const result = await db.query(
      "SELECT * FROM quiz_attempts WHERE id = $1",
      [attemptId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Result not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});