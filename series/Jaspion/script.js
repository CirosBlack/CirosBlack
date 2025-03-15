const videoContainer = document.getElementById('videoContainer');
const videoPlayer = document.getElementById('videoPlayer');
const controlsOverlay = document.getElementById('controlsOverlay');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressHandle = document.getElementById('progressHandle');
const timeRemaining = document.getElementById('timeRemaining');
const videoTitle = document.getElementById('videoTitle');
const playlist = document.getElementById('playlist');
const playlistContainer = document.getElementById('playlistContainer');

const prevBtn = document.getElementById('prevBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const toggleDownloadsBtn = document.getElementById('toggleDownloadsBtn');

const playImage = 'https://raw.githubusercontent.com/CirosBlack/YuYuHakusho/refs/heads/main/Play.png';
const pauseImage = 'https://raw.githubusercontent.com/CirosBlack/YuYuHakusho/refs/heads/main/Pause.png';

// Playlist com os episódios
const videos = [
  { src: "https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/001.mp4", title: "O planeta de Edin" },
  { src: "https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/002.mp4", title: "O triste fim de Sakura" },
  { src: "https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/003.mp4", title: "O sonho do menino galáctico" },
  { src: "https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/004.mp4", title: "A fúria do pântano" },
  { src: "https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/005.mp4", title: "O enigma da flauta" },
  // ... restantes dos vídeos
];

let currentIndex = 0;
videoPlayer.removeAttribute('controls');

function generatePlaylist() {
  playlist.innerHTML = "";
  videos.forEach((video, index) => {
    const li = document.createElement('li');
    li.dataset.src = video.src;
    li.dataset.index = index;
    li.dataset.title = video.title;
    li.innerHTML = `<span class="episode-title">${video.title}</span>
                      <a href="${video.src}?download=true" class="download-btn" download>Download</a>`;
    playlist.appendChild(li);
  });
}

function addDownloadClickPrevention() {
  const downloadButtons = document.querySelectorAll('.download-btn');
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
    });
  });
}

function loadVideoByIndex(index) {
  if (index < 0 || index >= videos.length) return;
  currentIndex = index;
  videoPlayer.src = videos[currentIndex].src;
  updateVideoTitle(currentIndex);
  videoPlayer.play().catch(() => {});
  updatePlayPauseButton();
  highlightCurrentItem();
  scrollPlaylistToCurrent();
}

function updateVideoTitle(index) {
  videoTitle.textContent = videos[index].title || "Sem título";
}

function highlightCurrentItem() {
  const items = playlist.querySelectorAll('li');
  items.forEach(li => li.classList.remove('playing'));
  const currentLi = playlist.querySelector(`li[data-index="${currentIndex}"]`);
  if (currentLi) currentLi.classList.add('playing');
}

