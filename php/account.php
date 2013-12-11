<?php

function create_account($data) {
    // required fields
    try {
        if (!array_key_exists("user", $data)) throw new Exception("Missing 'user' input");
        if (!array_key_exists("pass", $data)) throw new Exception("Missing 'pass' input");
        if (!array_key_exists("email", $data)) throw new Exception("Missing 'email' input");
        if (!array_key_exists("first_name", $data)) throw new Exception("Missing 'first_name' input");
        if (!array_key_exists("last_name", $data)) throw new Exception("Missing 'last_name' input");
        if (!array_key_exists("dob", $data)) throw new Exception("Missing 'dob' input");
    } catch (Exception $e) {
        return $e->getMessage();
    }

    return 0;
}

if (isset($_POST)) {
    // check for method
    if (isset($_POST["method"]) == FALSE) {
        echo json_encode(array("error" => True, "response" => "No method sent to server!"));
        die();
    } else if ($_POST["method"] == "create_account") {
        $result = create_account($_POST);
        $error = False;
        $response = "";

        if ($result === 0) {
            $error = False;
            $response = "success";
        } else {
            $error = True;
            $response = $result;
        }

        echo json_encode(array("error" => $error, "response" => $response));
        die();
    }
}