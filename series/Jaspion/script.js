$(document).ready(function() {
  // Prevenir o menu de contexto
  $(document).on('contextmenu', function(e) {
    e.preventDefault();
  });

  function updateTitle(videoTitle) {
    $('.nav-title').text(videoTitle);
  }

  // Inicializar o player video.js
  var player = videojs('my-video', {
    controls: true,
    autoplay: true,
    preload: 'auto'
  });

  var videoItems = $('.video-item');
  var currentVideoIndex = 0;

  function playVideo(url) {
    player.src({ type: 'video/mp4', src: url });
    player.play();
  }

  function updateActiveStates(clickedItem) {
    videoItems.removeClass('active');
    clickedItem.addClass('active');
    var videoTitle = clickedItem.find('.video-title').text();
    updateTitle(videoTitle);
    // Rolagem suave para o item ativo dentro da playlist
    $('.playlist-container').animate({
      scrollTop: clickedItem.offset().top - $('.playlist-container').offset().top + $('.playlist-container').scrollTop()
    }, 500);
  }

  // Configura o primeiro vídeo como ativo
  videoItems.each(function(index) {
    if (index === 0) {
      $(this).addClass('active');
      var videoTitle = $(this).find('.video-title').text();
      updateTitle(videoTitle);
      playVideo($(this).data('url'));
    }
  });

  // Clique em um item da playlist
  videoItems.on('click', function() {
    currentVideoIndex = videoItems.index(this);
    updateActiveStates($(this));
    playVideo($(this).data('url'));
  });

  // Criação de botões customizados para a barra de controles usando video.js
  var Button = videojs.getComponent('Button');

  var PrevButton = videojs.extend(Button, {
    constructor: function(player, options) {
      Button.call(this, player, options);
      this.controlText('Anterior');
      // Definindo o ícone (seta para a esquerda)
      this.el().innerHTML = '&#9664;';
    },
    handleClick: function() {
      if (currentVideoIndex > 0) {
        currentVideoIndex--;
        var prevItem = videoItems.eq(currentVideoIndex);
        updateActiveStates(prevItem);
        playVideo(prevItem.data('url'));
      }
    }
  });

  var NextButton = videojs.extend(Button, {
    constructor: function(player, options) {
      Button.call(this, player, options);
      this.controlText('Próximo');
      // Definindo o ícone (seta para a direita)
      this.el().innerHTML = '&#9654;';
    },
    handleClick: function() {
      if (currentVideoIndex < videoItems.length - 1) {
        currentVideoIndex++;
        var nextItem = videoItems.eq(currentVideoIndex);
        updateActiveStates(nextItem);
        playVideo(nextItem.data('url'));
      }
    }
  });

  // Registrar os componentes customizados
  videojs.registerComponent('PrevButton', PrevButton);
  videojs.registerComponent('NextButton', NextButton);

  // Adicionar os botões customizados na barra de controles, antes do botão "PlayToggle"
  player.ready(function() {
    var controlBar = player.getChild('controlBar');
    // Procurar o índice do componente PlayToggle
    var playToggleIndex = controlBar.children().findIndex(function(child) {
      return child.name() === 'PlayToggle';
    });
    // Adiciona os botões antes do PlayToggle
    if (playToggleIndex === -1) {
      controlBar.addChild('PrevButton');
      controlBar.addChild('NextButton');
    } else {
      controlBar.addChild('PrevButton', {}, playToggleIndex);
      controlBar.addChild('NextButton', {}, playToggleIndex + 1);
    }
  });

  // Ao finalizar o vídeo, passa automaticamente para o próximo
  player.on('ended', function() {
    currentVideoIndex++;
    if (currentVideoIndex < videoItems.length) {
      var nextItem = videoItems.eq(currentVideoIndex);
      updateActiveStates(nextItem);
      playVideo(nextItem.data('url'));
    }
  });
});
