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
      answers: [],
      shuffledAnswers: [],
      aux: 0
      
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
    
    shuffle: function(){ 
      if (this.aux < 1){


        for (i = 0; i < 3; i++){
          this.answers.push({"string": JSON.parse(JSON.stringify(this.game.incorrectAnswers[i])), "index": 0})
        }
        
        this.answers.push({"string": JSON.parse(JSON.stringify(this.game.correctAnswer)), "index": 1});
        
        this.shuffledAnswers = this.answers
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

        this.aux++;
      }
      
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
      showCarusel: false,
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

    setTimeout(() => this.showCurrentQuestion(this.slideIndex), 700);

  },

  checkAnswer: function(isCorrect){
    console.log(isCorrect);

    if (isCorrect == 1){
      this.quizResults.correctAnswers += 1;
      console.log("correct");
    }

    else{
      this.quizResults.incorrectAnswers += 1;
      console.log("incorrect");
    }

    this.nextQuestion(1); 
  },

  },

});

let app = new Vue({
  el: '#app',
  data: {},
});
