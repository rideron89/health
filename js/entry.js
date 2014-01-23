var entry_data = [];
var total_calories = 0;
var monthly_calories = 0;

/**
 * Ask the backend for the total number of calories logged by this
 * user, not restricted by any month or year.
 *
 * @return {boolean} <b>false</b> if the url could not be validated,
 * <b>null</b> otherwise.
 */
function get_total_calories() {
    var url = "";

    // use the id of the summary table to determine whether we're talking diet or exercise
    if ($(".quota_summary_table").attr("id").indexOf("diet") !== -1) {
        url = "php/diet.php?method=get_total_calories";
    } else if ($(".quota_summary_table").attr("id").indexOf("exercise") !== -1) {
        url = "php/exercise.php?method=get_total_calories";
    } else {
        return false;
    }

    $.ajax({
        type: "POST",
        url: url,
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

/**
 * Ask the backend for details on the logs for this current month.
 * This method will ask for and display the user's quota and total
 * calories logged for the month.
 *
 * @return {boolean} <b>false</b> if the url could not be validated,
 * <b>null</b> otherwise.
 */
function get_monthly_calories() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var url = "";

    // ensure the 'month' is complete (01-12)
    if (String.valueOf(month).length == 1) {
        month = "0" + month;
    }

    // use the id of the summary table to determine whether we're talking diet or exercise
    if ($(".quota_summary_table").attr("id").indexOf("diet") !== -1) {
        url = "php/diet.php?method=get_monthly_calories";
    } else if ($(".quota_summary_table").attr("id").indexOf("exercise") !== -1) {
        url = "php/exercise.php?method=get_monthly_calories";
    } else {
        return false;
    }

    $.ajax({
        type: "POST",
        url: url,
        data: {username: USERNAME, month: year + "-" + month},
        beforeSend: function(xhr, settings) {
            $(".quota_summary_table .monthly_quota .calories").html("<img src=\"css/images/loader.gif\" />");
            $(".quota_summary_table .monthly_total .calories").html("<img src=\"css/images/loader.gif\" />");
        },
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                console.log(data.response);
                $(".quota_summary_table .monthly_quota .calories").html("-");
                $(".quota_summary_table .monthly_total .calories").html("-");
                $(".quota_summary_table .calories_togo .calories").html("-");
            } else {
                var quota = data.response.quota;
                var total = data.response.total;

                monthly_diet_calories = data.response;

                $(".quota_summary_table .monthly_quota .calories").html(quota);
                $(".quota_summary_table .monthly_total .calories").html(total);
                $(".quota_summary_table .calories_togo .calories").html(quota - total);
            }
        },
        error: function(xhr, status, errorThrown) {
            console.log(errorThrown);
            $(".quota_summary_table .monthly_quota .calories").html("-");
            $(".quota_summary_table .monthly_total .calories").html("-");
            $(".quota_summary_table .calories_togo .calories").html("-");
        },
        complete: function(xhr, status) {
        }
    });
}

/**
 * Sends a request to the backend to delete an entry. If that entry
 * was successfully deleted, remove the entry div from the entry list.
 * Make sure to prompt the user before deleting.
 *
 * @param {object} the delete button DOM element that was pressed.
 *
 * @return {boolean} <b>false</b> if there was an error validating the url,
 * or the user clicked 'Cancel' from the prompt. <b>null</b> otherwise.
 */
