// JS for the homepage.
$(document).ready(function () {
    $('.meet-the-founders').on('click', ':not(.sqs-block-code):not(.sqs-block-spacer)', function () {
        window.open('/about-us/', "_blank"); // TODO: add a test for this?
    });

    addDotChainSectionConnectors();

    $(window).on('resize', addDotChainSectionConnectors);

    function addDotChainSectionConnectors() {
        var dotChainWidth = 18;

        var $sectionTitles = $('.section-title');
        $sectionTitles.each(function (index) {
            if (index == 0) {
                return;
            }

            var $sectionStart = $sectionTitles[index - 1],
                $sectionEnd = $(this),
                $dotChainElement = $('#dot-chain-' + index);
            console.log(index);
console.log($sectionStart);
            console.log($sectionEnd);
            // create the dot chain element if it does not already exist
            if (!$dotChainElement.length) {
                $('<div>')
                    .addClass('dot-chain')
                    .attr('id', 'dot-chain-' + index)
                    .appendTo('#siteWrapper');
            }

            // position the dot chain
            var centerX = $sectionStart.offset().left + ($sectionStart.outerWidth() / 2),
                sectionStartBottom = $sectionStart.offset().top + $sectionStart.outerHeight(),
                sectionEndTop = $sectionEnd.offset().top;
            $dotChainElement.css({
                top: sectionStartBottom + 'px',
                left: (centerX - (dotChainWidth / 2)) + 'px',
                bottom: sectionEndTop + 'px',
                right: (centerX + (dotChainWidth / 2)) + 'px'
            });
        });
    }
});
