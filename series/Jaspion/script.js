document.addEventListener('contextmenu', (e) => e.preventDefault());

function updateTitle(videoTitle) {
  const navTitle = document.querySelector('.nav-title');
  navTitle.textContent = videoTitle;
}

const player = videojs('my-video', {
  controls: true,
  autoplay: true,
  preload: 'auto'
});

const videoItems = document.querySelectorAll('.video-item');
let currentVideoIndex = 0;

function playVideo(url) {
  player.src({ type: 'video/mp4', src: url });
  player.play();
}

function updateActiveStates(clickedItem) {
  videoItems.forEach(item => item.classList.remove('active'));
  clickedItem.classList.add('active');
  const videoTitle = clickedItem.querySelector('.video-title').textContent;
  updateTitle(videoTitle);
  // Rolagem suave para o topo do item ativo dentro da playlist
  clickedItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

videoItems.forEach((item, index) => {
  if (index === 0) {
    item.classList.add('active');
    const videoTitle = item.querySelector('.video-title').textContent;
    updateTitle(videoTitle);
    playVideo(item.dataset.url);
  }
  item.addEventListener('click', () => {
    updateActiveStates(item);
    playVideo(item.dataset.url);
    currentVideoIndex = index;
  });
});

// Botões de navegação para o vídeo
const prevButton = document.querySelector('.nav-button.prev');
const nextButton = document.querySelector('.nav-button.next');

prevButton.addEventListener('click', () => {
  if (currentVideoIndex > 0) {
    currentVideoIndex--;
    const prevItem = videoItems[currentVideoIndex];
    updateActiveStates(prevItem);
    playVideo(prevItem.dataset.url);
  }
});

nextButton.addEventListener('click', () => {
  if (currentVideoIndex < videoItems.length - 1) {
    currentVideoIndex++;
    const nextItem = videoItems[currentVideoIndex];
    updateActiveStates(nextItem);
    playVideo(nextItem.dataset.url);
  }
});

// Ao finalizar o vídeo, passa para o próximo automaticamente
player.on('ended', () => {
  currentVideoIndex++;
  if (currentVideoIndex < videoItems.length) {
    const nextItem = videoItems[currentVideoIndex];
    updateActiveStates(nextItem);
    playVideo(nextItem.dataset.url);
  }
});
