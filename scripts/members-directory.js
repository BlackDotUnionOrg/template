var MEMBERS_DIR_TEST = true;
if (MEMBERS_DIR_TEST) {
    window.userobj = {
        "userid":"9999",
        "membership_id":"8888",
        "user_data":{
            "username":"blackdotunion",
            "email":"blackdotunion@gmail.comm",
            "name":"Some One",
            "last_login":"2016-04-03 15:07:08",
            "avatar":"\/\/gopaywall.com\/uploads\/",
            "country":"US"
        }
    };

    gopaywall_loaded();
}

function gopaywall_loaded() {
    $(document).ready(function () {
        if (!$('#members-directory').length) {
            return; // this is not the members page, so do nothing
        }

        setUpMembersDirectory();
    });

    function setUpMembersDirectory() {
        var memberSortCompares = {
            name: function (a, b) {
                return compareValues(a.name, b.name);
            },

            profession_or_company: function (a, b) {
                return compareValues(a.professional_title, b.professional_title);
            },

            // NOTE: for these two sorts, we can't get the membership timestamp from gopaywall, so
            // we sort by membership_id. hopefully, this won't cause inaccuracies.
            newest_first: function (a, b) {
                return compareValues(a.membership_id, b.membership_id);
            },

            oldest_first: function (a, b) {
                return compareValues(b.membership_id, a.membership_id);
            }
        };

        var allMembers,
            displayedMembers;

        initMembersDirectoryOuterTemplate();
        getMembersData(initializeMembersPage);
        setCurrentUserName();

        function initMembersDirectoryOuterTemplate() {
            var template = '<div id="member-filters">'
            + '    <div id="sort-by-filter">'
            + '        <label>Sort by:</label>'
            + '        <select id="member-sort">'
            + '            <option value="newest_first" selected>Newest first</option>'
            + '            <option value="oldest_first">Oldest first</option>'
            + '            <option value="name">Sort by name</option>'
            + '            <option value="profession_or_company">Sort by profession or company</option>'
            + '        </select>'
            + '    </div>'
            + ''
            + '    <div id="search-filter">'
            + '        <label>Search:</label>'
            + '        <input type="text" placeholder="search for a name, skill or interest"/>'
            + '        <button>Search</button>'
            + '    </div>'
            + ''
            + '    <div id="views-filter">'
            + '        <label>View as:</label>'
            + '        <div class="view-filter-icon" data-filter-type="list"></div>'
            + '        <div class="view-filter-icon" data-filter-type="cards"></div>'
            + '    </div>'
            + '</div>'
            + ''
            + '<div id="members" class="membership-card-view">'
            + '    <div class="loading-container">'
            + '        <img src="/assets/images/loading.svg"/>'
            + '    </div>'
            + '</div>';

            var output = Mustache.render(template, {});
            $('#members-directory').html(output);
        }

        function setCurrentUserName() {
            var firstName = userobj.user_data.name.split(/\s+/)[0];
            $('.current-user-fname').each(function () {
                $(this).text(firstName);
            });
        }

        function initializeMembersPage(allData) {
            allMembers = allData;
            displayedMembers = [].concat(allMembers);

            initFilterIconSelection();
            normalizeMembersData(allMembers);

            handleMemberSortChange(); // will sort & render the first time

            $('.view-filter-icon').click(handleViewFilterIconClick);

            $('#search-filter > input').keypress(function (e) {
                if (e.which != 13) {
                    return;
                }

                handleSearchFilterExecute();
                return false;
            });
            $('#search-filter > button').click(handleSearchFilterExecute);

            $('#member-sort').change(handleMemberSortChange);

            $('body').on('click', '#members[data-filter-type=list] .member', launchMemberCardModal);
        }

        function getMembersData(callback) {
            var blackDotServerHost = 'https://blackdot-server.herokuapp.com/',
                params = {};

            if (MEMBERS_DIR_TEST) {
                params.test = 1;
            } else {
                params.user = userobj.user_data.username;
                params.auth_key = makeAuthKey();
            }

            $.ajax({
                url: blackDotServerHost,
                data: params,
                dataType: "json",
                success: callback,
                error: function () {
                    // TODO: better error message?
                    $('#members > .loading-container')
                    .text("Sorry, but the members directory is unavailable right now!");
                }
            });
        }

        function makeAuthKey() {
            var minute = (new Date()).getMinute(),
                // TODO: should have test in case gopaywall changes how this info is structured
                body = [
                    userobj.user_data.email,
                    userobj.user_data.name,
                    userobj.userid,
                    userobj.membership_id
                ].join(':');

            return CryptoJS.HmacSHA1(body, userobj.user_data.last_login + minute);
        }

        function initFilterIconSelection() {
            var filterType = $('#members').attr('data-filter-type') || 'cards';
            $('.view-filter-icon[data-filter-type="' + filterType + '"]')
            .addClass('selected');
        }

        function renderMembersList() {
            var template = '{{#members}}'
            + '<div class="member">'
            + '    <div class="member-info">'
            + '        <h2 class="name">{{ name }}</h2>'
            + '        <h2 class="title">{{ professional_title }}</h2>'
            + ''
            + '        <p class="description">{{ description }}</p>'
            + ''
            + '        <section class="skills">'
            + '            <h2>Skills</h2>'
            + ''
            + '            <ul>'
            + '                {{#skills}}'
            + '                <li>{{.}}</li>'
            + '                {{/skills}}'
            + '            </ul>'
            + '        </section>'
            + ''
            + '        <section class="interests">'
            + '            <h2>Interests</h2>'
            + ''
            + '            <ul>'
            + '                {{#interests}}'
            + '                <li>{{.}}</li>'
            + '                {{/interests}}'
            + '            </ul>'
            + '        </section>'
            + '    </div>'
            + ''
            + '    <div class="contact-info">'
            + '        <ul class="social-media">'
            + '            {{#twitter}}<li><a href="{{.}}" class="twitter-link" target="_blank"></a></li>{{/twitter}}'
            + '            {{#facebook}}<li><a href="{{.}}" class="facebook-link" target="_blank"></a></li>{{/facebook}}'
            + '            {{#instagram}}<li><a href="{{.}}" class="instagram-link" target="_blank"></a></li>{{/instagram}}'
            + '            {{#linkedin}}<li><a href="{{.}}" class="linkedin-link" target="_blank"></a></li>{{/linkedin}}'
            + '        </ul>'
            + ''
            + '        <h4 class="phone-number">{{ phone_number }}</h4>'
            + ''
            + '        <h4 class="email">{{ email }}</h4>'
            + ''
            + '        <ul class="websites">'
            + '            {{#websites}}'
            + '            <li><a href="{{url}}" target="_blank"><h4>{{label}}</h4></a></li>'
            + '            {{/websites}}'
            + '        </ul>'
            + ''
            + '        <div class="avatar">'
            + '            <img src="{{ avatar }}" />'
            + '        </div>'
            + '    </div>'
            + '</div>'
            + '{{/members}}';

            var output = Mustache.render(template, {members: displayedMembers});
            $('#members').html(output);
        }

        function normalizeMembersData(data) {
            var protocolStartRegex = /^[a-zA-Z]+:/,
                doubleSlashStartRegex = /^\/\//;

            data.forEach(function (member) {
                var link = document.createElement('a');

                // set whole name
                member.name = member.first_name + " " + member.middle_name + " " + member.last_name;
                member.name = member.name.replace(/ +/g, ' ');

                // normalize URLs and pair each w/ a more readable label
                member.websites = member.websites.map(function (urlEntry) {
                    var url = urlEntry;
                    if (!protocolStartRegex.test(urlEntry)) {
                        var prefix = doubleSlashStartRegex.test(urlEntry) ? 'http:' : 'http://';
                        url = prefix + urlEntry;
                    }

                    link.href = url;

                    // link.hostname will sometimes change the case of the URL host,
                    // so instead we look for the host in the original URL
                    var hostStart = urlEntry.toLowerCase().indexOf(link.hostname.toLowerCase()),
                        label = urlEntry.substring(hostStart, hostStart + link.hostname.length);

                    return {
                        url: url,
                        label: label
                    };
                });

                // if the phone number looks like a US number (has 10 digits), normalize it
                var phoneNumberDigits = member.phone_number.replace(/[^0-9]/g, '');
                if (phoneNumberDigits.length == 10) {
                    member.phone_number = "(" + phoneNumberDigits.substring(0, 3) + ")\u00a0"
                    + phoneNumberDigits.substring(3, 6) + "\u00a0-\u00a0"
                    + phoneNumberDigits.substring(6, 10);
                }
            });
        }

        function handleViewFilterIconClick() {
            $('.view-filter-icon').removeClass('selected');

            $(this).addClass('selected');

            var filterType = $(this).attr('data-filter-type');
            $('#members').attr('data-filter-type', filterType);
        }

        function handleSearchFilterExecute() {
            var searchTerm = $('#search-filter > input').val().toLowerCase();
            displayedMembers = allMembers.filter(function (member) {
                if (member.name.toLowerCase().indexOf(searchTerm) != -1) {
                    return true;
                }

                if (member.professional_title.toLowerCase().indexOf(searchTerm) != -1) {
                    return true;
                }

                var hasSkill = member.skills.some(function (skill) {
                    return skill.toLowerCase().indexOf(searchTerm) != -1;
                });
                if (hasSkill) {
                    return true;
                }

                var hasInterest = member.interests.some(function (interest) {
                    return interest.toLowerCase().indexOf(searchTerm) != -1;
                });
                if (hasInterest) {
                    return true;
                }

                return false;
            });

            renderMembersList();
        }

        function handleMemberSortChange() {
            var compareValue = $('#member-sort').val(),
                compareFunction = memberSortCompares[compareValue];
            if (!compareFunction) {
                console.error("Unexpected error: Unknown member comparison function: " + compareValue);
                return;
            }

            displayedMembers.sort(compareFunction);

            renderMembersList();
        }

        // launches full card modal when the list view is clicked
        function launchMemberCardModal(event) {
            var $target = $(event.target);
            if ($target.is('a')) {
                return;
            }

            $target.closest('.member').clone().remodal().open();
        }

        // utility functions
        function compareValues(a, b) {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}
