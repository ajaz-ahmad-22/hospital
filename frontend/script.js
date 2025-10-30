const API_URL = "http://192.168.35.70:5000/api/users";
const token = localStorage.getItem("token");
if (!token) window.location.href="login.html";

async function loadUsers() {
  const res = await fetch(API_URL, { headers: { "Authorization": "Bearer "+token } });
  const users = await res.json();
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.staff_id}</td>
      <td>${user.role}</td>
      <td>${user.status}</td>
      <td>${user.last_check_in ? new Date(user.last_check_in).toLocaleString() : "-"}</td>
      <td>${user.last_check_out ? new Date(user.last_check_out).toLocaleString() : "-"}</td>
      <td>
        <button onclick="toggleStatus('${user.staff_id}', '${user.status}')">
          ${user.status === 'Active' ? 'Disable' : 'Enable'}
        </button>
        <button onclick="deleteUser('${user.staff_id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("addUserForm").addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const staff_id = document.getElementById("staff_id").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type":"application/json", "Authorization":"Bearer "+token },
    body: JSON.stringify({ name, staff_id, password, role })
  });
  const data = await res.json();
  if(res.ok) { 
    alert(data.message);
    document.getElementById("addUserForm").reset();
    loadUsers();
  } else alert(data.error);
});

async function toggleStatus(staff_id, currentStatus) {
  const newStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';
  const res = await fetch(`${API_URL}/status/${staff_id}`, {
    method: "PUT",
    headers: { "Content-Type":"application/json", "Authorization":"Bearer "+token },
    body: JSON.stringify({ status: newStatus })
  });
  if(res.ok) loadUsers();
}

async function deleteUser(staff_id) {
  if(!confirm("Delete this user?")) return;
  const res = await fetch(`${API_URL}/${staff_id}`, {
    method: "DELETE",
    headers: { "Authorization":"Bearer "+token }
  });
  if(res.ok) loadUsers();
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href="login.html";
});

// Initial load
loadUsers();
