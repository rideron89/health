var diet_data = [];
var exercise_data = [];

function display_diet_entries() {
    var content_div = $("#content_tabs #diet_content");
    var content = "";
    var entry_div = null;

    diet_data.map(function(value, index, arr) {
        entry_div = document.createElement("DIV");

        content = "<div class=\"calories\">" + value.calories + " calories</div>"
                + "<div class=\"comment\">" + value.comment + "</div>"
                + "<div class=\"date\">" + value.date_logged + "</div>";

        $(entry_div).html(content).addClass("diet_entry");
        $(content_div).append(entry_div);
    });
}

function display_exercise_entries() {
    var content_div = $("#content_tabs #exercise_content");
    var content = "";
    var entry_div = null;

    exercise_data.map(function(value, index, arr) {
        entry_div = document.createElement("DIV");

        content = "<div class=\"calories\">" + value.calories + " calories</div>"
                + "<div class=\"comment\">" + value.comment + "</div>"
                + "<div class=\"date\">" + value.date_logged + "</div>";

        $(entry_div).html(content).addClass("exercise_entry");
        $(content_div).append(entry_div);
    });
}

function load_diet_data(username) {
    $.ajax({
        type: "POST",
        url: "php/user.php?method=get_diet_entries",
        data: {username: username},
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                console.log(data.response);
            } else {
                $.parseJSON(data.response).map(function(value, index, arr) {
                    diet_data.push($.parseJSON(value));
                });
            }
        },
        error: function(xhr, status, errorThrown) {
            console.log(errorThrown);
        },
        complete: function(xhr, status) {
            display_diet_entries();
        }
    });
}

function load_exercise_data(username) {
    $.ajax({
        type: "POST",
        url: "php/user.php?method=get_exercise_entries",
        data: {username: username},
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                console.log(data.response);
            } else {
                $.parseJSON(data.response).map(function(value, index, arr) {
                    exercise_data.push($.parseJSON(value));
                });
            }
        },
        error: function(xhr, status, errorThrown) {
            console.log(errorThrown);
        },
        complete: function(xhr, status) {
            display_exercise_entries();
        }
    });
}

// load diet summary information for use in left sidebar
function load_diet_summary(username) {
    $.ajax({
        type: "POST",
        url: "php/user.php?method=get_user_diet_summary",
        data: {username: username},
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                console.log(data.response);
            } else {
                var diet_box = $("#summary_box #diet_summary");
                var exercise_box = $("#summary_box #exercise_summary");
                var all = $.parseJSON(data.response);
                var diet_info = $.parseJSON(all.diet);
                var exercise_info = $.parseJSON(all.exercise);
                var diet_to_go = diet_info.monthly_quota - diet_info.monthly_total
                var exercise_to_go = exercise_info.monthly_quota - exercise_info.monthly_total

                $(".total", diet_box).html(diet_info.total + " cals");
                $(".monthly_quota", diet_box).html(diet_info.monthly_quota + " cals");
                $(".monthly_total", diet_box).html(diet_info.monthly_total + " cals");
                $(".calories_to_quota", diet_box).html(diet_to_go + " cals");

                $(".total", exercise_box).html(exercise_info.total + " cals");
                $(".monthly_quota", exercise_box).html(exercise_info.monthly_quota + " cals");
                $(".monthly_total", exercise_box).html(exercise_info.monthly_total + " cals");
                $(".calories_to_quota", exercise_box).html(exercise_to_go + " cals");
            }
        },
        error: function(xhr, status, errorThrown) {
            console.log(errorThrown);
        },
        complete: function(xhr, status) {
        }
    });
}

$(document).ready(function() {
    if (USERNAME !== "") {
        load_diet_summary(USERNAME);

        load_diet_data(USERNAME);
        load_exercise_data(USERNAME);
    }
});
