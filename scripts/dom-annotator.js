/**
 * This file contains JS that adds classes to squarespace rows/columns based on the location
 * of code blocks added as content. This is currently the only way to reliably styles
 * squarespace layout chunks.
 */

$(document).ready(function () {

    // add the meet-the-founders class to the column containing the .meet-the-founders-bgnd code block
    $('.meet-the-founders-bgnd').closest('.col').addClass('meet-the-founders');

});
