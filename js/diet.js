var diet_data = [];

function display_diet_entries() {
    var content_div = $("#diet_entry_list");
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

function reload_diet_entries(username, password) {
    $.ajax({
        type: "POST",
        url: "php/user.php?method=get_diet_entries",
        data: {username: username, limit: 25},
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

function add_diet_entry(username, password, calories, comment) {
    $.ajax({
        type: "POST",
        url: "php/diet.php?method=add_diet_entry",
        data: {username: username, password: password, calories: calories, comment: comment},
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                $("#diet_entry_form .info_message").html(data.response);
            } else {
                reload_diet_entries(username, password);
            }
        },
        error: function(xhr, status, errorThrown) {
            $("#diet_entry_form .info_message").html(errorThrown);
            console.log(errorThrown);
        },
        complete: function(xhr, status) {
        }
    });
}

function validate_diet_entry_form(username, password) {
    var calories = 0;
    var comment = "";

    calories = parseInt($("#diet_entry_form .calories").val());
    comment = $("#diet_entry_form .comment").val();

    if (isNaN(calories)) {
        $("#diet_entry_form .info_message").html("You must enter a valid number.");
        $("#diet_entry_form .calories").addClass("error");
        return false;
    } else if (calories < 1) {
        $("#diet_entry_form .info_message").html("You must enter a positive number.");
        $("#diet_entry_form .calories").addClass("error");
        return false;
    } else {
        $("#diet_entry_form .info_message").html("");
        $("#diet_entry_form .calories").removeClass("error");
    }

    add_diet_entry(username, password, calories, comment);
}

$(document).ready(function() {
    if (USERNAME !== "") {
        $("#diet_entry_form .submit").click(function(e) {
            e.preventDefault();
            validate_diet_entry_form(USERNAME, PASSWORD);
        });

        reload_diet_entries(USERNAME, PASSWORD);
    }
});
