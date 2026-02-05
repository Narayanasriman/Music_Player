import { useEffect, useRef, useState } from "react";

interface Song {
  id: number;
  title: string;
  movie: string;
  src: string;
}

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // fetch songs.json
  useEffect(() => {
    fetch("/songs.json")
      .then((res) => res.json())
      .then((data: Song[]) => setSongs(data));
  }, []);

  // auto play when song changes
  useEffect(() => {
    if (audioRef.current && songs.length > 0) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentIndex, songs]);

  // auto next song
  const playNext = () => {
    setCurrentIndex((prev) =>
      prev < songs.length - 1 ? prev + 1 : 0
    );
  };

  if (!songs.length) return <p>Loading songs...</p>;

  return (
    <div>
      <h2>Now Playing</h2>
      <p>{songs[currentIndex].title}</p>
      <p>{songs[currentIndex].movie}</p>

      <audio
        ref={audioRef}
        src={songs[currentIndex].src}
        controls
        onEnded={playNext}
        onError={playNext}
      />

      <hr />

      {songs.map((song, index) => (
        <button key={song.id} onClick={() => setCurrentIndex(index)}>
          {song.title}
        </button>
      ))}
    </div>
  );
}

export default App;
