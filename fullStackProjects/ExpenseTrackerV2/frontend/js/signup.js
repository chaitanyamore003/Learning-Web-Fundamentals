const formSubmit = async (event) => {
  event.preventDefault();

  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;
  const responseMessage = document.getElementById("responseMessage");

  try {
    const response = await axios.post("http://localhost:3000/users/signup", {
      name,
      email,
      password,
    });

    responseMessage.textContent = response.data.message;
    responseMessage.style.color = "green";

    if (response.data.success) {
      window.location.href = "login.html";
    }
  } catch (error) {
    responseMessage.textContent =
      error.response?.data?.message || "Something went wrong";

    responseMessage.style.color = "red";
  }
};
