import styles from "./page.module.css";
import AudioList from "./components/waveform/AudioList";

export default function Home() {
  return (
    <main className={styles.main}>
      <AudioList />
    </main>
  );
}
