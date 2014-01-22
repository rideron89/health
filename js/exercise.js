var exercise_data = [];
var total_exercise_calories = 0;
var monthly_exercise_calories = 0;

function delete_exercise_entry(delete_elem) {
    var id = $(delete_elem).children("input[type=button]").data("id");

    if (confirm("Are you sure you wish to delete this entry?") == false) {
        return false;
    }

    $.ajax({
        type: "POST",
        url: "php/exercise.php?method=delete_exercise_entry",
        data: {username: USERNAME, password: PASSWORD, id: id},
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                console.log(data.response);
            } else {
                $(delete_elem).parent(".exercise_entry").hide(
                    125,
                    function() {
                        $(delete_elem).parent(".exercise_entry").remove();
                    }
                );
            }
        },
        error: function(xhr, status, errorThrown) {
            console.log(errorThrown);
        },
        complete: function(xhr, status) {
        }
    });
}

function display_exercise_entries() {
    var content_div = $("#exercise_entry_list");
    var content = "";
    var entry_div = null;

    exercise_data.map(function(value, index, arr) {
        entry_div = document.createElement("DIV");

        content = "<div class=\"calories\">" + value.calories + " calories</div>"
                + "<div class=\"comment\">" + value.comment + "</div>"
                + "<div class=\"date\">" + value.date_logged + "</div>"
                + "<div class=\"delete\">"
                + "<input type=\"button\" data-id=\"" + value.id + "\" value=\"Delete Entry\" />"
                + "</div>";

        $(entry_div).html(content).addClass("exercise_entry");
        $(content_div).append(entry_div);

        $(entry_div).children(".delete").click(function(e) {
            e.preventDefault();
            delete_exercise_entry($(this));
        });
        
        // when this entry is hovered, toggle the delete button
        $(entry_div).hover(
            function(e) {
                $(this).children(".delete").show(125);
            },
            function(e) {
                $(this).children(".delete").hide(125);
            }
        );
    });
}

function reload_exercise_entries(username, password) {
    $.ajax({
        type: "POST",
        url: "php/user.php?method=get_exercise_entries",
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

function add_exercise_entry(username, password, calories, comment) {
    $.ajax({
        type: "POST",
        url: "php/exercise.php?method=add_exercise_entry",
        data: {username: username, password: password, calories: calories, comment: comment},
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                $("#exercise_entry_form .info_message").html(data.response);
            } else {
                reload_exercise_entries(username, password);
                $("#exercise_entry_form input[type!=button]").val("");
            }
        },
        error: function(xhr, status, errorThrown) {
            $("#exercise_entry_form .info_message").html(errorThrown);
            console.log(errorThrown);
        },
        complete: function(xhr, status) {
        }
    });
}

function get_monthly_calories() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;

    // ensure the 'month' is complete (01-12)
    if (String.valueOf(month).length == 1) {
        month = "0" + month;
    }

    $.ajax({
        type: "POST",
        url: "php/exercise.php?method=get_monthly_calories",
        data: {username: USERNAME, month: year + "-" + month},
        beforeSend: function(xhr, settings) {
            $("#exercise_table .monthly_quota .calories").html("<img src=\"css/images/loader.gif\" />");
            $("#exercise_table .monthly_total .calories").html("<img src=\"css/images/loader.gif\" />");
        },
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                console.log(data.response);
                $("#exercise_table .monthly_quota .calories").html("-");
                $("#exercise_table .monthly_total .calories").html("-");
                $("#exercise_table .calories_togo .calories").html("-");
            } else {
                var quota = data.response.quota;
                var total = data.response.total;

                monthly_exercise_calories = data.response;

                $("#exercise_table .monthly_quota .calories").html(quota);
                $("#exercise_table .monthly_total .calories").html(total);
                $("#exercise_table .calories_togo .calories").html(quota - total);
            }
        },
        error: function(xhr, status, errorThrown) {
            console.log(errorThrown);
            $("#exercise_table .monthly_quota .calories").html("-");
            $("#exercise_table .monthly_total .calories").html("-");
            $("#exercise_table .calories_togo .calories").html("-");
        },
        complete: function(xhr, status) {
        }
    });
}

function get_total_calories() {
    $.ajax({
        type: "POST",
        url: "php/exercise.php?method=get_total_calories",
        data: {username: USERNAME},
        beforeSend: function(xhr, settings) {
            $("#total_calories h3").html("<img src=\"css/images/loader.gif\" />");
        },
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                console.log(data.response);
                $("#total_calories h3").html("-");
            } else {
                total_diet_calories = data.response;
                $("#total_calories h3").html(data.response);
            }
        },
        error: function(xhr, status, errorThrown) {
            console.log(errorThrown);
            $("#total_calories h3").html("-");
        },
        complete: function(xhr, status) {
        }
    });
}

function validate_exercise_entry_form(username, password) {
    var calories = 0;
    var comment = "";

    calories = parseInt($("#exercise_entry_form .calories").val());
    comment = $("#exercise_entry_form .comment").val();

    if (isNaN(calories)) {
        $("#exercise_entry_form .info_message").html("You must enter a valid number.");
        $("#exercise_entry_form .calories").addClass("error");
        return false;
    } else if (calories < 1) {
        $("#exercise_entry_form .info_message").html("You must enter a positive number.");
        $("#exercise_entry_form .calories").addClass("error");
        return false;
    } else {
        $("#exercise_entry_form .info_message").html("");
        $("#exercise_entry_form .calories").removeClass("error");
    }

    add_exercise_entry(username, password, calories, comment);
}

$(document).ready(function() {
    if (USERNAME !== "") {
        $("#exercise_entry_form input[type!=button]").keypress(function(e) {
            if (e.keyCode === 13) {
                validate_exercise_entry_form(USERNAME, PASSWORD);
            }
        });

        $("#exercise_entry_form .submit").click(function(e) {
            e.preventDefault();
            validate_exercise_entry_form(USERNAME, PASSWORD);
        });

        get_total_calories();
        get_monthly_calories();
        reload_exercise_entries(USERNAME, PASSWORD);
    }
});
