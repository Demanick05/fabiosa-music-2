"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
// import Loader from "../../components/loader/Loader";
// import gridIcon from "../../../../public/grid.png";
// import listIcon from "../../../../public/list.png";
import Image from "next/image";

const MusicList = () => {
  const [inputValue, setInputValue] = useState("");
  const [tempInputValue, setTempInputValue] = useState(""); // Tracks the input field
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(20); // Number of tracks per page
  const [loading, setLoading] = useState(false);
  const [isGridView, setIsGridView] = useState(true);

  const fetchTracks = async () => {
    setLoading(true);
    setError(null);

    // Prepare headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api_key", "KjeRtf2QZWXk2k6zRVArhWQLFusaKA"); // Use environment variable

    // Prepare the request body with fixed and dynamic parts
    const raw = JSON.stringify({
      prompt: inputValue,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://api.harmix.ai/search?offset=${offset}&limit=${limit}&session_id=<USER-SESSION-ID>`,
        requestOptions
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setTracks(result.tracks || result);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tracks whenever filters or pagination change
  useEffect(() => {
    fetchTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, inputValue]);

  // Pagination handlers
  const handleNextPage = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  const handlePreviousPage = () => {
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
  };

  const handleChange = (event) => {
    setTempInputValue(event.target.value);
  };

  // Sets the final input value on button click or Enter key
  const handleSetInputValue = () => {
    setInputValue(String(tempInputValue)); // Convert to string before updating state
  };

  // Checks for Enter key and updates the main state if pressed
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setInputValue(tempInputValue); // Update main state on Enter
    }
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div className={styles.main_wrapper}>
      <div>
        {/* Search filter */}
        <div className={styles.search_bar}>
          <label>
            <input
              type="text"
              value={tempInputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Listen for Enter key press
              placeholder="Genres, instruments or mood..."
            />
          </label>
          <button className={styles.search_btn} onClick={handleSetInputValue}>
            Search
          </button>
          <button className={styles.view_button} onClick={toggleView}>
            {/* {isGridView ? (
              <Image
                className={styles.nav_icon}
                alt="grid"
                src={gridIcon}
                height={30}
              />
            ) : (
              <Image
                className={styles.nav_icon}
                alt="list"
                src={listIcon}
                height={30}
              />
            )} */}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p>Error: {error}</p>}

      {/* Loading Indicator */}
      {loading && <p>Loading</p>}

      {/* Tracks List */}
      {!loading && !error && tracks.length > 0 && (
        <div className={styles.track_list}>
          <ul className={isGridView ? styles.grid_view : styles.list_view}>
            {tracks.map((track) => (
              <li className={styles.audio_record_wrapper} key={track.system_id}>
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
                  <p><span className={styles.audio_genre_label}>For: </span> 
                    {track.metadata.extra_parameters?.allowed_platforms ||
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

      {/* No Tracks Found */}
      {!loading && !error && tracks.length === 0 && <p>Loading</p>}
    </div>
  );
};

export default MusicList;
