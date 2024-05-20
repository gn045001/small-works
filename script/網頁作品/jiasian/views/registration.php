<?php
require_once dirname(__FILE__) . "/include/head.php";
require_once dirname(__FILE__) . "/login_nav.php";
?>

<div>
  <form 
    id="form" 
    onsubmit="return false" 
    action="/jiasian/models/registration_check.php"
  >
    <div>
      <label>
        <p class="label-txt"><b>請輸入EMAIL</b></p>
        <input 
          id="email" 
          type="email" 
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
        <p class="label-txt"><b>請輸入使用者名稱</b></p>
        <input 
          id="username" 
          type="text" 
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
        <p class="label-txt"><b>請輸入密碼</b></p>
        <input 
          id="passwordInput" 
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
        <p class="label-txt"><b>再確認一次密碼</b></p>
        <input 
          id="passwordConfirm" 
          type="password" 
          class="input" 
          autocomplete="Off" 
          required=""
        >
        <div class="line-box">
          <div class="line"></div>
        </div>
      </label>
    </div>
    <button>提交</button>
  </form>
</div>

<script>
$("#form").submit(function(e) {
  if ($("#passwordInput").val() !== $("#passwordConfirm").val()) {
    Swal.fire({
      icon: '錯誤了',
      title: '哎呀...',
      text: '請再確認一次密碼',
    });
    return;
  } else {
    var params = {
      email: $('#email').val(),
      username: $('#username').val(),
      password: md5($('#passwordInput').val()),
    };
    var query = jQuery.param(params);
    var form = $(this);
    var url = form.attr('action');
    $.ajax({
      type: "POST",
      url: url + '?' + query,
      success: function(data) {
        if (data.includes('已註冊過')) {
          Swal.fire({
            icon: '錯誤了',
            title: '哎呀...',
            html:data,
          });
        }
        if (data.includes('資料新增成功')) {
          Swal.fire({
            icon: '成功',
            title: 'OK',
            text: '資料新增成功',
            allowOutsideClick: false,
            showCancelButton: false,
          }).then((result) => {
            if (result.value) {
              window.location = '/jiasian/views/login.php'
            }
          })
        }
      }
    });
    e.preventDefault(); // avoid to execute the actual submit of the form.
  }
});
</script>