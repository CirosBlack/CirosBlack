document.addEventListener('contextmenu', (e) => e.preventDefault());

function updateTitle(moduleTitle, videoTitle) {
    const navTitle = document.querySelector('.nav-title');
    navTitle.textContent = `${moduleTitle} - ${videoTitle}`;
}



const player = videojs('my-video', {
    controls: true,
    autoplay: true,
    preload: 'auto'
});





const modules = document.querySelectorAll('.module');
const videoItems = document.querySelectorAll('.video-item');
let currentVideoIndex = 0;
let currentModule = null;

function playVideo(url) {
    player.src({ type: 'video/mp4', src: url });
    player.play();
}

function scrollModuleToTop(module) {
    const playlistContainer = document.querySelector('.playlist-container');
    const moduleTop = module.offsetTop;
    playlistContainer.scrollTo({
        top: moduleTop,
        behavior: 'smooth'
    });
}

function updateActiveStates(clickedItem) {
    videoItems.forEach(item => item.classList.remove('active'));
    clickedItem.classList.add('active');

    const newModule = clickedItem.closest('.module');
    const moduleTitle = newModule.querySelector('.module-title').textContent;
    const videoTitle = clickedItem.querySelector('.video-title').textContent;
    updateTitle(moduleTitle, videoTitle);

    if (currentModule !== newModule) {
        modules.forEach(module => {
            if (module === newModule) {
                module.classList.add('active');
            } else {
                module.classList.remove('active');
            }
        });
        currentModule = newModule;
    }
    
    // Scroll the active module to the top of the playlist
    scrollModuleToTop(newModule);
}

function getNextVideo(currentItem) {
    const currentList = currentItem.closest('.video-list');
    const items = Array.from(currentList.querySelectorAll('.video-item'));
    const currentIndex = items.indexOf(currentItem);

    if (currentIndex < items.length - 1) {
        return items[currentIndex + 1];
    }

    const nextModule = currentItem.closest('.module').nextElementSibling;
    if (nextModule) {
        return nextModule.querySelector('.video-item');
    }

    return null;
}

videoItems.forEach((item, index) => {
    if (index === 0) {
        item.classList.add('active');
        item.closest('.module').classList.add('active');
        currentModule = item.closest('.module');
        const moduleTitle = currentModule.querySelector('.module-title').textContent;
        const videoTitle = item.querySelector('.video-title').textContent;
        updateTitle(moduleTitle, videoTitle);
        playVideo(item.dataset.url);
    }

    item.addEventListener('click', () => {
        updateActiveStates(item);
        playVideo(item.dataset.url);
    });
});

player.on('ended', () => {
    const currentItem = document.querySelector('.video-item.active');
    const nextVideo = getNextVideo(currentItem);

    if (nextVideo) {
        updateActiveStates(nextVideo);
        playVideo(nextVideo.dataset.url);
    }
});

modules.forEach(module => {
    const moduleTitle = module.querySelector('.module-title');
    moduleTitle.addEventListener('click', () => {
        module.classList.toggle('active');
    });
});