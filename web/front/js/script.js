Vue.component('finalResults', {
  props: ['results', 'display'],
          
  data: function () {
    return {
      numAnswers: 0,
      points: 0,
      dificulty: {
        easy: 1.5,
        medium: 2,
        hard: 4
      }
    };
  },

  template: `<div>
    Resultat final:

    {{results.correctAnswers}}/{{numAnswers}}
    Puntos:{{points}}
  </div>`,

  mounted(){
    this.numAnswers = this.results.correctAnswers + this.results.incorrectAnswers;
    this.points = this.results.correctAnswers * this.dificulty.hard; 
},

methods: {
  returnIndex: function(){


  }
}
})

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
  data: function () {
    return {
      shuffledAnswers: []
      
    };
  },

  
  template: `
  <div>
  {{game.question}}
  {{randomNumber()}}
  {{shuffle()}}

  <li v-for="incAns in game.incorrectAnswers">
      <button class="quiz_incorrectButton" @click="$emit('evtAnswer', '0')">{{ incAns }}</button>
  </li>
  <li>
    <button id="quiz_correctButton" @click="$emit('evtAnswer', '1')">{{game.correctAnswer}}</button>
  </li>
  </div>`,
  

  methods: {
    randomNumber: function () {
      return Math.floor(Math.random() * 4);
    },

    shuffle: function(){ 
      this.shuffledAnswers = JSON.parse(JSON.stringify(this.game.incorrectAnswers));
      console.log("bbbbb", this.game.incorrectAnswers);
      console.log("ccccc", this.shuffledAnswers);
    }
  },
});
Vue.component('questions', {
  data: function () {
    return {
      result: [],
      slideIndex: 1,
      arrQuestions: [],
      quizResults: {
        correctAnswers: 0,
        incorrectAnswers: 0
      },

      showResults: false,
      showCarusel: false
    };
  },
  template: `
    <div class="questions">
      <h1 class="index_title">League of Trivial</h1>
      <b-button @click="handler">Start Demo</b-button>

      <div class="carusel" v-if="showCarusel">
        <div v-for="question in result">
          <b-card class="mySlides">
            <quiz @evtAnswer='checkAnswer' :game=question></quiz>
          </b-card>
        </div>
    </div>

    <div v-if="showResults">
      <finalResults :results=quizResults :display=showResults></finalResults>
      <button @click="showResults = false" >Return</buttton>
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
      if (n > this.arrQuestions.length) {
        this.slideIndex = 1
        this.showResults = true;
        this.showCarusel = false;
      }

      if (n < 1) {this.slideIndex = this.arrQuestions.length}
      for (i = 0; i < this.arrQuestions.length; i++) {
        this.arrQuestions[i].style.display = "none";  
      }
      this.arrQuestions[this.slideIndex-1].style.display = "block";  
  },

  handler: function(){
    this.showCarusel = true;
    this.getQuestions();

    setTimeout(() => this.showCurrentQuestion(this.slideIndex), 500);

  },

  checkAnswer: function(isCorrect){
    console.log(isCorrect);

    if (isCorrect == 1){
      this.quizResults.correctAnswers += 1;
    }

    else{
      this.quizResults.incorrectAnswers += 1;
    }

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
