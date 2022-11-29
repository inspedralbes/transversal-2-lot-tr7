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
          <b-card>
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
