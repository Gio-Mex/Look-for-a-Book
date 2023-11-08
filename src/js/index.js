// Initialization
import "../css/style.css";
import indexImage from "../img/indexImg.jpg";
import "material-icons";
let searchType = "subject";
let offset = 0;
let j = 0;

// DOM elements definition
const div = newElement("div", "bg-image", "div");

const indexImg = newElement(
  "img",
  "object-cover object-center vh-100 w-100",
  "homeImg",
  "",
  indexImage,
  "A pile of books"
);

const mask = newElement(
  "div",
  "mask py-5 d-flex align-items-center justify-content-center overflow-auto",
  "mask"
);
mask.style.backgroundColor = "rgba(0, 0, 0, 0.6)";

const div1 = newElement("div", "d-flex justify-content-center m-5", "div1");

const div2 = newElement("div", "text-white text-center m-md-3", "div2");

const h1 = newElement("h1", "display-1 fw-bold");
h1.innerText = "Look for a Book";
h1.style.fontFamily = "Calligraffitti";

const h2 = newElement("h2", "fs-4 my-4");
h2.innerText = "Powered by Open Library";

let inputBox = newElement(
  "div",
  "input-group w-100 p-1 my-1 my-md-4 border-0 text-center  d-flex flex-column flex-md-row justify-content-between",
  "form"
);

const dropdownButton = newElement(
  "button",
  "btn btn-outline-light rounded-0 dropdown-toggle dropdown-toggle-split",
  "inputButton",
  "button"
);
dropdownButton.setAttribute("data-mdb-toggle", "dropdown");
dropdownButton.setAttribute("aria-expanded", "false");
dropdownButton.innerText = "Subject ";

const dropdown = newElement("span", "visually-hidden", "span");

const dropdownMenu = newElement("ul", "dropdown-menu", "dropdownMenu");
dropdownMenu.style.cursor = "pointer";

const dropdownItem = newElement("li", "dropdown-item", "dropdownItem");
dropdownItem.innerText = "Title";

const dropdownItem1 = newElement("li", "dropdown-item", "dropdownItem1");
dropdownItem1.innerText = "Subject";

const searchButton = newElement(
  "button",
  "btn btn-outline-light rounded-0",
  "searchButton",
  "button"
);

const icon = newElement("span", "material-icons-outlined", "icon");
icon.innerText = "search";

const inputText = newElement(
  "input",
  "form-control w-auto h-auto text-center",
  "formInput",
  "search"
);
inputText.placeholder = "Search by Subject";

const quote = newElement("p", "text-center fs-4 mt-4 mb-0", "quote");
quote.innerText =
  "“Some books are to be tasted, others to be swallowed, and some few to be chewed and digested.” - Francesco Bacone";
quote.style.fontFamily = "Calligraffitti";

const galleryContainer = newElement(
  "div",
  "container-fluid",
  "galleryContainer"
);

const gallery = newElement(
  "div",
  "d-flex flex-wrap justify-content-center",
  "gallery"
);

const counter = newElement("div", "fs-4 text-center mb-2 mt-4", "counter");

const widget = newElement(
  "div",
  "bg-dark rounded-pill text-white fixed-top ms-auto pb-3 me-2 translate-middle-y d-flex justify-content-center shadow-5-strong",
  "widget"
);
widget.style.visibility = "hidden";

const widgetIcon = newElement(
  "a",
  "material-icons-outlined align-self-end text-light",
  "widgetIcon"
);
widgetIcon.innerText = "youtube_searched_for";
widgetIcon.style.cursor = "pointer";
widgetIcon.setAttribute("href", "#");

// Adding elements to DOM
document.body.appendChild(div);
div.appendChild(indexImg);
div.appendChild(mask);
mask.appendChild(div1);
div1.appendChild(div2);
div2.appendChild(h1);
div2.appendChild(h2);
div2.appendChild(inputBox);
inputBox.appendChild(dropdownButton);
inputBox.appendChild(dropdownMenu);
inputBox.appendChild(inputText);
inputBox.appendChild(searchButton);
dropdownButton.appendChild(dropdown);
dropdownMenu.appendChild(dropdownItem);
dropdownMenu.appendChild(dropdownItem1);
searchButton.appendChild(icon);
div2.appendChild(quote);
document.body.appendChild(galleryContainer);
document.body.appendChild(widget);
widget.appendChild(widgetIcon);

// Functions definition
function newElement(tagName, className, id, type, src, alt) {
  let element = document.createElement(tagName);
  element.id = id;
  element.className = className;
  if (type) {
    element.type = type;
  }
  if (src) {
    element.src = src;
  }
  if (alt) {
    element.alt = alt;
  }
  return element;
}



