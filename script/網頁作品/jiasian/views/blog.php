<?php
require_once dirname(__FILE__). "/login_status.php";
require_once dirname(__FILE__). "/blog_nav.php";
require_once dirname(__FILE__). "/animations/box_anime.php";
require_once $_SERVER["DOCUMENT_ROOT"]. "/jiasian/models/db_check.php";
$conn = db_check();
$article_sql = "SELECT id, title, content, username, img, reg_date FROM user_article ORDER BY id DESC;";
?>

<div 
  id="topBtnGroup"
  class="sticky-top mt-5" 
  align="left" 
  style="width: 10%; height:85%; overflow-y: scroll; overflow-x:hidden; position: absolute;"
>
  <?php
  $article_result = mysqli_query($conn, $article_sql);
  if (mysqli_num_rows($article_result) > 0) {
    while($row = mysqli_fetch_assoc($article_result)) {
      echo "<button onclick=\"document.getElementById('".$row["id"]. "').scrollIntoView({block:'end', behavior:'smooth'});\" style=\"width: 100%\">". $row["title"]."</button>";
    }
  }
  ?>
</div>
<div class="blog">
  <div class="article-lg-12 text-center">
    <h2>jiasian部落格文章</h2>
  </div>
  <div 
    id="blogContent" 
    class="container" 
    style="height: 100%; overflow-y: scroll;"
  >
    <div 
      class="container" 
      align="center"
    >
    <?php
    $article_result = mysqli_query($conn, $article_sql);
    if (mysqli_num_rows($article_result) > 0) {
      while($row = mysqli_fetch_assoc($article_result)) {
        echo "<div id=\"". $row["id"]. "\" class=\"article\" align=\"left\">";
        echo "  <div class=\"text-center mt-5\"><h4>". $row["title"]. "</h4>";
        echo "    <div class=\"text-right mt-1 mr-2\" style=\"font-size: 10px\">發布時間: ". $row["reg_date"]. "</div>";
        echo "    <div class=\"text-right mt-1 mr-2\" style=\"font-size: 10px\">作者: " . $row["username"]. "</div>
                </div><hr>";
        if ($row["img"] !== NULL) {  // 如果img欄位有數值則顯示圖片
          if(strlen($row["img"]) > 0) {
            $imgSrc = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")."://". $_SERVER['HTTP_HOST']. $row["img"];
            echo "<div class=\"text-center\" align=\"center\" style=\"width: 100%; margin:0 auto;\">
                    <img src=\" ".$imgSrc. "\" style=\"display: block; max-width: 100%; max-height: 100%; margin:0 auto;\">
                  </div>";
          }
        }
        echo "  <div style=\"display: flex;\">";
        echo "    <div class=\"text-center mt-2 ml-5 mr-5\" style=\"font-size:15px\">" . $row["content"]. "</div>
                </div>";
        echo "  <div style=\"width: 100%\" align=\"right\">";
        echo "  <button class=\"btn-sm\" onclick=\"message(".$row["id"]. ",'". $_SESSION['username'] ."')\"> 留言</button>";
        if ($row["username"] === $_SESSION['username']) {  // 如果登入狀態與文章的作者相同則新增刪除按鈕
          echo "  <button class=\"btn-sm\" onclick=\"deleteArticle(".$row["id"].")\"> 刪除</button>";
        }
        echo "  </div>";
        $article_id = $row["id"]; 
        $message_sql = "SELECT id, article_id, username, content, reg_date FROM user_message WHERE article_id='$article_id' ORDER BY id DESC;";
        $message_result = mysqli_query($conn, $message_sql);
        echo "  <div id=\"article". $row["id"]. "\">";
        if (mysqli_num_rows($message_result) > 0) {  // 如果該文章下面有流言則顯示出留言內容
          while($row = mysqli_fetch_assoc($message_result)) {
            echo "  <div id=\"message". $row["id"] ."\">";
            echo "    <div class=\"text-center mt-5\">". $row["content"];
            echo "      <div class=\"text-right mt-1 mr-2\" style=\"font-size: 10px\">發布時間: ". $row["reg_date"]. "</div>";
            echo "      <div class=\"text-right mt-1 mr-2\" style=\"font-size: 10px\">作者: " . $row["username"]. "</div>";
            if ($row["username"] === $_SESSION['username']) {  // 如果登入狀態與留言的作者相同則新增刪除按鈕
              echo "    <div class=\"text-right mt-1 mr-2\" style=\"font-size: 10px\"><button class=\"btn-sm\" onclick=\"deleteMessage(".$row["id"].",'". $_SESSION['username'] ."')\"> 刪除留言</button></div>";
            }
            echo "    </div>";
            echo "  </div>";
          }
        }
        echo "  </div>";
        echo "</div><br>"; 
      }
    }
    $conn->close();
    ?>
    </div>
  </div>
