let questions = [];
let randomQuestions = [];
let currentQuestion = null;
let currentQuestionIndex = 0;
let score = 0;

// JSONデータをロード
async function loadQuestions() {
  try {
    const response = await fetch("../assets/script/questions.json");
    if (!response.ok) {
      throw new Error("Failed to load JSON data.");
    }
    questions = await response.json();
    startGame();
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

// 配列をシャッフル
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ゲーム開始
function startGame() {
  currentQuestionIndex = 0;
  score = 0;
  randomQuestions = shuffleArray([...questions]).slice(0, 5);
  document.getElementById("finalScreen").style.display = "none";
  initGame();
}

// ゲーム初期化
function initGame() {
  if (currentQuestionIndex >= randomQuestions.length) {
    showFinalScreen();
    return;
  }

  currentQuestion = randomQuestions[currentQuestionIndex];
  document.getElementById("gameScreen").style.display = "block";
  document.getElementById("resultScreen").style.display = "none";

  document.getElementById("currentQuestionNumber").textContent = currentQuestionIndex + 1;
  document.getElementById("question").textContent = currentQuestion.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  const optionLabels = ["A", "B", "C"];

  currentQuestion.options.forEach((option, index) => {
    const optionId = `option${index}`;
    const label = document.createElement("label");
    label.className = "option-label";
    label.textContent = `${optionLabels[index]}. ${option}`;
    label.htmlFor = optionId;

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = optionId;
    radio.name = "option";
    radio.value = option;
    radio.className = "option-radio"

    optionsDiv.appendChild(radio);
    optionsDiv.appendChild(label);
  });

  document.getElementById("hint1").onclick = () => showHint(currentQuestion.hints[0]);
  document.getElementById("hint2").onclick = () => showHint(currentQuestion.hints[1]);
  document.getElementById("hint3").onclick = () => showHint(currentQuestion.hints[2]);

  document.getElementById("authorName").textContent = currentQuestion.author;

  // "回答する" ボタンにイベントリスナーを設定
  document.getElementById("submitAnswer").addEventListener("click", submitAnswer);

   // 5問目の場合、ボタンを「結果を見る」に変更
   if (currentQuestionIndex + 1 === randomQuestions.length) {
    document.getElementById("nextButton").textContent = "結果を見る";
  } else {
    document.getElementById("nextButton").textContent = "次の問題へ";
  }
}

// ヒントの表示
function showHint(hintText) {
  const modal = document.getElementById("hintModal");
  const hintTextElement = document.getElementById("hintText");

  // ヒントテキストを設定
  hintTextElement.textContent = hintText;

  // モーダルを表示
  modal.style.display = "block";
}
function closeModal() {
  const modal = document.getElementById("hintModal");
  modal.style.display = "none";
}

// 答えの送信
function submitAnswer() {
  const selectedOption = document.querySelector("input[name='option']:checked");
  if (!selectedOption) {
    alert("選択肢を選んでください。");
    return;
  }

  const selectedValue = selectedOption.value;
  checkAnswer(selectedValue, currentQuestion.answer);
}

// 答えの確認
function checkAnswer(selected, correct) {
  const resultMessageDiv = document.getElementById("resultMessage");
  const resultContainer = document.getElementById("resultImageContainer");
  const resultImage = document.getElementById("resultImage");
  const resultExplanation = document.getElementById("resultExplanation");
  const selectedAnswerSpan = document.getElementById("selectedAnswer");
  const correctAnswerSpan = document.getElementById("correctAnswer");
  const resultQuestionText = document.getElementById("resultQuestionText");
  const resultAnswerText = document.getElementById("resultAnswerText");
  const resultComment = document.getElementById("resultComment");

  // クラスをリセット
  resultContainer.className = "result-text";

  // 選択肢をアルファベットに変換するためのマッピング
  const optionLetters = ["A", "B", "C", "D"];
  const selectedIndex = currentQuestion.options.indexOf(selected);
  const correctIndex = currentQuestion.options.indexOf(correct);

  const selectedLetter = optionLetters[selectedIndex] || "N/A";
  const correctLetter = optionLetters[correctIndex] || "N/A";

  // 正解/不正解の処理
  if (selected === correct) {
    // 正解の場合
    resultMessageDiv.textContent = "正解";
    resultImage.src = "../assets/img/text_eureka.svg"; // 正解画像のパスを指定
    resultImage.alt = "エウレーカ！";
    resultContainer.classList.add("correct"); // 正解用クラスを追加
    score++; // スコア加算
  } else {
    // 不正解の場合
    resultMessageDiv.textContent = "不正解…";
    resultImage.src = "../assets/img/text_incorrect.svg"; // 不正解画像のパスを指定
    resultImage.alt = "ざんねん…";
    resultContainer.classList.add("incorrect"); // 不正解用クラスを追加
  }

  // 問題文・解答・コメントを設定
  resultQuestionText.textContent = currentQuestion.question;
  resultAnswerText.textContent = currentQuestion.answer;
  resultComment.textContent = currentQuestion.comment;

  // 「あなたの答え」と「正解」にアルファベットを設定
  selectedAnswerSpan.textContent = selectedLetter;
  correctAnswerSpan.textContent = correctLetter;

  resultExplanation.textContent = currentQuestion.explanation;
  document.getElementById("sourceLink").href = currentQuestion.source_url;
  document.getElementById("sourceLink").textContent = currentQuestion.source_title;

  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "block";
}

// 5問目の後は結果を見る画面に進む
function nextQuestion() {
  if (currentQuestionIndex + 1 === randomQuestions.length) {
    showFinalScreen(); // 結果画面を表示
  } else {
    currentQuestionIndex++;
    initGame(); // 次の問題へ
  }
}


// 結果発表
function showFinalScreen() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "none";
  document.getElementById("finalScreen").style.display = "block";
  document.getElementById("finalScore").textContent = score;
}

// ゲーム再開
function restartGame() {
  startGame();
}

// JSONデータのロード開始
loadQuestions();
