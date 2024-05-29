export const BattleShips: any =  {
  'Patrol boat': {
    hitCount: 0,
    length: 2,
    isSank: false,
  },
  'Submarine': {
    hitCount: 0,
    length: 3,
    isSank: false,
  }
};

export enum BattleShipTypes {
  PatrolBoat = 'Patrol boat',
  Submarine = 'Submarine',
}

export const ROW_NUMBER = 10;
export const COL_NUMBER = 10;
export const TOTAL_SHIP_AMOUNT = 2;

export enum GamePhase {
  Preparing = 'Preparing',
  InProgress = 'InProgress',
  Finish = 'Finish',
}