function delete_entry(delete_elem) {
    var id = $(delete_elem).children("input[type=button]").data("id");
    var url = "";

    // use the className of the entry div to determine whether we're talking diet or exercise
    if ($(delete_elem).parent(".entry").hasClass("diet_entry") == true) {
        url = "php/diet.php?method=delete_diet_entry";
    } else if ($(delete_elem).parent(".entry").hasClass("exercise_entry") == true) {
        url = "php/exercise.php?method=delete_exercise_entry";
    } else {
        return false;
    }

    if (confirm("Are you sure you wish to delete this entry?") == false) {
        return false;
    }

    $.ajax({
        type: "POST",
        url: url,
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
                $(delete_elem).parent(".entry").hide(
                    125,
                    function() {
                        $(delete_elem).parent(".entry").remove();
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

/**
 * Insert an entry div containing the input to the top of the
 * entry list. Entries are expected to be retrieved in ASCending
 * order, so we use $.prepend() when adding the div.
 *
 * @param {object} input should have members <i>calories</i>,
 * <i>comment</i>, <i>date_logged<i>, <i>id</i>.
 *
 * @return {null} Always returns <b>null</b>.
 */
function add_entry_div(input) {
    var content_div = $(".entry_list");
    var content = "";
    var entry_div = null;

    entry_div = document.createElement("DIV");

    content = "<div class=\"calories\">" + input.calories + " calories</div>"
            + "<div class=\"comment\">" + input.comment + "</div>"
            + "<div class=\"date\">" + input.date_logged + "</div>"
            + "<div class=\"delete\">"
            + "<input type=\"button\" data-id=\"" + input.id + "\" value=\"Delete Entry\" />"
            + "</div>";

    // use the id of the entry form to determine whether we're talking diet or exercise
    if ($(content_div).attr("id").indexOf("diet") !== -1) {
        $(entry_div).html(content).addClass("diet_entry").addClass("entry");
    } else if ($(content_div).attr("id").indexOf("exercise") !== -1) {
        $(entry_div).html(content).addClass("exercise_entry").addClass("entry");
    }

    // we get the entries in ASCending order, to we need to add the entry to the to of the list
    $(content_div).prepend(entry_div);

    // add functionality to the delete button in this entry
    $(entry_div).children(".delete").click(function(e) {
        e.preventDefault();
        delete_entry($(this));
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
}

/**
 * Ask the backend for the last 25 entries, using the entry form id
 * to determine whether we want diet or exercise data. Store this
 * data in a global variable for later use.
 *
 * @return {boolean} <b>false</b> if the POST url could not be
 * validated. <b>null</b> otherwise.
 */
function load_entry_data() {
    var url = "";

    // use the id of the entry form to determine whether we're talking diet or exercise
    if ($(".entry_form").attr("id").indexOf("diet") !== -1) {
        url = "php/user.php?method=get_diet_entries";
    } else if ($(".entry_form").attr("id").indexOf("exercise") !== -1) {
        url = "php/user.php?method=get_exercise_entries";
    } else {
        return false;
    }

    $.ajax({
        type: "POST",
        url: url,
        data: {username: USERNAME, limit: 25},
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                console.log(data.response);
            } else {
                // empty the existing entry data
                entry_data = [];

                $.parseJSON(data.response).map(function(value, index, arr) {
                    entry_data.push($.parseJSON(value));
                    add_entry_div($.parseJSON(value));
                });
            }
        },
        error: function(xhr, status, errorThrown) {
            console.log(errorThrown);
        },
        complete: function(xhr, status) {
        }
    });
}

/**
 * Send entry to the backend to add to the database. If
 * there are any problems along the way, <b>false</b> will
 * be returned.
 *
 * @param {object} input should be an object with members
 * <i>calories</i> and <i>comment</i>.
 *
 * @return {boolean} <b>false</b> if an error occurs before
 * sending to the backend. <b>null</b> otherwise.
 */
function add_entry(input) {
    var url = "";

    // use the id of the entry form to determine whether we're talking diet or exercise
    if ($(".entry_form").attr("id").indexOf("diet") !== -1) {
        url = "php/diet.php?method=add_diet_entry";
    } else if ($(".entry_form").attr("id").indexOf("exercise") !== -1) {
        url = "php/exercise.php?method=add_exercise_entry";
    } else {
        return false;
    }

    // I pity the fool who gives me bad input!
    if (input.calories == null || input.comment == null) {
        return false;
    }

    $.ajax({
        type: "POST",
        url: url,
        data: $.extend({username: USERNAME, password: PASSWORD}, input),
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                $(".entry_form .info_message").html(data.response);
            } else {
                $(".entry_form input[type!=button]").val("");
            }
        },
        error: function(xhr, status, errorThrown) {
            $(".entry_form .info_message").html(errorThrown);
            console.log(errorThrown);
        },
        complete: function(xhr, status) {
        }
    });
}

/**
 * Checks the entry form inputs to ensure valid values
 * are given. If not, <b>null</b> is returned and an
 * error message is displayed in the corresponding
 * .info_message element.
 *
 * @return {object} <b>null</b> if invalid input was
 * detected. Otherwise, return on object with members
 * <i>calories</i> and <i>comment</i>.
 */
function validate_entry_form() {
    var calories = 0;
    var comment = "";

    calories = parseInt($(".entry_form .calories").val());
    comment = $(".entry_form .comment").val();

    if (isNaN(calories)) { // user entered a non-integer value in calories
        $(".entry_form .info_message").html("You must enter a valid number.");
        $(".entry_form .calories").addClass("error");
        return null;
    } else if (calories < 1) { // user entered 0 or negative number in calories
        $(".entry_form .info_message").html("You must enter a positive number.");
        $(".entry_form .calories").addClass("error");
        return null;
    } else { // user actually obeyed the rules!
        $(".entry_form .info_message").html("");
        $(".entry_form .calories").removeClass("error");
    }

    return {"calories": calories, "comment": comment};
}

$(document).ready(function() {
    if (USERNAME !== "") {
        // entry form text/number inputs will submit onEnter
        $(".entry_form input[type!=button]").keypress(function(e) {
            if (e.keyCode === 13) {
                var input = validate_entry_form();

                if (input != null) {
                    add_entry(input);
                }
            }
        });

        // entry form button will submit onClick
        $(".entry_form .submit").click(function(e) {
            var input = validate_entry_form();

            if (input != null) {
                add_entry(input);
            }
        });

        get_total_calories();
        get_monthly_calories();

        // this will load the entry data and add the necessary entry divs
        load_entry_data();

        /*
        get_total_calories();
        get_monthly_calories();
        */
    }
});