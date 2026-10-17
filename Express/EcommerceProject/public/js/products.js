const onSubmitHandler = (e) => {
  e.preventDefault();

  const productName = e.target.productName.value;
  const obj = { productName };

  axios
    .post("http://localhost:3000/api/products", obj)
    .then((result) => {
      document.body.insertAdjacentHTML("beforeend", result.data);
    })
    .catch((error) => console.error(error));
};
