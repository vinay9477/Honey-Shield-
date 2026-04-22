var attempts = [];
var TIME_LIMIT = 3000;

function validateEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(fieldId, errorMsg) {
  var errorEl = document.getElementById(fieldId + 'Error');
  if (errorEl) {
    errorEl.textContent = errorMsg;
    errorEl.style.display = 'block';
    errorEl.style.color = '#fca5a5';
    errorEl.style.fontSize = '12px';
    errorEl.style.marginTop = '4px';
  }
}

function clearErrors() {
  document.getElementById('emailError').textContent = '';
  document.getElementById('passwordError').textContent = '';
}

function login() {
  clearErrors();
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value;

  if (!email) {
    showError('email', 'Email is required');
    return;
  }

  if (!validateEmail(email)) {
    showError('email', 'Please enter a valid email address');
    return;
  }

  if (!password) {
    showError('password', 'Password is required');
    return;
  }

  if (password.length < 6) {
    showError('password', 'Password must be at least 6 characters');
    return;
  }

  var now = Date.now();
  attempts.push(now);
  attempts = attempts.filter(function(t) { return now - t <= TIME_LIMIT; });

  if (attempts.length >= 3) {
    window.location.href = HONEYPOT_REDIRECT;
    return;
  }

  fetch(API_BASE + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    var msg = document.getElementById("msg");

    if (data.message === "Login successful") {
      msg.className = "message success";
      msg.innerText = "Login successful. Redirecting...";

      var userData = {
        email: email,
        _id: data.user._id || data.user.id || email
      };
      Object.assign(userData, data.user);

      localStorage.setItem("user", JSON.stringify(userData));

      setTimeout(function() {
        window.location.href = "user-dashboard.html";
      }, 1200);
    } else {
      msg.className = "message error";
      msg.innerText = data.message || "Login failed. Please try again.";
    }
  })
  .catch(function(err) {
    var msg = document.getElementById("msg");
    msg.className = "message error";
    msg.innerText = "Connection error. Please check your network.";
    console.error("Login error:", err);
  });
}

function togglePassword(id, icon) {
  var field = document.getElementById(id);

  if (field.type === "password") {
    field.type = "text";
    icon.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    field.type = "password";
    icon.innerHTML = '<i class="fas fa-eye"></i>';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var emailInput = document.getElementById('email');
  var passwordInput = document.getElementById('password');

  if (emailInput) {
    emailInput.addEventListener('input', function() {
      document.getElementById('emailError').textContent = '';
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      document.getElementById('passwordError').textContent = '';
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        login();
      }
    });
  }
});
