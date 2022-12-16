Vue.component('send_challenge', {
    props: ['idGame'],
    data: function () {
        return {
            result: [],
            idUser: 0,
        };
    },

    template: `
    <div>
    <label for="users">Choose a user</label>
    <b-form-select id="users" v-model="idUser">
      <option v-for="(users, id) in result.usersList" :value=id>{{users}}</option>
    </b-form-select>
      <b-button @click="sendChallenge()">Send challenge</b-button>
    </div>`,

    methods: {
        sendChallenge: function () {
            const store = userStore();
            fetch(
                `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/create-challenge`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + store.loginInfo.token,
                    },
                    method: 'post',
                    body: JSON.stringify({
                        idReceiver: parseInt(this.idUser),
                        idGame: this.idGame,
                    }),
                }
            );
        },
    },

    mounted() {
        const store = userStore();
        if (store.logged) {
            fetch(
                `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/users-list`,
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
                    this.result = data;
                });
        }
    },
});

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
    props: ['results', 'display', 'opt', 'idGame', 'daily', 'challenge'],

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
        let a0 = parseInt(a[0]);
        let a1 = parseInt(a[1]);
        let seconds = a0 * 60 + a1;

        this.numAnswers =
            this.results.correctAnswers + this.results.incorrectAnswers;
        this.points = this.results.correctAnswers * this.selectDifficulty - seconds;

        const store = userStore();
        if (store.logged) {
            console.log(this.idGame, this.points, seconds);
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
        if (this.challenge) {
            fetch(
                `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/challenge-winner`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + store.loginInfo.token,
                    },
                    method: 'post',
                    body: JSON.stringify({
                        idGame: this.idGame,
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
        <button class="question__buttonAnswers" v-for="ans in shuffledAnswers" @click="$emit('evtAnswer', ans.index, shuffledAnswers)" >{{ ans.string }}</button>
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
            showResults: false,
            showCarousel: false,
            showIndex: true,
            showRankings: false,
            gameId: 0,
            dailyGame: false,
            buttonsIndex: 0,
            isChallenge: false,
        };
    },
    template: `
      <div class="game">
      <div v-show="showIndex">
        <h1 class="index_title">League of Trivial</h1>
  
        <div class="game__selectOptions">
        <div class="game__selectOptions--difficulty">
          <input type="radio"  id="easy" value="easy" v-model="options.difficulty">
          <label class="buttonsDifficulty" for="easy">Easy</label>
          <input type="radio" id="medium" value="medium" v-model="options.difficulty">
          <label class="buttonsDifficulty" for="medium">Medium</label>
          <input type="radio" id="hard" value="hard" v-model="options.difficulty">
          <label class="buttonsDifficulty" for="hard">Hard</label>
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
          <b-button @click="handlerDay" v-show="userIsLogged()" :disabled="Boolean(getCookie('dailyGame='))">Daily Game</b-button>
         </div>
      </div>
  
        <div class="game__carousel" v-if="showCarousel">
          <div class="game__carousel--mySlides" v-for="question in result">
              <quiz @evtAnswer='checkAnswer' :game=question></quiz>
          </div>
          <chronometer></chronometer>
        </div>
  
        <div class="game__results" v-if="showResults">
          <finalResults :opt=options :results=quizResults :display=showResults :idGame=gameId :daily=dailyGame :challenge=isChallenge></finalResults>
          <button @click="endDemo" >Return</button>
          <send_challenge v-if="userIsLogged()" v-show="!dailyGame" :idGame=gameId></send_challenge>
        </div>
        <ranking v-show="showRankings"></ranking>
      </div>`,

    created() {
        this.$root.$refs.game = this;
    },

    methods: {
        getChallenge: function (idChallenge) {
            const store = userStore();
            fetch(
                `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/get-game`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + store.loginInfo.token,
                    },
                    method: 'post',
                    body: JSON.stringify({
                        id: parseInt(idChallenge),
                    }),
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
                    this.gameId = data.game.id;
                    this.result = JSON.parse(data.game.jsonGame);
                    this.$bvModal.hide('challenge');
                    this.options.difficulty = data.game.difficulty;
                    this.isChallenge = true;
                });
        },
        handlerChallenge(id) {
            this.$forceUpdate();

            this.result = [];
            this.buttonsIndex = 0;
            this.quizResults.correctAnswers = 0;
            this.quizResults.incorrectAnswers = 0;
            this.showCarousel = true;
            this.showIndex = false;

            this.getChallenge(id);
            setTimeout(() => this.showCurrentQuestion(this.slideIndex), 900);
        },
        getCookie: function (name) {
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
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
            this.$forceUpdate();

            this.result = [];
            this.buttonsIndex = 0;
            this.dailyGame = false;
            if (this.options.difficulty == '' || this.options.category == '') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Select Difficulty And Category',
                    showConfirmButton: false,
                    timer: 2000,
                });
            } else {
                this.quizResults.correctAnswers = 0;
                this.quizResults.incorrectAnswers = 0;
                this.showCarousel = true;
                this.showIndex = false;
                this.isChallenge = false;
                this.getQuestions();
                setTimeout(() => this.showCurrentQuestion(this.slideIndex), 900);
            }
        },

        checkAnswer: function (isCorrect, arrQuestions) {
            let buttons = document.getElementsByClassName('question__buttonAnswers');

            if (isCorrect == 1) {
                this.quizResults.correctAnswers += 1;
            } else {
                this.quizResults.incorrectAnswers += 1;
            }

            let aux = this.buttonsIndex + 4;

            for (let i = this.buttonsIndex; i < aux; i++) {
                let text = buttons[i].textContent;
                buttons[i].disabled = 'true';

                for (j = 0; j < 4; j++) {
                    if (text == arrQuestions[j].string) {
                        if (arrQuestions[j].index == 0) {
                            buttons[i].style.backgroundColor = '#FF6961';
                        } else {
                            buttons[i].style.backgroundColor = '#C1E1C1';
                        }
                    }
                }
            }
            this.buttonsIndex += 4;

            setTimeout(() => this.nextQuestion(1), 1000);
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
            this.$forceUpdate();

            this.result = [];
            this.buttonsIndex = 0;
            this.quizResults.correctAnswers = 0;
            this.quizResults.incorrectAnswers = 0;
            this.showCarousel = true;
            this.showIndex = false;
            this.isChallenge = false;
            const d = new Date();
            d.setUTCHours(23, 59, 59, 999);
            let expires = "expires=" + d.toUTCString();
            document.cookie = "dailyGame=" + true + ";" + expires + ";path=/";
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
        ranking: function () {
            if (this.showRankings) {
                this.showIndex = true;
            } else {
                this.showIndex = false;
            }
            this.showRankings = !this.showRankings;

            this.showResults = false;
            this.$root.$refs.ranking.fetchRanking();
        },
    },
});

