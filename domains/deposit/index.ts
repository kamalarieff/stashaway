export type Deposit = number;
/**
 * @description
 * Check constraints for deposits.
 *
 * @example
 * checkDepositsConstraints([])
 * //=> Error
 */
export function checkDepositsConstraints(deposits: Deposit[]) {
  if (!deposits || deposits.length == 0)
    throw new Error("You must pass a non-empty deposits.");
}

/**
 * @description
 * Returns sum
 *
 * @example
 * getSum([1, 2, 3])
 * //=> 6
 */
export function getSum(deposits: Deposit[]) {
  return deposits.reduce((previous, current) => previous + current, 0);
}
