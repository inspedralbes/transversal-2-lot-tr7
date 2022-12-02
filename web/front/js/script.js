Vue.component('chronometer', {
  data: function () {
    return {
      output: document.getElementById('stopwatch'),
      // ms: 0,
      // sec: 0,
      // min: 0,
      // x: null,
      
    };
  },

  template: `<div>
  <h1>
        <span id="hour">00</span> :
        <span id="min">00</span> :
        <span id="sec">00</span> :
        <span id="milisec">00</span>
    </h1>

    {{ start() }}
  </div>`,

  methods: {
    timer: function(){
      console.log("start timer"); 
        var milisec = 0;
        var sec = 0; /* holds incrementing value */
        var min = 0;
        var hour = 0;

        /* Contains and outputs returned value of  function checkTime */

        var miliSecOut = 0;
        var secOut = 0;
        var minOut = 0;
        var hourOut = 0;
      
            miliSecOut = this.checkTime(milisec);
            secOut = this.checkTime(sec);
            minOut = this.checkTime(min);
            hourOut = this.checkTime(hour);

            milisec = ++milisec;

            if (milisec === 100) {
                milisec = 0;
                this.sec = ++this.sec;
            }

            if (this.sec == 60) {
                this.min = ++this.min;
                this.sec = 0;
            }

            if (this.min == 60) {
                this.min = 0;
                hour = ++hour;

            }


            document.getElementById("milisec").innerHTML = miliSecOut;
            document.getElementById("sec").innerHTML = secOut;
            document.getElementById("min").innerHTML = minOut;
            document.getElementById("hour").innerHTML = hourOut;
    },

    checkTime: function(i){
      if (i < 10) {
        i = "0" + i;
      } 
      return i;
    },

    start: function(){
      this.x = setInterval(this.timer, 10);
      console.log("start");
    }
  }
})

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
      showIndex: true
    };
  },
  template: `
    <div class="questions">
    <div v-show="showIndex">
      <h1 class="index_title">League of Trivial</h1>

      <div class="selectOptions">
        <b-form-checkbox id="easy" value="easy" v-model="options.difficulty">Easy</b-form-checkbox>
        <b-form-checkbox id="medium" value="medium" v-model="options.difficulty">Medium</b-form-checkbox>
        <b-form-checkbox id="hard" value="hard" v-model="options.difficulty">Hard</b-form-checkbox>

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
        <b-button @click="handler" variant="primary">Start Game</b-button>
      </div>
    </div>

      <div class="carousel" v-if="showCarousel">
        <chronometer></chronometer>
        <div v-for="question in result">
          <b-card class="mySlides">
            <quiz @evtAnswer='checkAnswer' :game=question></quiz>
          </b-card>
        </div>
      </div>

      <div v-if="showResults">
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
      this.quizResults.correctAnswers = 0;
      this.quizResults.incorrectAnswers = 0;
      this.showCarousel = true;
      this.showIndex = false;

      this.getQuestions();
      setTimeout(() => this.showCurrentQuestion(this.slideIndex), 500);

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

    endDemo: function(){
      this.showIndex = true;
      this.showResults = false;
    }
  },
});

let app = new Vue({
  el: '#app',
  data: {},
});
