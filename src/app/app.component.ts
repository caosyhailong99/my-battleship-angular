import { Component } from '@angular/core';
import { io } from 'socket.io-client';
import { BattleShips, COL_NUMBER, GamePhase, ROW_NUMBER } from 'src/data/Constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
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
  shipPlacements = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ''),
  );

  selectedShip = '';
  selectedPosition: {x: number, y: number} | null = null;

  ngOnInit() {
    this.shipPlacements[4][3] = ''; // Coordination: [x, y] = [3, 4]
    this.socket.on('connect', () => {
      console.log('connect', this.socket.id);
      console.log(this.gameBoxHitStatus);
    });
    this.socket.on(
      'broadcast-coordination',
      (coordination: { x: number; y: number }) => {
        console.log('coordination', coordination);
        this.gameBoxHitStatus[coordination.x][coordination.y] = true;
        let rowRef = document.getElementsByClassName('game-table-row')[coordination.x];
        let boxRef = rowRef.getElementsByClassName('game-table-box')[coordination.y] as HTMLDivElement;
        let shotDotEl = boxRef.querySelector('.shot-dot') as HTMLDivElement;
        shotDotEl.style.display = 'block';
      },
    );
  }

  onClickGameBox(coordination: { x: number; y: number}) {
    if(this.selectedShip && !this.selectedPosition) this.selectedPosition = {...coordination};
    console.log(this.selectedPosition);
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
