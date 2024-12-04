"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import fetchRecords from "@/app/api/music/route";
import styles from "./search.module.scss";
import Loader from "../components/loader/Loader";
import gridIcon from "../../../public/grid.png";
import listIcon from "../../../public/list.png";

const AudioList = () => {
  // Fetching records
  const [records, setRecords] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const Records = await fetchRecords();
        setRecords(Records);
      } catch (err) {
        console.log("Error loading", err);
      }
    };
    load();
  }, []);
  console.log(records)

  const [isVisible, setIsVisible] = useState(true);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Customize this value as needed

  const tags = [...new Set(records.map((record) => record.tags))];
  const [selectedCategories, setSelectedCategories] = useState([]);

  const genres = [...new Set(records.map((record) => record.music_genre))];
  const [selectedGenres, setSelectedGenres] = useState([]);

  const instruments = [...new Set(records.map((record) => record.instruments))];
  const [selectedInstruments, setSelectedInstruments] = useState([]);

  const matchesFilters = (item) => {
    const genreMatches =
      selectedGenres.length === 0 || selectedGenres.includes(item.music_genre);
    const tagsMatches =
      selectedCategories.length === 0 ||
      selectedCategories.every((tag) =>
        typeof item.tags === 'string' && item.tags.toLowerCase().includes(tag.toLowerCase())
      );
    const instrumentsMatches =
      selectedInstruments.length === 0 ||
      selectedInstruments.every((instr) =>
        typeof item.instruments === 'string' && item.instruments.toLowerCase().includes(instr.toLowerCase())
      );

    return genreMatches && tagsMatches && instrumentsMatches;
  };

  const filteredList = records.filter(matchesFilters);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredList.slice(startIndex, endIndex);
  }, [filteredList, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredList.length / itemsPerPage);
  }, [filteredList, itemsPerPage]);

  // Check if the current page is the last one
  const isLastPage = useMemo(() => {
    return currentPage === totalPages;
  }, [currentPage, totalPages]);

  const [isGridView, setIsGridView] = useState(true);
  // Showing loader during fetching the audio list
  if (records.length === 0) {
    return (
      <div className={styles.loader_box}>
        <Loader />
      </div>
    );
  }

  function getUniqueValues(tags) {
    const uniqueValuesSet = new Set();

    tags.forEach((str) => {
      if (typeof str === 'string') {
        str.split(",").forEach((value) => {
          uniqueValuesSet.add(value.trim());
        });
      }
    });

    return Array.from(uniqueValuesSet);
  }

  const tagsList = getUniqueValues(tags);
  const instrumentsList = getUniqueValues(instruments);

  // Function to handle checkbox changes
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((c) => c !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const handleInstrumentsChange = (instrument) => {
    setSelectedInstruments((prevSelectedInstruments) =>
      prevSelectedInstruments.includes(instrument)
        ? prevSelectedInstruments.filter((c) => c !== instrument)
        : [...prevSelectedInstruments, instrument]
    );
  };

  const handleGenreChange = (genre) => {
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter((c) => c !== genre)
        : [...prevSelectedGenres, genre]
    );
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const isFilled = paginatedData.length > 0;

  return (
    <div className={styles.audio_list}>
      <div className={styles.filters_wrapper}>
        <button className={styles.fliters_button} onClick={toggleVisibility}>
          Filters
        </button>

        {/* <button className={styles.view_button} onClick={toggleView}>
          {isGridView ? (
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
          )}
        </button> */}
        <div
          className={
            isVisible ? styles.tags_container : styles.tags_container_visible
          }
        >
          <details className={styles.tag_accordion} open>
            <summary>
              <h3 className={styles.tagname}>GENRES</h3>
            </summary>
            <div className={styles.accordion_content}>
              {genres.map((genre) => (
                <div key={genre} className={styles.filter_item}>
                  <label key={genre} className={styles.category_label}>
                    <input
                      className={styles.category_checkbox}
                      type="checkbox"
                      value={genre}
                      onChange={() => handleGenreChange(genre)}
                      checked={selectedGenres.includes(genre)}
                    />
                    {genre}
                  </label>
                </div>
              ))}
            </div>
          </details>

          <details className={styles.tag_accordion} open>
            <summary>
              <h3 className={styles.tagname}>TAGS</h3>
            </summary>
            <div className={styles.accordion_content}>
              {tagsList.map((category) => (
                <div key={category} className={styles.filter_item}>
                  <label key={category} className={styles.category_label}>
                    <input
                      className={styles.category_checkbox}
                      type="checkbox"
                      value={category}
                      onChange={() => handleCategoryChange(category)}
                      checked={selectedCategories.includes(category)}
                    />
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </details>

          <details className={styles.tag_accordion} open>
            <summary>
              <h3 className={styles.tagname}>INSTRUMENTS</h3>
            </summary>
            <div className={styles.accordion_content}>
              {instrumentsList.map((instrument) => (
                <div key={instrument} className={styles.filter_item}>
                  <label className={styles.category_label}>
                    <input
                      className={styles.category_checkbox}
                      type="checkbox"
                      value={instrument}
                      onChange={() => handleInstrumentsChange(instrument)}
                      checked={selectedInstruments.includes(instrument)}
                    />
                    {instrument}
                  </label>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
      <div className={isGridView ? styles.grid_view : styles.list_view}>
        {isFilled ? (
          paginatedData.map((record, index) => (
            <div
              key={record.audio_name}
              className={styles.audio_record_wrapper}
            >
              <div className={styles.music_name_and_genre}>
                <p className={styles.audio_name}>{record.base_music_name}</p>
                <p className={styles.audio_genre}>
                  <span className={styles.audio_genre_label}>Genre: </span>
                  {record.music_genre}
                </p>
              </div>
              <audio
                key={index}
                controls
                src={record.s3_link_music}
                className={styles.audio}
              ></audio>
            </div>
          ))
        ) : (
          <h1>No music matching selected filters...</h1>
        )}
        {isFilled ? (
          <div className={styles.pagination_box}>
            {/* Pagination controls */}
            <button
              className={styles.pagination_btn}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Back
            </button>
            <button
              className={styles.pagination_btn}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= filteredList.length}
            >
              Next
            </button>
          </div>
        ) : (
          <div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioList;