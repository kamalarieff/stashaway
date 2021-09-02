const MAX_DEPOSIT_PLANS = 2;
/**
 * @description
 * Deposit takes a list of deposit plans and a list of deposits that will
 * be credited into the specific deposit plans
 *
 * @param {{
 *          type: String
 *          portfolio: String
 *          limit: Number
 *        }[]} depositPlan - List of deposit plans
 * @param {Number[]} deposits - Number of deposits
 *
 * @example
 * deposit([{ type: "One time", portfolio: "High risk", limit: 10000 }], [10000])
 * //=> { "High risk": 10000 }
 *
 * deposit([{ type: "One time", portfolio: "High risk", limit: 5000 }], [10000])
 * //=> { "High risk": 5000 }
 *
 * deposit([
 *        {
 *            type: "Monthly",
 *            portfolio: "Retirement",
 *            limit: 0
 *        }
 *      ],
 *      [10000])
 * //=> { "Retirement": 10000 }
 *
 * deposit([
 *        {
 *            type: "One time",
 *            portfolio: "High risk",
 *            limit: 5000
 *        },
 *        {
 *            type: "Monthly",
 *            portfolio: "Retirement",
 *            limit: 0
 *        }
 *      ],
 *      [10000])
 * //=> { "High risk": 5000, "Retirement": 5000 }
 *
 */
function deposit(depositPlan, deposits) {
  if (depositPlan.length > MAX_DEPOSIT_PLANS)
    throw new Error("Exceeded amount of deposit plans.");

  if (deposits.length == 0)
    throw new Error("You must pass a non-empty deposits.");

  const oneTimeDeposit = depositPlan.filter((plan) => plan.type === "One time");
  console.log("oneTimeDeposit", oneTimeDeposit);
}

deposit(
  [
    {
      type: "One time",
      portfolio: "High risk",
      limit: 5000,
    },
    {
      type: "Monthly",
      portfolio: "Retirement",
      limit: 0,
    },
  ],
  [10000]
);
