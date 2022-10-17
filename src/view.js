
export default class View {
    static colors = {
        'I': 'cyan',
        'J': 'blue',
        'L': 'orange',
        'O': 'yellow',
        'S': 'green',
        'T': 'purple',
        'Z': 'red'
    };

    constructor({ element, width, height, rows, columns }) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');



       

        this.playfieldBorderWidth = 4;
        this.playfieldX = this.playfieldBorderWidth;
        this.playfieldY = this.playfieldBorderWidth;
        this.playfieldWidth = this.width * 2 / 3;
        this.playfieldHeight = this.height;
        this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
        this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;

        this.blockWidth = this.playfieldInnerWidth / columns;
        this.blockHeight = this.playfieldInnerHeight / rows;

        this.panelX = this.playfieldWidth + 10;
        this.panelY = 0;
        this.panelWidth = this.width / 3;
        this.panelHeight = this.height;

        this.element.appendChild(this.canvas);

    }

    on(event, handler) {
        document.addEventListener(event, handler);
    }

    //начальный экран
    renderStartScreen() {
        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER or TAP', this.width / 2, this.height / 2);
        this.context.fillText('the screen to Start', this.width / 2, this.height / 2 + 50);
          
    }


    renderMainScreen(state) {
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
        this.renderBorder();
    }

    //пауза
    renderPauseScreen() {
        this.clearScreen('rgba(0, 0, 0, 0.75)');//затемнение экрана

        this.context.fillStyle = 'white';
        this.context.font = '16px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('PAUSE', this.width / 2, this.height / 2 - 48);
        this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
    }

    renderEndScreen({ score }) {
        this.clearScreen();

        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
        this.context.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 48);
    }

    clearScreen(color = 'black') {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    renderBorder() {
        this.context.strokeStyle = 'white';
        this.context.lineWidth = this.playfieldBorderWidth;
        this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight);
    }

    renderPlayfield({ playfield, activePiece }) {
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];

            for (let x = 0; x < line.length; x++) {
                const block = playfield[y][x];
                
                if (block) {
                    this.renderBlock({
                        x: this.playfieldX + (x * this.blockWidth),
                        y: this.playfieldY + (y * this.blockHeight),
                        width: this.blockWidth,
                        height: this.blockHeight,
                        color: View.colors[block.type]
                    });
                }
            }
        }

        this.renderPiece(activePiece, {
            x: this.playfieldX,
            y: this.playfieldY,
            width: this.blockWidth,
            height: this.blockHeight
        });
    }

   /*  принимаем необходимые данные, передаем в рамках объекта  */
    renderPanel({ level, score, lines, nextPiece }) {
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'white';
        this.context.font = '14px "Press Start 2P"';

        //отображаем очки
        this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 0);
        this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 24);
        this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 48);
        this.context.fillText('Next:', this.panelX, this.panelY + 96);
        
     

        this.renderPiece(nextPiece, {
            x: this.panelX,
            y: this.panelY + 120,
            width: this.blockWidth * 0.5,
            height: this.blockHeight * 0.5
        });
    
    }
   


    renderPiece(piece, { x, y, width = this.blockWidth, height = this.blockHeight }) {
        for (let block of piece) {
            if (block) {
                this.renderBlock({
                    x: x + (block.x * width),
                    y: y + (block.y * height),
                    width,
                    height,
                    color: View.colors[block.type]
                });
            }
        }
    }

    renderBlock({ x, y, width, height, lineWidth = 2, color = 'black' }) {
        this.context.fillStyle = color;
        this.context.strokeStyle = 'black';
        this.context.lineWidth = lineWidth;
        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height);
    }
}