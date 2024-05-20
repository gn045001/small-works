<?php

require_once dirname(__FILE__) . "/include/head.php";
require_once dirname(__FILE__) . "/blog_nav.php";

$username = $_SESSION['username'];
$oldPassword ="";
$newPassword ="";
$newPasswordConfirm ="";

?>



<div>
  <form 
    id="form" 
    onsubmit="return false" 
    action="/jiasian/models/password_change_check.php"
  >
    <input type="hidden" id="username" name="username" value="<?php echo $username; ?>">
    <div>
      <label>
        <p class="label-txt"><b>請輸入舊密碼</b></p>
        <input 
          id="oldPassword" 
          name="oldPassword"
          type="password" 
          class="input" 
          required=""
        >
        <div class="line-box">
          <div class="line"></div>
        </div>
      </label>
    </div>
    <div>
      <label>
        <p class="label-txt"><b>請輸入新密碼</b></p>
        <input 
          id="newPassword" 
          name="newPassword"
          type="password" 
          class="input" 
          required=""
        >
        <div class="line-box">
          <div class="line"></div>
        </div>
      </label>
    </div>
    <div>
      <label>
        <p class="label-txt"><b>再次確認新密碼</b></p>
        <input 
          id="newPasswordConfirm" 
          name="newPasswordConfirm"
          type="password" 
          class="input" 
          required=""
        >
        <div class="line-box">
          <div class="line"></div>
        </div>
      </label>
    </div>
    <button>submit</button>
  </form>
</div>

<script>
$("#form").submit(function(e) {
  if ($("#newPassword").val() !== $("#newPasswordConfirm").val()) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: '請再確認一次新密碼',
    });
    return;
  } else {
    var form = $(this);
    var url = form.attr('action');

    $.ajax({
      type: "POST",
      url: url,
      data: $(form).serialize(),
      success: function(data) {
        if (data.includes('密碼更新成功')) {
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: '密碼更新成功',
            allowOutsideClick: false,
            showCancelButton: false,
          }).then((result) => {
            if (result.value) {
              window.location = '/jiasian/views/blog.php'
            }
          })
        }
      }
    });
    e.preventDefault(); // avoid to execute the actual submit of the form.
  }
});
</script>
