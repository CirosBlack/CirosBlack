const videoSource = 'dados/jaspion.json';
const videoPlayer = document.getElementById('videoPlayer');
const videoTitle = document.getElementById('videoTitle');
const playlist = document.getElementById('playlist');
const prevBtn = document.getElementById('prevBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const toggleDownloadsBtn = document.getElementById('toggleDownloadsBtn');
const playlistContainer = document.getElementById('playlistContainer');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressHandle = document.getElementById('progressHandle');
const timeRemaining = document.getElementById('timeRemaining');

let videos = [];
let currentIndex = 0;

function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function generatePlaylist() {
  playlist.innerHTML = "";
  videos.forEach((video, index) => {
    const li = document.createElement('li');
    li.dataset.index = index;
    li.innerHTML = `
      <span class="episode-title">${video.title}</span>
      <a href="${video.src}?download=true" class="download-btn" download>Download</a>
    `;
    playlist.appendChild(li);
  });
}

function updatePlayPauseButton() {
  const playIcon = "https://raw.githubusercontent.com/CirosBlack/YuYuHakusho/refs/heads/main/Play.png";
  const pauseIcon = "https://raw.githubusercontent.com/CirosBlack/YuYuHakusho/refs/heads/main/Pause.png";
  playPauseBtn.innerHTML = `<img src="${videoPlayer.paused ? playIcon : pauseIcon}" alt="${videoPlayer.paused ? 'Play' : 'Pause'}" />`;
}

function loadVideoByIndex(index) {
  if (index < 0 || index >= videos.length) return;
  currentIndex = index;
  videoPlayer.src = videos[index].src;
  videoTitle.textContent = videos[index].title;
  videoPlayer.play().catch(() => {});
  highlightCurrentItem();
  updatePlayPauseButton();
}

function highlightCurrentItem() {
  const items = playlist.querySelectorAll('li');
  items.forEach(li => li.classList.remove('playing'));
  const current = playlist.querySelector(`li[data-index="${currentIndex}"]`);
  if (current) current.classList.add('playing');
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

function updateProgress() {
  const duration = videoPlayer.duration || 0;
  const currentTime = videoPlayer.currentTime || 0;
  const percent = (currentTime / duration) * 100;
  progressBar.style.width = percent + '%';
  progressHandle.style.left = `calc(${percent}% - 7px)`;
  timeRemaining.textContent = formatTime(duration - currentTime);
}

document.addEventListener('DOMContentLoaded', () => {
  const somAtivado = getParam('som') === '1';

  fetch(videoSource)
    .then(res => res.json())
    .then(data => {
      if (data.serie) {
        document.title = data.serie;
        videoTitle.textContent = data.serie;
      }

      videos = data.episodios;
      generatePlaylist();
      loadVideoByIndex(0);

      // Ativa som automaticamente se ?som=1
      if (somAtivado) {
        videoPlayer.muted = false;
        videoPlayer.play().catch(() => {});
      }
    });

  // Corrige sincronização de áudio/vídeo ao voltar à aba
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !videoPlayer.paused) {
      const currentTime = videoPlayer.currentTime;
      videoPlayer.pause();
      setTimeout(() => {
        videoPlayer.currentTime = currentTime;
        videoPlayer.play().catch(() => {});
      }, 50);
    }
  });

  // Bloqueia botão direito
  document.addEventListener('contextmenu', e => e.preventDefault());
});

playlist.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (li && li.dataset.index) {
    loadVideoByIndex(parseInt(li.dataset.index));
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) loadVideoByIndex(currentIndex - 1);
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < videos.length - 1) loadVideoByIndex(currentIndex + 1);
});

playPauseBtn.addEventListener('click', () => {
  videoPlayer.muted = false;
  if (videoPlayer.paused) {
    videoPlayer.play();
  } else {
    videoPlayer.pause();
  }
  updatePlayPauseButton();
});

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
});

toggleDownloadsBtn.addEventListener('click', () => {
  playlistContainer.classList.toggle('show-downloads');
});

videoPlayer.addEventListener('timeupdate', updateProgress);
videoPlayer.addEventListener('loadedmetadata', updateProgress);
videoPlayer.addEventListener('ended', () => {
  if (currentIndex + 1 < videos.length) {
    loadVideoByIndex(currentIndex + 1);
  }
});

progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const percent = offsetX / rect.width;
  videoPlayer.currentTime = percent * videoPlayer.duration;
});
