"use client";
import React, { useState } from "react";
import styles from "./page.module.scss";
import fetchRecords from "@/app/api/music/route";

const Database = () => {
  const [iteration, setIteration] = useState(0);
  const [deletedTracks, setDeletedTracks] = useState([]);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [syncedTracks, setSyncedTracks] = useState([]);

  const performSearchAndDeleteDuplicates = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api_key", "KjeRtf2QZWXk2k6zRVArhWQLFusaKA");

    let offset = 0;
    const limit = 50;
    let iterationCount = 0;
    const seenSourceIds = new Set();
    let hasMoreTracks = true;

    setIsRunning(true);

    while (hasMoreTracks) {
      iterationCount++;
      setIteration(iterationCount);
      setStatus(
        `Iteration ${iterationCount}: Fetching tracks with offset ${offset}`
      );

      // Prepare the request body (modify as needed)
      const raw = JSON.stringify({
        prompt: "",
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          `https://api.harmix.ai/search?offset=${offset}&limit=${limit}`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const result = await response.json();

        const tracks = result.tracks;
        if (!tracks || tracks.length === 0) {
          hasMoreTracks = false;
          setStatus(`Iteration ${iterationCount}: No more tracks found.`);
          break;
        }

        for (const track of tracks) {
          const sourceId = track.metadata.source_id;
          const systemId = track.system_id;

          if (seenSourceIds.has(sourceId)) {
            // Duplicate found
            try {
              const deleteHeaders = new Headers();
              deleteHeaders.append("api_key", "KjeRtf2QZWXk2k6zRVArhWQLFusaKA");
              deleteHeaders.append("Content-Type", "application/json");

              const deleteRaw = JSON.stringify({
                primary_key: {
                  source_id: sourceId,
                },
              });

              const deleteRequestOptions = {
                method: "DELETE",
                headers: deleteHeaders,
                body: deleteRaw,
                redirect: "follow",
              };

              const deleteResponse = await fetch(
                "https://api.harmix.ai/tracks?force=True",
                deleteRequestOptions
              );
              if (!deleteResponse.ok) {
                throw new Error(
                  `Error ${deleteResponse.status}: ${deleteResponse.statusText}`
                );
              }
              const deleteResult = await deleteResponse.json();

              setDeletedTracks((prev) => [
                ...prev,
                { systemId, sourceId, status: deleteResult.status },
              ]);
              setStatus(`Deleted duplicate track with system_id ${systemId}`);
            } catch (error) {
              setErrors((prev) => [
                ...prev,
                `Error deleting track with system_id ${systemId}: ${error.message}`,
              ]);
            }
          } else {
            seenSourceIds.add(sourceId);
          }
        }

        offset += limit;
      } catch (error) {
        setErrors((prev) => [
          ...prev,
          `Error on iteration ${iterationCount}: ${error.message}`,
        ]);
        hasMoreTracks = false; // Stop the loop on error
      }
    }

    setIsRunning(false);
    setStatus("Completed search and deletion.");
  };

  const syncTracks = async () => {
    setIsRunning(true);
    setStatus("Sync in progress...");

    try {
      // Fetch records from Airtable
      const airtableRecords = await fetchRecords();
      const airtableTracks = airtableRecords.map(
        (record) => record.base_music_name
      );

      console.log("Fetched records from Airtable:", airtableTracks);

      // Fetch all tracks from Harmix
      let offset = 1;
      const limit = 100;
      let harmixTracks = [];
      const harmixAPIKey = "KjeRtf2QZWXk2k6zRVArhWQLFusaKA";

      do {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("api_key", harmixAPIKey);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({}), // Empty body for unfiltered search
          redirect: "follow",
        };

        const response = await fetch(
          `https://api.harmix.ai/search?offset=${offset}&limit=${limit}`,
          requestOptions
        );

        const result = await response.json();
        harmixTracks = harmixTracks.concat(
          result.tracks.map((track) => ({
            trackTitle: track.metadata.track_title,
            sourceId: track.metadata.source_id,
          }))
        );

        offset += limit;
        console.log(`Fetched ${result.tracks.length} tracks from Harmix...`);
      } while (offset % limit === 0 && harmixTracks.length > 0);

      console.log("All Harmix tracks fetched:", harmixTracks);

      // Identify tracks to add to Harmix
      const tracksToAdd = airtableRecords.filter(
        (record) =>
          !harmixTracks.some((track) => track.trackTitle === record.audio_name)
      );

      // Identify tracks to delete from Harmix
      const tracksToDelete = harmixTracks.filter(
        (track) => !airtableTracks.includes(track.trackTitle)
      );

      console.log("Tracks to add to Harmix:", tracksToAdd);
      console.log("Tracks to delete from Harmix:", tracksToDelete);

      // Add missing tracks to Harmix
      for (const record of tracksToAdd) {
        try {
          // Fetch the audio file from S3
          const audioBlob = await fetchAudioFile(record.s3_link_music);

          if (!audioBlob) {
            console.error(`Error fetching audio file for record ${record.id}`);
            continue;
          }

          // Determine file extension and MIME type
          const fileExtension = getFileExtension(record.s3_link_music);
          const mimeType = getMimeType(fileExtension);

          if (!mimeType) {
            console.error(`Unsupported file format: ${fileExtension}`);
            continue; // Skip this file
          }

          // Create the File object with the correct name and MIME type
          const audioFile = new File([audioBlob], `audio${fileExtension}`, {
            type: mimeType,
          });

          // Prepare metadata
          const metadata = {
            source_id: record.base_music_name,
            track_title: record.base_music_name,
            version_tag: "main",
            audio_url: record.s3_link_music,
            instruments: record.instruments
              ? record.instruments.split(",").map((item) => item.trim())
              : [],
            genres: record.music_genre
              ? record.music_genre.split(",").map((item) => item.trim())
              : [],
            composers: [record.composer.trim()],
            platforms:
              typeof record.allowed_for_usage_platform === "string"
                ? record.allowed_for_usage_platform
                    .split(",")
                    .map((item) => item.trim())
                : Array.isArray(record.allowed_for_usage_platform)
                ? record.allowed_for_usage_platform.map((item) => item.trim())
                : [],
          };

          // Create FormData
          const formdata = new FormData();
          formdata.append("track", audioFile);
          formdata.append("metadata", JSON.stringify(metadata));

          const addHeaders = new Headers();
          addHeaders.append("api_key", harmixAPIKey);

          const requestOptions = {
            method: "POST",
            headers: addHeaders,
            body: formdata,
            redirect: "follow",
          };

          const response = await fetch(
            "https://api.harmix.ai/tracks",
            requestOptions
          );
          const result = await response.json();
          console.log("Upload result:", result);
        } catch (error) {
          console.error(
            `Error adding track ${record.base_music_name} to Harmix:`,
            error
          );
        }
      }

      // Delete redundant tracks from Harmix
      for (const track of tracksToDelete) {
        try {
          const deleteHeaders = new Headers();
          deleteHeaders.append("api_key", harmixAPIKey);
          deleteHeaders.append("Content-Type", "application/json");

          const deleteRequestOptions = {
            method: "DELETE",
            headers: deleteHeaders,
            body: JSON.stringify({
              primary_key: {
                source_id: track.sourceId,
              },
            }),
            redirect: "follow",
          };

          const deleteResponse = await fetch(
            "https://api.harmix.ai/tracks?force=True",
            deleteRequestOptions
          );

          const deleteResult = await deleteResponse.json();
          console.log(
            `Deleted track from Harmix: ${track.trackTitle}`,
            deleteResult
          );
        } catch (error) {
          console.error(
            `Error deleting track ${track.trackTitle} from Harmix:`,
            error
          );
        }
      }

      console.log("Sync complete.");
    } catch (error) {
      console.error("Error during synchronization:", error);
    }
  };

  const updateComposersInHarmix = async () => {
    try {
      // Step 1: Fetch records from Airtable
      const airtableRecords = await fetchRecords();
      console.log(airtableRecords);

      // Step 2: Iterate over each Airtable record
      for (const record of airtableRecords) {
        const trackName = record.base_music_name;
        const airtableGenres = record.сomposer;

        // Skip if there is no composer data in Airtable
        if (!airtableGenres) {
          console.log(
            `No genres data for track "${trackName}" in Airtable. Skipping...`
          );
          continue;
        }

        // Step 3: Search for the track in Harmix
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("api_key", "KjeRtf2QZWXk2k6zRVArhWQLFusaKA");

        const rawSearchBody = JSON.stringify({
          filters: {
            logic: "and",
            conditions: [
              {
                field: "track_title",
                operator: "contains",
                value: trackName,
              },
            ],
          },
        });

        const searchRequestOptions = {
          method: "POST",
          headers: myHeaders,
          body: rawSearchBody,
          redirect: "follow",
        };

        try {
          const searchResponse = await fetch(
            "https://api.harmix.ai/search?offset=0&limit=50",
            searchRequestOptions
          );
          if (!searchResponse.ok) {
            console.error(
              `Error searching for "${trackName}" in Harmix: ${searchResponse.statusText}`
            );
            continue;
          }

          const searchResult = await searchResponse.json();
          const tracks = searchResult.tracks;

          // Check if any tracks were found
          if (tracks && tracks.length > 0) {
            // Step 4: Process each track found in Harmix
            for (const track of tracks) {
              const harmixTrackName = track.metadata.track_title;
              const systemId = track.system_id;

              // Prepare composer data from Airtable
              let genresArray = [];
              if (typeof airtableGenres === "string") {
                genresArray = airtableGenres
                  .split(",")
                  .map((genre) => genre.trim());
              } else if (Array.isArray(airtableGenres)) {
                genresArray = airtableGenres;
              }

              // Update the track in Harmix
              const updateHeaders = new Headers();
              updateHeaders.append("api_key", "KjeRtf2QZWXk2k6zRVArhWQLFusaKA");
              updateHeaders.append("Content-Type", "application/json");

              const updateBody = JSON.stringify({
                primary_key: {
                  system_id: systemId,
                },
                update_metadata: {
                  composers: genresArray,
                },
              });

              const updateRequestOptions = {
                method: "PUT",
                headers: updateHeaders,
                body: updateBody,
                redirect: "follow",
              };

              try {
                const updateResponse = await fetch(
                  "https://api.harmix.ai/tracks",
                  updateRequestOptions
                );
                if (!updateResponse.ok) {
                  console.error(
                    `Error updating composers for "${harmixTrackName}": ${updateResponse.statusText}`
                  );
                  continue;
                }
                const updateResult = await updateResponse.json();
                console.log(
                  `Successfully updated composers for "${harmixTrackName}".`,
                  updateResult
                );
              } catch (updateError) {
                console.error(
                  `Error updating track "${harmixTrackName}":`,
                  updateError
                );
              }
            }
          } else {
            console.log(`No tracks found in Harmix for "${trackName}".`);
          }
        } catch (searchError) {
          console.error(
            `Error searching for track "${trackName}":`,
            searchError
          );
        }
      }

      console.log("Composers update process completed.");
    } catch (error) {
      console.error("An error occurred during the update process:", error);
    }
  };

  const fetchAudioFile = async (s3Link) => {
    try {
      const response = await fetch(s3Link);
      if (!response.ok) {
        console.error("Error fetching audio file:", response.statusText);
        return null;
      }
      return await response.blob();
    } catch (error) {
      console.error("Error fetching audio file:", error);
      return null;
    }
  };

  const getFileExtension = (url) => {
    return url.substring(url.lastIndexOf("."));
  };

  const getMimeType = (extension) => {
    const mimeTypes = {
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".flac": "audio/flac",
    };
    return mimeTypes[extension.toLowerCase()] || null;
  };

  return (
    <div className={styles.page}>
      <h3>Search and Delete Duplicates</h3>
      <button onClick={performSearchAndDeleteDuplicates} disabled={isRunning}>
        {isRunning ? "Running..." : "Start"}
      </button>
      <p>Iteration: {iteration}</p>
      <p>Status: {status}</p>
      {errors.length > 0 && (
        <div>
          <h4>Errors:</h4>
          <ul>
            {errors.map((errorMsg, index) => (
              <li key={index}>{errorMsg}</li>
            ))}
          </ul>
        </div>
      )}
      {deletedTracks.length > 0 && (
        <div>
          <h4>Deleted Tracks:</h4>
          <ul>
            {deletedTracks.map((track, index) => (
              <li key={index}>
                System ID: {track.systemId}, Source ID: {track.sourceId},
                Status: {track.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3>Sync Tracks</h3>
      <button onClick={syncTracks} disabled={isRunning}>
        {isRunning ? "Running..." : "Start Sync"}
      </button>

      <h3>Sync genres</h3>
      <button onClick={updateComposersInHarmix} disabled={isRunning}>
        {isRunning ? "Running..." : "Start Sync"}
      </button>
    </div>
  );
};

export default Database;
