let buttonDiv = document.querySelector(".buttonDiv");
let body = document.querySelector("body");
let cards = document.querySelector(".cards");
let modal = document.querySelector(".modal");
let getButtons = async () => {
  const getButtonsData = await fetch(
    "https://openapi.programming-hero.com/api/levels/all"
  );

  const buttonsJsonData = await getButtonsData.json();
  let buttons = await buttonsJsonData.data;

  //   lopping through all the buttons
  for (let button of buttons) {
    buttonDiv.innerHTML += `
        <button
            id=${button.id}
            data-isActive="${false}"
            data-level="${button.level_no}"
            class="btn flex items-center gap-1 border border-] py-1 px-3 rounded-sm"

          >
            <span>
              <img src="../assets/learn.png" alt="" />
            </span>
            <span>Lesson -${button.level_no}</span>
          </button>
        `;
  }
  //   when the button clicked data will be loaded
  let lessonBtn = buttonDiv.querySelectorAll("button");
  lessonBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      lessonBtn.forEach((otherBtn) => {
        otherBtn.classList.remove("button");
      });
      btn.classList.add("button");

      getWordById(btn);
    });
  });
};

window.addEventListener("load", getButtons);

// function to get all the words by Id

async function getWordById(btn) {
  cards.innerHTML = "";
  try {
    let getAllTheWords = await fetch(
      `https://openapi.programming-hero.com/api/level/${btn.dataset.level}`
    );
    let allWordsJson = await getAllTheWords.json();
    let allWord = allWordsJson.data;
    if (allWord.length === 0) {
      cards.innerHTML = `
        <div class="absolute inset-0 top-6 flex flex-col items-center">
            <img src="../assets/alert-error.png" alt="" />
            <p class="mt-4 mb-4 text-center">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2>নেক্সট Lesson এ যান</h2>
          </div>
        `;
    }
    for (let word of allWord) {
      cards.innerHTML += `
    <div id=${word.id} class="card p-9 md:p-[56px] text-center bg-white rounded-2xl">
            <div class="flex flex-col items-center">
              <h2 class="inter_font font-bold text-3xl">${word.word}</h2>
              <p class="inter_font font-bold text-xl mt-6 mb-8">
                Meaning/Pronounciation
              </p>
              <h2 class="hind_siliguri_font font-semibold text-3xl">
                "${word.meaning} / ${word.pronunciation}"
              </h2>
            </div>
            <div class="flex justify-between mt-[67px]">
              <img class='info' src="../assets/info.png" alt="" />
              <img src="../assets/volume.png" alt="" />
            </div>
          </div>
    `;
    }
    let infos = document.querySelectorAll(".info");
    infos.forEach((info) => {
      // when the button clicked info will be loaded
      info.addEventListener("click", async (e) => {
        let card = e.target.closest(".card").id;

        let getWord = await fetch(
          `https://openapi.programming-hero.com/api/word/${card}`
        );
        let wordJson = await getWord.json();
        let word = wordJson.data;
        console.log(word);

        modal.classList.toggle("hidden");
        modal.innerHTML = `
        <div
        class="fixed inset-0 w-[100vw] h-[100vh] flex items-center justify-center z-50 bg-gray-400/30"
      >
        <div
          class="w-[735px] h-[588px] bg-white flex flex-col items-start justify-center p-6 rounded-2xl"
        >
          <div class="p-6">
            <h2 class="mb-8 font-semibold text-4xl">
              ${word.word} (<img
                class="inline-block"
                src="../assets/microphone.png"
                alt=""
              />:${word.meaning})
            </h2>
            <div class="mb-8 text-2xl">
              <h4 class="mb-2 font-semibold">Meaning</h4>
              <h4 class="font-medium">${word.meaning}</h4>
            </div>
            <div class="mb-8 text-2xl">
              <h4 class="mb-2 font-semibold">Example</h4>
              <h4 class="font-medium">
                ${word.sentence}
              </h4>
            </div>
            <div class="mb-8 text-2xl">
              <h4 class="mb-2 font-semibold">সমার্থক শব্দ গুলো</h4>
              <div>
                <button class="bg-[#D7E4EF] px-5 py-2 rounded-sm mr-4">
                  ${word.synonyms[0]}
                </button>
                <button class="bg-[#D7E4EF] px-5 py-2 rounded-sm mr-4">
                  ${word.synonyms[1]}
                </button>
                <button class="bg-[#D7E4EF] px-5 py-2 rounded-sm">${word.synonyms[2]}</button>
              </div>
            </div>
          </div>
          <button
            class="completeBtn text-2xl font-medium px-9 py-2 bg-[#422AD5] text-white rounded-2xl"
          >
            Complete Learning
          </button>
        </div>
      </div>
        `;
        modal.querySelector(".completeBtn").addEventListener("click", () => {
          modal.classList.add("hidden");
          body.classList.toggle("overflow-hidden");
        });

        body.classList.toggle("overflow-hidden");
      });
    });
  } catch (error) {
    console.log(error);
  }
}

// logic for the login and logout

let header = document.querySelector("header");
let footer = document.querySelector("footer");
let learn = document.querySelector(".learn");
let FAQ = document.querySelector(".FAQ");
let banner = document.querySelector(".banner");

let loginName = document.getElementById("loginName");
let loginPass = document.getElementById("loginPass");
let loginBtn = document.getElementById("loginBtn");
let logoutBtn = document.getElementById("logout");

let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || "";
if (!isLoggedIn) {
  header.classList.add("hidden");
  learn.classList.add("hidden");
  FAQ.classList.add("hidden");
  footer.classList.add("hidden");
  banner.classList.remove("hidden");
}

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let loginNameValue = loginName.value;
  let loginPassValue = loginPass.value;

  if (!isNaN(loginNameValue || !loginNameValue)) {
    return Swal.fire({
      title: "oppss!",
      text: "Name cannot be only Number or Empty ",
      icon: "error",
    });
  }
  if (!loginPassValue || loginPassValue.length < 6) {
    return Swal.fire({
      title: "Error!",
      text: "Password have to be at least 6 characters ",
      icon: "error",
    });
  }

  if (loginPassValue !== "123456") {
    Swal.fire({
      title: "Error!",
      text: "Wrong Password!",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Welcome!",
      text: "You have successfully logged in !",
      icon: "success",
    });
    localStorage.setItem("isLoggedIn", "true");
    isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    if (isLoggedIn) {
      header.classList.remove("hidden");
      learn.classList.remove("hidden");
      FAQ.classList.remove("hidden");
      footer.classList.remove("hidden");
      banner.classList.add("hidden");
      console.log(isLoggedIn);
    }
  }
});

logoutBtn.addEventListener("click", () => {
  console.log("logout");
  window.location.reload();
  localStorage.setItem("isLoggedIn", "false");
});

// FAQ

let listDiv = document.querySelectorAll(".list div");
listDiv.forEach((list) => {
  let isClicked = true;
  list.addEventListener("click", (e) => {
    isClicked = !isClicked;
    if (isClicked) {
      e.currentTarget.querySelector("p").classList.add("hidden");
    } else {
      e.currentTarget.querySelector("p").classList.remove("hidden");
    }
  });
});
