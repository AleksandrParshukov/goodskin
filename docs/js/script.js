function init_menu() {
  const $menu_open = $('.js_menu_open'),
    $menu_close = $('.js_menu_close'),
    $main_nav = $('.main-nav');

  $menu_open.on('click', function (evt) {
    evt.preventDefault();

    if ($main_nav.is('.open')) {
      $main_nav.removeClass('open');
      // $('html').removeClass('modal-open');
    } else {
      $main_nav.addClass('open');
      // $('html').addClass('modal-open');
    }

    $main_nav.on('click', main_nav_click_handler);
  });

  $menu_close.on('click', function (evt) {
    evt.preventDefault();

    $main_nav.removeClass('open');
    // $('html').removeClass('modal-open');
    $main_nav.off('click', main_nav_click_handler);
  });

  function main_nav_click_handler(evt) {
    if (!$(evt.target).is('.main-nav__content') && !$(evt.target).closest('.main-nav__content').length) {
      $main_nav.removeClass('open');
      $('html').removeClass('modal-open');
      $main_nav.off('click', main_nav_click_handler);
    }
  }
}

function init_modals() {
  $.fn.modal = function (action) {
    return this.each(function () {
      var $modal = $(this);

      function show_modal() {
        $modal.fadeIn(0, function () {
          $modal.addClass('show');
        });
        $('body').addClass('modal_open'); // можно потом использовать для блокировки скролла
      }

      function hide_modal() {
        $modal.removeClass('show');
        setTimeout(function () {
          $modal.fadeOut(0);
          $('body').removeClass('modal_open');
        }, 300);
      }

      if (action === 'show') {
        show_modal();
      } else if (action === 'hide') {
        hide_modal();
      }

      // Поддержка кликов на кнопки и фон
      if (!$modal.data('modal_initialized')) {
        $modal.on('click', function (e) {
          if ($(e.target).is('.modal')) hide_modal();
        });
        $modal.on('click', '[data-dismiss="modal"]', hide_modal);
        $modal.data('modal_initialized', true);
      }
    });
  };

  $(document).on('click', '[data-dismiss="modal"]', function () {
    var $modal = $(this).closest('.modal');
    $modal.modal('hide');
  });

  // Открытие через data-атрибуты (bootstrap-стиль)
  $(document).on('click', '[data-toggle="modal"]', function (evt) {
    evt.preventDefault();
    var target = $(this).data('target');
    $(target).modal('show');
  });

  // Закрытие по Esc
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.modal.show').each(function () {
        $(this).modal('hide');
      });
    }
  });
}

function init_custom_select() {
  const $selects = $('.js_custom_select');

  if (!$selects.length) {
    return false;
  }

  $selects.each(function () {
    const $select = $(this);

    $select.hide();

    const $wrapper = $('<div class="custom-select"></div>'),
      $current = $('<div class="custom-select__current"></div>'),
      $list = $('<ul class="custom-select__list"></ul>');

    function toggle_placeholder(value) {
      $current.toggleClass('placeholder', value === '');
    }

    $select.find('option').each(function () {
      const $option = $(this),
        $item = $('<li class="custom_select__item"></li>');

      $item.text($option.text()).attr('data_value', $option.val());

      if ($option.is(':selected')) {
        $current.text($option.text());
        toggle_placeholder($option.val());
      }

      $list.append($item);
    });

    $wrapper.append($current).append($list);
    $select.before($wrapper);

    // открыть/закрыть
    $current.on('click', function () {
      $('.custom-select').not($wrapper).removeClass('open');
      $wrapper.toggleClass('open');
    });

    // выбор
    $list.on('click', '.custom_select__item', function () {
      const value = $(this).attr('data_value'),
        text = $(this).text();

      $current.text(text);
      toggle_placeholder(value);
      $wrapper.removeClass('open');

      $select.val(value).trigger('change');
    });

    // синхронизация если меняют оригинальный select
    $select.on('change', function () {
      const value = $select.val(),
        $item = $list.find('[data_value="' + value + '"]');

      if ($item.length) {
        $current.text($item.text());
      }

      toggle_placeholder(value);
    });

    // закрытие при клике вне
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.custom-select').length) {
        $('.custom-select').removeClass('open');
      }
    });
  });
}

function init_form() {
  $('.js_phone_input').on('keydown', function (evt) {
    $(this).mask('+7 (000) 000-00-00');
  });
}

function init_popups() {
  const $popup_toggle = $('.js_popup_toggle'),
    $popup = $('.js_popup'),
    $popup_close = $('.js_popup_close');

  if (!$popup_toggle.length || !$popup.length) {
    return false;
  }

  $popup_toggle.on('click', function (evt) {
    evt.preventDefault();
    $popup.not($(this).next($popup)).removeClass('show');
    $(this).next($popup).toggleClass('show');

    $(document).on('click', function doc_click_handler(e) {
      if (!$(e.target).closest($popup).length && !$(e.target).closest($popup_toggle).length) {
        $popup.removeClass('show');
        $(document).off('click', doc_click_handler);
      }
    });
  });

  if ($popup_close.length) {
    $popup_close.on('click', function (evt) {
      evt.preventDefault();
      $(this).closest($popup).removeClass('show');
    });
  }
}

