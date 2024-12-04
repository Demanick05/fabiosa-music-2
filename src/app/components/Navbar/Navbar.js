import React from "react";
import styles from "./Navbar.module.scss";
import Image from "next/image";
import logo from "../../../../public/Fabiosa_logo_fuxia.png";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.nav_wrapper}>
        <div className={styles.nav_inner_wrapper}>
          <div className={styles.logo}>
            <Link href={"/"}>
              <Image alt="fabiosa-logo" src={logo} height={30} />
            </Link>
            <div className={styles.navigation_links}>
              <Link className={styles.navigation_link} href={"/"}>
                AI search
              </Link>
              <Link className={styles.navigation_link} href={"/search"}>
                Regular search
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
