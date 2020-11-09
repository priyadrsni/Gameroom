const games = document.getElementById('games');
const categories = document.getElementById('categories');
let isGamesOpen = true;
let isCategoriesOpen = true;


// Side nav drop downs
games.addEventListener('click', () => {
  if (!isGamesOpen) {
    games.parentElement.children[1].style.maxHeight = "600px";
    games.children[1].style.transform = "rotate(180deg)";
    isGamesOpen = true;
  }
  else {
    games.parentElement.children[1].style.maxHeight = 0;
    games.children[1].style.transform = "rotate(0deg)";
    isGamesOpen = false;
  }
});

categories.addEventListener('click', () => {
  if (!isCategoriesOpen) {
    categories.parentElement.children[1].style.maxHeight = "600px";
    categories.children[1].style.transform = "rotate(180deg)";
    isCategoriesOpen = true;
  }
  else {
    categories.parentElement.children[1].style.maxHeight = 0;
    categories.children[1].style.transform = "rotate(0deg)";
    isCategoriesOpen = false;
  }
});


// language Dropdown
const languages = document.querySelector('#languages');
const arrow = document.querySelector(".arrow-down");
const dropdownList = document.querySelector(".dropdown-list");
const dropdown = document.querySelector(".dropdown");

dropdown.addEventListener('click', () => {
  dropdown.classList.toggle('open');
});

const language = document.querySelector(".language");

let langList = dropdownList.children;
let currentActiveList = langList[0];

for (let i = 0; i < langList.length; i++) {
  langList[i].addEventListener("click", () => {
    language.textContent = langList[i].textContent;
    currentActiveList.classList.remove("active");
    langList[i].classList.add("active");
    currentActiveList = langList[i];
    dropdown.classList.toggle('open');
  });
}


// Populate data
let carouselContainer = document.querySelectorAll('.carousel');
const categoriesList = document.querySelector('.categories-list');
const sideNavMenus = document.querySelector('.side-nav__menu-items');
const pageContent = document.querySelector('.page-content');
let currentlyActive = categoriesList.children[0];
let loaderGif = document.querySelector('.loader');
let noOfQuests = 0,
  noOfPopularOnes = 0;

for (let i = 0; i < sideNavMenus.childElementCount; i++) {
  sideNavMenus.children[i].addEventListener('click', () => {
    let selectedMenu = sideNavMenus.children[i];
    let selectedMenuId = selectedMenu.children[0].getAttribute('href').split("#")[1];

    if (selectedMenuId !== undefined) {
      document.getElementById(selectedMenuId).innerHTML = `<h3>${selectedMenu.innerText}</h3>`;
    }
  })
}

for (let i = 0; i < categoriesList.childElementCount; i++) {
  categoriesList.children[i].addEventListener('click', () => {
    currentlyActive.classList.remove('active-list');
    categoriesList.children[i].classList.add('active-list');
    currentlyActive = categoriesList.children[i];
    let showLoader = () => {
      loaderGif.style.display = "block";
      setTimeout(() => {
        loaderGif.style.display = "none";
        populateData(categoriesList.children[i].innerText);
      }, 500);
    }
    showLoader();
  });
}
let defaultCategory = "Action";


window.addEventListener('DOMContentloaded', () => {
  console.log("hellooo");
  
  populateData(defaultCategory);
});
document.querySelector('a[href="#action"]').click();

// window.addEventListener('storage', () => {
//   console.log('storage');
//   currentTheme = localStorage.getItem('theme')
//   if (currentTheme) {
//     document.documentElement.setAttribute('data-theme', currentTheme);

//     if (currentTheme === 'light') {
//       toggleSwitch.click();
//     }
//   }
// });

// categoriesList.children[0].click();
function populateData(category) {
  fetch("\games.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(game => {
        if (game.gameGenre === category && category === "Action") {
          populateActionGames(game.gameType, game.gameName, game.gameGenre, game.gameImage, game.gameGoal, game.gameCoins, game.gameEnergy);
        }
        else {
          document.getElementById(category.toLowerCase()).innerHTML = `<h3>${category}</h3>`;
        }
      });
      createCarousel();

    })
}

