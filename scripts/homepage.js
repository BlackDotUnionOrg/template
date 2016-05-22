// JS for the homepage.
$(document).ready(function () {
    $('.meet-the-founders').on('click', ':not(.sqs-block-code):not(.sqs-block-spacer)', function () {
        window.open('/about-us/', "_blank"); // TODO: add a test for this?
    });

    addDotChainSectionConnectors();
    $(window).on('resize', addDotChainSectionConnectors);

    sizeMembershipOptionBlocks();

    function addDotChainSectionConnectors() {
        var dotChainWidth = 18,
            $siteWrapper = $('#siteWrapper');

        var $sectionTitles = $('.section-title');
        $sectionTitles.each(function (index) {
            if (index == 0) {
                return;
            }

            var $sectionStart = $($sectionTitles[index - 1]),
                $sectionEnd = $(this),
                $dotChainElement = $('#dot-chain-' + index);

            // create the dot chain element if it does not already exist
            if (!$dotChainElement.length) {
                $dotChainElement = $('<div>')
                    .addClass('dot-chain')
                    .attr('id', 'dot-chain-' + index)
                    .appendTo('#siteWrapper');
            }

            // position the dot chain
            var centerX = $sectionStart.offset().left + ($sectionStart.outerWidth() / 2),
                sectionStartBottom = $sectionStart.offset().top + $sectionStart.outerHeight(),
                sectionEndTop = $sectionEnd.offset().top;

            centerX -= $siteWrapper.offset().left;
            sectionStartBottom -= $siteWrapper.offset().top;
            sectionEndTop -= $siteWrapper.offset().top;

            $dotChainElement.css({
                top: sectionStartBottom + 'px',
                left: (centerX - (dotChainWidth / 2)) + 'px',
                height: (sectionEndTop - sectionStartBottom) + 'px',
                width: dotChainWidth + 'px'
            });
        });
    }

    function sizeMembershipOptionBlocks() {
        var $row = $('.membership-options-row'),
            $columns = $row.children()
                .filter(function () {
                    return $(this).find('.sqs-block-html').length > 0;
                });

        var columnsWidth = 0;
        $columns.each(function () {
            columnsWidth += $(this).outerWidth();
        });

        var newColumnsWidth = columnsWidth / $columns.length;
        $columns.each(function () {
            $(this).css('width', columnsWidth).addClass('membership-options-block');
        });
    }
});
