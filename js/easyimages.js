(function ($) {

    // Construct Modal Window - Returns the modal node
    // $elements : Collection of the <img>
    function eiModal($elements) {
        let $eiModal = $('<div class="ei-modal"/>');
        let $eiModalClose = $('<button type="button" class="btn btn-danger ei-modal-close">X</button>');
        let $eiPrevPicNext = $('<div></div>').addClass('ei-modal-pagination-pic');

        let $eiPicture = $('<div></div>').addClass('ei-modal-picture');
        $elements.find('img').clone().removeAttr('width').removeAttr('height').appendTo($eiPicture);

        if ($elements.length > 1) {
            let $eiModalPrev = $('<div><button type="button" class="btn btn-success ei-modal-prev">-</button></div>');
            let $eiModalNext = $('<div><button type="button" class="btn btn-success ei-modal-next">+</button></div>');
            $eiPrevPicNext.append($eiModalPrev).append($eiPicture).append($eiModalNext);
        } else {
            $eiPrevPicNext.append($eiPicture);
        }

        $eiModal.append($eiModalClose).append($eiPrevPicNext);
        return $eiModal;
    }

    // Calculate Image Position
    // $item : Image item
    function calcImg($item) {
        let winWidth = $(window).width();
        let winHeight = $(window).height();
        let eiModalWidth = $item.outerWidth() + 80;
        let eiModalHeight = $item.outerHeight() + 20;

        if ((eiModalWidth < winWidth) && (eiModalHeight < winHeight)) {
            $item.addClass('ei-img-fits-screen')
                .removeClass('ei-img-xheight')
                .removeClass('ei-img-xwidth');
        }

        if ((eiModalWidth < winWidth) && (eiModalHeight > winHeight)) {
            $item.removeClass('ei-img-fits-screen')
                .removeClass('ei-img-xwidth')
                .addClass('ei-img-xheight');
        }

        if ((eiModalWidth > winWidth) && (eiModalHeight < winHeight)) {
            $item.removeClass('ei-img-fits-screen')
                .removeClass('ei-img-xheight')
                .addClass('ei-img-xwidth');
        }

        if ((eiModalWidth > winWidth) && (eiModalHeight > winHeight)) {
            $item.removeClass('ei-img-fits-screen')
                .removeClass('ei-img-xwidth')
                .addClass('ei-img-xheight');
        }

    }

    // Calculate Modal Position

    function calcModalPos() {
        let currentX = $(window).scrollLeft();
        let currentY = $(window).scrollTop();
        return {
            'cX': currentX,
            'cY': currentY
        };
    }

    // Modal Pagination

    function eiPagination($nav) {
        let currentPage = Number(sessionStorage.getItem('itemIndex'))||0;
        let countPictures = Number(sessionStorage.getItem('totalImages'))||0;

        switch ($nav) {
            case 'prev':
                if (currentPage == 0) {
                    currentPage = countPictures - 1;
                } else {
                    currentPage--;
                }
                break;

            case 'next':
                if (currentPage == countPictures - 1) {
                    currentPage=0;
                } else {
                    currentPage++;
                }
                break;
        }

        sessionStorage.setItem('itemIndex', currentPage);
        $('.ei-modal-picture').find('img').addClass('ei-item-hide').eq(currentPage).removeClass('ei-item-hide');

    }

    // Display the modal
    function modalDisplay() {

        // Image Size
        calcImg($('.ei-modal-pagination-pic'));
        // Buttons on click
        $('.ei-modal-close').on('click', function (e) {
            sessionStorage.removeItem('itemIndex');
            sessionStorage.removeItem('totalImages');
            sessionStorage.removeItem('group');
            $('.ei-modal').remove();
        });

        // Position of the modal
        $('.ei-modal').css({
            'top': calcModalPos().cY,
            'left': calcModalPos().cX
        });

        $(window).scroll(function () {
            $('.ei-modal').css({
                'top': calcModalPos().cY,
                'left': calcModalPos().cX
            });
        });

        let group = sessionStorage.getItem('group')=="true"?true:false;
        let imageIndex = sessionStorage.getItem('itemIndex')||0;
        if (group==true) {

            $('.ei-modal-picture').find('img')
                                    .addClass('ei-item-hide')
                                    .eq(imageIndex).removeClass('ei-item-hide');

            
            $('.ei-modal-prev').on('click', function (e) {
                eiPagination('prev');
            });
    
            $('.ei-modal-next').on('click', function (e) {
                eiPagination('next');
            });
        }

    }

    // Call for modal images
    $.fn.easyimagesmodal = function() {
        if ($(this).length>0) {
            var $pictureDivs = $(this);
            $pictureDivs.on('click', function(e) {
                let elementClickedIndex = $pictureDivs.index(e.currentTarget);
                let $eiModalPicture = eiModal($pictureDivs.eq(elementClickedIndex));
                $('body').prepend($eiModalPicture);
                modalDisplay();
                
            });
        }
    }

    // Call for gallery images
    $.fn.easyimagesgroup = function () {
        if ($(this).length>0) {
            this.each(function () {
                var $pictureDivs = $(this).find('.ei-picture');
                $pictureDivs.on('click', function(e) {
                    let elementClickedIndex = $pictureDivs.index(e.currentTarget);
                    let $eiModalPicture = eiModal($pictureDivs);
                    $('body').prepend($eiModalPicture);

                    sessionStorage.setItem('group','true');
                    sessionStorage.setItem('itemIndex', elementClickedIndex);
                    sessionStorage.setItem('totalImages', $pictureDivs.length);
                    modalDisplay();
                    
                });
                
            });
        } 
    }

})(jQuery)

jQuery('.easy-images').easyimagesgroup();
jQuery('.easy-images-item').easyimagesmodal();