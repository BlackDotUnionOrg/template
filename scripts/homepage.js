// JS for the homepage.
$(document).ready(function () {
    $('.meet-the-founders').on('click', ':not(.sqs-block-code):not(.sqs-block-spacer)', function () {
        window.location = '/about-us/'; // TODO: add a test for this?
    });
});
