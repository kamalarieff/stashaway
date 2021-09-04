const { DEPOSIT_TYPE_ONE_TIME } = require("../constants");

/**
 * @description
 * Returns sum
 *
 * @param {Number[]} deposits - Array of deposits
 *
 * @returns {Number} Sum of the deposits
 *
 * @example
 * getSum([1, 2, 3])
 * //=> 6
 */
function getSum(deposits) {
  return deposits.reduce((previous, current) => previous + current, 0);
}

/**
 * @description
 * Sort the deposit plans by the One time type first. Rest can follow
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
 * @returns {{
 *          type: String
 *          portfolios: {
 *              id: {
 *                  limit: Number
 *              }
 *          }
 *        }[]} depositPlans - Sorted list of deposit plans
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
function sortDepositPlans(depositPlans) {
  return depositPlans.sort((a, b) => {
    if (a.type == DEPOSIT_TYPE_ONE_TIME) return -1;
    else if (b.type == DEPOSIT_TYPE_ONE_TIME) return 1;
    return 0;
  });
}

/**
 * @description
 * Build the balance object via the first deposit plan
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
 * @returns {Object} Balance object
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
function buildBalanceObject(depositPlans) {
  const [firstDepositPlan] = depositPlans;
  return Object.keys(firstDepositPlan.portfolios).reduce(
    (previous, current) => {
      return { ...previous, ...{ [current]: 0 } };
    },
    {}
  );
}

module.exports = {
  getSum,
  sortDepositPlans,
  buildBalanceObject,
};
