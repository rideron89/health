function validate_new_user() {
    var box_elem = $("#create_account_box");
    var verified = true;

    // go through all inputs excluding the final button
    // if a required field is not set, display a message
    $(box_elem).children("input[type!=button]").each(function () {
        if ($(this).hasClass("optional") === false && $(this).val() === "") {
            $(this).addClass("error");
            verified = false;
            $(box_elem).children(".info_message").html("Some required fields aren't set.");
        } else {
            $(this).removeClass("error");
            $(box_elem).children(".info_message").html("");
        }
    });

    // if a required field is not set, do not go any further
    if (verified === false) return false;

    var user = $(box_elem).children(".user").val();
    var pass = $(box_elem).children(".pass").val();
    var pass_confirm = $(box_elem).children(".pass_confirm").val();
    var email = $(box_elem).children(".email").val();
    var email_confirm = $(box_elem).children(".email_confirm").val();
    var first_name = $(box_elem).children(".first_name").val();
    var last_name = $(box_elem).children(".last_name").val();
    var dob = $(box_elem).children(".dob").val();

    // check to make sure the passwords match
    if (pass !== pass_confirm) {
        $(box_elem).children(".pass, .pass_confirm").addClass("error");
        $(box_elem).children(".info_message").html("Passwords do not match.");
        return false;
    } else {
        $(box_elem).children(".pass, .pass_confirm").removeClass("error");
    }

    // check to make sure the emails match
    if (email !== email_confirm) {
        $(box_elem).children(".email, .email_confirm").addClass("error");
        $(box_elem).children(".info_message").html("Email addresses do not match.");
        return false;
    } else {
        $(box_elem).children(".email, .email_confirm").removeClass("error");
    }


    // check for valid username
    if (user.match(/[^a-zA-Z0-9_]/g) !== null) {
        $(box_elem).children(".user").addClass("error");
        $(box_elem).children(".info_message").html("Username has invalid characters.");
        return false;
    } else if (user.length < 4) {
        $(box_elem).children(".user").addClass("error");
        $(box_elem).children(".info_message").html("Username must have at least 4 characters.");
        return false;
    } else {
        $(box_elem).children(".user").removeClass("error");
    }


    // check for valid passwords
    if (pass.match(/[^a-z]/g) !== null) {
        $(box_elem).children(".pass, .pass_confirm").addClass("error");
        $(box_elem).children(".info_message").html("Password has invalid characters.");
        return false;
    } else if (pass.length < 4) {
        $(box_elem).children(".pass, .pass_confirm").addClass("error");
        $(box_elem).children(".info_message").html("Password must have at least 4 characters.");
        return false;
    } else {
        $(box_elem).children(".pass, .pass_confirm").removeClass("error");
    }
    

    // check for valid email addresses
    if (email.match(/.*@.*\..*/g) === null) {
        $(box_elem).children(".email, .email_confirm").addClass("error");
        $(box_elem).children(".info_message").html("Email address is not valid.");
        return false;
    } else {
        $(box_elem).children(".email, .email_confirm").removeClass("error");
    }

    if (verified === true) {
        var user_data = {
            "user": user,
            "pass": pass,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "dob": dob
        };

        $(box_elem).children(".info_message").html("Creating account...");

        $.ajax({
            type:"POST",
            url: "php/account.php?method=create_account",
            data: user_data,
            success: function(data, status, xhr) {
                try {
                    data = $.parseJSON(data);
                } catch (e) {
                    data = {"error": true, "response": data};
                }

                if (data.error === true) {
                    $(box_elem).children(".info_message").html(data.response);
                } else {
                    $(box_elem).children(".info_message").html("Account created!");
                }
            },
            error: function(xhr, status, errorThrown) {
                console.log(errorThrown);
            },
            complete: function(xhr, status) {
            }
        });
    }
}

function validate_login() {
    var box_elem = $("#login_box");
    var user = $(box_elem).children(".user").val();
    var pass = $(box_elem).children(".pass").val();

    if (user === "") {
        $(box_elem).children(".user").addClass("error");
        $(box_elem).children(".info_message").html("Username is empty.");
        return false;
    } else {
        $(box_elem).children(".user").removeClass("error");
    }

    if (pass === "") {
        $(box_elem).children(".pass").addClass("error");
        $(box_elem).children(".info_message").html("Password is empty");
        return false;
    } else {
        $(box_elem).children(".pass").removeClass("error");
    }

    var user_data = {"user": user, "pass": pass};

    $(box_elem).children(".info_message").html("Logging in...");

    $.ajax({
        type: "POST",
        url: "php/account.php?method=login",
        data: user_data,
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                $(box_elem).children(".info_message").html(data.response);
            } else {
                console.log(data);
                $(box_elem).children(".info_message").html("Logged in!");
            }
        },
        error: function(xhr, status, errorThrown) {
            console.log(errorThrown);
        },
        complete: function(xhr, status) {
        }
    });
    return false;

    $.ajax({
        type: "POST",
        url: "php/account.php",
        data: $.extend({"method": "login"}, data),
        success: function(data, status, xhr) {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {"error": true, "response": data};
            }

            if (data.error === true) {
                $(box_elem).children(".info_message").html(data.response);
            } else {
                console.log(data);
                $(box_elem).children(".info_message").html("Logged in!");
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
    $("#create_account_box input[type=button].submit").click(function(e) {
        e.preventDefault();
        validate_new_user();
    });

    $("#login_box input[type=button].submit").click(function(e) {
        e.preventDefault();
        validate_login();
    });
})
