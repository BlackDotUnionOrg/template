$(document).on('gopaywall:loaded', function () {
    var firstName = window.userobj.user_data.username.replace(/^\s+|\s+$/g, '').split(/\s+/)[0];
    $('.login-profile-link').html($('<p>').text('Hello ' + firstName));
});
