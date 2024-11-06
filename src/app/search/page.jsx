"use client";
import React, { useState } from "react";
import styles from "./search.module.scss";

const MediaUploadComponent = () => {
  const [textInput, setTextInput] = useState("");
  const [isAudioUploadEnabled, setIsAudioUploadEnabled] = useState(false);
  const [isVideoUploadEnabled, setIsVideoUploadEnabled] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleAudioToggle = () => {
    setIsAudioUploadEnabled(!isAudioUploadEnabled);
    setIsVideoUploadEnabled(false); // Disable video upload if audio is enabled
    setVideoFile(null); // Clear video file if audio upload is enabled
  };

  const handleVideoToggle = () => {
    setIsVideoUploadEnabled(!isVideoUploadEnabled);
    setIsAudioUploadEnabled(false); // Disable audio upload if video is enabled
    setAudioFile(null); // Clear audio file if video upload is enabled
  };

  const handleFileDrop = (event, type) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (type === "audio" && file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    } else if (type === "video" && file && file.type.startsWith("video/")) {
      setVideoFile(file);
    } else {
      alert(`Invalid file type. Please upload a ${type} file.`);
    }
  };

  const handleFileSelect = (event, type) => {
    const file = event.target.files[0];
    if (type === "audio" && file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    } else if (type === "video" && file && file.type.startsWith("video/")) {
      setVideoFile(file);
    } else {
      alert(`Invalid file type. Please select a ${type} file.`);
    }
  };

  return (
    <div className={styles.main_wrapper}>
      <h3>Media Upload Component</h3>

      <div className={styles.text_input}>
        <label className={styles.checkbox}>
          Describe your music genre, mood or instruments:
          <input
            type="text"
            value={textInput}
            onChange={handleTextChange}
            placeholder="Enter text"
          />
        </label>
      </div>

      <div className={styles.toggles_box}>
        <div className={styles.checkbox}>
          <label>
            <input
              type="checkbox"
              checked={isAudioUploadEnabled}
              onChange={handleAudioToggle}
            />
            I have an audio reference
          </label>

          <label style={{ marginLeft: "10px" }}>
            <input
              type="checkbox"
              checked={isVideoUploadEnabled}
              onChange={handleVideoToggle}
            />
            I have a video reference
          </label>
        </div>
      </div>

      {/* Audio Upload Zone */}
      {isAudioUploadEnabled && (
        <div
          onDrop={(event) => handleFileDrop(event, "audio")}
          onDragOver={(event) => event.preventDefault()}
          className={styles.dropzone}
        >
          <p>Drag and drop an audio file here, or select a file</p>
          <input
            type="file"
            accept="audio/*"
            onChange={(event) => handleFileSelect(event, "audio")}
            style={{ display: "block", marginTop: "30px" }}
          />
          {audioFile && <p className={styles.selected_file_name}>Selected Audio: {audioFile.name}</p>}
        </div>
      )}

      {/* Video Upload Zone */}
      {isVideoUploadEnabled && (
        <div
          onDrop={(event) => handleFileDrop(event, "video")}
          onDragOver={(event) => event.preventDefault()}
          className={styles.dropzone}
        >
          <p>Drag and drop a video file here, or select a file</p>
          <input
            type="file"
            accept="video/*"
            onChange={(event) => handleFileSelect(event, "video")}
            style={{ display: "block", marginTop: "30px" }}
          />
          {videoFile && <p className={styles.selected_file_name}>Selected Video: {videoFile.name}</p>}
        </div>
      )}
    </div>
  );
};

export default MediaUploadComponent;
