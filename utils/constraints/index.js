const { MAX_DEPOSIT_PLANS, VALID_PLAN_TYPES } = require("../constants");

/**
 * @description
 * Check constraints for deposit plans.
 *
 * @param {{
 *          type: String
 *          portfolios: {
 *              id: {
 *                  limit: Number
 *              }
 *          }
 *        }[]} depositPlans - List of deposit plans
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
function checkDepositPlansConstraints(depositPlans) {
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
 * Check constraints for deposits.
 *
 * @param {Number[]} deposits - Number of deposits
 *
 * @example
 * checkDepositsConstraints([])
 * //=> Error
 */
function checkDepositsConstraints(deposits) {
  if (!deposits || deposits.length == 0)
    throw new Error("You must pass a non-empty deposits.");
}

module.exports = {
  checkDepositPlansConstraints,
  checkDepositsConstraints,
};
