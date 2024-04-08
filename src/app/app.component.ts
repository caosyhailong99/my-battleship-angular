import { Component } from '@angular/core';
import { io } from 'socket.io-client';

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

  ngOnInit() {
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

  onClickGameBox(event: MouseEvent, coordination: { x: number; y: number }) {
    let gameBoxEl = event.target as HTMLDivElement;
    let shotDotEl = gameBoxEl.querySelector('.shot-dot') as HTMLDivElement;
    shotDotEl.style.display = 'block';
    this.gameBoxHitStatus[coordination.x][coordination.y] = true;
    this.socket.emit('send-coordination', coordination);
  }
}
