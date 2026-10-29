const formSubmit = async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  const responseMessage = document.getElementById("responseMessage");

  try {
    const response = await axios.post("http://localhost:3000/users/login", {
      email,
      password,
    });

    responseMessage.textContent = response.data.message;
    responseMessage.style.color = "green";
  } catch (error) {
    responseMessage.textContent =
      error.response?.data?.message || "Something went wrong";

    responseMessage.style.color = "red";
  }
};
