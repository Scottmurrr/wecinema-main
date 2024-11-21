import React, { useRef, useEffect } from 'react';
import videojs from 'video.js'; // Import Video.js
import 'video.js/dist/video-js.css'; // Import Video.js styles
import { Layout } from '../components';

const videoeditorpage = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Initialize Video.js player
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        responsive: true,
        fluid: true,
      });
    }

    return () => {
      // Cleanup player on component unmount
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  return (
    <Layout expand={false} hasHeader={false}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Video Editor</h2>
        <div style={styles.videoWrapper}>
          <video
            ref={videoRef}
            className="video-js vjs-default-skin"
            controls
            preload="auto"
            style={styles.videoPlayer}
          >

            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4" // Replace with your video URL
              type="video/mp4"
            />
            Your browser does not support HTML5 video.
          </video>
		  <h2 >Comming Soon</h2>

        </div>
      </div>
    </Layout>
  );
};

// Styles object
const styles = {
  container: {
    marginTop: 12,
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  videoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: '8px',
    border: '2px solid #ddd',
  },
  videoPlayer: {
    width: '100%',
    height: 'auto',
    maxWidth: '1200px',
  },
};

export default videoeditorpage;
