"use client";
import React from "react";
import { useState } from "react";
import styles from "./banner.module.scss";
import Link from "next/link";

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null; // Don't render the banner if it's not visible
  }

  return (
    <div className={styles.banner}>
      <p>
        <b>NOTICE:</b> ALL CONTENT ON THIS WEBSITE, INCLUDING BUT NOT LIMITED TO
        AUDIO TRACKS, IS THE EXCLUSIVE PROPERTY OF FABIOSA MEDIA AND IS
        AVAILABLE ONLY FOR USE BY OUR CONTRACTED PARTNERS. UNAUTHORIZED ACCESS
        OR USE IS STRICTLY PROHIBITED AND MAY RESULT IN LEGAL ACTION.
      </p>
      <h3>Privacy Notice</h3>
      <p>
        We value your privacy. Our website does not use cookies, track visitors,
        or collect personal information. For more details, please review our <Link className={styles.link} href={'/privacy'}>Privacy Policy</Link>.
      </p>
      <button onClick={handleClose} className={styles.button}>
        ACCEPT
      </button>
    </div>
  );
};

export default Banner;
