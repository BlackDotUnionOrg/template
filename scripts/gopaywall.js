function gopaywall_loaded() {
    $(document).ready(function () {
        $(document).trigger('gopaywall:loaded');
    });
}
