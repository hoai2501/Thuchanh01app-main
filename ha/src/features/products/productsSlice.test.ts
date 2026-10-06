import { describe, expect, it } from "@jest/globals";

import products from "./productsSlice";

describe("products data", () => {
  it("starts with an empty product collection", () => {
    expect(products).toEqual([]);
  });
});
