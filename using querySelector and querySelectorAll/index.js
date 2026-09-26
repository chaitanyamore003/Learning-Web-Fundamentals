let h1 = (document.querySelector("#basket-heading").style.color = "brown");

let fruits = document.querySelectorAll(".fruit");

document.querySelector(".fruits").style.listStyleType = "none";

for (let i = 1; i < fruits.length; i += 2) {
  fruits[i].style.backgroundColor = "brown";
  fruits[i].style.color = "white";
}
