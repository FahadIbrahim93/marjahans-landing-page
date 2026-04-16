import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useCartStore, type CartItem } from "./cartStore";

describe("CartStore", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset store state
    useCartStore.setState({ items: [] });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("addItem", () => {
    it("should add a new item to the cart", () => {
      const item: CartItem = {
        id: "1",
        name: "Gold Ring",
        price: 5000,
        quantity: 1,
        image: "ring.jpg",
      };

      useCartStore.getState().addItem(item);
      const items = useCartStore.getState().items;

      expect(items).toHaveLength(1);
      expect(items[0]).toEqual(item);
    });

    it("should increase quantity if item already exists", () => {
      const item: CartItem = {
        id: "1",
        name: "Gold Ring",
        price: 5000,
        quantity: 1,
        image: "ring.jpg",
      };

      useCartStore.getState().addItem(item);
      useCartStore.getState().addItem({ ...item, quantity: 2 });

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0]?.quantity).toBe(3);
    });

    it("should persist to localStorage", () => {
      const item: CartItem = {
        id: "1",
        name: "Gold Ring",
        price: 5000,
        quantity: 1,
        image: "ring.jpg",
      };

      useCartStore.getState().addItem(item);
      const saved = localStorage.getItem("cart");

      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toHaveLength(1);
    });
  });

  describe("removeItem", () => {
    it("should remove item from cart", () => {
      const item: CartItem = {
        id: "1",
        name: "Gold Ring",
        price: 5000,
        quantity: 1,
        image: "ring.jpg",
      };

      useCartStore.getState().addItem(item);
      useCartStore.getState().removeItem("1");

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });

    it("should update localStorage after removal", () => {
      const item: CartItem = {
        id: "1",
        name: "Gold Ring",
        price: 5000,
        quantity: 1,
        image: "ring.jpg",
      };

      useCartStore.getState().addItem(item);
      useCartStore.getState().removeItem("1");

      const saved = localStorage.getItem("cart");
      expect(JSON.parse(saved!)).toHaveLength(0);
    });
  });

  describe("updateQuantity", () => {
    it("should update item quantity", () => {
      const item: CartItem = {
        id: "1",
        name: "Gold Ring",
        price: 5000,
        quantity: 1,
        image: "ring.jpg",
      };

      useCartStore.getState().addItem(item);
      useCartStore.getState().updateQuantity("1", 5);

      const items = useCartStore.getState().items;
      expect(items[0]?.quantity).toBe(5);
    });

    it("should remove item if quantity is 0", () => {
      const item: CartItem = {
        id: "1",
        name: "Gold Ring",
        price: 5000,
        quantity: 1,
        image: "ring.jpg",
      };

      useCartStore.getState().addItem(item);
      useCartStore.getState().updateQuantity("1", 0);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });

    it("should remove item if quantity is negative", () => {
      const item: CartItem = {
        id: "1",
        name: "Gold Ring",
        price: 5000,
        quantity: 1,
        image: "ring.jpg",
      };

      useCartStore.getState().addItem(item);
      useCartStore.getState().updateQuantity("1", -1);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });

  describe("clearCart", () => {
    it("should remove all items", () => {
      const items: CartItem[] = [
        { id: "1", name: "Ring", price: 5000, quantity: 1, image: "ring.jpg" },
        {
          id: "2",
          name: "Necklace",
          price: 8000,
          quantity: 1,
          image: "necklace.jpg",
        },
      ];

      items.forEach(item => useCartStore.getState().addItem(item));
      useCartStore.getState().clearCart();

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("should clear localStorage", () => {
      const item: CartItem = {
        id: "1",
        name: "Gold Ring",
        price: 5000,
        quantity: 1,
        image: "ring.jpg",
      };

      useCartStore.getState().addItem(item);
      useCartStore.getState().clearCart();

      expect(localStorage.getItem("cart")).toBeNull();
    });
  });

  describe("getTotalPrice", () => {
    it("should calculate correct total", () => {
      const items: CartItem[] = [
        { id: "1", name: "Ring", price: 5000, quantity: 2, image: "ring.jpg" },
        {
          id: "2",
          name: "Necklace",
          price: 8000,
          quantity: 1,
          image: "necklace.jpg",
        },
      ];

      items.forEach(item => useCartStore.getState().addItem(item));
      const total = useCartStore.getState().getTotalPrice();

      expect(total).toBe(18000); // (5000 * 2) + 8000
    });

    it("should return 0 for empty cart", () => {
      const total = useCartStore.getState().getTotalPrice();
      expect(total).toBe(0);
    });
  });

  describe("getTotalItems", () => {
    it("should count total items correctly", () => {
      const items: CartItem[] = [
        { id: "1", name: "Ring", price: 5000, quantity: 3, image: "ring.jpg" },
        {
          id: "2",
          name: "Necklace",
          price: 8000,
          quantity: 2,
          image: "necklace.jpg",
        },
      ];

      items.forEach(item => useCartStore.getState().addItem(item));
      const count = useCartStore.getState().getTotalItems();

      expect(count).toBe(5); // 3 + 2
    });

    it("should return 0 for empty cart", () => {
      const count = useCartStore.getState().getTotalItems();
      expect(count).toBe(0);
    });
  });

  describe("localStorage persistence", () => {
    it("should save cart to localStorage when items are added", () => {
      const item: CartItem = {
        id: "1",
        name: "Gold Ring",
        price: 5000,
        quantity: 1,
        image: "ring.jpg",
      };

      useCartStore.getState().addItem(item);
      const saved = localStorage.getItem("cart");

      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]?.id).toBe("1");
    });
  });
});
