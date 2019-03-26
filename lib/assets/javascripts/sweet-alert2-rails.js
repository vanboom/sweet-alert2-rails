var sweetAlertConfirmConfig = sweetAlertConfirmConfig || {}; // Add default config object

(function($) {
  var sweetAlertConfirm = function(event) {
    swal.close();
    swalDefaultOptions = {
      title: sweetAlertConfirmConfig.title || 'Are you sure?',
      type: sweetAlertConfirmConfig.type || 'warning',
      showCancelButton: sweetAlertConfirmConfig.showCancelButton || true,
      confirmButtonText: sweetAlertConfirmConfig.confirmButtonText || "Ok",
      cancelButtonText: sweetAlertConfirmConfig.cancelButtonText || "Cancel"
    }
    if (sweetAlertConfirmConfig.confirmButtonColor !== null) {
      swalDefaultOptions.confirmButtonColor = sweetAlertConfirmConfig.confirmButtonColor
    }

    $linkToVerify = $(this);
    var swalOptions = swalDefaultOptions;
    var optionKeys = [
                        'text',
                        'showCancelButton',
                        'confirmButtonColor',
                        'cancelButtonColor',
                        'confirmButtonText',
                        'cancelButtonText',
                        'html',
                        'imageUrl',
                        'allowOutsideClick',
                        'customClass'
                      ];

    function sweetAlertConfirmedCallback(result) {
      if (result.value) {

        if ($linkToVerify.data().remote === true) {
          console.debug($linkToVerify.get()[0]);
          console.debug(result);
          $.rails.handleRemote.call($linkToVerify.get()[0] );
        }
        else if($linkToVerify.data().method !== undefined) {
          $.rails.handleMethod.call($linkToVerify.get()[0]);
        }
        else {
          if($linkToVerify.attr('type') == 'submit') {
            var name = $linkToVerify.attr('name'),
            data = name ? {name: name, value: $linkToVerify.val()} : null;
            $linkToVerify.closest('form').data('ujs:submit-button', data);
            $linkToVerify.closest('form').submit();
          }
          else {
            $linkToVerify.data('swal-confirmed', true).click();
          }
        }
      }
      else
      {
        result.dismiss;
      }
    }

    if ($linkToVerify.data('swal-confirmed')) {
      $linkToVerify.data('swal-confirmed', false);
      return true;
    }

    $.each($linkToVerify.data(), function(key, val) {
      if ($.inArray(key, optionKeys) >= 0) {
        swalOptions[key] = val;
      }
    });

    if ($linkToVerify.attr('data-sweet-alert-type')) {
      swalOptions['type'] = $linkToVerify.attr('data-sweet-alert-type');
    }

    message = $linkToVerify.attr('data-sweet-alert-confirm')
    swalOptions['title'] = message
    swal(swalOptions).then(sweetAlertConfirmedCallback);

    return false;
  }

  $(document).on('ready turbolinks:load page:update ajaxComplete', function() {
    $('[data-sweet-alert-confirm]').unbind('click');
    $('[data-sweet-alert-confirm]').on('click', sweetAlertConfirm);
  });

  $(document).on('ready turbolinks:load page:load', function() {
    //To avoid "Uncaught TypeError: Cannot read property 'querySelector' of null" on turbolinks
    if (typeof window.sweetAlertInitialize === 'function') {
      window.sweetAlertInitialize();
    }
  });

})(jQuery);
