$(document).ready(function() {
  // Inicializa o player Video.js
  var player = videojs('my-video');

  // Define a playlist – cada objeto deve conter pelo menos 'sources' (com src e type) e 'name' (título)
  var myPlaylist = [
    {
      sources: [{ src: 'https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/001.mp4', type: 'video/mp4' }],
      name: "O planeta de Edin"
    },
    {
      sources: [{ src: 'https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/002.mp4', type: 'video/mp4' }],
      name: "O triste fim de Sakura"
    },
    {
      sources: [{ src: 'https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/003.mp4', type: 'video/mp4' }],
      name: "O sonho do menino galáctico"
    },
    {
      sources: [{ src: 'https://huggingface.co/datasets/CirosW/SmFzcGlvbg/resolve/main/004.mp4', type: 'video/mp4' }],
      name: "A fúria do pântano"
    }
    // Adicione os demais vídeos conforme necessário...
  ];

  // Configura a playlist no player e inicializa a interface de playlist
  player.playlist(myPlaylist);
  player.playlistUi();

  // Atualiza o título na navbar sempre que houver mudança na playlist
  player.on('playlistchange', function() {
    var currentIndex = player.playlist.currentItem();
    $('.nav-title').text(myPlaylist[currentIndex].name);
  });

  // Criação de botões customizados usando os componentes do Video.js
  var Button = videojs.getComponent('Button');

  var PrevButton = videojs.extend(Button, {
    constructor: function(player, options) {
      Button.call(this, player, options);
      this.controlText('Anterior');
      // Ícone: seta para a esquerda
      this.el().innerHTML = '&#9664;';
    },
    handleClick: function() {
      player.playlist.previous();
    }
  });

  var NextButton = videojs.extend(Button, {
    constructor: function(player, options) {
      Button.call(this, player, options);
      this.controlText('Próximo');
      // Ícone: seta para a direita
      this.el().innerHTML = '&#9654;';
    },
    handleClick: function() {
      player.playlist.next();
    }
  });

  // Registra os componentes customizados
  videojs.registerComponent('PrevButton', PrevButton);
  videojs.registerComponent('NextButton', NextButton);

  // Adiciona os botões customizados na control bar, posicionando-os antes do botão "PlayToggle"
  player.ready(function() {
    var controlBar = player.getChild('controlBar');
    // Procura o índice do componente PlayToggle
    var playToggleIndex = controlBar.children().findIndex(function(child) {
      return child.name() === 'PlayToggle';
    });
    if (playToggleIndex === -1) {
      controlBar.addChild('PrevButton');
      controlBar.addChild('NextButton');
    } else {
      controlBar.addChild('PrevButton', {}, playToggleIndex);
      controlBar.addChild('NextButton', {}, playToggleIndex + 1);
    }
  });

  // Quando o vídeo termina, passa para o próximo
  player.on('ended', function() {
    player.playlist.next();
  });
});
