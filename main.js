let news = [];
let page = 1;
let total_pages = 0;
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
    url.searchParams.set("page", page); // api에 &page=page 이런식으로 추가하는 것
    console.log(url);
    let response = await fetch(url, { headers: header }); //ajax, http,fetch   async 와 await 은 세트
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.`");
      }
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      render();
      pagenation();
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

//pagenation

const pagenation = () => {
  let pagenationHTML = ``;
  //total_page
  //page
  //page group
  let pageGroup = Math.ceil(page / 5);
  //last
  let last = pageGroup * 5;
  //first
  let first = last - 4 <= 0 ? 1 : last - 4;
  //first~last 페이지 프린트

  //total page 3이라면 3개의 페이지만 프린트
  //<< >> 버튼 만들기
  // 내가 그룹1 일때 << < 이 버튼 삭제
  // 내가 마지막 그룹일때 > >> 버튼 삭제

  if (first >= 6) {
    pagenationHTML = `<li class="page-item" onclick="pageClick(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="pageClick(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }

  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" href='#js-bottom' onclick="pageClick(${i})" >${i}</a>
                       </li>`;
  }

  if (last < total_pages) {
    pagenationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="pageClick(${total_pages})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }

  //   pagenationHTML = `  <li class="page-item">
  //   <a class="page-link" href="#" aria-label="Previous">
  //     <span aria-hidden="true">&laquo;</span></a></li>

  //   <li class="page-item">
  //     <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
  //       page - 1
  //     })">
  //   <span aria-hidden="true">&lt;</span></a></li>`;

  //   for (let i = first; i <= last; i++) {
  //     pagenationHTML += `<li class="page-item ${
  //       page == i ? "active" : "" //page 가 i랑 번호가 같으면 active 클래스 추가 아니면 "" (삼항연산)
  //     }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  //   }

  //   pagenationHTML += `    <li class="page-item">
  //   <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
  //     page + 1
  //   })">
  //     <span aria-hidden="true">&gt;</span>
  //   </a>
  // </li>
  // <li class="page-item">
  //       <a class="page-link" href="#" aria-label="Next">
  //         <span aria-hidden="true">&raquo;</span>
  //       </a>
  //     </li>`;

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const pageClick = (pageNum) => {
  //7.클릭이벤트 세팅
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
};

const errorRender = (message) => {
  document.getElementById(
    "news-board"
  ).innerHTML = `<h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
};
getLatestNews();

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

searchbtn.addEventListener("click", getNewByKeyword);
