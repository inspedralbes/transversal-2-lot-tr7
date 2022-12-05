Vue.component('chronometer', {
  data: function () {
    return {
      time: '',
      timeBegan: null,
      timeStopped: null,
      stoppedDuration: 0,
      started: null,
      running: false,
    };
  },

  template: `<span id="clock" class="time">  {{start()}}{{ time }}</span>`,

  methods: {
    start: function () {
      if (this.running) return;

      if (this.timeBegan === null) {
        this.reset();
        this.timeBegan = new Date();
      }

      if (this.timeStopped !== null) {
        this.stoppedDuration += new Date() - this.timeStopped;
      }

      this.started = setInterval(this.clockRunning, 10);
      this.running = true;
    },

    stop: function () {
      this.running = false;
      this.timeStopped = new Date();
      clearInterval(this.started);
    },

    reset: function () {
      this.running = false;
      clearInterval(this.started);
      this.stoppedDuration = 0;
      this.timeBegan = null;
      this.timeStopped = null;
      this.time = '00:00.000';
    },
    zeroPrefix: function (num, digit) {
      var zero = '';
      for (var i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    },

    clockRunning: function () {
      var currentTime = new Date(),
        timeElapsed = new Date(
          currentTime - this.timeBegan - this.stoppedDuration
        ),
        hour = timeElapsed.getUTCHours(),
        min = timeElapsed.getUTCMinutes(),
        sec = timeElapsed.getUTCSeconds(),
        ms = timeElapsed.getUTCMilliseconds();

      this.time =
        this.zeroPrefix(min, 2) +
        ':' +
        this.zeroPrefix(sec, 2) +
        '.' +
        this.zeroPrefix(ms, 3);
    },
  },
  getTime: function () {
    this.currentTime = document.getElementById('clock').textContent;
  },
});

Vue.component('finalResults', {
  props: ['results', 'display'],

  data: function () {
    return {
      numAnswers: 0,
      points: 0,
      difficulty: {
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
    this.points = this.results.correctAnswers * this.difficulty.hard;
  },

  methods: {
    returnIndex: function () { },
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
    <h2>{{game.question}}</h2>
    {{shuffle()}}
      <button v-for="ans in shuffledAnswers" @click="$emit('evtAnswer', ans.index)">{{ ans.string }}</button>
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

      checkDifficulty: false,
      checkCategory: false,
      showResults: false,
      showCarousel: false,
      showIndex: true,
    };
  },
  template: `
    <div class="game">
    <div v-show="showIndex">
      <h1 class="index_title">League of Trivial</h1>

      <div class="game__selectOptions">
      <div class="game__selectOptions--difficulty">
        <b-form-checkbox id="easy" value="easy" v-model="options.difficulty">Easy</b-form-checkbox>
        <b-form-checkbox id="medium" value="medium" v-model="options.difficulty">Medium</b-form-checkbox>
        <b-form-checkbox id="hard" value="hard" v-model="options.difficulty">Hard</b-form-checkbox>
      </div>

      <div class="game__selectOptions--categories">
        <label for="category">Choose a category</label>
        <b-form-select id="category" v-model="options.category">
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
        </b-form-select>
        </div>
        <b-button @click="handler">Start Game</b-button>

        <b-alert v-show="checkCategory" show variant="danger">Select Category</b-alert>
        <b-alert v-show="checkDifficulty" show variant="danger">Select Difficulty</b-alert>
      </div>
    </div>

      <div class="game__carousel" v-if="showCarousel">
        <div class="game__carousel--mySlides" v-for="question in result">
            <quiz @evtAnswer='checkAnswer' :game=question></quiz>
        </div>
        <chronometer></chronometer>
      </div>

      <div class="game__results" v-if="showResults">
        <finalResults :results=quizResults :display=showResults></finalResults>
        <button @click="endDemo" >Return</button>
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
      this.arrQuestions = document.getElementsByClassName(
        'game__carousel--mySlides'
      );
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
      if (this.options.difficulty == '') {
        this.checkDifficulty = true;
        this.checkCategory = false;
        console.log('dif');
      } else if (this.options.category == '') {
        this.checkCategory = true;
        this.checkDifficulty = false;
        console.log('cat');
      } else {
        this.quizResults.correctAnswers = 0;
        this.quizResults.incorrectAnswers = 0;
        this.showCarousel = true;
        this.showIndex = false;
        this.checkCategory = false;
        this.checkDifficulty = false;
        this.getQuestions();
        setTimeout(() => this.showCurrentQuestion(this.slideIndex), 900);
      }
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

    endDemo: function () {
      this.showIndex = true;
      this.showResults = false;
    },
  },
});

Vue.component('login-register', {
  template: `
  <b-modal id="modal-1" :title="infoDetallada.titol">
<p class="my-4"></p>
</b-modal>`,
});

Vue.component('vue-header', {
  template: `
  <div class="header">
    <a href=""><img src="img/logo.png" alt="logo" /></a>
    <div class="nav">
      <a href="">Ranking</a>
      <a href="">Login / Register</a>
    </div>
  </div>`,
});

let app = new Vue({
  el: '#app',
  data: {},
});
