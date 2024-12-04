import cron from 'node-cron';
import moment from 'moment-timezone';

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
      let offset = 10;
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
            composers: record.composer
              ? record.composer.split(",").map((item) => item.trim())
              : [],
            platforms:
              typeof record.allowed_for_usage_platform === "string"
                ? record.allowed_for_usage_platform
                : Array.isArray(record.allowed_for_usage_platform)
                ? record.allowed_for_usage_platform.join(", ")
                : "",
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

// Schedule to run daily at 6:00 a.m. GMT+2
const setupCronJobs = () => {
  cron.schedule(
    '0 6 * * *', // Cron syntax for 6:00 a.m. daily
    async () => {
      const now = moment().tz('Europe/Sofia').format(); // Adjust for GMT+2
      console.log(`Starting daily database synchronization at ${now}`);
      try {
        await syncTracks();
        console.log('Database synchronization completed successfully.');
      } catch (error) {
        console.error('Database synchronization failed:', error);
      }
    },
    {
      timezone: 'Europe/Sofia', // Use IANA timezone for GMT+2
    }
  );
};

export default setupCronJobs;
