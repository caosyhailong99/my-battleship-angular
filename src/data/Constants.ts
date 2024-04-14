export const BattleShips =  {
  patrolBoat: {
    name: 'Patrol boat',
    length: 2,
  }
};

export const ROW_NUMBER = 10;
export const COL_NUMBER = 10;

export enum GamePhase {
  Preparing = 'Preparing',
  InProgress = 'InProgress',
  Finish = 'Finish',
}