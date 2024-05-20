<nav class="sticky-top" style="width:100%; position: absolute; z-index: 10; background-color: #BD5D38">
  <div style="width: 100%">
    <div align="right" style="color:#f6f6f6">
      <?php
      // 檢查是否存在 $_SESSION['username']
      if (isset($_SESSION['username'])) {
          echo "你好！<b>" . $_SESSION['username'] . "</b>&nbsp;&nbsp;&nbsp;";
      }
      ?>     
          <button class="btn-outline-dark btn" onclick="window.location = '/jiasian/views/write_article.php'" style="color: white; border-color: white">
            <b>寫部落格</b>
          </button>
          <button class="btn-outline-dark btn" onclick="window.location = '/jiasian/views/changepw.php'" style="color: white; border-color: white">
            <b>修改密碼</b>
          </button>
          <button class="btn-outline-dark btn" style="color: white; border-color: white" id="logoutBtn">
        <b>登出</b>
      </button>
    </div>
  </div>
</nav>

<script>
  document.getElementById('logoutBtn').addEventListener('click', function() {
    Swal.fire({
      icon: '警告',
      title: '警告',
      text: '確定要登出嗎?',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        // 清除 cookie , 若確定要登出，則把 cookie 時間設定成前1小時
        document.cookie = 'username=; expires=Thu, -3600 ; path=/;';

        window.location = '/jiasian/index.html';
      }
    });
  });
</script>