function populateActionGames(type, name, genre, image, goal, coins, energy) {
  if (type === "quest") {
    noOfQuests++;

    let element = `<article class="card">
                  <img src="${image}" alt="game snapshot">
                  <span class="badge card__genre">${genre}</span>
                  <section class="card__content">
                    <h3>${name}</h3>
                    <p>${goal}</p>
                  </section>
                  <div class="card__action">
                    <span class="coins">
                      <span class="badge badge--small"><span class="icon shape1"></span></span>
                      <span>${coins}</span>
                    </span>
                    <span class="energy">
                      <span class="badge badge--red badge--small"><span class="icon icon-1"></span></span>
                      <span>${energy}</span>
                    </span>
                    <button class="btn btn-primary">Accept</button>
                  </div>
                </article>`;
    carouselContainer[0].innerHTML += element;
  }
  else if (type === "popular") {
    noOfPopularOnes++;
    let element = `<article class="card card--small">
                  <img src="${image}" alt="game snapshot">
                  <span class="badge card__genre card--small__genre">${genre}</span>
                  <section class="card__content card--small__content">
                    <h3>${name}</h3>
                    <p>${goal}</p>
                  </section>
                  <div class="card__action">
                    <span class="coins">
                      <span class="badge badge--small"><span class="icon shape1"></span></span>
                      <span>${coins}</span>
                    </span>
                    <span class="energy">
                      <span class="badge badge--red badge--small"><span class="icon icon-1"></span></span>
                      <span>${energy}</span>
                    </span>
                    <button class="btn btn-primary">Accept</button>
                  </div>
                </article>`;
    carouselContainer[1].innerHTML += element;
  }
}

// Carousel
const prevBtn = document.querySelectorAll('.prev');
const nextBtn = document.querySelectorAll('.next');
function createCarousel() {
  let carouselContainerWidth = 263 * (noOfQuests - 3);
  carouselContainer[0].style.width = carouselContainerWidth + "px";

  carouselContainerWidth = 263 * (noOfPopularOnes - 3);
  carouselContainer[1].style.width = carouselContainerWidth + "px";

  //   const debounce = (func, delay) => { 
  //     let debounceTimer 
  //     return function() { 
  //         const context = this
  //         const args = arguments 
  //             clearTimeout(debounceTimer) 
  //                 debounceTimer 
  //             = setTimeout(() => func.apply(context, args), delay) 
  //     } 
  // } 

  // let timerId;
  const throttleFunction = (func, delay) => {

    // If setTimeout is already scheduled, no need to do anything
    // if (timerId) {
    //   return
    // }

    // // Schedule a setTimeout after delay seconds
    // timerId = setTimeout(function () {
    //   func()

    //   // Once setTimeout function execution is finished, timerId = undefined so that in <br>
    //   // the next scroll event function execution can be scheduled by the setTimeout
    //   timerId = undefined;
    // }, delay)

    // Previously called time of the function 
    let prev = 0;
    return (...args) => {
      // Current called time of the function 
      let now = new Date().getTime();

      // If difference is greater than delay call 
      // the function again. 
      if (now - prev > delay) {
        prev = now;
        // "..." is the spread operator here  
        // returning the function with the  
        // array of arguments 
        return func(...args);
      }
    }
  }
  for (let i = 0; i < prevBtn.length; i++) {
    let carouselMarginLeft = 0;
    const moveLeftInCarousel = () => {
      if ((carouselMarginLeft) < 0) {
        carouselMarginLeft = parseInt(getComputedStyle(carouselContainer[i]).marginLeft) + 263;
        carouselContainer[i].style.marginLeft = carouselMarginLeft + "px";
      }
    }

    const moveRightInCarousel = () => {
      if ((carouselMarginLeft * -1) < carouselContainerWidth) {
        carouselMarginLeft = parseInt(getComputedStyle(carouselContainer[i]).marginLeft) - 263;
        carouselContainer[i].style.marginLeft = carouselMarginLeft + "px";
      }
    }
    prevBtn[i].addEventListener('click', throttleFunction(moveLeftInCarousel, 250));
    nextBtn[i].addEventListener('click', throttleFunction(moveRightInCarousel, 250));
  }
}


// Toggle between dark and light theme
const bodyContent = document.querySelector('body');
const toggleSwitch = document.getElementById('switchTheme');

toggleSwitch.children[0].checked = localStorage.getItem('checked');
function switchTheme(e) {
  if (toggleSwitch.children[0].checked) {
    document.documentElement.setAttribute('data-theme', '');
    localStorage.setItem('theme', '');
    localStorage.setItem('checked', 'true');
  }
  else if(!toggleSwitch.children[0].checked) {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    localStorage.setItem('checked', 'false');
  }
}
toggleSwitch.addEventListener('change', switchTheme);
let currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'light') {
      toggleSwitch.click();
    }
}

// Scroll bar

// let debounceResize;
// window.addEventListener("resize", () => {
//   clearTimeout(debounceResize);
//   debounceResize = setTimeout(() => {
//     totalPageHeight = document.body.scrollHeight - window.innerHeight;
//   }, 250);
// });

// const progressBarContainer = document.querySelector("#progressBarContainer");
// progressBarContainer.addEventListener("click", (e) => {
//   let newPageScroll = e.clientY / progressBarContainer.offsetHeight * totalPageHeight;
//   window.scrollTo({
//     top: newPageScroll,
//     behavior: 'smooth'
//   });
// });