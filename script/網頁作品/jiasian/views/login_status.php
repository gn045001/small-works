<?php
require_once dirname(__FILE__) . "/include/head.php";
$time = $_SERVER['REQUEST_TIME'];
$timeout_duration = 1800;  // 設定30分鐘為timeout
if (!isset($_SESSION['login']) || ($time - $_SESSION['LAST_ACTIVITY']) > $timeout_duration) {
  header("Location: ./login.php");
  exit();
}
?>