function init_cart() {
  const $cart = $('.js_cart');

  if (!$cart.length) {
    return false;
  }

  $cart.on('click', '.js_qty_minus', function (evt) {
    evt.preventDefault();
    const $input = $(this).next('.js_qty');

    if ($input.val() > parseInt($input.attr('min'))) {
      $input.val(parseInt($input.val()) - 1).trigger('change');
    }
  });

  $cart.on('click', '.js_qty_plus', function (evt) {
    evt.preventDefault();
    const $input = $(this).prev('.js_qty');

    if ($input.val() < parseInt($input.attr('max'))) {
      $input.val(parseInt($input.val()) + 1).trigger('change');
    }
  });

  $cart.on('change input', '.js_qty', function (evt) {
    const $input = $(this);

    if ($input.val() < parseInt($input.attr('min'))) {
      $input.val(parseInt($input.attr('min')));
    }

    if ($input.val() > parseInt($input.attr('max'))) {
      $input.val(parseInt($input.attr('max')));
    }

    update_width($input);

    if ($input.val() === '0') {
      if (confirm('Удалить товар из корзины?')) {
        $input.closest('.cart__item').remove();
      } else {
        $input.val(1).trigger('change');
      }
    } else {
      update_price($input);
    }
  });

  function update_price($input) {
    const $item = $input.closest('.cart__item'),
      $price_block = $item.find('.js_price'),
      $price = $price_block.find('.js_price_value'),
      qty = parseInt($input.val()),
      unit_price = parseInt($price_block.attr('data-price'));

    $price.text(`${format_number(qty * unit_price)} ₽`);

    if (qty > 1) {
      if (!$price_block.find('.js_unit-price').length) {
        $price_block.append(`<span class="js_unit-price">${format_number(unit_price)} ₽ за шт.</span>`);
      }
    } else {
      $price_block.find('.js_unit-price').remove();
    }

    function format_number(num) {
      return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
  }

  function update_width($input) {
    $input.width(`${$input.val().length}ch`);
  }

  $('.js_qty').each(function () {
    update_width($(this));
  });

  $(window).on('resize', function () {
    $('.js_qty').each(function () {
      update_width($(this));
    });
  });
}

function init_quiz() {
  const $quiz = $('.quiz');

  if (!$quiz.length) {
    return false;
  }

  $quiz.on('change', 'input[type="file"]', function () {
    const file = this.files?.[0];
    const $label = $('label[for="' + this.id + '"]');

    $label.find('.preview').remove();

    if (!file || !file.type.startsWith('image/')) return;

    const $preview = $(`
    <div class="preview">
      <div class="loader"></div>
    </div>
  `);

    $label.append($preview);

    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();

      img.onload = function () {
        $preview.find('.loader').remove();
        $preview.append(img);
      };

      img.onerror = function () {
        $preview.find('.loader').remove();
        $preview.append('<div class="preview-error">Не удалось загрузить изображение</div>');
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });

  const $more_photo = $('.js_more_photo');

  $more_photo.on('click', function (evt) {
    evt.preventDefault();

    const $template = $($('.js_add_photo_template').html()),
      $list = $(this).closest('ul'),
      max_elems = $list.data('max') ?? 10;
    id = 'photo_' + Date.now();
    $template.find('input').attr('id', id);
    $template.find('input').attr('name', id);
    $template.find('label').attr('for', id);

    $(this).parent().before($template);

    if ($list.children().length === max_elems + 1) {
      $(this).hide();
    }
  });
}

function init_test() {
  const $test = $('.js_test');

  if (!$test.length) {
    return false;
  }

  const $steps = $test.find('.js_test_step'),
    $btn_prev = $test.find('.js_btn_prev'),
    $btn_next = $test.find('.js_btn_next'),
    $btn_submit = $test.find('.js_btn_submit'),
    $current_step = $test.find('.js_current_step'),
    $result = $('.js_test_result');

  let current_step = 1;

  update_buttons();

  $btn_prev.on('click', function (evt) {
    evt.preventDefault();

    const $active_step = $steps.filter('.active');

    current_step--;
    $active_step.removeClass('active');
    $steps.filter(`[data-step="${current_step}"]`).addClass('active');
    update_buttons();
  });

  $btn_next.on('click', function (evt) {
    evt.preventDefault();

    const $active_step = $steps.filter('.active');

    current_step++;
    $active_step.removeClass('active');
    $steps.filter(`[data-step="${current_step}"]`).addClass('active');
    update_buttons();
  });

  $btn_submit.on('click', function (evt) {
    evt.preventDefault();
    
    $test.hide();
    $result.addClass('show');
  });

  function update_buttons() {
    if (current_step == 1) {
      $btn_prev.addClass('disabled').prop('disabled', true);
    } else {
      $btn_prev.removeClass('disabled').prop('disabled', false);
    }

    if (current_step == $steps.length) {
      $btn_next.hide();
      $btn_submit.show().css('display', 'flex');
    } else {
      $btn_next.show();
      $btn_submit.hide();
    }

    $current_step.text(current_step.toString().padStart(2, '0'));
  }
}

function init_cookie() {
  const $cookie = $('.js_cookie');

  if (!$cookie.length) {
    return false;
  }

  $cookie.find('.js_apply_cookie').on('click', function (evt) {
    evt.preventDefault();

    $cookie.remove();
  });
}

$(document).ready(function () {
  init_menu();
  init_form();
  init_modals();
  init_popups();
  init_custom_select();
  init_cart();
  init_quiz();
  init_test();
  init_cookie();
});
