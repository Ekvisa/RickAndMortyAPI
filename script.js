const PATH = "https://rickandmortyapi.com/api";
const MY_PATH = "http://localhost:3002";

function getCharacters(p, filter) {
  currentP.textContent = p;
  let query = `page=${p}`;
  loading = true;
  if (filter) {
    query = filter;
  }
  // Запрос к обычным персонажам на rickandmortyapi:
  const mainFetch = fetch(`${PATH}/character/?${query}`).then((r) => r.json());

  // Запрос к моим персонажам (добавим их только на первую страницу, после Рика):
  const myFetch =
    p === 1
      ? fetch(`${MY_PATH}/character`).then((r) => r.json())
      : Promise.resolve([]);

  Promise.all([mainFetch, myFetch]).then(([data, mydata]) => {
    console.log(data);
    console.log(mydata);
    loading = false;
    maxPage = data.info.pages;
    totalP.textContent = maxPage;
    clearPage();
    const characters = data.results;
    const updatedCharacters = [
      characters[0],
      ...mydata,
      ...characters.slice(1),
    ];
    updatedCharacters.forEach((element) => {
      showPage(element);
    });
  });
  //   Promise.all([
  //     fetch(`${PATH}/character/?${query}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data);
  //         loading = false;
  //         maxPage = data.info.pages;
  //         totalP.textContent = maxPage;
  //         clearPage();
  //         data.results.forEach((element) => {
  //           showPage(element);
  //         });
  //       }),
  //     fetch(`${MY_PATH}/character/`)
  //       .then((myresponse) => myresponse.json())
  //       .then((mydata) => {
  //         console.log(mydata);
  //         loading = false;
  //         mydata.forEach((element) => {
  //           showPage(element);
  //         });
  //       }),
  //   ]);
}

// function getCharacters(p, filter) {
//   currentP.textContent = p;
//   let query = `page=${p}`;
//   loading = true;
//   if (filter) {
//     query = filter;
//   }
//   fetch(`${PATH}/character/?${query}`)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       loading = false;
//       maxPage = data.info.pages;
//       totalP.textContent = maxPage;
//       clearPage();
//       data.results.forEach((element) => {
//         showPage(element);
//       });
//     });
// }

let page = 1;
let maxPage = 0;
let loading = false;
const main = document.querySelector("main");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const filterBtn = document.querySelector("#filter");
const currentP = document.querySelector("#currentPage");
const totalP = document.querySelector("#totalPages");

nextBtn.addEventListener("click", () => {
  if (loading) return;
  if (page === maxPage) return;
  page++;
  getCharacters(page);
});

prevBtn.addEventListener("click", () => {
  if (loading) return;
  if (page === 1) return;
  page--;
  getCharacters(page);
});

filterBtn.addEventListener("click", () => {
  if (loading) return;
  getCharacters(0, "name=rick");
});

function showPage(character) {
  const div = document.createElement("div");
  const title = document.createElement("span");
  const species = document.createElement("span");
  const img = document.createElement("img");
  div.classList.add("card");

  title.textContent = character.name;
  species.textContent = character.specises;
  img.src = character.image;
  div.append(title, img, species);
  main.append(div);
}

function clearPage() {
  main.innerHTML = "";
}

getCharacters(page);
