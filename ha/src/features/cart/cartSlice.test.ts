import { describe, expect, it } from "@jest/globals";

import reducer, { addToCart, removeFromCart, updateQuantity } from "./cartSlice";
import type { Product } from "../products/productsSlice";

const product: Product = {
  id: 5,
  title: "Keyboard",
  price: 50,
  image: "/keyboard.png",
};

describe("cart reducer", () => {
  it("adds an item and increments a duplicate", () => {
    const once = reducer(undefined, addToCart(product));
    const twice = reducer(once, addToCart(product));
    expect(twice.items[0].quantity).toBe(2);
  });

  it("removes an item", () => {
    const state = reducer(undefined, addToCart(product));
    expect(reducer(state, removeFromCart(product.id)).items).toEqual([]);
  });

  it("updates quantity for an existing item", () => {
    const state = reducer(undefined, addToCart(product));
    expect(
      reducer(state, updateQuantity({ id: product.id, quantity: 4 })).items[0].quantity
    ).toBe(4);
  });

  it("keeps state unchanged when updating a missing item", () => {
    const state = reducer(undefined, addToCart(product));
    expect(reducer(state, updateQuantity({ id: 999, quantity: 4 }))).toEqual(state);
  });
});
