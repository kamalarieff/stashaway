import { DepositPlan } from "../depositPlan";

export interface Balance {
  [key: string]: number;
}

/**
 * @description
 * Build the balance object via the first deposit plan
 *
 * @example
 * buildBalanceObject([
 *   {
 *     type: "One time",
 *     portfolios: {
 *       "High risk": {
 *         limit: 10000
 *       }
 *       "Retirement": {
 *         limit: 10000
 *       }
 *     }
 *   }
 * ])
 * //=> { High risk: 0, Retirement: 0 }
 */
export function buildBalanceObject(depositPlans: DepositPlan[]): Balance {
  const [firstDepositPlan] = depositPlans;
  return Object.keys(firstDepositPlan.portfolios).reduce(
    (previous, current) => {
      return { ...previous, ...{ [current]: 0 } };
    },
    {}
  );
}
