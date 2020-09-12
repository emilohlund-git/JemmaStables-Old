// When the user scrolls down 80px from the top of the document, change the navbars background to transparent
$(function() {
    $(document).scroll(function() {
        var windowsize = $(window).width();
        if (windowsize > 1300) {
            $("nav").toggleClass(
                "bg-dark",
                $(this).scrollTop() > $("nav").height()
            );
            $(".nav-link").toggleClass(
                "text-white",
                $(this).scrollTop() > $("nav").height()
            );
            $(".navbar-brand").toggleClass(
                "logo-filter",
                $(this).scrollTop() > $("nav").height()
            );
        }
    });
});

$(document).ready(function() {
    $(".dmenu").hover(
        function() {
            $(this).find(".sm-menu").first().stop(true, true).slideDown(150);
        },
        function() {
            $(this).find(".sm-menu").first().stop(true, true).slideUp(105);
        }
    );
    document.getElementById("copyright").innerHTML = "@ " + new Date().getFullYear() + " Copyright: Jemmastables.com | Design av Emil Öhlund";
    $('.first-button').on('click', function() {
        $('.animated-icon1').toggleClass('open');
    });
    //Click event to scroll to top
    $('.back-to-top').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    function overlaps(a, b) {
        const rect1 = a.getBoundingClientRect();
        const rect2 = b.getBoundingClientRect();
        const isInHoriztonalBounds =
            rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
        const isInVerticalBounds =
            rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
        const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
        return isOverlapping;
    }
    $(document).scroll(function() {
        if (document.getElementsByClassName("toast")[0]) {
            if (overlaps(document.getElementsByClassName("site-footer")[0], document.getElementsByClassName("toast")[0])) {
                document.getElementsByClassName("toast")[0].classList.remove("bg-dark");
                document.getElementsByClassName("toast")[0].style.background = "black";
            } else {
                document.getElementsByClassName("toast")[0].classList.add("bg-dark");
                document.getElementsByClassName("toast")[0].style.background = "none";
            }
        }
        if (overlaps(document.getElementsByClassName("site-footer")[0], document.getElementsByClassName("animated-icon1")[0])) {
            $(".animated-icon1 span").css(
                "background", "black",
            );
            $(".navbar-brand").css(
                "opacity", "0",
            );
        } else {
            $(".animated-icon1 span").css(
                "background", "white",
            );
            $(".navbar-brand").css(
                "opacity", "1",
            );
        }
    });
});