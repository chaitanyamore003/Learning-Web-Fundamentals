const baseurl = "http://localhost:3000/users";

const userForm = document.getElementById("userForm");
const userList = document.querySelector("ul");

let editingUserId = null;

// Fetch all users from backend
async function fetchUsers() {
  try {
    const response = await axios.get(baseurl);
    userList.innerHTML = "";

    response.data.users.forEach((user) => {
      displayUserOnScreen(user);
    });
  } catch (error) {
    console.error("Unable to fetch users:", error);
  }
}

// Add or update user
async function handleFormSubmit(event) {
  event.preventDefault();

  const userDetails = {
    name: document.getElementById("username").value,
    email: document.getElementById("email").value,
  };

  try {
    if (editingUserId !== null) {
      await axios.put(`${baseurl}/update/${editingUserId}`, userDetails);
      editingUserId = null;
    } else {
      await axios.post(`${baseurl}/add`, userDetails);
    }

    userForm.reset();
    await fetchUsers();
  } catch (error) {
    console.error("Unable to save user:", error);
  }
}

// Display one user
function displayUserOnScreen(user) {
  const userItem = document.createElement("li");

  const userInfo = document.createElement("span");
  userInfo.textContent = `${user.name} - ${user.email}`;

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";

  userItem.append(userInfo, editBtn, deleteBtn);
  userList.appendChild(userItem);

  // Edit user
  editBtn.addEventListener("click", () => {
    editingUserId = user.id;

    document.getElementById("username").value = user.name;
    document.getElementById("email").value = user.email;
  });

  // Delete user
  deleteBtn.addEventListener("click", async () => {
    try {
      await axios.delete(`${baseurl}/delete/${user.id}`);
      await fetchUsers();
    } catch (error) {
      console.error("Unable to delete user:", error);
    }
  });
}

// Event listeners
userForm.addEventListener("submit", handleFormSubmit);

// Load existing users when the page opens
document.addEventListener("DOMContentLoaded", fetchUsers);
