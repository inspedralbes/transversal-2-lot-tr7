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
      this.time = '00:00';
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
        min = timeElapsed.getUTCMinutes(),
        sec = timeElapsed.getUTCSeconds();

      this.time = this.zeroPrefix(min, 2) + ':' + this.zeroPrefix(sec, 2);
    },
  },
});

Vue.component('finalResults', {
  props: ['results', 'display', 'opt', 'idGame', 'daily'],

  data: function () {
    return {
      numAnswers: 0,
      points: 0,
      selectDifficulty: 0,
    };
  },

  template: `<div>
    Final results: {{results.correctAnswers}}/{{numAnswers}}
    Points: {{points}}
    {{getTime()}}
    Time: {{currentTime}}

  </div>`,
  mounted() {
    if (!this.daily) {
      if (this.opt.difficulty == 'hard') {
        this.selectDifficulty = 300;
      } else if (this.opt.difficulty == 'medium') {
        this.selectDifficulty = 200;
      } else if (this.opt.difficulty == 'easy') {
        this.selectDifficulty = 100;
      }
    } else {
      this.selectDifficulty = 200;
    }
    this.getTime();

    let a = this.currentTime.split(':');
    let seconds = parseInt(+a[0] * 60 + a[1]);

    this.numAnswers =
      this.results.correctAnswers + this.results.incorrectAnswers;
    this.points = this.results.correctAnswers * this.selectDifficulty - seconds;

    const store = userStore();
    if (store.logged) {
      fetch(
        `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/update-score`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.loginInfo.token,
          },
          method: 'post',
          body: JSON.stringify({
            idGame: this.idGame,
            points: this.points,
            time: seconds,
          }),
        }
      );
    }
  },
  methods: {
    getTime: function () {
      if (document.getElementById('clock')) {
        this.currentTime = document.getElementById('clock').textContent;
      }
    },
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

Vue.component('game', {
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
      gameId: 0,
      dailyGame: false,
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
        <b-button @click="handlerDay" v-show="userIsLogged()" :disabled="getCookie()">Daily Game</b-button>

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
        <finalResults :opt=options :results=quizResults :display=showResults :idGame=gameId :daily=dailyGame></finalResults>
        <button @click="endDemo" >Return</button>
      </div>
    </div>`,
  methods: {
    getCookie: function () {
      let name = 'dailyGame=';
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return Boolean(c.substring(name.length, c.length));
        }
      }
    },
    getQuestions: function () {
      fetch(
        `https://the-trivia-api.com/api/questions?categories=${this.options.category}&limit=10&difficulty=${this.options.difficulty}`
      )
        .then((response) => response.json())
        .then((data) => {
          this.result = data;
          if (this.userIsLogged()) {
            const store = userStore();
            const date = new Date();

            fetch(
              `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/create-game`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + store.loginInfo.token,
                },
                method: 'post',
                body: JSON.stringify({
                  jsonGame: JSON.stringify(this.result),
                  date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
                  difficulty: this.options.difficulty,
                  category: this.options.category,
                  type: 'standard',
                }),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                console.log({ data });
                fetch(
                  `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/create-score`,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: 'Bearer ' + store.loginInfo.token,
                    },
                    method: 'post',
                    body: JSON.stringify({
                      idGame: data,
                    }),
                  }
                );
                this.gameId = data;
              });
          }
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
      this.dailyGame = false;
      if (this.options.difficulty == '') {
        this.checkDifficulty = true;
        this.checkCategory = false;
      } else if (this.options.category == '') {
        this.checkCategory = true;
        this.checkDifficulty = false;
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
      if (isCorrect == 1) {
        this.quizResults.correctAnswers += 1;
      } else {
        this.quizResults.incorrectAnswers += 1;
      }

      this.nextQuestion(1);
    },

    endDemo: function () {
      this.showIndex = true;
      this.showResults = false;
    },
    loadDailyGame: function () {
      const store = userStore();
      fetch(
        `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/get-daily-game`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.loginInfo.token,
          },
          method: 'get',
        }
      )
        .then((response) => response.json())
        .then((data) => {
          fetch(
            `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/create-score`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + store.loginInfo.token,
              },
              method: 'post',
              body: JSON.stringify({
                idGame: data.game.id,
              }),
            }
          );
          this.result = JSON.parse(data.game.jsonGame);
          this.gameId = data.game.id;
          this.dailyGame = true;
        });
    },

    handlerDay: function () {
      this.quizResults.correctAnswers = 0;
      this.quizResults.incorrectAnswers = 0;
      this.showCarousel = true;
      this.showIndex = false;
      this.checkCategory = false;
      this.checkDifficulty = false;
      let data = new Date();
      data.setUTCHours(23, 59, 59, 999);
      document.cookie = 'dailyGame=true;' + data.toUTCString();
      this.loadDailyGame();
      setTimeout(() => this.showCurrentQuestion(this.slideIndex), 900);
    },

    userIsLogged: function () {
      const store = userStore();
      if (store.logged == true) {
        return true;
      }
      return false;
    },
  },
});

