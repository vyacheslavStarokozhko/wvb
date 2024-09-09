(function ($) {
    $(document).ready(function () {
        // var markdownit = require("markdown-it");

        // get element text
        var text = $('#footer-caption').text();
        // modify text
        text = text.replace('@year', new Date().getFullYear());
        // update element text
        $('#footer-caption').text(text);


        $('.markdown').each(function () {
            let text = $(this).text();
            let html = $(this).html(text);
            $(this).find('>*:first-child').unwrap();

        });

        $('.script').each(function () {

            let text = $(this).text();
            let _text = text.replace('<p>', '').replace('</p>', '').replaceAll('&quot;', '"').replaceAll('&gt;', '>').replaceAll('&lt;', '<')

            // let html = $(this).html(_text);
            let html = $.parseHTML(_text);
            console.log(html);


            $(this).text(decodeURI(html));
            $(this).find('>*:first-child').unwrap();

        });

        function InitAccordion() {
            $('.accordion-labels li:first-child .accordion-button,.accordion-contents .accordion-content:first-child').addClass('is-active');
            $('.accordion-button').click(Accordion);
        }

        function Accordion(event) {
            $(`.accordion-content, .accordion-button`).removeClass('is-active');

            let $this = $(event.target);
            let idx = $this.data('idx');

            $(`.accordion-content[data-idx=${idx}], .accordion-button[data-idx=${idx}]`).addClass('is-active');

        }

        function SlideOpenMenu(element){
            element.slideDown();
        }

        function SlideCloseMenu(element){
            setTimeout(()=> {element.slideUp()},0)
        }

        function AccordionMenu(e){

            let $this = $(e.target);
            let menu = $this.next('ul.submenu');
            if (menu.hasClass('is-active')){
                menu.removeClass('is-active')
                SlideCloseMenu(menu);
            }
            else{
                e.preventDefault();
                menu.addClass('is-active')
                SlideOpenMenu(menu)
            }

            if ($this.hasClass('is-active')){
                $this.removeClass('is-active')
            }
            else{
                $this.addClass('is-active')
            }

        }

        function OpenMenu(e) {
            // console.log(e);
            let $this = $(e.target);
            // $this.addClass('is-active');
            $this.closest('li.has-submenu').addClass('is-active');
            $this.find('> ul').addClass('is-active');
            $this.find('+ ul').addClass('is-active');
        }

        function CloseMenu(e) {
            $('ul.submenu').removeClass('is-active');
            $('li.has-submenu').removeClass('is-active');
        }

        function MenuControll() {
            var windowWidth = $(this).width();
            if (windowWidth <= 1201 && windowWidth > 992) {
                $('li.has-submenu').click(OpenMenu)
                $(document).click(function (e) {
                    if ((!$(e.target).hasClass('menu-item'))) {
                        CloseMenu()
                    }
                })
                $('.main-menu').removeClass('mobile-menu');
            } else if (windowWidth <= 992) {
                SlideCloseMenu($('.submenu'));
                SlideCloseMenu($('.main-menu'));

                $(document).off('click')
                $('li.has-submenu').off('hover')
                $('li.has-submenu').off('click')

                $('.main-menu').addClass('mobile-menu');
                $('.link-submenu').click(AccordionMenu);

            } else {
                $('li.has-submenu').hover(OpenMenu, CloseMenu)
                $('.main-menu').removeClass('mobile-menu');
            }
        }





        InitAccordion()
        MenuControll()
        // $(window).resize(MenuControll);

        // $('li.has-submenu').hover(OpenMenu,CloseMenu)
$('.menu-icon').click(function (){
    if ($(this).hasClass('is-active')){
        $(this).removeClass('is-active')
        SlideCloseMenu($('.main-menu'));
    }
    else{
        $(this).addClass('is-active')
        SlideOpenMenu($('.main-menu'));
    }
})


    })
})(jQuery);




