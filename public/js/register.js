function register() {
  var msg = document.getElementById("msg");

  if (!name.value || !email.value || !password.value || !confirmPassword.value || !org.value) {
    msg.className = "message error";
    msg.innerText = "All fields are required.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    msg.className = "message error";
    msg.innerText = "Passwords do not match.";
    return;
  }

  if (!terms.checked) {
    msg.className = "message error";
    msg.innerText = "You must accept the terms.";
    return;
  }

  fetch(API_BASE + "/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value,
      service: service.value,
      organization: org.value
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    msg.className = "message success";
    msg.innerText = "Registration successful. Redirecting...";

    setTimeout(function() {
      window.location.href = "login.html";
    }, 1200);
  });
}
