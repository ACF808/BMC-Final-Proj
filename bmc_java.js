const cards = document.querySelectorAll(".card ul");

function toggleInfo(index) {
  // This ensures the index matches the card, not the whole page
  const hiddenText = document.querySelectorAll(".card")[index].querySelector("ul");
  hiddenText.classList.toggle("hidden");
}

function updateRisk() {
  const slider = document.getElementById("drinkSlider").value;
  const text = document.getElementById("riskText");

  if (slider == 0) text.textContent = "No alcohol: normal immune function";
  if (slider == 1) text.textContent = "Light drinking: slight immune suppression";
  if (slider == 2) text.textContent = "Moderate drinking: noticeable immune weakening";
  if (slider == 3) text.textContent = "Heavy drinking: major immune suppression and infection risk";
}

function checkAnswer(answer) {
  const result = document.getElementById("quizResult");
   if (answer === true) {
    result.textContent = "yuhhhhh [explanation here]";
    result.style.color = "green";
  } else {
    result.textContent = "womp womp [explanation here]";
    result.style.color = "red";
  }
}

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

