/*
  Este script cuida das interações do player, mudança de vídeo,
  título dinâmico e funcionalidade de playlist.
*/

/*
  Impede o menu de contexto (botão direito do mouse),
  caso seja necessário inibir downloads diretos, por exemplo.
*/
document.addEventListener('contextmenu', (e) => e.preventDefault());

/*
  Atualiza o título exibido na navbar, concatenando
  o nome do módulo com o título do vídeo.
*/
function updateTitle(moduleTitle, videoTitle) {
  const navTitle = document.querySelector('.nav-title');
  navTitle.textContent = `${moduleTitle} - ${videoTitle}`;
}

/*
  Inicializa o Video.js no elemento <video id="my-video">
*/
const player = videojs('my-video', {
  controls: true,
  autoplay: true,
  preload: 'auto'
});

/*
  Seleciona todos os módulos e itens de vídeo,
  mantendo controle do módulo atual.
*/
const modules = document.querySelectorAll('.module');
const videoItems = document.querySelectorAll('.video-item');
let currentModule = null;

/*
  Define a fonte do vídeo e inicia a reprodução.
*/
function playVideo(url) {
  player.src({ type: 'video/mp4', src: url });
  player.play();
}

/*
  Rola a playlist até o módulo selecionado,
  para que ele fique visível ao usuário.
*/
function scrollModuleToTop(module) {
  const playlistContainer = document.querySelector('.playlist-container');
  if (playlistContainer) {
    const moduleTop = module.offsetTop;
    playlistContainer.scrollTo({
      top: moduleTop,
      behavior: 'smooth'
    });
  }
}

/*
  Remove a classe 'active' dos demais vídeos,
  marca o clicado como ativo e atualiza o título.
  Se o módulo for diferente do atual, ativa/desativa.
*/
function updateActiveStates(clickedItem) {
  videoItems.forEach(item => item.classList.remove('active'));
  clickedItem.classList.add('active');

  const newModule = clickedItem.closest('.module');
  const moduleTitle = newModule.querySelector('.module-title').textContent;
  const videoTitle = clickedItem.querySelector('.video-title').textContent;
  updateTitle(moduleTitle, videoTitle);

  if (currentModule !== newModule) {
    modules.forEach(m => m.classList.remove('active'));
    newModule.classList.add('active');
    currentModule = newModule;
  }

  // Rola a playlist até o módulo selecionado
  scrollModuleToTop(newModule);
}

/*
  Retorna o próximo vídeo na lista.
  Se não houver mais vídeos no módulo atual,
  passa para o primeiro vídeo do próximo módulo.
*/
function getNextVideo(currentItem) {
  const currentList = currentItem.closest('.video-list');
  const items = Array.from(currentList.querySelectorAll('.video-item'));
  const currentIndex = items.indexOf(currentItem);

  // Próximo item no mesmo módulo
  if (currentIndex < items.length - 1) {
    return items[currentIndex + 1];
  }

  // Se não houver próximo item, pega o primeiro do próximo módulo
  const nextModule = currentItem.closest('.module').nextElementSibling;
  if (nextModule) {
    return nextModule.querySelector('.video-item');
  }

  // Se acabou tudo, retorna null
  return null;
}

/*
  Ao carregar a página, já define o primeiro vídeo como ativo
  e inicia a reprodução.
*/
videoItems.forEach((item, index) => {
  if (index === 0) {
    item.classList.add('active');
    currentModule = item.closest('.module');
    currentModule.classList.add('active');

    const moduleTitle = currentModule.querySelector('.module-title').textContent;
    const videoTitle = item.querySelector('.video-title').textContent;
    updateTitle(moduleTitle, videoTitle);

    playVideo(item.dataset.url);
  }

  // Evento de clique em cada vídeo da lista
  item.addEventListener('click', () => {
    updateActiveStates(item);
    playVideo(item.dataset.url);
  });
});

/*
  Quando o vídeo atual termina, avança para o próximo
  automaticamente (autoplay sequencial).
*/
player.on('ended', () => {
  const currentItem = document.querySelector('.video-item.active');
  const nextVideo = getNextVideo(currentItem);

  if (nextVideo) {
    updateActiveStates(nextVideo);
    playVideo(nextVideo.dataset.url);
  }
});

/*
  Permite abrir/fechar manualmente cada módulo ao clicar no título.
  (Se quiser que abra sempre só o módulo do vídeo atual,
   pode desabilitar esta parte ou ajustar a lógica).
*/
modules.forEach(module => {
  const moduleTitle = module.querySelector('.module-title');
  moduleTitle.addEventListener('click', () => {
    module.classList.toggle('active');
  });
});
