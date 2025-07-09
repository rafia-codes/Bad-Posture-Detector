import React, { useRef, useState } from "react";
import { useVideoPose } from "../utils/hooks/useVideo";

const VideoUpload = () => {
  const [videoURL, setVideoURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const skeletonCanvasRef = useRef(null);
  const [error, setError] = useState("");
  const postureStatus = useVideoPose(videoRef, canvasRef, skeletonCanvasRef);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError("❗ Please select a video before uploading.");
      return;
    }
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setVideoURL(url);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="border border-gray-300 rounded px-2 py-1 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Upload Video
        </button>
      </div>
      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

      {/* Display video + canvas */}
      {videoURL && (
        <div className="mt-6">
          <video
            ref={videoRef}
            src={videoURL}
            controls
            width="640"
            height="480"
            className="mb-4 rounded shadow"
          />
          <div className="flex gap-4">
            <canvas ref={canvasRef} width={640} height={480} />
            <canvas
              ref={skeletonCanvasRef}
              width={640}
              height={480}
              className="bg-black"
            />
          </div>

          {/* Posture feedback */}
          {postureStatus && (
            <div className="mt-4 p-4 bg-gray-100 rounded shadow text-sm">
              <p>
                <strong>Back:</strong>{" "}
                {postureStatus.backStraight ? "✅ Straight" : "❌ Bent"}
              </p>
              <p>
                <strong>Head:</strong>{" "}
                {postureStatus.headTilted ? "❌ Tilted" : "✅ Straight"}
              </p>
              <p>
                <strong>Knee:</strong>{" "}
                {postureStatus.kneeOverToe ? "❌ Over Toe" : "✅ Correct"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
