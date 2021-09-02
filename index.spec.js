const deposit = require("./index");

describe("constraints", () => {
  it("no deposit plans", () => {
    expect(() => {
      deposit(null, [10]);
    }).toThrow("You must pass a non-empty deposit plans.");
    expect(() => {
      deposit([], [10]);
    }).toThrow("You must pass a non-empty deposit plans.");
  });

  it("no deposits", () => {
    expect(() => {
      deposit([{ type: "One time" }, { type: "Monthly" }], []);
    }).toThrow("You must pass a non-empty deposits.");

    expect(() => {
      deposit([{ type: "One time" }, { type: "Monthly" }]);
    }).toThrow("You must pass a non-empty deposits.");
  });

  it("exceeded deposit plans", () => {
    expect(() => {
      deposit(
        [{ type: "One time" }, { type: "Monthly" }, { type: "Yearly" }],
        [10]
      );
    }).toThrow("Exceeded amount of deposit plans.");
  });

  it("invalid deposit plans", () => {
    expect(() => {
      deposit([{ type: "Kamal" }], [10]);
    }).toThrow("Invalid plan types.");
  });
});

describe("test", () => {
  it("happy path", () => {
    const res = deposit(
      [
        {
          type: "One time",
          portfolios: {
            "High risk": { limit: 10000 },
            Retirement: { limit: 500 },
          },
        },
        {
          type: "Monthly",
          portfolios: { "High risk": { limit: 0 }, Retirement: { limit: 100 } },
        },
      ],
      [10500, 100]
    );
    expect(res).toEqual({
      "High risk": { balance: 10000 },
      Retirement: { balance: 600 },
    });
  });

  it("happy path out of order portfolios", () => {
    const res = deposit(
      [
        {
          type: "One time",
          portfolios: {
            Retirement: { limit: 500 },
            "High risk": { limit: 10000 },
          },
        },
        {
          type: "Monthly",
          portfolios: {
            Retirement: { limit: 100 },
            "High risk": { limit: 0 },
          },
        },
      ],
      [10500, 100]
    );
    expect(res).toEqual({
      "High risk": { balance: 10000 },
      Retirement: { balance: 600 },
    });
  });

  it("out of order deposit portfolio", () => {
    const res = deposit(
      [
        {
          type: "Monthly",
          portfolios: { "High risk": { limit: 0 }, Retirement: { limit: 100 } },
        },
        {
          type: "One time",
          portfolios: {
            "High risk": { limit: 10000 },
            Retirement: { limit: 500 },
          },
        },
      ],
      [10500, 100]
    );
    expect(res).toEqual({
      "High risk": { balance: 10000 },
      Retirement: { balance: 600 },
    });
  });

  it("should only fill up to the limit based on the number of deposits", () => {
    const res = deposit(
      [
        {
          type: "Monthly",
          portfolios: { "High risk": { limit: 0 }, Retirement: { limit: 100 } },
        },
      ],
      [10500, 100]
    );
    expect(res).toEqual({
      "High risk": { balance: 0 },
      // Retirement: { balance: 10600 },
      Retirement: { balance: 200 },
    });
  });

  it("should fill up retirement only to the limit", () => {
    const res = deposit(
      [
        {
          type: "One time",
          portfolios: {
            "High risk": { limit: 0 },
            Retirement: { limit: 10000 },
          },
        },
      ],
      [10500, 100]
    );
    expect(res).toEqual({
      "High risk": { balance: 0 },
      Retirement: { balance: 10000 },
    });
  });

  it("should fill up high risk first", () => {
    const res = deposit(
      [
        {
          type: "One time",
          portfolios: {
            "High risk": { limit: 100000 },
            Retirement: { limit: 500 },
          },
        },
        {
          type: "Monthly",
          portfolios: { "High risk": { limit: 0 }, Retirement: { limit: 100 } },
        },
      ],
      [10500, 100]
    );
    expect(res).toEqual({
      "High risk": { balance: 10500 },
      Retirement: { balance: 100 },
    });
  });
});
