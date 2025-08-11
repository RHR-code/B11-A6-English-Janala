let buttonDiv = document.querySelector(".buttonDiv");
let cards = document.querySelector(".cards");

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
            data-level="${button.level_no}"
            class="flex items-center gap-1 border border-[rgba(66,42,213,1)] py-1 px-3 rounded-sm"

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
    btn.addEventListener("click", () => {
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
    console.log(allWord);
    if (allWord.length === 0) {
      cards.innerHTML = `
        <div class="absolute inset-0 top-6 flex flex-col items-center">
            <img src="../assets/alert-error.png" alt="" />
            <p class="mt-4 mb-4">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2>নেক্সট Lesson এ যান</h2>
          </div>
        `;
    }
    for (let word of allWord) {
      cards.innerHTML += `
    <div id=${word.id} class="p-[56px] text-center bg-white rounded-2xl">
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
              <img src="../assets/info.png" alt="" />
              <img src="../assets/volume.png" alt="" />
            </div>
          </div>
    `;
    }
  } catch (error) {
    console.log(error);
  }
}
