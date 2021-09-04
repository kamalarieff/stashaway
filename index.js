const MAX_DEPOSIT_PLANS = 2;
const DEPOSIT_TYPE_ONE_TIME = "One time";
const DEPOSIT_TYPE_MONTHLY = "Monthly";
const VALID_PLAN_TYPES = [DEPOSIT_TYPE_ONE_TIME, DEPOSIT_TYPE_MONTHLY];

/**
 * @class
 * @description
 * This is an implementation of the queue data structure.
 * JavaScript doesn't have a built in so we create one here
 *
 * @example
 * const queue = new Queue([1, 2, 3]);
 * queue.peek();
 * //=> 1
 *
 * queue.dequeue();
 * //=> 1
 *
 * console.log(queue)
 * //=> [2, 3]
 *
 * queue.enqueue(4);
 * //=> [2, 3, 4]
 *
 * queue.isEmpty();
 * //=> false
 *
 * queue.dequeue();
 * queue.dequeue();
 * queue.dequeue();
 * queue.isEmpty();
 * //=> true
 **/
class Queue extends Array {
  enqueue(val) {
    this.push(val);
  }

  dequeue() {
    return this.shift();
  }

  peek() {
    return this[0];
  }

  isEmpty() {
    return this.length === 0;
  }
}

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
