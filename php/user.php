<?php

function get_user_diet_summary($username) {
    $diet = array(
        "total" => 0, "monthly_quota" => 0, "monthly_total" => 0);
    $exercise = array(
        "total" => 0, "monthly_quota" => 0, "monthly_total" => 0);

    try {
        $dbh = new PDO("mysql:dbname=health;host=127.0.0.1", "root", "bob");

        // retrieve user id and calorie intake quota
        $sql = "SELECT id,monthly_diet_quota,monthly_exercise_quota FROM user WHERE username=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($username));
        $user_row = $sth->fetch();
        $diet["monthly_quota"] = $user_row["monthly_diet_quota"];
        $exercise["monthly_quota"] = $user_row["monthly_exercise_quota"];

        // retrieve calorie intake for the current month
        $sql = "SELECT calories,date_logged FROM food_log WHERE user_id=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($user_row["id"]));
        foreach ($sth->fetchAll() as $row) {
            $diet["total"] += $row["calories"];

            // record only this month's calorie count here
            $entry_date_split = explode("-", $row["date_logged"]);
            if (intval(date("Y")) === intval($entry_date_split[0]) &&
                intval(date("m")) === intval($entry_date_split[1])) {
                $diet["monthly_total"] += $row["calories"];
            }
        }

        $sql = "SELECT calories,date_logged FROM exercise_log WHERE user_id=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($user_row["id"]));
        foreach ($sth->fetchAll() as $row) {
            $exercise["total"] += $row["calories"];

            // record only thos month's calorie count here
            $entry_date_split = explode("-", $row["date_logged"]);
            if (intval(date("Y")) === intval($entry_date_split[0]) &&
                intval(date("m")) === intval($entry_date_split[1])) {
                $exercise["monthly_total"] += $row["calories"];
            }
        }
    } catch (PDOException $e) {
        return "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }

    return array("diet" => json_encode($diet), "exercise" => json_encode($exercise));
}

$result = NULL;
$error = TRUE;
$response = "No method performed";

// request to retrieve a user's diet summary info
if (isset($_GET["method"]) && $_GET["method"] === "get_user_diet_summary") {
    if (!isset($_POST["username"]) || $_POST["username"] == "") {
        $result = "No username supplied!";
    } else {
        $result = get_user_diet_summary($_POST["username"]);
    }

    if (gettype($result) === "string") {
        $error = TRUE;
        $response = $result;
    } else {
        $error = FALSE;
        $response = json_encode($result);
    }
}

// DELETE THIS???
// request to create a new account
if (isset($_GET["method"]) && $_GET["method"] === "create_account") {
    $result = create_account($_POST);

    if ($result === 0) {
        $error = False;
        $response = "success";
    } else {
        $error = True;
        $response = $result;
    }
}

// send the response back to the front-end and end the script
echo json_encode(array("error" => $error, "response" => $response));
die();

?>
