const formSubmit = async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;
  const responseMessage = document.getElementById("responseMessage");

  try {
    const response = await axios.post(
      "https://rally-tameness-mardi.ngrok-free.dev/users/login",
      {
        email,
        password,
      },
    );

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);

      window.location.href = "dashboard.html";
    } else {
      responseMessage.textContent = response.data.message;
      responseMessage.style.color = "red";
    }
  } catch (error) {
    responseMessage.textContent =
      error.response?.data?.message || "Something went wrong";

    responseMessage.style.color = "red";
  }
};
