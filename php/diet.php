<?php

function add_diet_entry($username, $password, $calories, $comment) {
    try {
        $calories = filter_var($calories, FILTER_SANITIZE_NUMBER_INT);
        $comment = filter_var($comment, FILTER_SANITIZE_STRING);

        if ($calories === FALSE) {
            return "Invalid value given for calories.";
        }

        if ($comment == NULL) {
            $comment = "";
        }

        $dbh = new PDO("mysql:dbname=health;host=127.0.0.1", "root", "bob");

        // retrieve user_id from database
        $sql = "SELECT id FROM user WHERE username=? AND password=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($username, $password));
        $user_row = $sth->fetch();

        if ($user_row == FALSE) {
            return "Invalid credentials.";
        }

        // prepare the INSERT statement and execute it
        $sql = "INSERT INTO food_log VALUES(NULL, ?, \"\", ?, ?, NULL)";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($user_row["id"], $calories, $comment));

        if ($success === FALSE) {
            return "Error adding entry to database!";
        }
    } catch (PDOException $e) {
        return "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }

    return 0;
}

$result = NULL;
$error = TRUE;
$response = "No valid method performed";

if (isset($_GET["method"]) && $_GET["method"] === "add_diet_entry") {
    if (isset($_POST["username"]) === FALSE) {
        $result = "No username supplied!";
    } else if (isset($_POST["password"]) === FALSE) {
        $result = "No password supplied!";
    } else if (isset($_POST["calories"]) === FALSE) {
        $result = "No calorie value supplied!";
    } else {
        $username = $_POST["username"];
        $password = $_POST["password"];
        $calories = $_POST["calories"];
        $comment = (isset($_POST["comment"])) ? ($_POST["comment"]) : ("");
        $result = add_diet_entry($username, $password, $calories, $comment);
    }

    if (gettype($result) === "string") {
        $error = TRUE;
        $response = $result;
    } else {
        $error = FALSE;
        $response = $result;
    }
}

// send the response back to the front-end and end the script
echo json_encode(array("error" => $error, "response" => $response));
die();

?>
