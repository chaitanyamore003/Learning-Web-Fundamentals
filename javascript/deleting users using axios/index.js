// Write your code below:
let baseUrl = "https://crudcrud.com/api/7bab256f95d246499eda6b36cb3daa22";
let ul = document.querySelector("ul");

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
    display();
  } catch (err) {
    console.log(err);
  }
}

async function display() {
  try {
    let response = await axios.get(`${baseUrl}/users`);
    let users = response.data;

    ul.innerHTML = "";

    users.forEach((u) => {
      let li = document.createElement("li");
      let text = document.createTextNode(
        u.username + "-" + u.email + "-" + u.phone,
      );

      li.appendChild(text);

      let delBtn = document.createElement("button");

      delBtn.classList.add("del-btn");
      delBtn.innerText = "Delete";

      delBtn.addEventListener("click", () => deleteUser(u._id));
      li.appendChild(delBtn);

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

// Do not touch the code below
module.exports = handleFormSubmit;
