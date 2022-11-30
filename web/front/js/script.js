Vue.component('startdemo', {
  data: function () {
    return {};
  },
  template: `<div>
  <h1>Index</h1>
</div>`,
});
Vue.component('quiz', {
  props: ['game'],
  template: `
  <div>
  {{game.question}}
  {{randomNumber()}}

  <li v-for="incAns in game.incorrectAnswers">
      <button class="quiz_incorrectButton" @click="$emit('evtAnswer', 'false')">{{ incAns }}</button>
  </li>
  <li>
    <button id="quiz_correctButton" @click="$emit('evtAnswer', 'true')">{{game.correctAnswer}}</button>
  </li>
  </div>`,
  methods: {
    randomNumber: function () {
      return Math.floor(Math.random() * 4);
    },
  },
});
Vue.component('questions', {
  data: function () {
    return {
      result: [],
      slideIndex: 1,
      arrQuestions: [],
      quizResults: []
    };
  },
  template: `
    <div class="questions">
      <h1 class="index_title">League of Trivial</h1>
      <b-button @click="handler">Start Demo</b-button>

      <div class="carusel">
        <div v-for="question in result">
          <b-card class="mySlides">
            <quiz @evtAnswer='checkAnswer' :game=question></quiz>
          </b-card>
        </div>
    </div>
        
  </div>`,
  methods: {
    getQuestions: function () {
      fetch(
        'https://the-trivia-api.com/api/questions?categories=film_and_tv&limit=10&difficulty=easy'
      )
        .then((response) => response.json())
        .then((data) => {
          console.log({ data });
          this.result = data;
        });
    },

    nextQuestion: function(n) {
      this.showCurrentQuestion(this.slideIndex += n);
    },

  showCurrentQuestion: function(n) {
        this.arrQuestions = document.getElementsByClassName("mySlides");
      if (n > this.arrQuestions.length) {this.slideIndex = 1}
      if (n < 1) {this.slideIndex = this.arrQuestions.length}
      for (i = 0; i < this.arrQuestions.length; i++) {
        this.arrQuestions[i].style.display = "none";  
      }
      this.arrQuestions[this.slideIndex-1].style.display = "block";  
  },

  handler: function(){
    this.getQuestions();
    
    setTimeout(() => this.showCurrentQuestion(this.slideIndex), 500);

  },

  checkAnswer: function(isCorrect){
    console.log(isCorrect);

    // buttonsQuiz = document.getElementsByClassName("quiz_incorrectButton");
    
    // for (i = 0; i < buttonsQuiz.length; i++){
    //   buttonsQuiz[i].style.backgroundColor = 'red';
    // }
    // document.getElementById("quiz_correctButton").style.backgroundColor = 'green';
    
    setTimeout(() => this.nextQuestion(1), 1000); 
  },

  },

});

let app = new Vue({
  el: '#app',
  data: {},
});
