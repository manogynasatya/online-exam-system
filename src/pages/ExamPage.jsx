import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api"; // your axios instance

function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [timeTakenMinutes, setTimeTakenMinutes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ Make API request
      const response = await api.post(`/api/student/exams/${examId}/submit`, {
        answers,
        timeTakenMinutes,
      });

      console.log("Submission successful:", response.data);

      // ✅ Redirect to results page (or dashboard)
      navigate(`/results/${examId}`, { state: { result: response.data } });
    } catch (err) {
      console.error("Error submitting exam:", err);
      setError("Failed to submit exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Exam {examId}</h2>

      {/* Example button */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Exam"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default ExamPage;
