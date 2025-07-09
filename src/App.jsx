import React, { useState } from "react";
import WebcamCapture from "./components/WebcamCapture";
import VideoUpload from "./components/VideoUpload";

const App = () => {
  const [mode, setMode] = useState("webcam"); // "webcam" or "upload"

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bad Posture Detection App</h1>

      <p className="mb-4 text-gray-600">Choose an input method to detect your posture.</p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode("webcam")}
          className={`px-4 py-2 rounded ${
            mode === "webcam" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
        Use Webcam
        </button>
        <button
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded ${
            mode === "upload" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >Upload Video
        </button>
      </div>

      {mode === "webcam" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">📷 Webcam Input</h2>
          <WebcamCapture />
        </div>
      )}

      {mode === "upload" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">🎥 Upload a Video</h2>
          <VideoUpload />
        </div>
      )}
    </div>
  );
};

export default App;
