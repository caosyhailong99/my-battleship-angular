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
  io = io('localhost:3000');

  ngOnInit() {
    this.io.on("connection", (socket) => {
    });
    this.io.on('hit-the-island', (coordination: {x: number, y: number}) => {
    });
  }

  onClickGameBox(event: MouseEvent, coordination: {x: number, y: number}) {
    let gameBoxEl = event.target as HTMLDivElement;
    let shotDotEl = gameBoxEl.querySelector('.shot-dot') as HTMLDivElement;
    shotDotEl.style.display = 'block'
    this.io.emit('send-coordination', coordination);
  }
}
