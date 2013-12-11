<!DOCTYPE html>
<html>
<head>
    <title>Health Log</title>
    <link rel="stylesheet" href="vendor/960/960.css" />
    <link rel="stylesheet" href="vendor/960/960_12_col.css" />
    <link rel="stylesheet" href="vendor/960/reset.css" />
    <link rel="stylesheet" href="vendor/960/text.css" />
    <link rel="stylesheet" href="css/style.css" />
</head>
<body>
<?php include("templates/header.php"); ?>

    <div class="grid_2">&nbsp;</div>
    <div class="grid_4" id="create_account_box">
        <h2>New Account</h2>
        <input type="text" class="user" placeholder="username" value="aaaa" /><br />
        <input type="password" class="pass" placeholder="password" value="aaaa" /><br />
        <input type="password" class="pass_confirm" placeholder="confirm password" value="aaaa" /><br />
        <br />
        <input type="text" class="email" placeholder="email" value="a@a.a" /><br />
        <input type="text" class="email_confirm" placeholder="confirm email" value="a@a.a" /><br />
        <br />
        <input type="text" class="first_name" placeholder="first name" value="a" /><br />
        <input type="text" class="last_name optional" placeholder="last name" /><br />
        <input type="date" class="dob" value="1989-01-23" /><br />
        <br />
        <div class="info_message"></div>
        <input type="button" class="submit" value="Create Account" />
    </div>
    <div class="grid_4" id="login_box">
        <h2>Login</h2>
        <input type="text" class="user" placeholder="username" /><br />
        <input type="pass" class="pass" placeholder="password" /><br />
        <br />
        <div class="info_message"></div>
        <input type="button" class="submit" value="Login" />
    </div>
    <div class="grid_2">&nbsp;</div>

<?php include("templates/footer.php"); ?>
</body>
</html>
