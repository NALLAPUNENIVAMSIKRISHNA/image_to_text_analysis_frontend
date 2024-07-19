import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

function Ocr() {
  const [image, setImage] = useState(null);
  const [userInputText, setUserInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTextInputChange = (e) => {
    setUserInputText(e.target.value);
  };

  const handleAnalyzeImage = () => {
    if (image) {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("file", image);
      formData.append("apikey", "K88532334288957");
      formData.append("language", "eng");

      axios
        .post("https://api.ocr.space/parse/image", formData)
        .then((response) => {
          const extracted = response.data.ParsedResults[0].ParsedText;
          analyzeText(extracted, userInputText);
          setIsProcessing(false);
        })
        .catch((err) => {
          console.error(err);
          setIsProcessing(false);
        });
    }
  };

  const analyzeText = (extracted, userInput) => {
    if (!extracted || !userInput) {
      const analysisText = "Both texts are required for analysis.";
      navigate("/analysis", {
        state: { extractedText: extracted, userInputText: userInput, analysis: analysisText },
      });
      return;
    }

    const extractedWords = extracted.split(/\s+/).filter(Boolean);
    const userInputWords = userInput.split(/\s+/).filter(Boolean);

    const commonWords = extractedWords.filter((word) =>
      userInputWords.includes(word)
    );
    const extractedOnlyWords = extractedWords.filter(
      (word) => !userInputWords.includes(word)
    );
    const userInputOnlyWords = userInputWords.filter(
      (word) => !extractedWords.includes(word)
    );

    const analysisText = `
      Common words: ${commonWords.join(", ")}
      Words in extracted text only: ${extractedOnlyWords.join(", ")}
      Words in user input text only: ${userInputOnlyWords.join(", ")}
    `;

    // Post the analysis result to the backend
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/analyze`, {
        extractedText: extracted,
        userInputText: userInput,
        analysis: analysisText,
      })
      .then((response) => {
        navigate("/analysis", {
          state: {
            extractedText: response.data.extractedText,
            userInputText: response.data.userInputText,
            analysis: response.data.analysis,
          },
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="ocr-container">
      <h1>Image and Text Analysis</h1>
      <div className="input-container">
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleAnalyzeImage} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Analyze Image"}
        </button>
      </div>
      <div className="text-input-container">
        <h2>Enter Text:</h2>
        <textarea
          value={userInputText}
          onChange={handleTextInputChange}
          placeholder="Enter your text here..."
        ></textarea>
      </div>
    </div>
  );
}

export default Ocr;
