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
      <div className="nav navbar-dark bg-dark text-center">
        <div className="navbar-brand mx-4 my-2">
          Giff
        </div>
      </div>
      <div className="card m-3 text-center">
        <div className="card-body">
          {
            !video &&
            <div>
              <h5 className="display-6">
                Choose a video to convert
              </h5>
              <span className="btn btn-primary btn-file">
                <input type="file" class="form-control" onChange={(e) => setVideo(e.target.files?.item(0))} />
                Import Video
              </span>
            </div>
          }
          {
            video && !gif &&
            <div>
              <video controls width="250" src={URL.createObjectURL(video)}></video>
              <br />
              <button className="btn btn-primary mt-3" onClick={convertToGif}>Convert Video</button>
            </div>
          }
          {
            gif && 
            <div>
              <img src={gif} width="250" />
              <br />
              <a className="btn btn-success mt-3" href={gif} download>Download Gif</a>
            </div>
          }
        </div>
      </div>
    </div>
    )
    :
    (
      <div className="card m-5">
        <div className="card-body text-center">
          <h1 className="fs-1 bolder display-1">GIFF</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
}

export default App;
