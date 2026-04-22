function logout() {
  localStorage.clear();
  window.location.href = "admin-login.html";
}

var usersTable = document.getElementById("usersTable");
var statUsers = document.getElementById("statUsers");

fetch(API_BASE + "/api/admin/users")
  .then(function(res) { return res.json(); })
  .then(function(data) {

    statUsers.innerText = data.length;

    var bot = 0;
    var honey = 0;

    data.forEach(function(u) {

      if (u.service === "bot") bot++;
      else honey++;

      if (usersTable) {
        usersTable.innerHTML += `
        <tr>
          <td>${u.email}</td>
          <td>${u.organization || "N/A"}</td>
          <td>${u.service}</td>
        </tr>`;
      }

    });

  })
  .catch(function(err) {
    console.error("Admin fetch error:", err);
  });
