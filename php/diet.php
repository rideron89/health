<?php

function get_monthly_quota($username) {
    try {
        $dbh = new PDO("mysql:dbname=health;host=192.168.1.23", "root", "bob");

        // retrieve user_id from database
        $sql = "SELECT monthly_diet_quota AS quota FROM user WHERE username=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($username));
        $user_row = $sth->fetch(PDO::FETCH_ASSOC);

        if ($user_row === FALSE) {
            return "That user does not exist.";
        }

        return intval($user_row["quota"]);
    } catch (PDOException $e) {
        return "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }

    return 0;
}

function get_monthly_calories($username, $month) {
    try {
        $min = $month . "-01";
        $max = explode("-", $month)[1];

        if ($max == "01" ||
            $max == "03" ||
            $max == "05" ||
            $max == "07" ||
            $max == "08" ||
            $max == "10" ||
            $max == "12") {
            $max = $month . "-31";
        } else if ($max == "02") {
            // this may cause trouble on non-leap years
            $max = $month . "-29";
        } else {
            $max = $month . "-30";
        }

        $dbh = new PDO("mysql:dbname=health;host=192.168.1.23", "root", "bob");

        // retrieve user_id from database
        $sql = "SELECT id,monthly_diet_quota AS quota FROM user WHERE username=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($username));
        $user_row = $sth->fetch(PDO::FETCH_ASSOC);

        if ($user_row === FALSE) {
            return "That user does not exist.";
        }

        $sql = "SELECT SUM(calories) AS calories FROM food_log WHERE user_id=? AND date_logged BETWEEN ? AND ?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($user_row["id"], $min, $max));
        $row = $sth->fetch();

        if ($row[0] == NULL) {
            return 0;
        }

        return array("quota" => $user_row["quota"], "total" => $row["calories"]);
    } catch (PDOException $e) {
        return "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }

    return 0;
}

function get_total_calories($username) {
    try {
        $dbh = new PDO("mysql:dbname=health;host=192.168.1.23", "root", "bob");

        // retrieve user_id from database
        $sql = "SELECT id FROM user WHERE username=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($username));
        $user_row = $sth->fetch(PDO::FETCH_ASSOC);

        if ($user_row === FALSE) {
            return "That user does not exist.";
        }

        $sql = "SELECT SUM(calories) FROM food_log WHERE user_id=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($user_row["id"]));
        $row = $sth->fetch();

        if ($row[0] == NULL) {
            return 0;
        }

        return intval($row[0]);
    } catch (PDOException $e) {
        return "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }

    return 0;
}

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

        $dbh = new PDO("mysql:dbname=health;host=192.168.1.23", "root", "bob");

        // retrieve user_id from database
        $sql = "SELECT id FROM user WHERE username=? AND password=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($username, $password));
        $user_row = $sth->fetch();

        if ($user_row == FALSE) {
            return "Invalid credentials.";
        }

        // prepare the INSERT statement and execute it
        $sql = "INSERT INTO food_log VALUES(NULL, ?, ?, ?, NULL)";
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

function delete_diet_entry($username, $password, $id) {
    try {
        $id = filter_var($id, FILTER_SANITIZE_NUMBER_INT);

        if ($id < 0) {
            return "ID must be non-negative when removing an entry";
        }

        $dbh = new PDO("mysql:dbname=health;host=192.168.1.23", "root", "bob");

        // retrieve user_id from database
        $sql = "SELECT id FROM user WHERE username=? AND password=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($username, $password));
        $user_row = $sth->fetch();

        if ($user_row == FALSE) {
            return "Invalid credentials.";
        }

        $sql = "DELETE FROM food_log WHERE user_id=? AND id=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($user_row["id"], $id));
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

if (isset($_GET["method"]) && $_GET["method"] === "get_monthly_quota") {
    if (isset($_POST["username"]) === FALSE) {
        $result = "No username supplied!";
    } else {
        $result = get_monthly_quota($_POST["username"]);
    }

    if (gettype($result) === "string") {
        $error = TRUE;
        $response = $result;
    } else {
        $error = FALSE;
        $response = $result;
    }
}

if (isset($_GET["method"]) && $_GET["method"] === "get_monthly_calories") {
    if (isset($_POST["username"]) === FALSE) {
        $result = "No username supplied!";
    } else if (isset($_POST["month"]) === FALSE) {
        $result = "No month supplied!";
    } else {
        $result = get_monthly_calories($_POST["username"], $_POST["month"]);
    }

    if (gettype($result) === "string") {
        $error = TRUE;
        $response = $result;
    } else {
        $error = FALSE;
        $response = $result;
    }
}

if (isset($_GET["method"]) && $_GET["method"] === "get_total_calories") {
    if (isset($_POST["username"]) === FALSE) {
        $result = "No username supplied!";
    } else {
        $result = get_total_calories($_POST["username"]);
    }

    if (gettype($result) === "string") {
        $error = TRUE;
        $response = $result;
    } else {
        $error = FALSE;
        $response = $result;
    }
}

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

if (isset($_GET["method"]) && $_GET["method"] === "delete_diet_entry") {
    if (isset($_POST["username"]) === FALSE) {
        $result = "No username supplied!";
    } else if (isset($_POST["password"]) === FALSE) {
        $result = "No password supplied!";
    } else if (isset($_POST["id"]) === FALSE) {
        $result = "No ID value supplied!";
    } else {
        $username = $_POST["username"];
        $password = $_POST["password"];
        $id = $_POST["id"];
        $result = delete_diet_entry($username, $password, $id);
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
