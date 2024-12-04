export const createSnapshots = async (duration, player) => {
    const video = player.getInternalPlayer(); // Removed type annotation
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context == null) return; // Abort if no context
  
    const times = [5, duration * 0.25, duration * 0.5, duration * 0.75, duration - 5];
    const newSnapshots = []; // Array to store snapshots
  
    for (const time of times) {
      video.currentTime = time;
      await new Promise((resolve) => {
        video.onseeked = () => {
          const targetWidth = 226;
          const targetHeight = 226;
  
          const tempCanvas = document.createElement('canvas');
          const tempContext = tempCanvas.getContext('2d');
  
          tempCanvas.width = targetWidth;
          tempCanvas.height = targetHeight;
          tempContext?.drawImage(video, 0, 0, targetWidth, targetHeight);
  
          const dataUrl = tempCanvas.toDataURL('image/jpeg', 1.0);
          newSnapshots.push(dataUrl);
          resolve();
        };
      });
    }
    return newSnapshots;
  };
  