Vue.component('ranking', {
    data: function () {
        return {
            result: [],
        };
    },

    template: `
    <div>
      <h1>Rankings</h1>
      <div class="rankings">
        <div class="rankings__ranking">
          <div class="rankings__title">
            <h2>Total Points</h2>
          </div>
          <ol>
            <div class="rankings__list" v-for="users in result.totalPoints">
              <li>
                <p @click="showProfile(users.idUser)" class="rankings__user">{{users.username}}</p>
              </li>
              <p class="rankings__user">{{users.pSum}}</p>
            </div>
          </ol>
        </div>
        <div class="rankings__ranking">
          <div class="rankings__title">
            <h2>Daily game points</h2>
          </div>
          <ol>
            <div class="rankings__list" v-for="users in result.dailyGame">
              <li>
                <p @click="showProfile(users.idUser)" class="rankings__user">{{users.username}}</p>
              </li>
              <p class="rankings__user">{{users.points}}</p>
            </div>
          </ol>
        </div>
        <div class="rankings__ranking">
          <div class="rankings__title">
            <h2>Games completed</h2>
          </div>
          <ol>
            <div class="rankings__list" v-for="users in result.totalGames">
              <li>
                <p @click="showProfile(users.idUser)" class="rankings__user">{{users.username}}</p>
              </li>
              <p class="rankings__user">{{users.pSum}}</p>
            </div>
          </ol>
        </div>
        <div class="rankings__ranking">
          <div class="rankings__title">
            <h2>Average points</h2>
          </div>
          <ol>
            <div class="rankings__list" v-for="users in result.averagePoints">
              <li>
                <p @click="showProfile(users.idUser)" class="rankings__user">{{users.username}}</p>
              </li>
              <p class="rankings__user">{{users.pSum}}</p>
            </div>
          </ol>
        </div>
      </div>
    </div>`,

    created() {
        this.$root.$refs.ranking = this;
    },

    mounted() {
        this.fetchRanking();
    },

    methods: {
        showProfile: function (id) {
            this.$root.$refs.vueheader.getProfile('false', id);
        },

        fetchRanking() {
            fetch(
                `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/ranking`
            )
                .then((response) => response.json())
                .then((data) => {
                    this.result = data.ranking;
                });
        },
    },
});

