$(document).ready(function() {
  // Prevenir a abertura do menu de contexto
  $(document).on('contextmenu', function(e) {
    e.preventDefault();
  });

  // Função para atualizar o título exibido na navbar
  function updateTitle(videoTitle) {
    $('.nav-title').text(videoTitle);
  }

  // Inicializar o player Video.js com controles, autoplay e preload
  var player = videojs('my-video', {
    controls: true,
    autoplay: true,
    preload: 'auto'
  });

  // Definir a playlist com os vídeos e seus títulos
  var myPlaylist = [
    {
      sources: [{
        src: 'https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/001.mp4',
        type: 'video/mp4'
      }],
      name: "O planeta de Edin"
    },
    {
      sources: [{
        src: 'https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/002.mp4',
        type: 'video/mp4'
      }],
      name: "O triste fim de Sakura"
    },
    {
      sources: [{
        src: 'https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/003.mp4',
        type: 'video/mp4'
      }],
      name: "O sonho do menino galáctico"
    },
    {
      sources: [{
        src: 'https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/004.mp4',
        type: 'video/mp4'
      }],
      name: "A fúria do pântano"
    }
    // Adicione mais vídeos à playlist conforme necessário.
  ];

  // Configurar a playlist e a interface da playlist se os plugins estiverem disponíveis
  if (player.playlist && player.playlistUi) {
    player.playlist(myPlaylist);
    player.playlistUi();
    // Atualizar o título na navbar quando ocorrer uma mudança na playlist
    player.on('playlistchange', function() {
      var currentIndex = player.playlist.currentItem();
      updateTitle(myPlaylist[currentIndex].name);
    });
  }

  // Criação de botões customizados para navegação usando os componentes do Video.js
  var Button = videojs.getComponent('Button');

  // Criação do botão "Anterior"
  var PrevButton = videojs.extend(Button, {
    constructor: function(player, options) {
      Button.call(this, player, options);
      this.controlText('Anterior');
      this.addClass('vjs-prev-button');
      // Ícone de seta para a esquerda
      this.el().innerHTML = '&#9664;';
    },
    handleClick: function() {
      if (player.playlist) {
        player.playlist.previous();
      }
    }
  });

  // Criação do botão "Próximo"
  var NextButton = videojs.extend(Button, {
    constructor: function(player, options) {
      Button.call(this, player, options);
      this.controlText('Próximo');
      this.addClass('vjs-next-button');
      // Ícone de seta para a direita
      this.el().innerHTML = '&#9654;';
    },
    handleClick: function() {
      if (player.playlist) {
        player.playlist.next();
      }
    }
  });

  // Registrar os componentes customizados no Video.js
  videojs.registerComponent('PrevButton', PrevButton);
  videojs.registerComponent('NextButton', NextButton);

  // Inserir os botões customizados na control bar, posicionando-os antes do botão "PlayToggle"
  player.ready(function() {
    var controlBar = player.getChild('controlBar');
    var children = controlBar.children();
    var playToggle = controlBar.getChild('PlayToggle');
    var playToggleIndex = children.indexOf(playToggle);
    if (playToggleIndex !== -1) {
      controlBar.addChild('PrevButton', {}, playToggleIndex);
      controlBar.addChild('NextButton', {}, playToggleIndex + 1);
    } else {
      controlBar.addChild('PrevButton');
      controlBar.addChild('NextButton');
    }
  });

  // Quando o vídeo terminar, avançar para o próximo item da playlist
  player.on('ended', function() {
    if (player.playlist) {
      player.playlist.next();
    }
  });
});
