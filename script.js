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