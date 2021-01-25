(function ($) {

    // Global Functions

    // Modal Construction
    function eiModal($elements) {
        let $eiModal = $('<div class="ei-modal"/>');
        let $eiModalButton = $('<button role="button" class="ei-modal-close">X</button>');
        let $eiPrevPicNext = $('<div></div>').addClass('ei-modal-pagination-pic');

        let $eiPicture = $('<div></div>').addClass('ei-modal-picture');
        $elements.clone().appendTo($eiPicture);

        if ($elements.length > 1) {
            let $eiModalPrev = $('<div><button role="button" class="ei-modal-prev">-</button></div>');
            let $eiModalNext = $('<div><button role="button" class="ei-modal-next">+</button></div>');
            $eiPrevPicNext.append($eiModalPrev).append($eiPicture).append($eiModalNext);
        } else {
            $eiPrevPicNext.append($eiPicture);
        }

        $eiModal.append($eiModalButton).append($eiPrevPicNext);
        return $eiModal;
    }

    function displayImg($pictures, item) {
        $pictures.addClass('ei-item-hide')
            .eq(item)
            .toggleClass('ei-item-hide');
        calcImg($pictures.eq(item).find('img')[0]);
    }

    function calcImg($item) {
        let winWidth = $(window).width();
        let winHeight = $(window).height();
        let eiModalWidth = $item.naturalWidth + 80;
        let eiModalHeight = $item.naturalHeight + 30;

        if ((eiModalWidth < winWidth) && (eiModalHeight < winHeight)) {
            $($item).addClass('ei-img-fits-screen')
                .removeClass('ei-img-xheight')
                .removeClass('ei-img-xwidth');
        }

        if ((eiModalWidth < winWidth) && (eiModalHeight > winHeight)) {
            $($item).removeClass('ei-img-fits-screen')
                .removeClass('ei-img-xwidth')
                .addClass('ei-img-xheight');
        }

        if ((eiModalWidth > winWidth) && (eiModalHeight < winHeight)) {
            $($item).removeClass('ei-img-fits-screen')
                .removeClass('ei-img-xheight')
                .addClass('ei-img-xwidth');
        }

        if ((eiModalWidth > winWidth) && (eiModalHeight > winHeight)) {
            $($item).removeClass('ei-img-fits-screen')
                .removeClass('ei-img-xwidth')
                .addClass('ei-img-xheight');
        }

    }

    function calcModalPos() {
        let currentX = $(window).scrollLeft();
        let currentY = $(window).scrollTop();
        return {
            'cX': currentX,
            'cY': currentY
        };
    }

    function eiPagination($nav, index, countPictures) {

        switch ($nav) {

            case 'prev':
                if (index == 0) {
                    sessionStorage.setItem('eiModalPage', countPictures - 1);
                } else {
                    sessionStorage.setItem('eiModalPage', index - 1);
                }
                break;
            case 'next':
                if (index == countPictures - 1) {
                    sessionStorage.setItem('eiModalPage', 0);
                } else {
                    sessionStorage.setItem('eiModalPage', index + 1);
                }
                break;
        }
        displayImg($('.ei-modal-picture .ei-picture'), Number(sessionStorage.getItem('eiModalPage')));
    }

    // On click Listeners for Images

    function onClick(e, $collection) {
        countPictures = $collection.length;
        let eiPicIndex = $collection.index(e.currentTarget);
        $('body').prepend(eiModal($collection));
        sessionStorage.setItem("eiModalPage", eiPicIndex);

        displayImg($('.ei-modal-picture .ei-picture'), eiPicIndex);

        $('.ei-modal').css({
            'top': calcModalPos().cY,
            'left': calcModalPos().cX
        });

        $('.ei-modal-prev').on('click', function (e) {
            let currentModalPictureIndex = Number(sessionStorage.getItem('eiModalPage')) || 0;
            eiPagination('prev', currentModalPictureIndex, countPictures);

        });

        $('.ei-modal-next').on('click', function (e) {
            let currentModalPictureIndex = Number(sessionStorage.getItem('eiModalPage')) || 0;
            eiPagination('next', currentModalPictureIndex, countPictures);
        });

        $('.ei-modal-close').on('click', function (e) {
            $('.ei-modal').remove();
        });

        $(window).scroll(function () {
            $('.ei-modal').css({
                'top': calcModalPos().cY,
                'left': calcModalPos().cX
            });
        });

    }

    // Call for modal images
    $.fn.easyimagesmodal = function() {
        $(this).on('click', function(e) {
            onClick(e, $(this));

        });


    }

    // Call for gallery images
    $.fn.easyimagesgroup = function () {
        this.each(function () {
            var $eiPictures = $(this).find('.ei-picture');
            $eiPictures.on('click', function (e) {
                onClick(e, $eiPictures);
            });
        });
    }

})(jQuery)

jQuery('.easy-images').easyimagesgroup();
jQuery('.easy-images-item').easyimagesmodal();