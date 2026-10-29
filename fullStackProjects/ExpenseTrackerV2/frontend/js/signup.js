const baseUrl = "http://localhost:3000/users";

const formSubmit = async (e) => {
  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;

  await axios.post(`${baseUrl}/signup`, {
    name,
    email,
    password,
  });
};
