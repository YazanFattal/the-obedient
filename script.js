const images = document.querySelectorAll(".page img");

const lightbox = document.createElement("div");
lightbox.className = "lightbox";
document.body.appendChild(lightbox);

images.forEach(img => {
  img.addEventListener("click", () => {
    lightbox.innerHTML = `<img src="${img.src}" alt="">`;
    lightbox.classList.add("active");
  });
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
});

const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    darkModeToggle.textContent = "Light Mode";
  } else {
    darkModeToggle.textContent = "Dark Mode";
  }
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".top-nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 150;
        const height = section.offsetHeight;

        if(pageYOffset >= top && pageYOffset < top + height){

            current = section.id;

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if(current === "about" && href === "#about"){

            link.classList.add("active");

        }

        if(
            ["chapter1","chapter2","chapter3","chapter4","chapter5","chapter6","toc","final"].includes(current)
            && href === "#chapter1"
        ){

            link.classList.add("active");

        }

        if(current === "news" && href === "#news"){

            link.classList.add("active");

        }

    });

});

const houseImages = [
  "images/HouseOfConnection1.png",
  "images/HouseOfConnection2.png",
  "images/HouseOfConnection3.png"

];

let currentHouse = 0;

const houseImage = document.getElementById("houseImage");
const houseCounter = document.getElementById("houseCounter");
const nextHouse = document.getElementById("nextHouse");
const prevHouse = document.getElementById("prevHouse");

function updateHouseImage() {
  houseImage.src = houseImages[currentHouse];
  houseCounter.textContent = `${currentHouse + 1} / ${houseImages.length}`;
}

if (houseImage && nextHouse && prevHouse && houseCounter) {
  nextHouse.addEventListener("click", () => {
    currentHouse = (currentHouse + 1) % houseImages.length;
    updateHouseImage();
  });

  prevHouse.addEventListener("click", () => {
    currentHouse =
      currentHouse === 0 ? houseImages.length - 1 : currentHouse - 1;
    updateHouseImage();
  });
}