function scrollPlaylistToCurrent() {
  const currentLi = playlist.querySelector(`li[data-index="${currentIndex}"]`);
  if (currentLi) {
    currentLi.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  if (min < 10) min = "0" + min;
  if (sec < 10) sec = "0" + sec;
  return `${min}:${sec}`;
}

function updateProgress() {
  const duration = videoPlayer.duration;
  const currentTime = videoPlayer.currentTime;
  if (!duration || isNaN(duration)) {
    progressBar.style.width = '0%';
    progressHandle.style.left = '0%';
    timeRemaining.textContent = "00:00";
    return;
  }
  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = progressPercent + '%';
  progressHandle.style.left = `${progressPercent}%`;
  const remainingTime = duration - currentTime;
  timeRemaining.textContent = formatTime(remainingTime);
}

function updatePlayPauseButton() {
  if (videoPlayer.paused) {
    playPauseBtn.innerHTML = `<img src="${playImage}" alt="Play" />`;
  } else {
    playPauseBtn.innerHTML = `<img src="${pauseImage}" alt="Pause" />`;
  }
}

window.addEventListener('load', () => {
  generatePlaylist();
  addDownloadClickPrevention();
  loadVideoByIndex(0);
  videoPlayer.play().then(() => {
    videoPlayer.muted = false;
    videoPlayer.volume = 1.0;
  }).catch((err) => {
    console.log("Erro ao tentar reproduzir o vídeo:", err);
  });
  setTimeout(() => {
    controlsOverlay.classList.add('hidden');
  }, 2000);
});

videoPlayer.addEventListener('timeupdate', updateProgress);
videoPlayer.addEventListener('loadedmetadata', updateProgress);

videoPlayer.addEventListener('ended', () => {
  const nextIndex = currentIndex + 1;
  if (nextIndex < videos.length) {
    loadVideoByIndex(nextIndex);
  }
});

playlist.addEventListener('click', e => {
  if ((e.target && e.target.tagName.toLowerCase() === 'li') || 
      (e.target.parentElement && e.target.parentElement.tagName.toLowerCase() === 'li')) {
    const li = e.target.tagName.toLowerCase() === 'li' ? e.target : e.target.parentElement;
    const index = parseInt(li.getAttribute('data-index'), 10);
    loadVideoByIndex(index);
  }
});

let isDragging = false;
function getOffsetX(e) {
  if (e.type.startsWith('touch')) {
    return e.touches[0].clientX;
  }
  return e.clientX;
}

function scrub(e) {
  const rect = progressContainer.getBoundingClientRect();
  const offsetX = getOffsetX(e) - rect.left;
  let ratio = offsetX / rect.width;
  ratio = Math.min(Math.max(ratio, 0), 1);
  const newTime = ratio * videoPlayer.duration;
  videoPlayer.currentTime = newTime;
  const progressPercent = ratio * 100;
  progressBar.style.width = progressPercent + '%';
  progressHandle.style.left = `${progressPercent}%`;
  timeRemaining.textContent = formatTime(videoPlayer.duration - newTime);
}

progressContainer.addEventListener('mousedown', e => {
  isDragging = true;
  scrub(e);
});
progressContainer.addEventListener('touchstart', e => {
  isDragging = true;
  scrub(e);
}, { passive: false });
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  scrub(e);
});
window.addEventListener('touchmove', e => {
  if (!isDragging) return;
  scrub(e);
}, { passive: false });
window.addEventListener('mouseup', () => { isDragging = false; });
window.addEventListener('touchend', () => { isDragging = false; });

prevBtn.addEventListener('click', () => {
  const prevIndex = currentIndex - 1;
  if (prevIndex >= 0) loadVideoByIndex(prevIndex);
});

nextBtn.addEventListener('click', () => {
  const nextIndex = currentIndex + 1;
  if (nextIndex < videos.length) loadVideoByIndex(nextIndex);
});

playPauseBtn.addEventListener('click', () => {
  if (videoPlayer.paused) {
    videoPlayer.play();
  } else {
    videoPlayer.pause();
  }
  updatePlayPauseButton();
});

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.mozRequestFullScreen) {
      videoContainer.mozRequestFullScreen();
    } else if (videoContainer.msRequestFullscreen) {
      videoContainer.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
});

toggleDownloadsBtn.addEventListener('click', () => {
  playlistContainer.classList.toggle('show-downloads');
  if (playlistContainer.classList.contains('show-downloads')) {
    toggleDownloadsBtn.innerHTML = `<img src="https://raw.githubusercontent.com/CirosBlack/YuYuHakusho/refs/heads/main/down.png" alt="Ocultar Downloads" style="width:35px; height:35px; transform: rotate(180deg);">`;
  } else {
    toggleDownloadsBtn.innerHTML = `<img src="https://raw.githubusercontent.com/CirosBlack/YuYuHakusho/refs/heads/main/down.png" alt="Mostrar Downloads" style="width:35px; height:35px;">`;
  }
});

videoContainer.addEventListener('mouseenter', () => {
  controlsOverlay.classList.remove('hidden');
  clearTimeout(hideControlsTimeout);
});

let hideControlsTimeout;
videoContainer.addEventListener('mousemove', () => {
  controlsOverlay.classList.remove('hidden');
  clearTimeout(hideControlsTimeout);
  hideControlsTimeout = setTimeout(() => {
    controlsOverlay.classList.add('hidden');
  }, 2000);
});

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});
