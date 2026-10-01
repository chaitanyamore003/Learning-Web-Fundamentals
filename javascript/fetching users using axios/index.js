// Write your code below:
let ul = document.querySelector("ul");
let baseUrl = "https://crudcrud.com/api/7bab256f95d246499eda6b36cb3daa22";

function handleFormSubmit(event) {
  event.preventDefault();
  let form = event.target;
  let name = form.username.value;
  let email = form.username.value;
  let phone = form.phone.value;

  let userDetails = {
    username: name,
    email: email,
    phone: phone,
  };

  axios.post(baseUrl, userDetails);
}

document.addEventListener("DOMcontextLoaded", () => {
  ul.innerHTML = "";
  axios
    .get(baseUrl)
    .then((res) => {
      const users = res.data;
      users.forEach((u) => {
        const li = document.createElement("li");
        li.textContent = `${u.username} - ${u.email} - ${u.phone}`;
        ul.appendChild(li);
      });
    })
    .catch((err) => console.log(err));
});

// Do not touch the code below
module.exports = handleFormSubmit;