</div>

<script>
function deleteArticle(id) {  // 雖然一樣為ajax的方式，但最後有做網頁重整
  Swal.fire({
  icon: 'warning',
  title: 'warning',
  text: '確定要刪除嗎?',
  showCancelButton: true,
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: "POST",
        url: '/jiasian/models/article_check.php',
        data: {
          deleteArticle: id,
        },
        success: function(data) {
          if(data.includes('文章刪除成功')) {
            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: '文章刪除成功',
              allowOutsideClick: false,
              showCancelButton: false,
            }).then((result) => {
              if (result.value) {
                window.location = '/jiasian/views/blog.php'  // 網頁重整
              }
            })
          }
        }
      });
    }
  });
}
function deleteMessage(id, username) {
  Swal.fire({
  icon: 'warning',
  title: 'warning',
  text: '確定要刪除嗎?',
  showCancelButton: true,
  }).then((result) => {
    if (result.value) {
      $.ajax({
        type: "POST",
        url: '/jiasian/models/article_check.php',
        data: {
          deleteMessage: id,
          username: username,
        },
        success: function(data) {
          $('#message' + id ).remove();
          Swal.fire({
          icon: 'success',
          title: 'OK',
          text: '刪除留言成功',
          });
        }
      });
    }
  });
}
async function message(articleId, username) {
  const { value: text } = await Swal.fire({
    title: '留言',
    input: 'textarea',
    inputPlaceholder: '請輸入留言'
  })
  if (text) {
    var messageId = '';
    var params= {
      writeMessage: '',
      articleId: articleId,
      username: username,
      content: text
    };
    $.ajax({
      type: "POST",
      url: '/jiasian/models/article_check.php',
      data: params,
      success: function(data) {
        messageId = data;
        var dt = new Date();
        var time = dt.getFullYear() + '-' + (dt.getMonth()+1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
        $('#article' + articleId.toString()).prepend("\
          <div id=\"message"+ messageId + "\">\
            <div class=\"text-center mt-5\">" + text + "\
              <div class=\"text-right mt-1 mr-2\" style=\"font-size: 10px\">發布時間: " + time + "</div>" + "\
              <div class=\"text-right mt-1 mr-2\" style=\"font-size: 10px\">作者: " + username + "</div>" + "\
              <div class=\"text-right mt-1 mr-2\" style=\"font-size: 10px\"><button class=\"btn-sm\" onclick=\"deleteMessage('" + messageId +"','" + username + "')\"> 刪除留言</button></div>" + "\
            </div>\
          </div>\
        ");
        Swal.fire({
        icon: 'success',
        title: 'OK',
        text: '留言成功',
        });
      }
    });
  } 
}
</script>

<style>
body {
  background-color: #ffffff !important;
  /* overflow: hidden */
}

h2 {
  color: #4C4C4C;
  word-spacing: 5px;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 30px;
  font-family: 'Raleway', sans-serif;
}

.blog {
  background-color: rgba(255, 255, 255, 0);
  padding: 60px 0px;
  font-family: 'Raleway', sans-serif;
  height: 90%;
}

.article {
  background-color: rgba(175, 175, 175, 0.1);
  width: 60%;
  border-color: transparent; /* 將框線顏色設置為透明 */
}

#topBtnGroup button {
  background-color: rgba(175, 175, 175, 0.2);
  border-color: transparent; /* 將框線顏色設置為透明 */
}

#blogContent::-webkit-scrollbar, #topBtnGroup::-webkit-scrollbar
{
	width: 12px;
	background-color: rgba(0,0,0,0);
}

#blogContent::-webkit-scrollbar-thumb, #topBtnGroup::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2);
	background-color: #ffffff;
}
</style>