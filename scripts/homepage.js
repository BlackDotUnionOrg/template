// JS for the homepage.
$(document).ready(function () {
    $('.meet-the-founders').on('click', ':not(.sqs-block-code):not(.sqs-block-spacer)', function () {
        window.open('/about-us/', "_blank"); // TODO: add a test for this?
    });
});
