// load diet summary information for use in left sidebar
function load_summary_info(username) {
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
        load_summary_info(USERNAME);
    }
});
