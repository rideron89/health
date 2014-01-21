<?php
    $LOGGED_IN = FALSE;
    $USERNAME = "";
    $PASSWORD = "";
    $FIRST_NAME = "";
    $LAST_NAME = "";

    session_start();

    if (isset($_SESSION["username"]) && isset($_SESSION["password"])) {
        try {
            $dbh = new PDO("mysql:dbname=health;host=192.168.1.23", "root", "bob");
            $sql = "SELECT * FROM user WHERE username=? AND password=?";
            $sth = $dbh->prepare($sql);
            $success = $sth->execute(array($_SESSION["username"], $_SESSION["password"]));

            if ($success === FALSE) {
                $LOGGED_IN = FALSE;
                $USERNAME = "";
                $PASSWORD = "";
            }

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

    if ($LOGGED_IN === FALSE) {
        header("Location: ./login.php");
    }
?>
<!DOCTYPE html>
<html>
<head>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
    <title>Health Log</title>
    <link rel="stylesheet" href="vendor/960/960.css" />
    <link rel="stylesheet" href="vendor/960/960_12_col.css" />
    <link rel="stylesheet" href="vendor/960/reset.css" />
    <link rel="stylesheet" href="vendor/960/text.css" />
    <link rel="stylesheet" href="css/style.css" />
    <script type="text/javascript">
        var USERNAME = "<?php echo $USERNAME; ?>";
        var PASSWORD = "<?php echo $PASSWORD; ?>";
    </script>
</head>
<body>
    <!-- header -->
<?php include("templates/header.php"); ?>
    <!-- /header -->

    <!-- content -->
<?php
    include("templates/summary_sidebar.php");
    echo "\n";
    include("templates/diet/content.php");
    echo "\n";
    include("templates/nutrition_sidebar.php");
?>
    <!-- /content -->

    <!-- footer -->
<?php include("templates/footer.php"); ?>
    <!-- /footer -->

<?php if (isset($LOGGED_IN) && $LOGGED_IN) { ?>
    <script type="text/javascript" src="js/summary.js"></script>
    <script type="text/javascript" src="js/diet.js"></script>
<?php } ?>
</body>
</html>
