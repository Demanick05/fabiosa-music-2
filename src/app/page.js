import styles from "./page.module.css";
import AudioList from "./components/waveform/AudioList";
import Banner from "./components/cookieBanner/banner";


export default function Home() {
  return (
    <main className={styles.main}>
      <Banner />
     <AudioList />
    </main>
  );
}
