<?php

function get_user_diet_summary($username) {
    $diet = json_encode(array("total" => 50000, "monthly_quota" => 10000));
    $exercise = json_encode(array());

    return json_encode(array("diet" => $diet, "exercise" => $exercise));
}

$result = NULL;
$error = TRUE;
$response = "No method performed";

// request to retrieve a user's diet summary info
if (isset($_GET["method"]) && $_GET["method"] === "get_user_diet_summary") {
    $result = get_user_diet_summary("rideron");
    $error = FALSE;
    $response = $result;
}

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
