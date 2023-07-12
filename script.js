const containerOutput = document.querySelector(".articles-container");
const newsFeedBtn = document.querySelector(".newsfeed");
const topicBtn = document.querySelector(".topics-container");
const allTopic = document.querySelectorAll(".topic-button");
const favBtn = document.querySelector(".favourites");
const topicLine = document.querySelector(".topic-line");
let dataArray = [];

newsFeedBtn.addEventListener("click", () => {
  if (!newsFeedBtn.classList.contains("active")) {
    allTopic.forEach((topic) => {
      topic.classList.remove("active-topic");
    });
    allTopic[0].classList.add("active-topic");
    newsFeedBtn.classList.add("active");
    favBtn.classList.remove("active");
    topicBtn.style.visibility = "visible";
    topicLine.style.visibility = "visible";
    fetchData();
  }
});

favBtn.addEventListener("click", () => {
  if (!favBtn.classList.contains("active")) {
    newsFeedBtn.classList.remove("active");
    favBtn.classList.add("active");
    topicBtn.style.visibility = "hidden";
    topicLine.style.visibility = "hidden";
    const favString = localStorage.getItem("fav");
    const favArray = JSON.parse(favString);
    const filteredArray = dataArray.filter((newsID) => {
      return favArray.includes(newsID.id + "");
    });
    renderNews(filteredArray);
  }
});

topicBtn.addEventListener("click", (e) => {
  if (e.target.classList.contains("topic-button")) {
    allTopic.forEach((topic) => {
      topic.classList.remove("active-topic");
    });
    e.target.classList.add("active-topic");
    if (e.target.textContent === "All") {
      renderNews(dataArray);
    } else {
      const updatedArray = dataArray.filter((news) => {
        return e.target.textContent.toLowerCase() === news[" category"];
      });
      renderNews(updatedArray);
    }
  }
});

async function fetchData() {
  const data = await fetch(
    "https://content.newtonschool.co/v1/pr/64806cf8b7d605c99eecde47/news"
  );
  const data1 = await data.json();
  let counter = 1;
  dataArray = [...data1];
  dataArray.forEach((object) => {
    object.id = counter++;
  });
  renderNews(dataArray);
}

function renderNews(array) {
  containerOutput.innerHTML = "";
  const favArray = getFromLocalStorage();
  array.forEach((news) => {
    const key1 = " author";
    const key2 = " category";
    const { [key1]: author, [key2]: category, content, url, id } = news;
    const favNews = favArray.indexOf(id + "") > -1;
    let elem = document.createElement("section");
    elem.className = "article";
    elem.innerHTML = `<div class="author">By <span class="author-name">${author}</span></div>
          <div class="category">&#8226; ${category}</div>
          <div class="content">
            ${content}
            <a
              href="${url}"
              class="article-link"
              >Read More</a
            >
          </div>
          <section class="icon-container" onClick="favHandler(event)">
            <span id="${id}" class="fav-icon fa-regular fa-heart ${
      favNews ? "fa-solid" : ""
    }"></span>
          </section>`;
    containerOutput.appendChild(elem);
  });
}

function getFromLocalStorage() {
  const favString = JSON.parse(localStorage.getItem("fav"));
  if (favString == null || favString == undefined) {
    return [];
  } else {
    return favString;
  }
}

function addToLocalStorage(id) {
  const favArray = getFromLocalStorage();
  const updatedFav = [...favArray, id];
  localStorage.setItem("fav", JSON.stringify(updatedFav));
}

function removeFromLocalStorage(id) {
  const favArray = getFromLocalStorage();
  const updatedFav = favArray.filter((favID) => favID != id);
  localStorage.setItem("fav", JSON.stringify(updatedFav));
}

function favHandler(e) {
  if (e.target.classList.contains("fa-solid")) {
    removeFromLocalStorage(e.target.id);
    e.target.classList.remove("fa-solid");
  } else {
    addToLocalStorage(e.target.id);
    e.target.classList.add("fa-solid");
  }
}
