<?php
    $LOGGED_IN = FALSE;
    $USERNAME = "";
    $PASSWORD = "";

    session_start();

    if (isset($_SESSION["username"]) && isset($_SESSION["password"])) {
        try {
            $dbh = new PDO("mysql:dbname=health;host=127.0.0.1", "root", "bob");
            $sql = "SELECT * FROM user WHERE username=? AND password=?";
            $sth = $dbh->prepare($sql);
            $success = $sth->execute(array($_SESSION["username"], $_SESSION["password"]));
            if ($success === FALSE) $LOGGED_IN = FALSE;

            $row = $sth->fetch(PDO::FETCH_ASSOC);
            if ($row !== False) {
                $LOGGED_IN = TRUE;
                $USERNAME = $row["username"];
                $PASSWORD = $row["password"];
            }
        } catch (PDOException $e) {
            $LOGGED_IN = FALSE;
        } catch (Exception $e) {
            $LOGGED_IN = FALSE;
        }
    }

    // redirect to the home page if we are logged in
    if ($LOGGED_IN) header("Location: .");
?>
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
        <h2>Need a free account?</h2>
        <input type="text" class="user" placeholder="username" /><br />
        <input type="password" class="pass" placeholder="password" /><br />
        <input type="password" class="pass_confirm" placeholder="confirm password" /><br />
        <br />
        <input type="text" class="email" placeholder="email" /><br />
        <input type="text" class="email_confirm" placeholder="confirm email" /><br />
        <br />
        <input type="text" class="first_name" placeholder="first name" /><br />
        <input type="text" class="last_name optional" placeholder="last name" /><br />
        <input type="date" class="dob" /><br />
        <br />
        <div class="info_message"></div>
        <input type="button" class="submit" value="Create Account" />
    </div>
    <div class="grid_4" id="login_box">
        <h2>Existing Users</h2>
        <input type="text" class="user" tabindex=1 placeholder="username" /><br />
        <input type="password" class="pass" tabindex=2 placeholder="password" /><br />
        <br />
        <div class="info_message"></div>
        <input type="button" class="submit" tabindex=3 value="Login" />
    </div>
    <div class="grid_2">&nbsp;</div>

<?php include("templates/footer.php"); ?>
</body>
</html>
