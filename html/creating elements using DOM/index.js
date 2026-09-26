let header = document.querySelector("#header");
let h2 = document.createElement("h3");
h2.innerText = "Buy high quality organic fruits online";
h2.style.fontStyle = "italic";

header.appendChild(h2);

let div1 = document.querySelector("#fruits-div");

let p1 = document.createElement("p");
p1.id = "fruits-total";
let fruits = document.querySelectorAll(".fruit");
p1.innerText = `Total fruits: ${fruits.length}`;
let fruitList = document.querySelector(".fruits");

div1.insertBefore(p1, fruitList);
