let news = [];
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchbtn = document.getElementById("search-btn");
let url;

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "RaLcql7muXSjkldjKSRszB8dUTWxkTduHu1Mylf8oJw",
    });
    let response = await fetch(url, { headers: header }); //ajax, http,fetch   async 와 await 은 세트
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }
      news = data.articles;
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("에러 발생 : ", error.message);
    errorRender(error.message);
  }
};

//news api부르는 함수
const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=kr&page_size=10`
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=kr&page_size=10&topic=${topic}`
  );
  getNews();
};

const getNewByKeyword = async () => {
  //1. 검색 키워드 읽어오기
  //2. url에 검색 키워드 붙이기
  //3. 헤더준비
  //4. url 부르기
  //5. 데이터 가져오기
  //6. 데이터 보여주기

  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return ` <div class="row news">
    <div class="col-lg-4">
      <img
        class="news-img-size"
        src="${item.media}"
        alt=""
      />
    </div>
    <div class="col-lg-8">
      <h2>${item.title}</h2>
      <p>
        ${item.summary}
      </p>
      <div>${item.rights}  * ${item.published_date}</div>
    </div>
  </div>`;
    })
    .join(""); // array를 string 으로 바꿔주기 위해 .join("")

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

getLatestNews();
searchbtn.addEventListener("click", getNewByKeyword);