Vue.component('vueheader', {
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
            stats: {
                totalGames: '',
                gamesUncompleted: '',
                totalTime: '',
                avgTimePerGame: '',
                totalPoints: '',
                avgPointsPerGame: '',
                maxGamePoints: '',
                lastGamePlayed: '',
            },
            challenges: {
                completed: '',
                pending: '',
                idChallengeGame: 0,
            },
            canEditProfile: false,
        };
    },

    template: `
    <div class="header">
      <a href=""><img src="img/logo.png" alt="logo" /></a>
      <div class="nav">
        <a @click="ranking()">Ranking</a>
        <a v-b-modal.challenge v-show="userIsLogged()" @click="getChallenges()">Challenge</a>
        <a v-b-modal.login-register v-show="!userIsLogged()">Login / Register</a>
        <a v-b-modal.profile v-show="userIsLogged()" @click="getProfile('true', 0)">Profile</a>
      </div>
  
      <b-modal id="challenge" title="Challenges">
        <div class="challenge__tab">
          <b-button class="challenge__tab--links" @click="openChallenges($event, 'pending')">Pending</b-button>
          <b-button class="challenge__tab--links" @click="openChallenges($event, 'completed')">Completed</b-button>
        </div>
        <div id="completed" class="challengeContent" style="display: none;">
          <table>
            <th>Winner</th>
            <th>Sender Points</th>
            <th>Sender</th>
            <th>Receiver Points</th>
            <th>Receiver</th>
            <th>Data</th>
            <tr v-for="completed in challenges.completed">
              <td>{{completed.winner}}</td>
              <td>{{completed.senderPoints}}</td>
              <td>{{completed.sender}}</td>
              <td>{{completed.receiverPoints}}</td>
              <td>{{completed.receiver}}</td>
              <td>{{completed.date}}</td>
            </tr>
          </table>
        </div>
        <div id="pending" class="challengeContent" >
          <table>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Data</th>
            <th>Play Game</th>
            <tr v-for="pending in challenges.pending" >
              <td>{{pending.sender}}</td>
              <td>{{pending.receiver}}</td>
              <td>{{pending.date}}</td>
              <td><b-button @click="clickChallenge(pending.idGame)" :value=pending.idGame>Play Challenge</b-button></td>
            </tr>
          </table>
        </div>
      </b-modal>
  
      <b-modal id="profile" title="Profile">
        <div class="profile__info">
          <img src="img/foto.png" alt="logo" />
          <div class="profile__info--editProfile" v-show="!profile.inProcessToEdit">
            <h3>Username: {{profile.username}} </h3>
            <h3>Email: {{profile.email}} </h3>
            <b-button v-show="canEditProfile" @click="editProfile">Edit Profile</b-button>
            <a v-show="canEditProfile" @click="logout"><b-button>Logout</b-button></a>
          </div>
          <div class="profile__info--editProfile" v-show="profile.inProcessToEdit">
            <h3>Username:  </h3> <b-form-input v-model="profile.username"/>
            <h3>Email: </h3> <b-form-input v-model="profile.email"/>
            <h3>Password: </h3> <b-form-input type="password" v-model="profile.password" />
            <h3>Repeat password: </h3> <b-form-input type="password" v-model="profile.repeatPassword" />
            <b-button v-show="canEditProfile" @click="editProfile">Save Profile</b-button>
          </div>
        </div>
        <div class="stats">
          <h3> <span class="stats__title"> Level </span> {{profile.level}}</h3>
          <h3> <span class="stats__title"> Total Points </span> {{stats.totalPoints}}</h3>
          <h3> <span class="stats__title"> Time Played </span> {{stats.totalTime}}</h3>
          <h3> <span class="stats__title"> Games Uncompleted </span> {{stats.gamesUncompleted}} of {{stats.totalGames}}</h3>
          <h3> <span class="stats__title"> Max Game Points </span> {{stats.maxGamePoints}}</h3>
          <h3> <span class="stats__title"> AVG Time Game </span> {{stats.avgTimePerGame}}</h3>
          <h3> <span class="stats__title"> Total Games </span> {{stats.totalGames}}</h3>
          <h3> <span class="stats__title"> AVG Points Game </span> {{stats.avgPointsPerGame}}</h3>
          <h3> <span class="stats__title"> Last Game Played </span> {{stats.lastGamePlayed}}</h3>
        </div>
      </b-modal>
      <b-modal id="login-register" title="Login / Register">
        <div class="form__login">
        <h2>Login</h2>
          <input v-model="login.username" placeholder="Username" />
          <input type="password" v-model="login.password" placeholder="Password" />
          <b-button @click="loginFunction">Login</b-button>
        </div>
        <div class="form__register">
        <h2>Register</h2>
          <input v-model="register.username" placeholder="Username" />
          <input v-model="register.email" placeholder="Email" />
          <input type="password" v-model="register.password" placeholder="Password" />
          <input type="password" v-model="register.repeatPassword" placeholder="Confirm password" />
          <b-button @click="registerFunction">Register</b-button>
        </div>
      </b-modal>
    </div>`,

    created() {
        this.$root.$refs.vueheader = this;
    },

    mounted() {
        sessionCookie = this.$root.$refs.game.getCookie('sessionCookie=');
        if (sessionCookie) {
            sessionCookie = JSON.parse(sessionCookie);
            const store = userStore();
            store.logged = true;
            store.loginInfo.id = sessionCookie.id;
            store.loginInfo.username = sessionCookie.username;
            store.loginInfo.token = sessionCookie.token;
        }
    },

    methods: {
        clickChallenge(id) {
            this.$root.$refs.game.handlerChallenge(id);
        },

        openChallenges: function (evt, challengeName) {
            let i, challengeContent, tabLinks;
            challengeContent = document.getElementsByClassName('challengeContent');
            for (i = 0; i < challengeContent.length; i++) {
                challengeContent[i].style.display = 'none';
            }
            tabLinks = document.getElementsByClassName('challenge__tab--links');
            for (i = 0; i < tabLinks.length; i++) {
                tabLinks[i].className = tabLinks[i].className.replace(' active', '');
            }
            document.getElementById(challengeName).style.display = 'block';
            evt.currentTarget.className += ' active';
        },
        getChallenges: function () {
            const store = userStore();
            fetch(
                `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/challenges-list`,
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
                    this.challenges.completed = data.challenges.completed;
                    this.challenges.pending = data.challenges.pending;
                });
        },
        getProfile: function (personal, id) {
            const store = userStore();

            if (personal == 'true') {
                fetch(
                    `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/my-profile`,
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
                        this.canEditProfile = true;
                        this.loadStats(data);
                    });
            } else {
                fetch(
                    `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/user-profile`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'post',
                        body: JSON.stringify({
                            idUser: id,
                        }),
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        this.canEditProfile = false;
                        this.loadStats(data);
                    });
            }
        },

        loadStats: function (data) {
            this.stats.totalGames = data.statistics[0].totalGames;
            this.stats.gamesUncompleted = data.statistics[1].gamesUncompleted;
            this.stats.totalTime = data.statistics[2].totalTime;
            this.stats.avgTimePerGame = Number(data.statistics[3].averageTimePerGame);
            this.stats.totalPoints = data.statistics[4].totalPoints;
            this.stats.avgPointsPerGame = Number(
                data.statistics[5].averagePointsPerGame
            );
            this.stats.maxGamePoints = data.statistics[6].maxGamePoints;
            this.stats.lastGamePlayed = data.statistics[7].lastGamePlayed;

            this.profile.username = data.userData.username;
            this.profile.email = data.userData.email;
            this.profile.level = data.userData.level;

            dT = Number(this.stats.totalTime);
            let hT = Math.floor(dT / 3600);
            let mT = Math.floor((dT % 3600) / 60);
            let sT = Math.floor((dT % 3600) % 60);

            let hDisplayT = hT > 0 ? hT + (hT == 1 ? ' hr ' : ' hrs ') : '';
            let mDisplayT = mT > 0 ? mT + ' min ' : '';
            let sDisplayT = sT > 0 ? sT + ' sec' : '';
            this.stats.totalTime = hDisplayT + mDisplayT + sDisplayT;

            dTG = Number(this.stats.avgTimePerGame);
            let hTG = Math.floor(dTG / 3600);
            let mTG = Math.floor((dTG % 3600) / 60);
            let sTG = Math.floor((dTG % 3600) % 60);

            let hDisplayTG = hTG > 0 ? hTG + (hTG == 1 ? ' hr ' : ' hrs ') : '';
            let mDisplayTG = mTG > 0 ? mTG + ' min ' : '';
            let sDisplayTG = sTG > 0 ? sTG + ' sec' : '';
            this.stats.avgTimePerGame = hDisplayTG + mDisplayTG + sDisplayTG;

            this.stats.lastGamePlayed = this.stats.lastGamePlayed.split(' ')[0];
            this.$bvModal.show('profile');
        },

        editProfile: function () {
            if (!this.profile.inProcessToEdit) {
                this.profile.inProcessToEdit = true;
            } else {
                this.profile.inProcessToEdit = false;
                const store = userStore();
                fetch(
                    `http://trivial7.alumnes.inspedralbes.cat/laravel/public/api/update-profile`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + store.loginInfo.token,
                        },
                        method: 'post',
                        body: JSON.stringify({
                            username: this.profile.username,
                            email: this.profile.email,
                            password: this.profile.password,
                            password_confirmation: this.profile.repeatPassword,
                        }),
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        if ((data = true)) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: 'Profile Updated',
                                showConfirmButton: false,
                                timer: 1000,
                            });
                        }
                    });
            }
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
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Please Login',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Invalid Credentials',
                            showConfirmButton: true,
                            timer: 2000,
                        });
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
                        let sessionCookie = {
                            id: data.user.id,
                            username: data.user.username,
                            token: data.token,
                        };
                        const d = new Date();
                        d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
                        let expires = "expires=" + d.toUTCString();
                        document.cookie = "sessionCookie=" + JSON.stringify(sessionCookie) + ";" + expires + ";path=/";
                        this.$bvModal.hide('login-register');
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1000,
                        });
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Invalid Credentials',
                            showConfirmButton: true,
                            timer: 2000,
                        });
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

        ranking: function () {
            this.$root.$refs.game.ranking();
        },
        logout: function () {
            document.cookie = 'sessionCookie=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            location.reload();
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