const { DEPOSIT_TYPE_ONE_TIME } = require("./utils/constants");
const {
  checkDepositPlansConstraints,
  checkDepositsConstraints,
} = require("./utils/constraints");
const {
  getSum,
  sortDepositPlans,
  buildBalanceObject,
} = require("./utils/functions");
const Queue = require("./dataStructures/queue");

/**
 * @description
 * Deposit takes a list of deposit plans and a list of deposits that will
 * be credited into the specific deposit plans
 *
 * @param {{
 *          type: String
 *          portfolios: {
 *              id: {
 *                  limit: Number
 *              }
 *          }
 *        }[]} depositPlans - List of deposit plans
 * @param {Number[]} deposits - Number of deposits
 * @returns {Object} Balance of all portfolios
 *
 * @example
 * deposit([
 *  {
 *    type: "One time",
 *    portfolios: {
 *      "High risk": {
 *        limit: 10000
 *      }
 *    }
 *  }],
 * [10000])
 * //=> { "High risk": 10000 }
 *
 * deposit([
 *  {
 *    type: "One time",
 *    portfolios: {
 *      "High risk": {
 *        limit: 5000
 *      }
 *    }
 *  }],
 * [10000])
 * //=> { "High risk": 5000 }
 *
 * deposit([
 *  {
 *    type: "Monthly",
 *    portfolios: {
 *      "Retirement": {
 *        limit: 100
 *      }
 *    }
 *  }],
 * [100])
 * //=> { "Retirement": 100 }
 *
 * deposit([
 *  {
 *    type: "One time",
 *    portfolios: {
 *      "High risk": {
 *        limit: 10000
 *      }
 *      "Retirement": {
 *        limit: 500
 *      }
 *    }
 *  },
 *  {
 *    type: "Monthly",
 *    portfolios: {
 *      "High risk": {
 *        limit: 0
 *      }
 *      "Retirement": {
 *        limit: 100
 *      }
 *    }
 *  }
 * ],
 * [10500, 100])
 * //=> { "One time": 10000, "Retirement": 600 }
 *
 */
function deposit(depositPlans, deposits) {
  checkDepositsConstraints(deposits);
  checkDepositPlansConstraints(depositPlans);

  let sum = getSum(deposits);

  // the order is very important here, it ensures that we do the one time first
  const sortedDepositPlan = sortDepositPlans(depositPlans);

  const account = buildBalanceObject(sortedDepositPlan);

  const queueDepositPlans = new Queue(...sortedDepositPlan);

  while (sum > 0 && queueDepositPlans.isEmpty() === false) {
    let currentDepositPlan = queueDepositPlans.peek();
    let portfolios = currentDepositPlan.portfolios;

    for (const property in portfolios) {
      if (sum >= portfolios[property].limit) {
        account[property] = account[property] + portfolios[property].limit;
        sum = sum - portfolios[property].limit;
      } else {
        account[property] = account[property] + sum;
        sum = 0;
      }
    }

    if (currentDepositPlan.type === DEPOSIT_TYPE_ONE_TIME)
      queueDepositPlans.dequeue();
  }

  return account;
}

// export default deposit;
module.exports = deposit;
