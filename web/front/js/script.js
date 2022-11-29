Vue.component('carrousel', {
    data: function() {
        return {
            slideIndex: 1,
            numQuestions: 10
        }
    },
    template: `<div>
    <h2 class="w3-center">Manual Slideshow</h2>

    <div class="w3-content w3-display-container">
      <questions></questions>
    
      <button class="w3-button w3-black w3-display-left" @click="plusDivs(-1)">&#10094;</button>
      <button class="w3-button w3-black w3-display-right" @click="plusDivs(1)">&#10095;</button>
    </div>
    </div>`,
    
    mounted(){
        this.showDivs(this.slideIndex);
    },

    methods: {
        plusDivs: function(n) {
            this.showDivs(this.slideIndex += n);
        },

        showDivs: function(n) {
            var questions = document.getElementsByClassName("mySlides");
            if (n > questions.length) {this.slideIndex = 1}
            if (n < 1) {this.slideIndex = questions.length}
            for (i = 0; i < questions.length; i++) {
                questions[i].style.display = "none";  
            }
            questions[this.slideIndex-1].style.display = "block";  
        },

        
    } 
});

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
      {{ incAns }}
  </li>
  <li>
    {{game.correctAnswer}}
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
    };
  },
  template: `
    <div>
      <h1>League of Trivial</h1>
      <b-button @click="getQuestions" block variant="primary">Start Demo</b-button>
      <b-row>
        <b-col md="3" v-for="question in result">
          <b-card class="mySlides">
            <quiz :game=question></quiz>
          </b-card>
        </b-col>
      </b-row>
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
  },
});

let app = new Vue({
  el: '#app',
  data: {},
});
