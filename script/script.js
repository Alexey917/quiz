/* обработчик событий, который отслеживает загрузку контента, как только он загрузился срабатывает наш функционал описанный ниже*/

document.addEventListener("DOMContentLoaded", () => {
  /* строгий режим нужен для того чтобы устаревший код работал(выдаст ошибку, если неверно обьявим переменную или константу) */
  /*"use strict";*/

  const btnOpenModal = document.querySelector("#btnOpenModal");
  const modalBlock = document.querySelector("#modalBlock");
  const closeModal = document.querySelector("#closeModal");
  const questionTitle = document.querySelector("#question");
  const formAnswers = document.querySelector("#formAnswers");
  const nextButton = document.querySelector("#next");
  const prevButton = document.querySelector("#prev");
  const sendButton = document.querySelector("#send");

  /* функция получения данных */
  const getData = () => {
    formAnswers.textContent = "LOAD";

    nextButton.classList.add("d-none");
    prevButton.classList.add("d-none");

    setTimeout(() => {
      fetch("./questions.json")
        .then((res) => res.json())
        .then((obj) => playTest(obj.questions))
        .catch((err) => {
          formAnswers.textContent = "Ошибка загрузки данных";
          console.log(err);
        });
      /*firebase
        .database()
        .ref()
        .child("questions")
        .once("value")
        .then((snap) => playTest(snap.val()));*/
    }, 1000);
  };

  //объект, содержащий вопросы и ответы
  /*const questions = [
    {
      question: "Какого цвета бургер?",
      answers: [
        {
          title: "Стандарт",
          url: "./image/burger.png",
        },
        {
          title: "Черный",
          url: "./image/burgerBlack.png",
        },
      ],
      type: "radio",
    },
    {
      question: "Из какого мяса котлета?",
      answers: [
        {
          title: "Курица",
          url: "./image/chickenMeat.png",
        },
        {
          title: "Говядина",
          url: "./image/beefMeat.png",
        },
        {
          title: "Свинина",
          url: "./image/porkMeat.png",
        },
      ],
      type: "radio",
    },
    {
      question: "Дополнительные ингредиенты?",
      answers: [
        {
          title: "Помидор",
          url: "./image/tomato.png",
        },
        {
          title: "Огурец",
          url: "./image/cucumber.png",
        },
        {
          title: "Салат",
          url: "./image/salad.png",
        },
        {
          title: "Лук",
          url: "./image/onion.png",
        },
      ],
      type: "checkbox",
    },
    {
      question: "Добавить соус?",
      answers: [
        {
          title: "Чесночный",
          url: "./image/sauce1.png",
        },
        {
          title: "Томатный",
          url: "./image/sauce2.png",
        },
        {
          title: "Горчичный",
          url: "./image/sauce3.png",
        },
      ],
      type: "radio",
    },
  ];*/

  //обработчик открытия модального окна
  btnOpenModal.addEventListener("click", () => {
    console.log("click");
    modalBlock.classList.add("d-block");
    getData();
  });

  //обработчик закрытия модального окна
  closeModal.addEventListener("click", () => {
    modalBlock.classList.remove("d-block");
  });

  //функция запуска тестирования
  const playTest = (questions) => {
    const finalAnswers = [];
    //переменная с номером вопроса
    let numberQuestion = 0;

    //функция рендеринга ответов
    const renderAnswers = (index) => {
      questions[index].answers.forEach((answer) => {
        /* создает HTML элемент */
        const answerItem = document.createElement("div");

        answerItem.classList.add(
          "answers-item",
          "d-flex",
          "justify-content-center"
        );

        /* Встраивает верстку */
        answerItem.innerHTML = `
        <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
        <label for="${answer.title}" class="d-flex flex-column justify-content-between">
          <img class="answerImg" src="${answer.url}">
          <span>${answer.title}</span>
        </label>
        `;

        /*  */
        formAnswers.appendChild(answerItem);
      });
    };

    //функция рендеринга вопросов + ответов
    const renderQuestions = (indexQuestion) => {
      formAnswers.innerHTML = ``;

      /* switch (numberQuestion) {
        case 0:
          prevButton.classList.add("d-none");
          break;

        case questions.length:
          nextButton.classList.add("d-none");
          prevButton.classList.add("d-none");
          sendButton.classList.remove("d-none");
          formAnswers.innerHTML = `
        
        <div class="form-group">
          <label for="numberPhone">Enter your number</label>
          <input type="phone" class="form-control" id="numberPhone">
        </div>
        `;
          break;

        case questions.length + 1:
          formAnswers.textContent = "Спасибо за пройденный тест";
          setTimeout(() => {
            modalBlock.classList.remove("d-block");
          }, 2000);
          break;

        case 1:
        case questions.length - 1:
          questionTitle.textContent = `${questions[indexQuestion].question}`;

          renderAnswers(indexQuestion);

          nextButton.classList.remove("d-none");
          prevButton.classList.remove("d-none");
          sendButton.classList.add("d-none");
          break;
      }*/

      if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
        /* задает текстовое содержимое элементу или считывает текст */
        questionTitle.textContent = `${questions[indexQuestion].question}`;

        renderAnswers(indexQuestion);

        nextButton.classList.remove("d-none");
        prevButton.classList.remove("d-none");
        sendButton.classList.add("d-none");
      }

      if (numberQuestion === 0) {
        prevButton.classList.add("d-none");
      }

      if (numberQuestion === questions.length) {
        nextButton.classList.add("d-none");
        prevButton.classList.add("d-none");
        sendButton.classList.remove("d-none");
        formAnswers.innerHTML = `
        
        <div class="form-group">
          <label for="numberPhone">Enter your number</label>
          <input type="phone" class="form-control" id="numberPhone">
        </div>
        `;
      }

      if (numberQuestion === questions.length + 1) {
        formAnswers.textContent = "Спасибо за пройденный тест";
        setTimeout(() => {
          modalBlock.classList.remove("d-block");
        }, 2000);
      }
    };
    renderQuestions(numberQuestion);

    const checkAnswer = () => {
      /* сюда заносим все выбранные варианты ответов */
      const obj = {};

      /* заносим в константу массив выбранных ответов */
      const inputs = [...formAnswers.elements].filter(
        (input) => input.checked || input.id === "numberPhone"
      );

      inputs.forEach((input, index) => {
        /* формируем объект: obj[название элемента] = значение */
        /* obj[`${index}_${questions[numberQuestion].question}`] = input.value;*/

        if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
          obj[`${index}_${questions[numberQuestion].question}`] = input.value;
        }

        if (numberQuestion === questions.length) {
          obj["номер телефона"] = input.value;
        }

        finalAnswers.push(obj);
        console.log(finalAnswers);
      });
    };

    nextButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
    };

    prevButton.onclick = () => {
      numberQuestion--;
      renderQuestions(numberQuestion);
    };

    sendButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
      /*firebase.database().ref().child("contacts").push(finalAnswers);*/
      console.log(finalAnswers);
    };
  };
});