function addOverlay() {
  const overlay = newElement(
    "div",
    "fixed-top h-100 d-flex flex-wrap justify-content-center align-items-center overflow-auto",
    "overlay"
  );
  overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
  overlay.style.backdropFilter = "blur(3px)";
  overlay.setAttribute("z-index", "3");
  document.body.appendChild(overlay);
  document.body.classList.add("overlayActive");
}

function search() {
  const searchSubject = inputText.value.toLowerCase();
  if (!searchSubject) {
    return;
  }
  cleanGallery();
  loadGallery(searchSubject, offset);
}

function loading() {
  addOverlay();
  const spinnerContainer = newElement(
    "div",
    "text-light text-center d-flex flex-column align-items-center",
    "spinnerContainer"
  );
  const spinner = newElement("div", "spinner-border mb-2", "spinner");
  spinner.setAttribute("role", "status");

  const span = newElement("span", "fs-3", "spinnerSpan");
  span.textContent = "Looking for your book . . .";
  span.style.fontFamily = "Calligraffitti";

  overlay.appendChild(spinnerContainer);
  spinnerContainer.appendChild(spinner);
  spinnerContainer.appendChild(span);
}

async function getData(url, responseType) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetching data error ${response.status}`);
    }
    let data;
    if (responseType == "json") {
      data = await response.json();
    } else if (responseType == "blob") {
      data = await response.blob();
    } else {
      throw new Error(`Invalid responseType: ${responseType}`);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

async function getBookData(searchSubject, offset) {
  if (searchType == "subject") {
   return getData(
      `https://openlibrary.org/subjects/${searchSubject}.json?limit=12&offset=${offset}`,"json"
    );
  } else {
   return getData(
      `https://openlibrary.org/search.json?title=${searchSubject}&limit=12&offset=${offset}`,"json"
    );
  }
}

function getDescription(id) {
  return getData(`https://openlibrary.org${id}.json`, "json")
}

function showDescription(id) {
  getDescription(id)
    .then((data) => {
      const title = data.title;
      let description = data.description;
      if (!description) {
        description = "Sorry, no description available.";
      } else {
        if (typeof description === "object") description = description.value;
      }
      modal(title, description);
    })
}

function addBooks(offset) {
  const moreBooks = document.querySelector("#moreBooks");
  moreBooks.addEventListener("click", () => {
    const searchSubject = inputText.value.toLowerCase();
    offset += 12;
    loadGallery(searchSubject, offset);
  });
}

function cleanGallery() {
  if (document.querySelector("#moreBooks")) {
    document.body.removeChild(moreBooks);
  }
  gallery.innerHTML = "";
  widget.style.visibility = "hidden";
  j = 0;
}

function scrollDown() {
  window.scrollBy({
    top: (window.innerHeight / 100) * 90,
    behavior: "smooth",
  });
}

function modal(title, text) {
  addOverlay();

  const descriptionModal = newElement(
    "div",
    "col-md-8 bg-white rounded-5 shadow-5-strong m-2 p-4 p-lg-5",
    "descriptionModal"
  );
  const modalContent = newElement(
    "div",
    "d-flex flex-column align-items-center",
    "modalContent"
  );

  const modalTitle = newElement("h3", "", "modalTitle");
  modalTitle.textContent = title;
  modalTitle.style.fontFamily = "Calligraffitti";

  const modalText = newElement(
    "p",
    "mt-3 text-break overflow-auto",
    "modalText"
  );
  modalText.textContent = text;

  const modalCloseButton = newElement(
    "button",
    "btn btn-dark mt-3",
    "modalCloseButton",
    "button"
  );
  modalCloseButton.textContent = "close";
  modalCloseButton.addEventListener("click", closeModal);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalText);
  modalContent.appendChild(modalCloseButton);
  descriptionModal.appendChild(modalContent);
  overlay.appendChild(descriptionModal);

  function closeModal() {
    document.body.removeChild(overlay);
    document.body.classList.remove("overlayActive");
  }
}

function clickItem(event) {
  dropdownMenu.style.display = "none";
  inputText.placeholder = "Search by " + event.target.textContent;
  searchType = event.target.textContent.toLowerCase();
  dropdownButton.textContent = event.target.textContent + " ";
}

