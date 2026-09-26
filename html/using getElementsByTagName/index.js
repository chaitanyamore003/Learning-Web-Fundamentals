let div1 = document.getElementsByTagName("ul")[0];
let elements = div1.querySelectorAll("*");

elements.forEach((element) => {
  element.style.fontStyle = "italic";
});

let mango = document.getElementsByTagName("li")[4];

mango.style.color = "red";
