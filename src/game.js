import Playfield from './playfield.js';
import Piece from './piece.js';

export default class Game {
    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200
    };

    score = 0;
    lines = 0;
    topOut = false;
    activePiece = null;
    nextPiece = null;

    constructor(rows, columns) {
        this.playfield = new Playfield(rows, columns);
        this.updatePieces();
    }

    get level() {
        return Math.floor(this.lines * 0.1);
    }

    get state() {
        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            playfield: this.playfield,
            activePiece: this.activePiece,
            nextPiece: this.nextPiece,
            isGameOver: this.topOut
        };
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.topOut = false;
        this.playfield.reset();
        this.updatePieces();
    }

    movePieceLeft() {
        this.activePiece.x -= 1;

        if (this.playfield.hasCollision(this.activePiece)) {
            this.activePiece.x += 1;
        }
    }

    movePieceRight() {
        this.activePiece.x += 1;

        if (this.playfield.hasCollision(this.activePiece)) {
            this.activePiece.x -= 1;
        }
    }

    movePieceDown() {
        if (this.topOut) return; //достиг ли элемент вверха

        this.activePiece.y += 1;

        
        if (this.playfield.hasCollision(this.activePiece)) {
            this.activePiece.y -= 1;
            this.update();
        }
    }

    rotatePiece() {
        this.activePiece.rotate();

        if (this.playfield.hasCollision(this.activePiece)) {
            this.activePiece.rotate(false);
        }
    }

    update() {
        this.updatePlayfield();
        this.updateScore();
        this.updatePieces();

        if (this.playfield.hasCollision(this.activePiece)) {
            this.topOut = true;
        }
    }

    updatePlayfield() {
        this.playfield.lockPiece(this.activePiece);
    }

    /* принимает аргумент, колличество удаленных линий, они считаються за очки */
    updateScore() {
        const clearedLines = this.playfield.clearLines();

        if (clearedLines > 0) {
            this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
        }
    }

    updatePieces() {
        this.activePiece = this.nextPiece || new Piece();
        this.nextPiece = new Piece();
        console.log('updatePieces', this.activePiece, this.nextPiece)
        this.activePiece.x = Math.floor((this.playfield.columns - this.activePiece.width) / 2);
        this.activePiece.y = -1;
    }
}