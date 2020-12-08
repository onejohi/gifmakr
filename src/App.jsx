import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';

const ffmpeg = createFFmpeg({ log: true });

function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'toConvert.mp4', await fetchFile(video));
    await ffmpeg.run('-i', 'toConvert.mp4', '-t', '2.5','-ss', '2.0', '-f', 'gif', 'output.gif');
    const data = ffmpeg.FS('readFile', 'output.gif');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url);
  }

  return ready ? 
    (
    <div className="App">
      <div className="nav navbar-dark bg-dark">
        <div className="text-center navbar-brand mx-4 my-2">
          Onejohi's GifMakr
        </div>
      </div>
      <div className="card m-3 text-center">
        <div className="card-body">
          {video && <video controls width="250" src={URL.createObjectURL(video)}></video>}
          <h3 className="display-4">
            Choose a video to convert
          </h3>
          <span className="btn btn-primary btn-file">
          <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
          </span>

          <h3>Result</h3>
          <button className="btn btn-primary" onClick={convertToGif}>Convert Video</button>

          { gif && <img src={gif} width="250" />}
        </div>
      </div>
    </div>
    )
    :
    (
      <p>this app size is 25MB, it might take a while to load...</p>
    );
}

export default App;
