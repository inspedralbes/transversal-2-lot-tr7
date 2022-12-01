Vue.component('finalResults', {
  props: ['results', 'display'],

  data: function () {
    return {
      numAnswers: 0,
      points: 0,
      dificulty: {
        easy: 1.5,
        medium: 2,
        hard: 4,
      },
    };
  },

  template: `<div>
    Resultat final:

    {{results.correctAnswers}}/{{numAnswers}}
    Puntos:{{points}}
  </div>`,

  mounted() {
    this.numAnswers =
      this.results.correctAnswers + this.results.incorrectAnswers;
    this.points = this.results.correctAnswers * this.dificulty.hard;
  },

  methods: {
    returnIndex: function () {},
  },
});
Vue.component('quiz', {
  props: ['game'],
  data: function () {
    return {
      answers: [],
      shuffledAnswers: [],
      aux: 0,
    };
  },

  template: `
  <div>
  {{game.question}}
  {{shuffle()}}

  <li v-for="ans in shuffledAnswers">
      <button class="quiz_incorrectButton" @click="$emit('evtAnswer', ans.index)">{{ ans.string }}</button>
    </li>
  </div>`,

  methods: {
    shuffle: function () {
      if (this.aux < 1) {
        for (i = 0; i < 3; i++) {
          this.answers.push({
            string: JSON.parse(JSON.stringify(this.game.incorrectAnswers[i])),
            index: 0,
          });
        }

        this.answers.push({
          string: JSON.parse(JSON.stringify(this.game.correctAnswer)),
          index: 1,
        });

        this.shuffledAnswers = this.answers
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);

        this.aux++;
      }
    },
  },
});
Vue.component('questions', {
  data: function () {
    return {
      options: {
        category: '',
        difficulty: '',
      },
      result: [],
      slideIndex: 1,
      arrQuestions: [],
      quizResults: {
        correctAnswers: 0,
        incorrectAnswers: 0,
      },

      showResults: false,
      showCarousel: false,
    };
  },
  template: `
    <div class="questions">
      <h1 class="index_title">League of Trivial</h1>
      <div class="selectOptions">
      <input type="radio" id="easy" value="easy" v-model="options.difficulty">
      <label for="easy">Easy</label><br>
      <input type="radio" id="medium" value="medium" v-model="options.difficulty">
      <label for="medium">Medium</label><br>
      <input type="radio" id="hard" value="hard" v-model="options.difficulty">
      <label for="hard">Hard</label>

      <label for="category">Choose a category</label>
      <select id="category" v-model="options.category">
      <option disabled value="">Select one category</option>
        <option value="arts_and_literature">Arts & Literature</option>
        <option value="film_and_tv">Film & TV</option>
        <option value="food_and_drink">Food & Drink</option>
        <option value="general_knowledge">General Knowledge</option>
        <option value="geography">Geography</option>
        <option value="history">History</option>
        <option value="music">Music</option>
        <option value="science">Science</option>
        <option value="society_and_culture">Society & Culture</option>
        <option value="sport_and_leisure">Sport & Leisure</option>
      </select>
      <b-button @click="handler" variant="primary">Start Game</b-button>
  </div>
      <div class="carousel" v-if="showCarousel">
        <div v-for="question in result">
          <b-card class="mySlides">
            <quiz @evtAnswer='checkAnswer' :game=question></quiz>
          </b-card>
        </div>
    </div>

    <div v-if="showResults">
      <finalResults :results=quizResults :display=showResults></finalResults>
      <button @click="showResults = false" >Return</button>
     </div>
  </div>`,
  methods: {
    getQuestions: function () {
      fetch(
        `https://the-trivia-api.com/api/questions?categories=${this.options.category}&limit=10&difficulty=${this.options.difficulty}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log({ data });
          this.result = data;
        });
    },

    nextQuestion: function (n) {
      this.showCurrentQuestion((this.slideIndex += n));
    },

    showCurrentQuestion: function (n) {
      this.arrQuestions = document.getElementsByClassName('mySlides');
      if (n > this.arrQuestions.length) {
        this.slideIndex = 1;
        this.showResults = true;
        this.showCarousel = false;
      }

      if (n < 1) {
        this.slideIndex = this.arrQuestions.length;
      }
      for (i = 0; i < this.arrQuestions.length; i++) {
        this.arrQuestions[i].style.display = 'none';
      }
      this.arrQuestions[this.slideIndex - 1].style.display = 'block';
    },

    handler: function () {
      this.showCarousel = true;
      this.getQuestions();

      setTimeout(() => this.showCurrentQuestion(this.slideIndex), 700);
    },

    checkAnswer: function (isCorrect) {
      console.log(isCorrect);

      if (isCorrect == 1) {
        this.quizResults.correctAnswers += 1;
        console.log('correct');
      } else {
        this.quizResults.incorrectAnswers += 1;
        console.log('incorrect');
      }

      this.nextQuestion(1);
    },
  },
});

let app = new Vue({
  el: '#app',
  data: {},
});
