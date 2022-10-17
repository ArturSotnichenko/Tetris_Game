

export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.isPlaying = false;
        this.interval = null;
        this.audio = document.getElementById('audio')
        this.update = this.update.bind(this);
       
       
       
        view.on('keypress', this.handleKeyPress.bind(this));
        view.on('keydown', this.handleKeyDown.bind(this));
        view.on('keyup', this.handleKeyUp.bind(this));
  

        document.querySelector('#btn_left').addEventListener('touchstart', (eo)=>{this.game.movePieceLeft();
           this.updateView();})
              
        
        document.querySelector('#root').addEventListener('touchstart', (eo)=>{this.play();})

        document.querySelector('#btn_right').addEventListener('touchstart', (eo)=>{this.game.movePieceRight();
            this.updateView();})
     
        document.querySelector('#btn_flip').addEventListener('touchstart', (eo)=>{this.game.rotatePiece();
            this.updateView();})



       

        this.view.renderStartScreen();
    }

    update() {
        this.game.movePieceDown();
        this.updateView();
    }


    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
        this.audio.play();
        this.audio.volume=0.1;
   
    }

    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
        this.audio.pause()
       
        
    }

    reset() {
        this.game.reset();
        this.play();
    }

    updateView() {
        const state = this.game.state;
        
        if (state.isGameOver) {
            this.view.renderEndScreen(state);
        } else if (!this.isPlaying) {
            this.view.renderPauseScreen(state);
        } else {
            this.view.renderMainScreen(state);
        }
    }
//изменение скорости игры в зависимости от уровня
    startTimer() {
        const speed = 1000 - this.game.level * 100;
        
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.update()
            }, speed > 0 ? speed : 100);
        }
    }

    stopTimer() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    handleKeyPress(event) {
             switch (event.keyCode) {
            case 13: // ENTER 
                if (this.game.state.isGameOver) {
                    console.log(this.game.state)
                    this.reset();
                } else if (this.isPlaying) {
                    this.pause();
                } else  {
                    this.play();
                }
               
                break;
        }
    }

     

 

    //привзяка клавиш

    handleKeyDown(event) {
        
        switch (event.keyCode) {
            case 37: // левая стрелка 
                this.game.movePieceLeft();
                this.updateView();
                break;
            case 38: // верхняя стрелка (вращение фигурой)
                this.game.rotatePiece();
                this.updateView();
                break;
            case 39: //  верхняя стрелка
                this.game.movePieceRight();
                this.updateView();
                break;
            case 40: // нижняя стрелка (ускорение)
                this.stopTimer();
                this.game.movePieceDown();
                this.updateView();
                break;
        }
    } 

    handleKeyUp(event) {
        switch (event.keyCode) {
            case 40: 
                this.startTimer();
                break;
        }
    }
}