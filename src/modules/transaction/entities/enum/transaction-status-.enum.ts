/**
 * Los estados tienen peso por importancia que repercuten en el estado general de la transaccion.
 * TO_CHANGE > EDITED > PENDING > OK
 */
export enum TRANSACTION_STATUS_ENUM {
  OK = 'OK',
  PENDING = 'PENDING',
  TO_CHANGE = 'TO_CHANGE',
  EDITED = 'EDITED',
}
