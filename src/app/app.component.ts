import { Component } from '@angular/core';
import { io } from 'socket.io-client';
import { BattleShips } from 'src/data/Constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'my-battleship';
  tenArray = new Array(10);
  socket = io('http://localhost:3000');
  gameBoxHitStatus = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => false),
  );
  shipPlacements = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => false),
  );

  selectedShip = '';
  selectedPosition: {x: number, y: number} | null = null;

  ngOnInit() {
    this.shipPlacements[4][3] = true; // Coordination: [x, y] = [3, 4]
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
  }

  onClickPatrolBoat() {
    this.selectedShip = BattleShips.PatrolBoat;
  }

  onClickCancelButton() {
    this.selectedShip = '';
    this.selectedPosition = null;
  }
}
