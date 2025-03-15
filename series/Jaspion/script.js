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

player.on('ended', () => {
  currentVideoIndex++;
  if (currentVideoIndex < videoItems.length) {
    const nextItem = videoItems[currentVideoIndex];
    updateActiveStates(nextItem);
    playVideo(nextItem.dataset.url);
  }
});
