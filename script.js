const PATH = "https://rickandmortyapi.com/api";
const MY_PATH = "https://rickandmortyapi-xkwe.onrender.com";
let allCharacters = []; // все персонажи
let fullArrayToShow = []; // персонажи, с которыми работаем (напр., фильтрованные)
let loading = true;
let currentPage = 1;
let pagesCount = 1;
const PER_PAGE = 20;
const currentP = document.querySelector("#currentPage");
const totalP = document.querySelector("#totalPages");
const main = document.querySelector("main");
const prevBtns = document.querySelectorAll(".prev");
const nextBtns = document.querySelectorAll(".next");
const searchInput = document.querySelector("#search");
const loadingEl = document.querySelector("#loading");
const pagination = document.querySelector(".pages");

function setLoading(state) {
  loading = state;
  loadingEl.style.display = state ? "block" : "none";
  pagination.style.display = state ? "none" : "block";
  document.querySelector("footer").style.display = state ? "none" : "block";
}

// Случайное высказывание:
setLoading(true);
fetch(`${MY_PATH}/quote`)
  .then((r) => r.json())
  .then((data) => {
    const randomQuote = data[Math.floor(Math.random() * data.length)];
    document.querySelector("#quote").textContent = randomQuote.text;
  });
setLoading(false);

// Случайное сообщение о загрузке:
const loadingMessages = [
  "Портал открыт, данные уже вылетают из своих галактик...",
  "Морти, держись! Мы загружаем!",
  "Межпространственная передача началась!",
  "Пакеты данных проходят сквозь кротовую нору...",
  "Летим через галактику за вашими данными...",
  "Рик что-то нажал, и теперь загрузка занимает вечность!",
  "Гравитационные волны мешают сигналу... Рик уже всё чинит, а пока подождите!",
  "Подождите! Морти, я почти загрузил это! Почти!",
  "Вселенная слегка тормозит. Подождите...",
  "Собираем биты информации... осторожно, возможен небольшой хлопок.",
  "Загрузка межгалактических данных... не паникуйте, всего пара световых лет!",
  "Загрузка данных может занять 42 секунды или вечность. Или не занять.",
  "Почти готово! Вселенский интернет не самый быстрый...",
];
const randomMessage =
  loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
loadingEl.textContent = randomMessage;

// Загрузка всех персонажей из Rick&MortyAPI:
async function fetchOfficialCharacters() {
  let officialCharacters = [];
  let url = `${PATH}/character/`;
  while (url) {
    const response = await fetch(url);
    const data = await response.json();
    officialCharacters = officialCharacters.concat(data.results);
    url = data.info.next;
  }
  return officialCharacters;
}

// Объединение персонажей из Rick&MortyAPI с кастомными:
async function joinCharacters() {
  setLoading(true);
  const [mainData, myData] = await Promise.all([
    fetchOfficialCharacters(),
    fetch(`${MY_PATH}/character`).then((r) => r.json()),
  ]);
  setLoading(false);
  const joined = [mainData[0], ...myData, ...mainData.slice(1)];
  return joined;
}

// Получение персонажей, которые попадут на заданную страницу:
function getPage(array, page) {
  const start = (page - 1) * PER_PAGE;
  return array.slice(start, start + PER_PAGE);
}

// Отображение персонажей из заданной страницы данных на странице сайта:
function showPage(characters, pageNumber) {
  const charactersToShow = getPage(characters, pageNumber);

  pagesCount = Math.ceil(characters.length / PER_PAGE);
  loading = false;
  totalP.textContent = pagesCount;

  clearPage();
  currentP.textContent = pageNumber;

  if (currentPage === 1) {
    prevBtns.forEach((b) => (b.disabled = true));
    prevBtns.forEach((b) => b.classList.remove("active"));
  }
  if (currentPage === pagesCount) {
    nextBtns.forEach((b) => (b.disabled = true));
    nextBtns.forEach((b) => b.classList.remove("active"));
  }

  charactersToShow.forEach((el) => {
    const card = document.createElement("div");
    const title = document.createElement("p");
    const img = document.createElement("img");
    card.classList.add("card");
    title.textContent = el.name;
    img.src = el.image;
    card.append(title, img);
    main.append(card);
    card.addEventListener("click", () => showDetails(el));
  });
}

searchInput.addEventListener("input", filterCharacters);

function filterCharacters() {
  const value = searchInput.value.toLowerCase();
  if (value === "") {
    fullArrayToShow = allCharacters;
  } else {
    fullArrayToShow = allCharacters.filter((char) =>
      char.name.toLowerCase().includes(value)
    );
  }
  currentPage = 1;
  showPage(fullArrayToShow, currentPage);
}

joinCharacters().then((characters) => {
  allCharacters = characters;
  fullArrayToShow = [...characters];
  showPage(fullArrayToShow, currentPage);
});

nextBtns.forEach((b) =>
  b.addEventListener("click", () => {
    if (currentPage < Math.ceil(fullArrayToShow.length / PER_PAGE)) {
      currentPage++;
      showPage(fullArrayToShow, currentPage);
    }
  })
);

prevBtns.forEach((b) =>
  b.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      showPage(fullArrayToShow, currentPage);
    }
  })
);

// Прокрутим наверх, если перелистнули нижней кнопкой:
document.querySelectorAll("footer button").forEach((b) => {
  b.addEventListener("click", () => {
    main.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function clearPage() {
  nextBtns.forEach((b) => (b.disabled = false));
  nextBtns.forEach((b) => b.classList.add("active"));
  prevBtns.forEach((b) => (b.disabled = false));
  prevBtns.forEach((b) => b.classList.add("active"));
  main.innerHTML = "";
}

function showDetails(character) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modalcontent">
<img src="./pics/circle-xmark.svg" class="close" alt="close"/>
      <h2>${character.name}</h2>
      <img src="${character.image}" class="photo" alt="${character.name}">
      <p><b>Status:</b> ${character.status}</p>
      <p><b>Species:</b> ${character.species}</p>
      <p><b>Gender:</b> ${character.gender}</p>
      <p><b>Origin:</b> ${character.origin.name}</p>
      <p><b>Location:</b> ${character.location.name}</p>
      ${
        character.location.name.includes("S-90")
          ? `<a href="https://youtu.be/5K0njIual6Q?si=xF0MDW6ECFP3s4DS" target="_blank">🎥 Watch the episode</a>`
          : ""
      }
    </div>`;

  document.body.appendChild(modal);
  modal.querySelector(".close").onclick = () => modal.remove();
}

// 40 случайных звезд в верхней половине экрана:
drawStars(40, 0, 50);
// 20 случайных звезд в нижней половине экрана:
drawStars(20, 50, 100);

function drawStars(starsCount, from, to) {
  for (let i = 0; i < starsCount; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const starSize = Math.random() * 10 + 1;
    star.style.width = star.style.height = `${starSize}px`;
    star.style.left = `calc(${Math.random() * 100}% - 10px)`; // сместим влево на максимальный диаметр звезды, чтобы не было прокрутки снизу
    star.style.top = `${Math.random() * to + from}%`;
    document.body.appendChild(star);
  }
}

// Сброс фильтра:
document.addEventListener("click", (event) => {
  if (
    event.target !== searchInput &&
    !event.target.closest(".next") &&
    !event.target.closest(".prev") &&
    searchInput.value
  ) {
    searchInput.value = "";
    filterCharacters();
  }
});
