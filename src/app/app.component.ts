import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { BattleShips, COL_NUMBER, GamePhase, ROW_NUMBER } from 'src/data/Constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  @ViewChild('gameBox') gameBox: ElementRef | undefined;
  @ViewChild('opponentBox') opponentBox: ElementRef | undefined
  readonly BattleShips = BattleShips;
  readonly ROW_NUMBER = ROW_NUMBER;
  readonly COL_NUMBER = COL_NUMBER;
  readonly GAME_PHASE = GamePhase;
  title = 'my-battleship';
  tenArray = new Array(10);
  socket = io('http://localhost:3000');
  currentPhase = this.GAME_PHASE.Preparing;

  gameBoxHitStatus = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => false),
  );

  opponentBoxHitStatus = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => false),
  );
  shipPlacements = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ''),
  );

  selectedShip = '';
  selectedPosition: {x: number, y: number} | null = null;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.shipPlacements[4][3] = ''; // Coordination: [x, y] = [3, 4]
    this.socket.on('connect', () => {
      console.log('connect', this.socket.id);
    });
    this.socket.on(
      'broadcast-coordination',
      (coordination: { x: number; y: number }) => {
        console.log('coordination', coordination);
        this.gameBoxHitStatus[coordination.y][coordination.x] = true;
        if(this.gameBox)
          this.updateBoxHitStatus(coordination, this.gameBox);
      },
    );
  }

  onClickGameBox(coordination: { x: number; y: number}) {
    if(this.selectedShip && !this.selectedPosition) this.selectedPosition = {...coordination};

  }

  onClickOpponentBox(coordination: { x: number; y: number}) {
    if(!this.opponentBoxHitStatus[coordination.y][coordination.x]) {
      this.opponentBoxHitStatus[coordination.y][coordination.x] = true;
      this.updateBoxHitStatus(coordination, this.opponentBox);
      this.socket.emit('send-coordination', coordination);
    }
  }

  updateBoxHitStatus(coordination: { x: number; y: number}, gameBox: ElementRef | undefined) {
    if(gameBox) {
      console.log(gameBox.nativeElement.getElementsByClassName('game-table-row'));
      let rowRef = gameBox.nativeElement.getElementsByClassName('game-table-row')[coordination.y];
      let boxRef = rowRef.getElementsByClassName('game-table-box')[coordination.x] as HTMLDivElement;
      let shotDotEl = boxRef.querySelector('.shot-dot') as HTMLDivElement;
      shotDotEl.style.display = 'block';
    }
  }

  onClickTopButton() {
    if(this.selectedPosition) {
      this.shipPlacements[this.selectedPosition.y][this.selectedPosition.x] = this.selectedShip;
      this.shipPlacements[this.selectedPosition.y - 1][this.selectedPosition.x] = this.selectedShip;
      this.selectedShip = '';
      this.selectedPosition = null;
    }
  }

  onClickBottomButton() {
    if(this.selectedPosition) {
      this.shipPlacements[this.selectedPosition.y][this.selectedPosition.x] = this.selectedShip;
      this.shipPlacements[this.selectedPosition.y + 1][this.selectedPosition.x] = this.selectedShip;
      this.selectedShip = '';
      this.selectedPosition = null;
    }
  }

  onClickLeftButton() {
    if(this.selectedPosition) {
      this.shipPlacements[this.selectedPosition.y][this.selectedPosition.x] = this.selectedShip;
      this.shipPlacements[this.selectedPosition.y][this.selectedPosition.x - 1] = this.selectedShip;
      this.selectedShip = '';
      this.selectedPosition = null;
    }
  }

  onClickRightButton() {
    if(this.selectedPosition) {
      this.shipPlacements[this.selectedPosition.y][this.selectedPosition.x] = this.selectedShip;
      this.shipPlacements[this.selectedPosition.y][this.selectedPosition.x + 1] = this.selectedShip;
      this.selectedShip = '';
      this.selectedPosition = null;
    }
  }

  onClickPatrolBoat() {
    this.selectedShip = BattleShips.patrolBoat.name;
  }

  onClickStartButton() {
    this.currentPhase = this.GAME_PHASE.InProgress;
  }

  onClickCancelButton() {
    this.selectedShip = '';
    this.selectedPosition = null;
  }
}
