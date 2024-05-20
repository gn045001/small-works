<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once dirname(__FILE__) . "/db_check.php";

// 確認是否收到 AJAX 請求
echo "Received AJAX request<br>";
print_r($_POST); 
echo "<br> <br>" ;

$username = isset($_POST['username']) ? $_POST['username'] : '';
$oldPassword = isset($_POST['oldPassword']) ? $_POST['oldPassword'] : '';
$newPassword = isset($_POST['newPassword']) ? $_POST['newPassword'] : '';

echo "Received username: " . $username . "<br>";
echo "Received oldPassword : " . $oldPassword . "<br>";
echo "Received newPassword : " . $newPassword . "<br>";


// 如果缺少必要的欄位，可以在此處返回錯誤或採取其他必要的處理方式
if (empty($username) || empty($oldPassword) || empty($newPassword)) {
  echo "Missing required fields";
  exit;
}

$conn = db_check();

// 檢查舊密碼是否正確
$stmt = $conn->prepare("SELECT * FROM user_account WHERE username=? AND password=?");
$stmt->bind_param("ss", $username, md5($oldPassword));
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows == 0) {
  echo "舊密碼錯誤";
  exit;
}

// 更新密碼
$stmt = $conn->prepare("UPDATE user_account SET password=? WHERE username=?");
$stmt->bind_param("ss", md5($newPassword), $username);
if ($stmt->execute()) {
  echo "密碼更新成功";
  echo "<script>window.location = '/jiasian/views/login.php';</script>";
} else {
  echo "密碼更新失敗: " . $conn->error;
}

$stmt->close();
$conn->close();

?>
