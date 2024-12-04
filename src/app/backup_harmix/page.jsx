"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Loader from "../components/loader/Loader";

const MediaUploadComponent = () => {
  const [isAudioUploadEnabled, setIsAudioUploadEnabled] = useState(false);
  const [isVideoUploadEnabled, setIsVideoUploadEnabled] = useState(false);
  const [isTrackNameSearchEnabled, setTrackNameSearchEnabled] = useState(false);
  const [trackName, setTrackName] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadAudioId, setUploadAudioId] = useState("");
  const [uploadVideoId, setUploadVideoId] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [prompt, setPrompt] = useState(" ");
  const [searchStatus, setSearchStatus] = useState("");
  const [tracks, setTracks] = useState([]);
  const [videoDuration, setVideoDuration] = useState(null); // New state for video duration
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(20);
  const platformFilters = [
    "Facebook",
    "YouTube (short)",
    "YouTube (long)",
    "Snapchat",
    "TikTok",
    "X",
  ];
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const genreFilters = [
    "Rock",
    "Classical",
    "Pop",
    "EDM",
    "Latin",
    "Orchestral",
    "Hip-Hop",
    "Cinematic",
    "Easy-Listening",
    "Experimental",
    "Gospel",
    "Disco",
    "Jazz",
    "Lo-Fi",
    "Indian",
  ];
  const [selectedGenres, setSelectedGenres] = useState([]);
  const instrumentFilters = [
    "Electric Guitar",
    "Bass",
    "Drums",
    "Strings",
    "Woods",
    "Horns",
    "Piano",
    "Synth",
    "Choir",
    "Acoustic Guitar",
    "Vocals",
    "Xylophone",
    "Harp",
    "Pad",
    "Acoustic Guitar Vocals",
    "Glockenspiel",
    "Accordion",
    "Organ",
    "Ukulele",
    "Church Bell",
    "Sleigh Bells",
    "Kazoo",
    "Cajon",
    "Indian",
  ];
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const composerFilters = [
    "7AMI",
    "Artem Mekh",
    "Olena Kudriavtseva",
    "Olexandr Soshalsky",
    "Sergiy Gudz",
    "Yurii Havrylenko",
  ];
  const [selectedComposers, setSelectedComposers] = useState([]);



  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleAudioToggle = () => {
    setIsAudioUploadEnabled(!isAudioUploadEnabled);
    setIsVideoUploadEnabled(false);
    setTrackNameSearchEnabled(false); // Disable video upload if audio is enabled
    setVideoFile(null); // Clear video file if audio upload is enabled
  };

  const handleVideoToggle = () => {
    setIsVideoUploadEnabled(!isVideoUploadEnabled);
    setTrackNameSearchEnabled(false);
    setIsAudioUploadEnabled(false); // Disable audio upload if video is enabled
    setAudioFile(null); // Clear audio file if video upload is enabled
  };

  const handleTrackNameSearchToggle = () => {
    setTrackNameSearchEnabled(!isTrackNameSearchEnabled);
    setIsAudioUploadEnabled(false); // Disable audio upload if video is enabled
    setAudioFile(null);
    setIsVideoUploadEnabled(false); // Disable video upload if audio is enabled
    setVideoFile(null); // Clear video file if audio upload is enabled // Clear audio file if video upload is enabled
  };

  const handleFileDrop = async (event, type) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (type === "audio" && file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    } else if (type === "video" && file && file.type.startsWith("video/")) {
      setVideoFile(file);
      const duration = await getVideoDuration(file);
      setVideoDuration(duration);
    } else {
      alert(`Invalid file type. Please upload a ${type} file.`);
    }
  };

  const handleFileSelect = async (event, type) => {
    const file = event.target.files[0];

    if (type === "audio" && file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      console.log("Audio file set:", file); // Confirm audio file set
    } else if (type === "video" && file && file.type.startsWith("video/")) {
      setVideoFile(file);
      const duration = await getVideoDuration(file);
      setVideoDuration(duration); // Set the duration in state // Set videoFile state
      console.log("Setting video file:", file, duration); // Log the file immediately
      // processAndUploadSnapshots(file, duration);
    } else {
      alert(`Invalid file type. Please select a ${type} file.`);
    }
  };

  const getVideoDuration = (videoFile) => {
    return new Promise((resolve, reject) => {
      // Create a temporary video element
      const video = document.createElement("video");

      // Set the video source to the file object
      video.src = URL.createObjectURL(videoFile);

      // Event listener for when the metadata (including duration) is loaded
      video.onloadedmetadata = () => {
        // Resolve the promise with the duration
        resolve(video.duration);

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(video.src);
      };

      // Event listener for error in loading metadata
      video.onerror = () => {
        reject("Failed to load video metadata.");
      };
    });
  };

  const createSnapshots = async (videoDuration, videoFile) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoFile);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context == null) return [];

    const times = [
      5,
      videoDuration * 0.25,
      videoDuration * 0.5,
      videoDuration * 0.75,
      videoDuration - 5,
    ];
    const snapshots = [];

    for (const time of times) {
      video.currentTime = time;
      await new Promise((resolve) => {
        video.onseeked = () => {
          const targetWidth = 226;
          const targetHeight = 226;

          const tempCanvas = document.createElement("canvas");
          const tempContext = tempCanvas.getContext("2d");
          tempCanvas.width = targetWidth;
          tempCanvas.height = targetHeight;
          tempContext?.drawImage(video, 0, 0, targetWidth, targetHeight);

          const dataUrl = tempCanvas.toDataURL("image/jpeg", 1.0);
          snapshots.push(dataUrl);
          resolve();
        };
      });
    }
    return snapshots;
  };

  // AUDIO UPLOAD API
  const uploadAudio = async () => {
    if (!audioFile) {
      alert("Please select an audio file first");
      return;
    }

    setIsLoading(true);
    setUploadStatus("Processing audio..."); // Start loading

    const myHeaders = new Headers();
    myHeaders.append("api_key", "KjeRtf2QZWXk2k6zRVArhWQLFusaKA");

    const formdata = new FormData();
    formdata.append("type", "manual-audio");
    formdata.append("source", audioFile, audioFile.name);
    formdata.append("reference", "");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://api.harmix.ai/upload",
        requestOptions
      );
      if (!response.ok)
        throw new Error(`Error ${response.status}: ${response.statusText}`);

      const result = await response.json();
      console.log(result);

      // Handle successful upload
      if (result.status === "success") {
        setUploadAudioId(result.upload_id);
        setUploadStatus("Upload successful");
      } else {
        setUploadStatus("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // VIDEO UPLOAD API
  const processAndUploadSnapshots = async (file, duration) => {
    let fileDuration = videoDuration;
    let entityFile = videoFile;

    if (!videoFile || !videoDuration) {
      alert(
        "Please select a video file first and ensure duration is available"
      );
      return;
    }

    setUploadStatus("Processing video...");

    try {
      // Step 1: Create Snapshots
      const snapshots = await createSnapshots(fileDuration, entityFile);
      if (!Array.isArray(snapshots) || snapshots.length === 0) {
        throw new Error("No snapshots created");
      }
      setUploadStatus("Uploading snapshots...");

      // Step 2: Prepare FormData and Headers for Upload
      const formData = new FormData();
      formData.append("type", "manual-video");

      for (const [index, snapshot] of snapshots.entries()) {
        const blob = await fetch(snapshot).then((res) => res.blob());
        const file = new File([blob], `snapshot-${index + 1}.jpeg`, {
          type: "image/jpeg",
        });
        formData.append("source", file);
      }

      const myHeaders = new Headers();
      myHeaders.append("api_key", "KjeRtf2QZWXk2k6zRVArhWQLFusaKA");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
      };

      // Step 3: Perform the Upload Request
      const response = await fetch(
        "https://api.harmix.ai/upload",
        requestOptions
      );
      const result = await response.json();

      if (result.status === "success") {
        setUploadVideoId(result.upload_id);
        console.log(result);
        console.log(uploadVideoId);
        setUploadStatus("Upload successful");
      } else {
        setUploadStatus("Upload failed");
        console.error("Upload failed:", result);
      }
    } catch (error) {
      console.error("Error processing and uploading snapshots:", error);
      setUploadStatus("Error during snapshot processing or upload");
    }
  };

  const performUnifiedSearch = async () => {
    // Validate that at least one search parameter is provided
    if (!uploadAudioId && !uploadVideoId && !prompt) {
      // alert("Please provide at least one search parameter: audio, video, or prompt");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api_key", "KjeRtf2QZWXk2k6zRVArhWQLFusaKA");

    // // Build request body dynamically based on provided parameters
    const raw = JSON.stringify({
      ...(uploadVideoId && {
        video_reference: {
          upload_id: uploadVideoId,
        },
      }),
      ...(uploadAudioId && {
        audio_reference: {
          external: {
            upload_id: uploadAudioId,
          },
        },
      }),
      ...(prompt && {
        prompt: prompt,
      }),
      ...(selectedGenres.length > 0 && {
        filters: {
          logic: "and",
          conditions: [
            {
              field: "genres",
              operator: "in",
              value: selectedGenres,
            },
          ],
        },
      }),
      ...(selectedInstruments.length > 0 && {
        filters: {
          logic: "and",
          conditions: [
            {
              field: "instruments",
              operator: "in",
              value: selectedInstruments,
            },
          ],
        },
      }),
      ...(selectedPlatforms.length > 0 && {
        filters: {
          logic: "and",
          conditions: [
            {
              field: "platforms",
              operator: "in",
              value: selectedPlatforms,
            },
          ],
        },
      }),
      ...(selectedComposers.length > 0 && {
        filters: {
          logic: "and",
          conditions: [
            {
              field: "composers",
              operator: "in",
              value: selectedComposers,
            },
          ],
        },
      }),
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    setSearchStatus("Searching..."); // Set loading status

    try {
      const response = await fetch(
        `https://api.harmix.ai/search?offset=${offset}&limit=${limit}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      // setTracks(removeDuplicateTracks(result.tracks));
      setTracks(result.tracks);
      console.log(tracks);

      return result;
    } catch (error) {
      console.error("Error during search:", error);
      setSearchStatus("Error performing search");
      throw error;
    }
  };

  const parsePlatformsToString = (platformsArray) => {
    if (!Array.isArray(platformsArray)) {
      console.error("Invalid input: expected an array of strings.");
      return "";
    }
  
    return platformsArray.join(", ");
  };
  

  const resetDropzone = () => {
    setVideoFile(null);
    setVideoDuration(null);
    setUploadAudioId("");
    setUploadVideoId("");
    setUploadStatus("");
  };

  const performNameSearch = async () => {
    if (!prompt) {
      alert("Please enter music name");
      return;
    }

    const trimmedPrompt = prompt.trim();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api_key", "KjeRtf2QZWXk2k6zRVArhWQLFusaKA");

    const raw = JSON.stringify({
      filters: {
        logic: "and",
        conditions: [
          {
            field: "track_title",
            operator: "contains",
            value: trimmedPrompt,
          },
        ],
      },
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    setSearchStatus("Searching...");
    try {
      const response = await fetch(
        `https://api.harmix.ai/search?offset=${offset}&limit=${limit}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setTracks(result.tracks);
      console.log(tracks);

      setSearchStatus("Search completed successfully");
      return result;
    } catch (error) {
      console.error("Error during search:", error);
      setSearchStatus("Error performing search");
      throw error;
    }
  };

  useEffect(() => {
    performUnifiedSearch();
  }, [offset, selectedGenres, selectedInstruments, selectedPlatforms, selectedComposers]);

  const handleNextPage = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  const handlePreviousPage = () => {
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
  };

  const handleGenreChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedGenres((prev) => [...prev, value]);
    } else {
      setSelectedGenres((prev) => prev.filter((genre) => genre !== value));
    }
  };

  const handlePlatformChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedPlatforms((prev) => [...prev, value]);
      console.log(selectedPlatforms);
    } else {
      setSelectedPlatforms((prev) =>
        prev.filter((platform) => platform !== value)
      );
      console.log(selectedPlatforms);
    }
  };

  const handleInstrumentChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedInstruments((prev) => [...prev, value]);
    } else {
      setSelectedInstruments((prev) =>
        prev.filter((instrument) => instrument !== value)
      );
    }
  };

  const handleComposerChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedComposers((prev) => [...prev, value]);
    } else {
      setSelectedComposers((prev) =>
        prev.filter((composer) => composer !== value)
      );
    }
  };

  return (
    <div className={styles.main_wrapper}>
      <div className={styles.filters_wrapper}>
        <div className={styles.filter_wrapper}>
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

              <label style={{ marginLeft: "10px" }}>
                <input
                  type="checkbox"
                  checked={isTrackNameSearchEnabled}
                  onChange={handleTrackNameSearchToggle}
                />
                Search by name
              </label>
            </div>
          </div>
          <div className={styles.text_input}>
            <label className={styles.checkbox}>
              <input
                type="text"
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Enter text"
              />
            </label>
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

              {/* {audioFile && (
            <p className={styles.selected_file_name}>
              Selected Video: {audioFile.name}
            </p>
          )} */}

              {/* Upload Button */}
              {!uploadAudioId && (
                <button
                  className={styles.upload_btn}
                  onClick={uploadAudio}
                  disabled={!audioFile || isLoading}
                >
                  {isLoading ? "Uploading..." : "Upload Audio"}
                </button>
              )}

              {uploadAudioId && (
                <button className={styles.upload_btn} onClick={resetDropzone}>
                  Upload new file
                </button>
              )}

              {/* Display Upload Status */}
              {uploadStatus && <p>{uploadStatus}</p>}
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
              {/* {videoFile && (
            <p className={styles.selected_file_name}>
              Selected Video: {videoFile.name}
            </p>
          )} */}

              {/* Upload Button */}
              {!uploadVideoId && (
                <button
                  className={styles.upload_btn}
                  onClick={processAndUploadSnapshots}
                  disabled={!videoFile || isLoading}
                >
                  {isLoading ? <Loader /> : "Upload video"}
                </button>
              )}

              {uploadVideoId && (
                <button className={styles.upload_btn} onClick={resetDropzone}>
                  Upload new file
                </button>
              )}

              {/* Display Upload Status */}
              {uploadStatus && <p>{uploadStatus}</p>}
            </div>
          )}
          {uploadAudioId && !uploadVideoId && (
            <button
              className={styles.upload_btn}
              onClick={performUnifiedSearch}
            >
              Search
            </button>
          )}
          {uploadVideoId && !uploadAudioId && (
            <button
              className={styles.upload_btn}
              onClick={performUnifiedSearch}
            >
              Search
            </button>
          )}

          {prompt &&
            !isTrackNameSearchEnabled &&
            !uploadVideoId &&
            !uploadAudioId && (
              <button
                className={styles.upload_btn}
                onClick={performUnifiedSearch}
              >
                Search
              </button>
            )}
          {prompt &&
            isTrackNameSearchEnabled &&
            !uploadVideoId &&
            !uploadAudioId && (
              <button className={styles.upload_btn} onClick={performNameSearch}>
                Search
              </button>
            )}
          <div className={styles.filter_wrapper_category}>
            <h4>By Platforms</h4>
            {platformFilters.map((filter) => (
              <label
                className={styles.category_label}
                key={filter}
                style={{ display: "block", marginBottom: "5px" }}
              >
                <input
                  className={styles.category_checkbox}
                  type="checkbox"
                  value={filter}
                  onChange={handlePlatformChange}
                />
                {filter}
              </label>
            ))}
          </div>
          <div className={styles.filter_wrapper_category}>
            <h4>By Instruments</h4>
            {instrumentFilters.map((filter) => (
              <label
                className={styles.category_label}
                key={filter}
                style={{ display: "block", marginBottom: "5px" }}
              >
                <input
                  className={styles.category_checkbox}
                  type="checkbox"
                  value={filter}
                  onChange={handleInstrumentChange}
                />
                {filter}
              </label>
            ))}
          </div>
          <div className={styles.filter_wrapper_category}>
            <h4>By Genre</h4>
            {genreFilters.map((filter) => (
              <label
                className={styles.category_label}
                key={filter}
                style={{ display: "block", marginBottom: "5px" }}
              >
                <input
                  className={styles.category_checkbox}
                  type="checkbox"
                  value={filter}
                  onChange={handleGenreChange}
                />
                {filter}
              </label>
            ))}
          </div>
          <div className={styles.filter_wrapper_category}>
            <h4>By Composer</h4>
            {composerFilters.map((filter) => (
              <label
                className={styles.category_label}
                key={filter}
                style={{ display: "block", marginBottom: "5px" }}
              >
                <input
                  className={styles.category_checkbox}
                  type="checkbox"
                  value={filter}
                  onChange={handleComposerChange}
                />
                {filter}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* RENDERING TRACKS */}
      <div className={styles.tracks_wrapper}>
        {!isLoading && !error && tracks.length > 0 && (
          <div className={styles.track_list}>
            <ul className={styles.grid_view}>
              {tracks.map((track) => (
                <li
                  className={styles.audio_record_wrapper}
                  key={track.system_id}
                >
                  <div className={styles.tags}>
                    <h3 className={styles.track_name}>
                      {track.metadata.track_title || "Untitled"}
                    </h3>
                    <p className={styles.tags_box}>
                      <span className={styles.audio_genre_label}>Genre: </span>
                      {track.metadata.genres || "Untitled"}
                    </p>
                  </div>
                  {track.metadata.audio_url && (
                    <audio
                      controls
                      src={track.metadata.audio_url}
                      className={styles.audio}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  <div className={styles.tags}>
                    <p>
                      <span className={styles.audio_genre_label}>For: </span>
                      {parsePlatformsToString(track.metadata.platforms) ||
                        "Untitled"}
                    </p>
                  </div>
                </li>
              ))}

              {/* Pagination Controls */}
              <div className={styles.pagination_box}>
                <button
                  className={styles.pagination_btn}
                  onClick={handlePreviousPage}
                  disabled={offset === 0}
                >
                  Previous
                </button>
                <button
                  className={styles.pagination_btn}
                  onClick={handleNextPage}
                  disabled={tracks.length < limit}
                >
                  Next
                </button>
              </div>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUploadComponent;
