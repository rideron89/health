    <div id="header"></div>

    <div class="container_12" style="position: relative; z-index: 3;">
        <div class="grid_12">&nbsp;</div>
        <div class="clear"></div>

        <div class="grid_4 header_outer">
            <div class="header_middle">
                <div class="header_inner">
                    <img id="logo_icon" src="./css/images/logo_icon.png" />
                    <span id="logo_text">Health Log</span>
                </div>
            </div>
        </div>
        <div class="grid_5 header_outer">
            <div class="header_middle">
                <div class="header_inner">
                    <ul id="navbar">
                        <li><a href=".">Home</a></li>
                        <li><a href="diet.php">Diet</a></li>
                        <li><a href="exercise.php">Exercise</a></li>
                        <li><a href="">Nutrition</a></li>
                        <li class="stretch"></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="grid_3 header_outer">
            <div id="user_info_banner">&nbsp;</div>
            <div class="header_middle">
                <div id="user_info" class="header_inner">
<?php
    if ($LOGGED_IN === FALSE) {
?>                  <a href="login.php">Create Account / Login</a>
<?php
    } else {
?>
                    Welcome <i><?php echo $USERNAME; ?></i>!<br />
                    9999 eaten/day | 999 lost/day<br />
                    <a href="logout.php">Logout</a>
<?php
    }
?>
                </div>
            </div>
        </div>
        <div class="clear"></div>
        <div class="grid_12" style="height: 75px"><h1>&nbsp;</h1></div>
        <div class="clear"></div>
