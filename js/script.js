$(function () {

  const slider = new Slider({
    images: ".slider img",
    btnPrev: ".slider__button_prev",
    btnNext: ".slider__button_next",
    wrapper: ".slider__wrapper",
    auto: false
  });

  function Slider(slider) {

    const $images = $(slider.images);
    const $wrapper = $(slider.wrapper);
    this.$prev = $(slider.btnPrev);
    this.$next = $(slider.btnNext);

    // ширина одной картинки
    let width = $images.eq(0).outerWidth(true);
    // номер текущей картинки
    let imageNumber = 0;
    // количество изображений, видимых в слайдере
    let imagesInOneScreen = $wrapper.width() / width;
    // завршена ли анимация
    let isAnimationComplete = true;

    this.$prev.on("click", function () {
      // если анимация завершена, то можно перелистывать слайдер
      if (isAnimationComplete) move(-1);
    });

    this.$next.on("click", function () {
      if (isAnimationComplete) move(1);
    });

    window.addEventListener('resize', function () {
      width = $images.eq(0).outerWidth(true);
      imagesInOneScreen = $wrapper.width() / width;
      shift(imageNumber);
    });

    if (slider.auto) {
      setInterval(function () {
        move(1)
      }, 2000);
      this.$prev.css("display", "none");
      this.$next.css("display", "none");
    }

    function move(direction) {

      isAnimationComplete = false;

      imageNumber += direction;

      if(imageNumber > $images.length - imagesInOneScreen) {
        imageNumber = 0;
      }
      else if(imageNumber < 0) {
        imageNumber = $images.length - imagesInOneScreen;
      }

      shift(imageNumber);
    }

    function shift(number) {
      // текущее смещение блока с картинками
      let cur = width * number;

      $wrapper.animate({
        left: -cur
      }, 300, function () {
        isAnimationComplete = true;
      });
    }
  }

  const $navigation = $('.main-header nav');
  const $showMenu = $('.main-header__show-menu');
  const $closeMenu = $('.main-navigation__close-menu');

  $showMenu.on('click', function () {
    $navigation.removeClass('main-navigation').addClass('main-navigation_mobile');
  });

  $closeMenu.on('click', function () {
    $navigation.removeClass('main-navigation_mobile').addClass('main-navigation');
  });

  window.addEventListener('resize', function (e) {
    if (window.innerWidth > 980) {
      $navigation.removeClass('main-navigation_mobile').addClass('main-navigation');
    }
  });

});