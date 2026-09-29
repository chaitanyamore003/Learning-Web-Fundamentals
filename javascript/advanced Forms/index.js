function handleFormSubmit(e) {
  e.preventDefault();

  let form = e.target;
  let name = form.username.value;
  let email = form.email.value;
  let phone = form.phone.value;

  //storing user in localStorage
  localStorage.setItem(
    email,
    JSON.stringify({
      username: name,
      email: email,
      phone: phone,
    }),
  );

  //finding the ul
  let ul = document.querySelector("#users");

  //creating li
  let li = document.createElement("li");
  let text = document.createTextNode(name + ", " + email + ", " + phone);

  li.appendChild(text);

  ul.appendChild(li);
}

module.exports = handleFormSubmit;
