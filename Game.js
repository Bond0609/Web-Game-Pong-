var MOVEMENT = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};
var rounds = [5, 5, 3, 3, 2];
var colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c52ff', '#9b59b6'];
// making the ball_obj  
var Ball = {
    new: function (increaseSpeed) {
        return {
            width: 18,
            height: 18,
            x: (this.canvas.width / 2) - 9,
            y: (this.canvas.height / 2) - 9,
            moveX: MOVEMENT.IDLE,
            moveY: MOVEMENT.IDLE,
            speed: increaseSpeed || 7 
        };
    }
};
// making the player_2 from : https://github.com/devression/Pong-Game/blob/main/index.html
var Player_2 = {
    new: function (side) {
        return {
            width: 18,
            height: 180,
            x: side === 'left' ? 150 : this.canvas.width - 150,
            y: (this.canvas.height / 2) - 35,
            score: 0,
            move: MOVEMENT.IDLE,
            speed: 8
        };
    }
};
var Game = {
    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 1400;
        this.canvas.height = 1000;
        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';
        this.player = Player_2.new.call(this, 'left');
        this.player_2 = Player_2.new.call(this, 'right');
        this.ball_obj = Ball.new.call(this);
        this.player_2.speed = 5;
        this.running = this.over = false;
        this.turn = this.player_2;
        this.timer = this.round = 0;
        this.color = '#8c52ff';
        web_game_pong.menu();
        web_game_pong.listen();
    },
    endGameMenu: function (text) {
        web_game_pong.context.font = '45px Courier New';
        web_game_pong.context.fillStyle = this.color;
        web_game_pong.context.fillRect(
            web_game_pong.canvas.width / 2 - 350,
            web_game_pong.canvas.height / 2 - 48,
            700,
            100
        );
        web_game_pong.context.fillStyle = '#ffffff';
        web_game_pong.context.fillText(text,
            web_game_pong.canvas.width / 2,
            web_game_pong.canvas.height / 2 + 15
        );
        setTimeout(function () {
            web_game_pong = Object.assign({}, Game);
            web_game_pong.initialize();
        }, 3000);
    },
    menu: function () {
        web_game_pong.draw();
        this.context.font = '50px Courier New';
        this.context.fillStyle = this.color;
        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );
        this.context.fillStyle = '#ffffff';
        this.context.fillText('Press any key to begin',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );
    },
    // will update all objects made
    update: function () {
        if (!this.over) {
            // colliton for the ball_obj objects : https://github.com/devression/Pong-Game/blob/main/index.html (dont really understand this part)
            if (this.ball_obj.x <= 0) web_game_pong._resetTurn.call(this, this.player_2, this.player);
            if (this.ball_obj.x >= this.canvas.width - this.ball_obj.width) web_game_pong._resetTurn.call(this, this.player, this.player_2);
            if (this.ball_obj.y <= 0) this.ball_obj.moveY = MOVEMENT.DOWN;
            if (this.ball_obj.y >= this.canvas.height - this.ball_obj.height) this.ball_obj.moveY = MOVEMENT.UP;
            if (this.player.move === MOVEMENT.UP) this.player.y -= this.player.speed;
            else if (this.player.move === MOVEMENT.DOWN) this.player.y += this.player.speed;
            if (web_game_pong._turnDelayIsOver.call(this) && this.turn) {
                this.ball_obj.moveX = this.turn === this.player ? MOVEMENT.LEFT : MOVEMENT.RIGHT;
                this.ball_obj.moveY = [MOVEMENT.UP, MOVEMENT.DOWN][Math.round(Math.random())];
                this.ball_obj.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
                this.turn = null;
            }
            if (this.player.y <= 0) this.player.y = 0;
            else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);
            if (this.ball_obj.moveY === MOVEMENT.UP) this.ball_obj.y -= (this.ball_obj.speed / 1);
            else if (this.ball_obj.moveY === MOVEMENT.DOWN) this.ball_obj.y += (this.ball_obj.speed / 1);
            if (this.ball_obj.moveX === MOVEMENT.LEFT) this.ball_obj.x -= this.ball_obj.speed;
            else if (this.ball_obj.moveX === MOVEMENT.RIGHT) this.ball_obj.x += this.ball_obj.speed;
            // Handle player 2 (player_2) UP and DOWN movement (increased the spped of player_2 to make it harder) (dont really understand this part)
            if (this.player_2.y > this.ball_obj.y - (this.player_2.height / 2)) {
                if (this.ball_obj.moveX === MOVEMENT.RIGHT) this.player_2.y -= this.player_2.speed / 0.5;
                else this.player_2.y -= this.player_2.speed / 2;
            }
            if (this.player_2.y < this.ball_obj.y - (this.player_2.height / 2)) {
                if (this.ball_obj.moveX === MOVEMENT.RIGHT) this.player_2.y += this.player_2.speed / 0.5;
                else this.player_2.y += this.player_2.speed / 2;
            }
            if (this.player_2.y >= this.canvas.height - this.player_2.height) this.player_2.y = this.canvas.height - this.player_2.height;
            else if (this.player_2.y <= 0) this.player_2.y = 0;
            // players and ball_obj collision : https://github.com/devression/Pong-Game/blob/main/index.html (dont really understand this part)
            if (this.ball_obj.x - this.ball_obj.width <= this.player.x && this.ball_obj.x >= this.player.x - this.player.width) {
                if (this.ball_obj.y <= this.player.y + this.player.height && this.ball_obj.y + this.ball_obj.height >= this.player.y) {
                    this.ball_obj.x = (this.player.x + this.ball_obj.width);
                    this.ball_obj.moveX = MOVEMENT.RIGHT;
                }
            }
            // player 2 and ball_obj collision : https://github.com/devression/Pong-Game/blob/main/index.html (dont really understand this part)
            if (this.ball_obj.x - this.ball_obj.width <= this.player_2.x && this.ball_obj.x >= this.player_2.x - this.player_2.width) {
                if (this.ball_obj.y <= this.player_2.y + this.player_2.height && this.ball_obj.y + this.ball_obj.height >= this.player_2.y) {
                    this.ball_obj.x = (this.player_2.x - this.ball_obj.width);
                    this.ball_obj.moveX = MOVEMENT.LEFT;
                }
            }
        }
        // score for player and to increase the score for the side that has scored
        if (this.player.score === rounds[this.round]) {
            if (!rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { web_game_pong.endGameMenu('Winner!'); }, 1000);
            } else {
                this.color = this._generateRoundColor();
                this.player.score = this.player_2.score = 0;
                this.player.speed += 0.5;
                this.player_2.speed += 1;
                this.ball_obj.speed += 1;
                this.round += 1;
            }
        }
        // check to see if the player 2 (player_2) has won
        else if (this.player_2.score === rounds[this.round]) {
            this.over = true;
            setTimeout(function () { web_game_pong.endGameMenu('Game Over!'); }, 1000);
        }
    },
    // drawing objects (player, player_2, ball, net) to the canvas
    draw: function () {
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.context.fillStyle = this.color;
        this.context.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.context.fillStyle = '#ffffff';
        this.context.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );
        this.context.fillRect(
            this.player_2.x,
            this.player_2.y,
            this.player_2.width,
            this.player_2.height 
        );
        if (web_game_pong._turnDelayIsOver.call(this)) {
            this.context.fillRect(
                this.ball_obj.x,
                this.ball_obj.y,
                this.ball_obj.width,
                this.ball_obj.height
            );
        }
        this.context.beginPath();
        this.context.setLineDash([7, 15]);
        this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
        this.context.lineTo((this.canvas.width / 2), 140);
        this.context.lineWidth = 5;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();
        this.context.font = '100px Courier New';
        this.context.textAlign = 'center';
        this.context.fillText(
            this.player.score.toString(),
            (this.canvas.width / 2) - 300,
            200
        );
        this.context.fillText(
            this.player_2.score.toString(),
            (this.canvas.width / 2) + 300,
            200
        );
        this.context.font = '30px Courier New';
        this.context.fillText(
            'Round ' + (web_game_pong.round + 1),
            (this.canvas.width / 2),
            35
        )
        this.context.font = '40px Courier';
        this.context.fillText(
            rounds[web_game_pong.round] ? rounds[web_game_pong.round] : rounds[web_game_pong.round - 1],
            (this.canvas.width / 2),
            100
        );
    },
    // used code from https://github.com/devression/Pong-Game/blob/main/index.html
    loop: function () {
        web_game_pong.update();
        web_game_pong.draw();
        if (!web_game_pong.over) requestAnimationFrame(web_game_pong.loop);
    },
    listen: function () {
        document.addEventListener('keydown', function (key) {
            if (web_game_pong.running === false) {
                web_game_pong.running = true;
                window.requestAnimationFrame(web_game_pong.loop);
            }
            if (key.keyCode === 38 || key.keyCode === 87) web_game_pong.player.move = MOVEMENT.UP;
            if (key.keyCode === 40 || key.keyCode === 83) web_game_pong.player.move = MOVEMENT.DOWN;
        });
        document.addEventListener('keyup', function (key) { web_game_pong.player.move = MOVEMENT.IDLE; });
    },
    _resetTurn: function(victor, loser) {
        this.ball_obj = Ball.new.call(this, this.ball_obj.speed);
        this.turn = loser;
        this.timer = (new Date()).getTime();
 
        victor.score++;
    },
    _turnDelayIsOver: function() {
        return ((new Date()).getTime() - this.timer >= 1500);
    },
    _generateRoundColor: function () {
        var newColor = colors[Math.floor(Math.random() * colors.length)];
        if (newColor === this.color) return web_game_pong._generateRoundColor();
        return newColor;
    }
};
 
var web_game_pong = Object.assign({}, Game);
web_game_pong.initialize();