// change the login/signup link to say 'Hello, user' if the user is logged in
$(document).on('gopaywall:loaded', function () {
    var firstName = window.userobj.user_data.username.replace(/^\s+|\s+$/g, '').split(/\s+/)[0];
    $('.login-profile-link')
        .html($('<span>').text('Hello ' + firstName));

    $('body').addClass('logged-in');
});

// if we're not on the homepage, move the login/signup link to the upper right
$(document).ready(function () {
    if ($('body.homepage').length) {
        return;
    }

    $('.login-profile-link')
        .detach()
        .appendTo($('#siteWrapper'));
});
