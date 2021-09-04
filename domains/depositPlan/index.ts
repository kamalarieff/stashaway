import {
  DEPOSIT_TYPE_ONE_TIME,
  MAX_DEPOSIT_PLANS,
  VALID_PLAN_TYPES,
} from "../../lib/constants";

export interface DepositPlan {
  type: string;
  portfolios: { [key: string]: { limit: number } };
}

/**
 * @description
 * Check constraints for deposit plans.
 *
 * @example
 * checkDepositPlansConstraints([
 *   {
 *     type: "Kamal",
 *     portfolios: {
 *       "High risk": {
 *         limit: 10000
 *       }
 *     }
 *   }
 * ])
 * //=> Error
 *
 * checkDepositPlansConstraints()
 * //=> Error
 *
 * checkDepositPlansConstraints([])
 * //=> Error
 */
export function checkDepositPlansConstraints(depositPlans: DepositPlan[]) {
  if (!depositPlans || depositPlans.length == 0)
    throw new Error("You must pass a non-empty deposit plans.");

  if (depositPlans.length > MAX_DEPOSIT_PLANS)
    throw new Error("Exceeded amount of deposit plans.");

  const invalidPlans = depositPlans.filter(
    (plan) => VALID_PLAN_TYPES.includes(plan.type) === false
  );

  if (invalidPlans.length != 0) throw new Error("Invalid plan types.");
}

/**
 * @description
 * Sort the deposit plans by the One time type first. Rest can follow
 *
 * @example
 * sortDepositPlans([
 *   {
 *     type: "Monthly",
 *     portfolios: {
 *       "High risk": {
 *         limit: 10000
 *       }
 *     }
 *   },
 *   {
 *     type: "One time",
 *     portfolios: {
 *       "High risk": {
 *         limit: 10000
 *       }
 *     }
 *   }
 * ])
 * //=> [
 *   {
 *     type: "One time",
 *     portfolios: {
 *       "High risk": {
 *         limit: 10000
 *       }
 *     }
 *   },
 *   {
 *     type: "Monthly",
 *     portfolios: {
 *       "High risk": {
 *         limit: 10000
 *       }
 *     }
 *   },
 * ]
 */
export function sortDepositPlans(depositPlans: DepositPlan[]) {
  return depositPlans.sort((a, b) => {
    if (a.type == DEPOSIT_TYPE_ONE_TIME) return -1;
    else if (b.type == DEPOSIT_TYPE_ONE_TIME) return 1;
    return 0;
  });
}
