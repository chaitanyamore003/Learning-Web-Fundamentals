let div1 = document.getElementsByClassName("fruits")[0];

let elements = div1.querySelectorAll("*");

elements.forEach((element) => {
  element.style.fontWeight = "bold";
});

let f3 = document.getElementsByClassName("fruit")[2];
f3.style.backgroundColor = "yellow";
