$(document).ready(function() {
  // Prevenir menu de contexto
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

  // Botão "prev"
  $('.nav-button.prev').on('click', function() {
    if (currentVideoIndex > 0) {
      currentVideoIndex--;
      var prevItem = videoItems.eq(currentVideoIndex);
      updateActiveStates(prevItem);
      playVideo(prevItem.data('url'));
    }
  });

  // Botão "next"
  $('.nav-button.next').on('click', function() {
    if (currentVideoIndex < videoItems.length - 1) {
      currentVideoIndex++;
      var nextItem = videoItems.eq(currentVideoIndex);
      updateActiveStates(nextItem);
      playVideo(nextItem.data('url'));
    }
  });

  // Ao finalizar o vídeo, passa para o próximo automaticamente
  player.on('ended', function() {
    currentVideoIndex++;
    if (currentVideoIndex < videoItems.length) {
      var nextItem = videoItems.eq(currentVideoIndex);
      updateActiveStates(nextItem);
      playVideo(nextItem.data('url'));
    }
  });
});
