const MAX_DEPOSIT_PLANS = 2;

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
 *        }[]} depositPlan - List of deposit plans
 * @param {Number[]} deposits - Number of deposits
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
function deposit(depositPlan, deposits) {
  if (!depositPlan || depositPlan.length == 0)
    throw new Error("You must pass a non-empty deposit plans.");

  if (depositPlan.length > MAX_DEPOSIT_PLANS)
    throw new Error("Exceeded amount of deposit plans.");

  if (!deposits || deposits.length == 0)
    throw new Error("You must pass a non-empty deposits.");

  // finding the one time deposit plan in the array
  const oneTimeDepositPlan = depositPlan.find(
    (plan) => plan.type === "One time"
  );

  const monthlyDepositPlan = depositPlan.find(
    (plan) => plan.type === "Monthly"
  );

  if (!oneTimeDepositPlan && !monthlyDepositPlan)
    throw new Error("Invalid plan types.");

  // building the balance object here
  const account = Object.keys(depositPlan[0].portfolios).reduce(
    (previous, current) => {
      return { ...previous, ...{ [current]: { balance: 0 } } };
    },
    {}
  );

  // need to remove the one time deposit plan when it has been deposited
  const queueDeposits = new Queue(...deposits);
  const queueDepositPlans = new Queue(
    // ...[oneTimeDepositPlan, monthlyDepositPlan]
    ...depositPlan
  );

  // can you deposit more than the limit set in the portfolio plan???
  while (queueDeposits.length > 0) {
    let currentDeposit = queueDeposits.peek();
    let currentDepositPlan = queueDepositPlans.peek();
    for (const property in currentDepositPlan.portfolios) {
      if (currentDeposit < currentDepositPlan.portfolios[property].limit) {
        account[property].balance = account[property].balance + currentDeposit;
      } else {
        account[property].balance =
          account[property].balance +
          currentDepositPlan.portfolios[property].limit;
      }
      currentDeposit =
        currentDeposit - currentDepositPlan.portfolios[property].limit;
    }
    if (currentDepositPlan.type === "One time") queueDepositPlans.dequeue();

    // if (currentDeposit === 0) {
    //   queueDeposits.dequeue();
    //   continue;
    // }
    queueDeposits.dequeue();
  }

  return account;
}

// export default deposit;
module.exports = deposit;

/* deposit(
  [
    {
      type: "One time",
      portfolios: { "High risk": { limit: 10000 }, Retirement: { limit: 500 } },
    },
    {
      type: "Monthly",
      portfolios: { "High risk": { limit: 0 }, Retirement: { limit: 100 } },
    },
  ],
  [10500, 100, 100, 100, 100]
); */
