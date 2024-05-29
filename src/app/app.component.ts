import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Socket, io } from 'socket.io-client';
import {
  BattleShipTypes,
  BattleShips,
  COL_NUMBER,
  GamePhase,
  ROW_NUMBER,
  TOTAL_SHIP_AMOUNT,
} from 'src/data/Constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  readonly BattleShips = JSON.parse(JSON.stringify(BattleShips));
  readonly BattleShipTypes = BattleShipTypes;
  readonly ROW_NUMBER: number = ROW_NUMBER;
  readonly COL_NUMBER: number = COL_NUMBER;
  readonly TOTAL_SHIP_AMOUNT: number = TOTAL_SHIP_AMOUNT;
  readonly GAME_PHASE = GamePhase;

  title: string = 'my-battleship';
  sinkedShip = '';
  selectedShip: string = '';
  positionedShipAmount = 0;
  timeoutId: NodeJS.Timeout | undefined;
  tenArray: any[] = new Array(10);
  currentPhase: string = this.GAME_PHASE.Preparing;
  gameBoxHitStatus: boolean[][] = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => false),
  );
  selectedPosition: { x: number; y: number } | null = null;
  opponentBoxHitStatus: boolean[][] = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => false),
  );
  shipPlacements: string[][] = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ''),
  );
  socket: Socket = io('http://localhost:3000');

  @ViewChild('gameBox') gameBox: ElementRef | undefined;
  @ViewChild('opponentBox') opponentBox: ElementRef | undefined;
  @ViewChild('patrolBoat') patrolBoat: ElementRef | undefined;
  @ViewChild('submarine') submarine: ElementRef | undefined;

  constructor(private cd: ChangeDetectorRef) {
    console.log(environment.production);
  }

  ngOnInit() {
    this.socket.on('connect', () => {});
    this.socket.on(
      'broadcast-coordination',
      (coordination: { x: number; y: number }) => {
        this.gameBoxHitStatus[coordination.y][coordination.x] = true;
        if (this.gameBox)
          this.updateBoxHitStatus(coordination, this.gameBox, 'player');
      },
    );
    this.socket.on('target-hit-response', (coordination) => {
      console.log('target-hit-response');
      if (this.opponentBox) {
        let shotDotEl = this.getShotDotEl(this.opponentBox, coordination);
        shotDotEl.classList.remove('bg-white');
        shotDotEl.classList.add('bg-red-600');
      }
    });
    this.socket.on('target-ship-sink', (shipName) => {
      this.sinkedShip = shipName;
      if(this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {this.sinkedShip = '';}, 5000);
    });
  }

  getShotDotEl(
    gameBox: ElementRef,
    coordination: { x: number; y: number },
  ): HTMLDivElement {
    let rowRef =
      gameBox.nativeElement.getElementsByClassName('game-table-row')[
        coordination.y
      ];
    let boxRef = rowRef.getElementsByClassName('game-table-box')[
      coordination.x
    ] as HTMLDivElement;
    return boxRef.querySelector('.shot-dot') as HTMLDivElement;
  }

  onClickGameBox(coordination: { x: number; y: number }) {
    if (this.selectedShip && !this.selectedPosition)
      this.selectedPosition = { ...coordination };
  }

  onClickOpponentBox(coordination: { x: number; y: number }) {
    if (!this.opponentBoxHitStatus[coordination.y][coordination.x]) {
      this.opponentBoxHitStatus[coordination.y][coordination.x] = true;
      this.updateBoxHitStatus(coordination, this.opponentBox, 'opponent');
      this.socket.emit('send-coordination', coordination);
    }
  }

  updateBoxHitStatus(
    coordination: { x: number; y: number },
    gameBox: ElementRef | undefined,
    target: 'player' | 'opponent',
  ) {
    if (gameBox) {
      let shotDotEl = this.getShotDotEl(gameBox, coordination);
      shotDotEl.style.display = 'block';
      let shipName = this.shipPlacements[coordination.y][coordination.x];
      if (target === 'player' && shipName) {
        let targettedBattleship = this.BattleShips[shipName];
        targettedBattleship.hitCount++;
        shotDotEl.classList.add('bg-red-600');
        if (targettedBattleship.hitCount === targettedBattleship.length) {
          targettedBattleship.isSank = true;
          this.socket.emit('ship-sink', shipName);
        }
        console.log('emit target-hit');
        this.socket.emit('target-hit', coordination);
      }
    }
  }

  removePositionedShip(shipName: string) {
    let shipDiv!: HTMLElement;
    switch (shipName) {
      case BattleShipTypes.PatrolBoat:
        shipDiv = this.patrolBoat?.nativeElement as HTMLDivElement;
        break;
      case BattleShipTypes.Submarine:
        shipDiv = this.submarine?.nativeElement as HTMLDivElement;
        break;
    }
    shipDiv.remove();
  }

  onClickTopButton() {
    let shipLength: number = this.BattleShips[this.selectedShip].length;
    if (this.selectedPosition) {
      for (let i = 0; i < shipLength; i++)
        this.shipPlacements[this.selectedPosition.y - i][
          this.selectedPosition.x
        ] = this.selectedShip;
      this.removePositionedShip(this.selectedShip);
      this.selectedShip = '';
      this.selectedPosition = null;
      this.positionedShipAmount++;
    }
  }

  onClickBottomButton() {
    let shipLength: number = this.BattleShips[this.selectedShip].length;
    if (this.selectedPosition) {
      for (let i = 0; i < shipLength; i++)
        this.shipPlacements[this.selectedPosition.y + i][
          this.selectedPosition.x
        ] = this.selectedShip;
      this.removePositionedShip(this.selectedShip);
      this.selectedShip = '';
      this.selectedPosition = null;
      this.positionedShipAmount++;
    }
  }

  onClickLeftButton() {
    let shipLength: number = this.BattleShips[this.selectedShip].length;
    if (this.selectedPosition) {
      for (let i = 0; i < shipLength; i++)
        this.shipPlacements[this.selectedPosition.y][
          this.selectedPosition.x - i
        ] = this.selectedShip;
      this.removePositionedShip(this.selectedShip);
      this.selectedShip = '';
      this.selectedPosition = null;
      this.positionedShipAmount++;
    }
  }

  onClickRightButton() {
    let shipLength: number = this.BattleShips[this.selectedShip].length;
    if (this.selectedPosition) {
      for (let i = 0; i < shipLength; i++)
        this.shipPlacements[this.selectedPosition.y][
          this.selectedPosition.x + i
        ] = this.selectedShip;
      this.removePositionedShip(this.selectedShip);
      this.selectedShip = '';
      this.selectedPosition = null;
      this.positionedShipAmount++;
    }
  }

  onClickBoat(shipName: string) {
    this.selectedShip = shipName;
  }

  onClickStartButton() {
    this.currentPhase = this.GAME_PHASE.InProgress;
  }

  onClickCancelButton() {
    this.selectedShip = '';
    this.selectedPosition = null;
  }
}
