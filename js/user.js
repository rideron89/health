// load diet summary information for use in
// left sidebar
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
                var all = $.parseJSON(data.response);
                var diet_info = $.parseJSON(all.diet);
                var exercise_info = $.parseJSON(all.exercise);

                $("#summary_box #diet_summary .total").html(diet_info.total);
                $("#summary_box #diet_summary .monthly_quota").html(diet_info.monthly_quota);
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
    load_diet_summary(USERNAME);
});
