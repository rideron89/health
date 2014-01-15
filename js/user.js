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

    if (diet_data.length < 1) {
        content = "<h5>No Diet data found for you account! Go <a href=\"diet.php\">here</a>"
                + " to add some entries!";
        $(content_div).append(content);
    }
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

    if (exercise_data.length < 1) {
        content = "<h5>No exercise data found for you account! Go <a href=\"exercise.php\">here</a>"
                + " to add some entries!";
        $(content_div).append(content);
    }
}

function load_tables(type, json) {
    var options = {
        series: {
            lines: {show: true, fill: true, fillColor: "rgba(0, 0, 0, 0.8)" },
            points: {show: true, fill: false}
        }
    };

    //var data = [[0,0], [0,1], [1,0], [1,1]];
    var data = [["January", 7500], ["February", 6800], ["March", 7800]];

    if (type === "diet") {
        $.plot($("#diet_placeholder"), data, options);
    } else if (type === "exercise") {
        $.plot($("#exercise_placeholder"), data, options);
    }
}

function create_tables(type) {
    var json = [];
    var months = [];
    var calories = [];
    var month = "";

    diet_data.map(function(value, index, arr) {
        month = value.date_logged.slice(0, 7);
        if (months.indexOf(month) === -1) {
            months.push(month);
            calories.push(0);
        }

        calories[months.indexOf(month)] += parseInt(value.calories);

    });

    months.map(function(value, index, arr) {
        json.push({
            month: value,
            calories: calories[index]
        });
    });

    load_tables(type, json);
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
            create_tables("diet");
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
            create_tables("exercise");
        }
    });
}

$(document).ready(function() {
    if (USERNAME !== "") {
        load_diet_data(USERNAME);
        load_exercise_data(USERNAME);
    }
});