async function loadBooksData(data, dataCounter, dataSrc) {
  counter.innerText = `${dataCounter || "No"} works found`;
  try {
    let books = dataSrc;
    const cards = [];
    let dataAuthors = [];
    let book = {};
    for (let i = 0; i < books.length; i++) {
      dataAuthors = dataSrc[i].authors;
      book = {
        id: dataSrc[i].key,
        title: dataSrc[i].title,  
      }
      if (dataSrc == data.works) {
          book.authors = dataAuthors.map((authors) => authors.name).join(", ");
          book.cover = dataSrc[i].cover_id;
        } else {
          book.authors = data.docs[i].author_name?.join(", ") ?? "No author available",
          book.cover = dataSrc[i].cover_i;
        }
      j++;
      cards.push(newCard(book, j));
    }
    return cards;
  } catch (error) {
    console.log(error);
  }
}

async function loadCover(book) {
  return new Promise((resolve, reject) => {
    getData(`https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`, "blob")
      .then(data => {
        let url = URL.createObjectURL(data);
        let cardImg = newElement(
          "img",
          "overflow-hidden shadow-3-strong",
          "cardCover",
          "",
          url,
          "Book cover"
        );
        resolve(cardImg);
      })
      .catch(error => {
        reject(error);
      });
  });
}


async function newCard(book) {
  let card = newElement(
    "div",
    "card h-auto col-11 col-md-5 col-lg-3 m-4 shadow-5-strong",
    `card`
  );
  let cardRow = newElement(
    "div",
    "row align-items-center justify-content-center h-auto g-0"
  );
  card.appendChild(cardRow);

  let cardCol = newElement(
    "div",
    "col-6 col-lg-8 h-100 text-center",
    "cardCol"
  );
  cardRow.appendChild(cardCol);

  let cardBody = newElement(
    "div",
    "card-body pe-0 d-flex flex-column justify-content-between",
    "cardBody"
  );
  cardCol.appendChild(cardBody);

  let cardTitle = newElement("h5", "card-title", "bookTitle");
  cardTitle.innerText = book.title;
  cardBody.appendChild(cardTitle);

  let cardAuthors = newElement("p", "card-text");
  cardAuthors.innerText = book.authors;
  cardAuthors.style.fontFamily = "Calligraffitti";
  cardBody.appendChild(cardAuthors);

  let cardCol1 = newElement(
    "div",
    "col-5 col-md-6 col-lg-4 p-4 p-lg-3 d-flex align-items-center justify-content-center",
    "cardCol1"
  );
  cardRow.appendChild(cardCol1);

if (book.cover == undefined || null) {
  cardCol1.style.color = "#d7ccc8";
  cardCol1.innerText = "No cover available";
} else {
  await loadCover(book)
  .then (cardImg => {
    cardCol1.appendChild(cardImg);
  })
  }

  let descriptionButton = newElement(
    "button",
    " btn btn-light mx-auto shadow-3-strong",
    `descriptionButton-${book.id}`,
    "button"
  );
  descriptionButton.innerText = "Description";
  cardBody.appendChild(descriptionButton);

  descriptionButton.addEventListener("click", () => {
    showDescription(book.id);
  });
  gallery.appendChild(card);
}
async function loadGallery(searchSubject, offset) {
  loading();
  const data = await getBookData(searchSubject, offset);
  let cards = [];
    try {  
  if (searchType === "subject") {
    cards = await loadBooksData(data, data.work_count, data.works);
      }
  else {
    cards = await loadBooksData(data, data.numFound, data.docs);
    }
  } catch (error) {
      console.log(error);
  }
  
  Promise.allSettled(cards)
  .then(() => {
      galleryContainer.prepend(counter);

  galleryContainer.appendChild(gallery);

  scrollDown();

  document.body.removeChild(overlay);
  document.body.classList.remove("overlayActive");

  widget.style.visibility = "visible";

  if (
    !document.querySelector("#moreBooks") &&
    (data.work_count || data.numFound > 0)
  ) {
    let moreBooks = newElement(
      "p",
      "text-center bottom-0 fs-5 my-4 cursor-pointer ",
      "moreBooks"
    );
    moreBooks.innerText = "More books...";
    moreBooks.style.cursor = "pointer";
    document.body.appendChild(moreBooks);
    addBooks(offset);
  }
  })
}

// Events
dropdownButton.addEventListener("click", () => {
  if (dropdownMenu.style.display === "block") {
    dropdownMenu.style.display = "none";
  } else {
    dropdownMenu.style.display = "block";
  }
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", clickItem, { once: true });
  });
});

document.addEventListener("click", (event) => {
  if (event.target !== dropdownButton) {
    dropdownMenu.style.display = "none";
  }
});

inputText.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    search();
  }
});

searchButton.addEventListener("click", () => {
  search();
});


