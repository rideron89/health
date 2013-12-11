<?php

function check_existing_account($user, $email) {
    try {
        $dbh = new PDO("mysql:dbname=health;host=127.0.0.1", "root", "bob");
        $sql = "SELECT username FROM user WHERE username=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($user));
        $row = $sth->fetch();
        if (count($row) > 1) return "Username already taken.";

        $sql = "SELECT email FROM user WHERE email=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($email));
        $row = $sth->fetch();
        if (count($row) > 1) return "Email already taken.";
    } catch (PDOException $e) {
        return "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        return $e->getMessage();
    }

    return 0;
}

function create_account($data) {
    // required fields
    try {
        if (!array_key_exists("user", $data)) throw new Exception("user");
        if (!array_key_exists("pass", $data)) throw new Exception("pass");
        if (!array_key_exists("email", $data)) throw new Exception("email");
        if (!array_key_exists("first_name", $data)) throw new Exception("first_name");
        if (!array_key_exists("last_name", $data)) throw new Exception("last_name");
        if (!array_key_exists("dob", $data)) throw new Exception("dob");
    } catch (Exception $e) {
        return "Missing '" . $e->getMessage() . "' input";
    }

    $existing = check_existing_account($data["user"], $data["email"]);

    if ($existing !== 0) {
        return $existing;
    }

    try {
        $dbh = new PDO("mysql:dbname=health;host=127.0.0.1", "root", "bob");
        $sql = "INSERT INTO user (username,password,email,first_name,last_name,date_of_birth)
            VALUES (?,?,?,?,?,?)";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($data["user"], $data["pass"], $data["email"],
            $data["first_name"], $data["last_name"], $data["dob"]));
        if ($success === FALSE) return "Database error: Most likely duplicate keys";
    } catch (PDOException $e) {
        return "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        return $e->getMessage();
    }

    return 0;
}

function login($data) {
    try {
        if (!array_key_exists("user", $data)) throw new Exception("user");
        if (!array_key_exists("pass", $data)) throw new Exception("pass");
    } catch (Exception $e) {
        return "Missing '" . $e->getMessage() . "' input";
    }

    try {
        $dbh = new PDO("mysql:dbname=health;host=127.0.0.1", "root", "bob");
        $sql = "SELECT * FROM user WHERE username=? AND password=?";
        $sth = $dbh->prepare($sql);
        $success = $sth->execute(array($data["user"], $data["pass"]));
        if ($success === FALSE) return "Database error";

        $row = $sth->fetch(PDO::FETCH_ASSOC);
        if ($row !== False) return $row;
    } catch (PDOException $e) {
        return "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        return $e->getMessage();
    }

    return "Invalid login";
}


// exit with an error if no method request was given
if (!isset($_GET) || !isset($_GET["method"])) {
    echo json_encode(array("error" => True, "response" => "No method request received"));
    die();
}

$result = NULL;
$error = True;
$response = "No method performed";

// request to create a new account
if ($_GET["method"] === "create_account") {
    $result = create_account($_POST);

    if ($result === 0) {
        $error = False;
        $response = "success";
    } else {
        $error = True;
        $response = $result;
    }
}

// request to login an existing account
if ($_GET["method"] === "login") {
    $result = login($_POST);

    if (gettype($result) === "array") {
        $error = False;
        $response = json_encode($result);
    } else {
        $error = True;
        $response = $result;
    }
}

// send the response back to the front-end and end the script
echo json_encode(array("error" => $error, "response" => $response));
die();

