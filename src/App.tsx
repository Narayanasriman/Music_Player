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
  const [hasUserPlayed, setHasUserPlayed] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // fetch songs.json
  useEffect(() => {
    fetch("/songs.json")
      .then((res) => res.json())
      .then((data: Song[]) => setSongs(data));
  }, []);

  // play only AFTER user interaction
  useEffect(() => {
    if (hasUserPlayed && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentIndex, hasUserPlayed]);

  const playNext = () => {
    setCurrentIndex((prev) =>
      prev < songs.length - 1 ? prev + 1 : 0
    );
  };

  const handleSongClick = (index: number) => {
    setCurrentIndex(index);
    setHasUserPlayed(true);
  };

  if (!songs.length) return <p>Loading songs...</p>;

  return (
    <div>
      <h2>Now Playing!!</h2>
      <p>{songs[currentIndex].title}</p>
      <p>{songs[currentIndex].movie}</p>

      <audio
        ref={audioRef}
        src={songs[currentIndex].src}
        controls
        onPlay={() => setHasUserPlayed(true)} // detects play button click
        onEnded={playNext}
        onError={playNext}
      />

      <hr />

      {songs.map((song, index) => (
        <button key={song.id} onClick={() => handleSongClick(index)}>
          {song.title}
        </button>
      ))}
    </div>
  );
}

export default App;