Vue.component('vue-header', {
  template: `
  <div class="header">
    <a href=""><img src="img/logo.png" alt="logo" /></a>
    <div class="nav">
      <a href="">Ranking</a>
      <a v-b-modal.login-register v-show="!userIsLogged()">Login / Register</a>
      <a v-b-modal.profile v-show="userIsLogged()" @click="getUser_getRanking()">Profile</a>
    </div>

    <b-modal id="profile" title="Profile">
      <img src="img/foto.png" alt="logo" />
      <div class="editProfile" v-show="!profile.inProcessToEdit">
        <h3>Username: {{profile.username}}</h3>
        <h3>Email: {{profile.email}}</h3>
        <h3>Level: {{profile.level}}</h3>
        <b-button @click="editProfile">Edit Profile</b-button>
      </div>
      <div class="editProfile" v-show="profile.inProcessToEdit">
        <h3>Username: </h3> <b-form-input v-model="profile.username"/>
        <h3>Email: </h3> <b-form-input v-model="profile.email"/>
        <h3>Password: </h3> <b-form-input v-model="profile.password" />
        <h3>Repeat password: </h3> <b-form-input v-model="profile.repeatPassword" />
        <b-button @click="editProfile">Save Profile</b-button>
      </div>
      <div>
      <h3>{{ranking.avg}}</h3>
      </div>
    </b-modal>

    <b-modal id="login-register" title="Login / Register">
      <div class="form__login">
        <h2>Login</h2>
        <input v-model="login.username" placeholder="Username" />
        <input v-model="login.password" placeholder="Password" />
        <b-button @click="loginFunction">Login</b-button>
      </div>
      <div class="form__register">
        <h2>Register</h2>
        <input v-model="register.username" placeholder="Username" />
        <input v-model="register.email" placeholder="Email" />
        <input v-model="register.password" placeholder="Password" />
        <input v-model="register.repeatPassword" placeholder="Confirm password" />
        <b-button @click="registerFunction">Register</b-button>
      </div>
    </b-modal>
  </div>`,
  data: function () {
    return {
      register: {
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
      },
      login: {
        username: '',
        password: '',
      },
      profile: {
        username: '',
        email: '',
        level: '',
        inProcessToEdit: false,
        password: '',
        repeatPassword: '',
      },
      ranking: {
        avg: '',
      },
    };
  },
  methods: {
    editProfile: function () {
      if (!this.profile.inProcessToEdit) {
        this.profile.inProcessToEdit = true;
      } else {
        this.profile.inProcessToEdit = false;
        const store = userStore();
        console.log({ store });
        fetch(
          `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/update-profile`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Bearer ' + '87|Tq1PU0KtV3DQGVq5z4jDqe7sCvNUeVE87sQcRovx',
            },
            method: 'post',
            body: JSON.stringify({
              username: this.profile.username,
              email: this.profile.email,
              password: this.profile.password,
              password_confirmation: this.profile.repeatPassword,
            }),
          }
        );
      }
    },
    getUser_getRanking: function () {
      const store = userStore();
      fetch(
        `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/user-profile`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.loginInfo.token,
          },
          method: 'get',
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log({ data });
          console.log(
            data.statistics.averagePointsPerGame[0].AVG(points).values
          );
          this.ranking.avg = data.statistics.averagePointsPerGame[0];
          this.profile.username = data.userData.username;
          this.profile.email = data.userData.email;
          this.profile.level = data.userData.level;
        });
    },
    registerFunction: function () {
      fetch(
        `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/register`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'post',
          body: JSON.stringify({
            username: this.register.username,
            email: this.register.email,
            password: this.register.password,
            password_confirmation: this.register.repeatPassword,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if ((data = true)) {
            this.register.username = '';
            this.register.email = '';
            this.register.password = '';
            this.register.repeatPassword = '';
          }
        });
    },
    loginFunction: function () {
      fetch(
        `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/login`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'post',
          body: JSON.stringify({
            username: this.login.username,
            password: this.login.password,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.login == true) {
            this.login.username = '';
            this.login.password = '';
            const store = userStore();
            store.logged = data.login;
            store.loginInfo.username = data.user.username;
            store.loginInfo.id = data.user.id;
            store.loginInfo.token = data.token;
            this.$bvModal.hide('login-register');
          }
        });
    },
    userIsLogged: function () {
      const store = userStore();
      if (store.logged == true) {
        return true;
      }
      return false;
    },
  },
});

const userStore = Pinia.defineStore('user', {
  state() {
    return {
      logged: false,
      loginInfo: {
        username: '',
        id: '',
        token: '',
      },
    };
  },
});

Vue.use(Pinia.PiniaVuePlugin);
const pinia = Pinia.createPinia();

let app = new Vue({
  el: '#app',
  data: {},
  pinia,
  computed: {
    ...Pinia.mapState(userStore, ['loginInfo', 'logged']),
  },
});
