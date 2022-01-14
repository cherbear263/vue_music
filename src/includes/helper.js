export default {
  formatTime(time) {
    // input time in seconds. Output in mins and secs
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.round((time - minutes * 60) || 0);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  },
};
