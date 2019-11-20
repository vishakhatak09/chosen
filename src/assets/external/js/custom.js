$(document).ready(function() {

    $('.go-top').click(function() {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    });
    $('.rate-owl').owlCarousel({
        loop: false,
        margin: 10,
        nav: true,
        items: 3,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 1,
            },
            800: {
                items: 2,
            },
            1200: {
                items: 3,
            }
        }
    });
    $('.how-work-owl').owlCarousel({
        loop: false,
        margin: 0,
        nav: false,
        dots: true,
        items: 1,
    })
    AOS.init();


    $(document).on("scroll", onScroll);

    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        $(document).off("scroll");

        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - 70
        }, 900, 'swing', function() {
            $(document).on("scroll", onScroll);
            // $(menu).addClass('active');
        });
        $('.menu a').each(function() {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
    });

    function onScroll(event) {
        var scrollPos = $(document).scrollTop() + 140;
        $('.menu a').each(function() {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            console.log(currLink.attr("href"), refElement.position().top)

            console.log('scrollPos', scrollPos)
            console.log('refElement.height()', refElement.height())
            if ((refElement.position().top) <= scrollPos && (refElement.position().top) + refElement.height() > scrollPos) {
                $('.menu a').removeClass("active");
                currLink.addClass("active");
                $(scrollPos).addClass("active");
            } else {
                currLink.removeClass("active");
            }
        });
    }
})

$(window).scroll(function(event) {
    var scroll = $(window).scrollTop();
    if ($(this).scrollTop() >= 50) {
        $('.go-top').fadeIn(200);
    } else {
        $('.go-top').fadeOut(200);
    }
});