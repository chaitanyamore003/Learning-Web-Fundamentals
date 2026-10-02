// Write your code below:
let baseUrl = "https://crudcrud.com/api/7bab256f95d246499eda6b36cb3daa22";

let ul = document.querySelector("ul");
let editId = null;
let editUser = null;

async function handleFormSubmit(event) {
  event.preventDefault();

  let form = event.target;
  let name = form.username.value;
  let email = form.email.value;
  let phone = form.phone.value;

  let user = {
    username: name,
    email: email,
    phone: phone,
  };

  try {
    await axios.post(`${baseUrl}/users`, user);
    editId = null;
    editUser = null;
    display();
  } catch (err) {
    console.log(err);
  }
}

async function display() {
  try {
    let res = await axios.get(`${baseUrl}/users`);
    let users = res.data;
    ul.innerHTML = "";

    users.forEach((u) => {
      let li = document.createElement("li");
      let text = document.createTextNode(
        u.username + "-" + u.email + "-" + u.phone,
      );

      li.appendChild(text);

      //delete button
      let delBtn = document.createElement("button");
      delBtn.classList.add("del-btn");
      delBtn.innerText = "Delete";
      delBtn.addEventListener("click", () => deleteUser(u._id));
      li.appendChild(delBtn);

      //edit button
      let editBtn = document.createElement("button");
      editBtn.classList.add("edit-btn");
      editBtn.innerText = "Edit";
      editBtn.addEventListener("click", () => editData(u._id));
      li.appendChild(editBtn);

      ul.appendChild(li);
    });
  } catch (err) {
    console.log(err);
  }
}

async function deleteUser(id) {
  try {
    await axios.delete(`${baseUrl}/users/${id}`);
    display();
  } catch (err) {
    console.log(err);
  }
}

async function editData(id) {
  try {
    let res = await axios.get(`${baseUrl}/users/${id}`);
    let user = res.data;

    if (!user) {
      console.log("user not found");
      return;
    }

    editId = id;
    editUser = user;
    let form = document.querySelector("form");
    form.username.value = user.username;
    form.email.value = user.email;
    form.phone.value = user.phone;

    await axios.delete(`${baseUrl}/users/${id}`);

    let sumbitBtn = form.querySelector("#submitBtn");
    sumbitBtn.innerText = "Update";
  } catch (err) {
    console.log(err);
  }
}

// Do not touch the code below
module.exports = handleFormSubmit;
