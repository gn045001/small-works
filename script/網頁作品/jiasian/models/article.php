<?php
require_once dirname(__FILE__) . "/db_check.php";

class ArticleClass
{
  public function insertArticle($query)
  {
    $result = '';
    $user_id = $query['user_id'];
    $username =  $query['username'];
    $title = $query['title'];
    $content = $query['content'];
    $img = $query['img'];
    $img_path = '';
    if (strlen($img) > 0) {  // 處理圖片的檔名問題
      $timestamp = strtotime("now");
      $img_path =  "/enzo/src/img/". $timestamp. "_". $username. ".jpg";
      $output_file = $_SERVER["DOCUMENT_ROOT"]. $img_path;
      $ifp = fopen( $output_file, 'wb' ); 
      $data = explode( ',', $img );
      fwrite( $ifp, base64_decode($data[1]));
      fclose( $ifp );
    }
    $conn = db_check();
    $sql = "INSERT INTO user_article (user_id, username, title, content, img)
    VALUES ('$user_id', '$username', '$title', '$content', '$img_path')";
    if (mysqli_query($conn, $sql)) {
      $result = "文章新增成功";
    } else {
      $result = "錯誤: " . $sql . "<br>" . $conn->error;
    }
    $conn->close();
    return $result;
  }

  public function deleteArticle($id)
  {
    $result = '';
    $conn = db_check();
    $sql = "SELECT img FROM user_article WHERE id=$id";
    $img_result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($img_result) > 0) {
      $row = mysqli_fetch_assoc($img_result);
      unlink($_SERVER["DOCUMENT_ROOT"]. $row['img']);  // 刪除server端的圖片
    }
    $article_sql = "DELETE FROM user_article WHERE id=$id";
    $message_sql = "DELETE FROM user_message WHERE article_id=$id";
    if (mysqli_query($conn, $article_sql) && mysqli_query($conn, $message_sql)) {
      $result = "文章刪除成功";
    } else {
      $result = "錯誤: " . $sql . "<br>" . $conn->error;
    }
    $conn->close();
    return $result;
  }

  public function insertMessage($query)
  {
    $result = '';
    $article_id = $query['article_id'];
    $username =  $query['username'];
    $content = $query['content'];
    $conn = db_check();
    $sql = "INSERT INTO user_message (article_id, username, content)
    VALUES ('$article_id', '$username', '$content')";
    if (mysqli_query($conn, $sql)) {
      $last_id = mysqli_insert_id($conn);
      $result = $last_id;
    } else {
      $result = "Error: " . $sql . "<br>" . $conn->error;
    }
    $conn->close();
    return $result;
  }

  public function deleteMessage($query)
  {
    $result = '';
    $sql = '';
    $id = $query['message_id'];
    $username = $query['username'];
    $conn = db_check();
    $sql = "DELETE FROM user_message WHERE id='$id' AND username='$username'";
    if (mysqli_query($conn, $sql)) {
      $result = "留言刪除成功";
    } else {
      $result = "錯誤: " . $sql . "<br>" . $conn->error;
    }
    $conn->close();
    return $result;
  }
}
?>