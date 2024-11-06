"use client";
import React from "react";
import styles from "./page.module.scss";
import fetchRecords from "@/app/api/music/route";
import { useState, useEffect } from "react";

const Database = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const fetchedRecords = await fetchRecords();
        setRecords(fetchedRecords);
  
        for (const record of fetchedRecords) {
          // Check if the track already exists in Harmix
          const trackExists = await checkTrackExists(record.base_music_name);
  
          if (trackExists) {
            console.log(`Track "${record.base_music_name}" already exists in Harmix. Skipping upload.`);
            continue; // Skip this track
          }
  
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
          const audioFile = new File([audioBlob], `audio${fileExtension}`, { type: mimeType });
  
          // Prepare metadata
          const metadata = {
            source_id: record.base_music_name,
            track_title: record.base_music_name,
            version_tag: "main",
            audio_url: record.s3_link_music,
            instruments: record.instruments
              ? record.instruments.split(",").map(item => item.trim())
              : [],
            genres: record.music_genre
              ? record.music_genre.split(",").map(item => item.trim())
              : [],
            extra_parameters: {
              allowed_platforms: typeof record.allowed_for_usage_platform === 'string'
                ? record.allowed_for_usage_platform
                : Array.isArray(record.allowed_for_usage_platform)
                  ? record.allowed_for_usage_platform.join(", ")
                  : "",
            },
          };
  
          // Create FormData
          const formdata = new FormData();
          formdata.append("track", audioFile); // Append the actual file here
          formdata.append("metadata", JSON.stringify(metadata));
  
          const myHeaders = new Headers();
          myHeaders.append("api_key", "KjeRtf2QZWXk2k6zRVArhWQLFusaKA"); // Add your API key here
  
          const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow',
          };
  
          // Upload each record to Harmix
          try {
            const response = await fetch("https://api.harmix.ai/tracks", requestOptions);
            const result = await response.json();
            console.log("Upload result:", result);
          } catch (error) {
            console.error("Error uploading track:", error);
          }
        }
      } catch (err) {
        console.log("Error loading records:", err);
      }
    };
  
    load();
  }, []);

  // Function to check if a track exists in Harmix
const checkTrackExists = async (source_id) => {
  const myHeaders = new Headers();
  myHeaders.append("api_key", "KjeRtf2QZWXk2k6zRVArhWQLFusaKA"); // Use your API key

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  // URL with query parameter to filter by source_id
  const url = `https://api.harmix.ai/tracks?source_id=${encodeURIComponent(source_id)}`;

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      console.error(`Error checking track existence: ${response.statusText}`);
      return false; // Proceed with uploading if there's an error checking
    }
    const data = await response.json();
    // Check if any tracks are returned
    if (data && data.length > 0) {
      return true; // Track exists
    } else {
      return false; // Track does not exist
    }
  } catch (error) {
    console.error("Error checking track existence:", error);
    return false; // Proceed with uploading in case of error
  }
};

// Helper functions (assumed to exist in your code)
const fetchAudioFile = async (s3Link) => {
  // Implementation of fetching audio file from S3
};

const getFileExtension = (url) => {
  // Implementation of extracting file extension from URL
};

const getMimeType = (extension) => {
  // Implementation of mapping file extension to MIME type
};

  return <div>Data</div>;
};

export default Database;
