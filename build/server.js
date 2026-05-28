const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing middlewares
app.use(cors());
app.use(express.json());

/**
 * 0/1 KNAPSACK DYNAMIC PROGRAMMING OPTIMIZATION ALGORITHM
 * 
 * Objective: Maximize total discount saved (value) while keeping 
 * the total discounted cost (weight) strictly within the maximum budget limit (capacity).
 */
app.post("/api/optimize", (req, res) => {
  try {
    const { cartItems, budget } = req.body;
    const capacity = parseInt(budget);

    // Guard clauses for invalid inputs
    if (isNaN(capacity) || capacity <= 0) {
      return res.status(400).json({ error: "Please provide a valid maximum budget capacity." });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Your shopping cart is empty." });
    }

    // 1. Flatten the cart items based on quantity
    // (If item has qty 3, we treat it as 3 individual items that can be selected or not)
    const flatItems = [];
    cartItems.forEach((item) => {
      const qty = parseInt(item.qty) || 1;
      const discountPercent = parseInt(item.discount) || 0;
      
      const unitOriginalPrice = Math.round(item.price);
      const unitDiscountedPrice = Math.round(unitOriginalPrice - (unitOriginalPrice * discountPercent) / 100);
      const unitSavings = Math.round((unitOriginalPrice * discountPercent) / 100);

      for (let i = 0; i < qty; i++) {
        flatItems.push({
          id: item.id,
          name: item.name,
          price: unitOriginalPrice,
          discount: item.discount,
          image: item.image,
          category: item.category,
          rating: item.rating,
          reviews: item.reviews,
          description: item.description,
          weight: unitDiscountedPrice,  // The cost to buy (Weight)
          value: unitSavings            // The discount saved (Value)
        });
      }
    });

    const N = flatItems.length;
    const W = capacity;

    // 2. Build the 2D Dynamic Programming grid: dp[i][w]
    // dp[i][w] holds the maximum savings we can achieve with capacity 'w' using the first 'i' items.
    const dp = Array(N + 1).fill(null).map(() => Array(W + 1).fill(0));

    for (let i = 1; i <= N; i++) {
      const item = flatItems[i - 1];
      for (let w = 0; w <= W; w++) {
        if (item.weight <= w) {
          // Choose the maximum of either:
          // A: Excluding the current item (dp[i-1][w])
          // B: Including the current item (dp[i-1][w - weight] + value)
          dp[i][w] = Math.max(
            dp[i - 1][w],
            dp[i - 1][w - item.weight] + item.value
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // 3. Backtrack from dp[N][W] to reconstruct the optimal selections
    let w = W;
    const selectedFlat = [];
    for (let i = N; i > 0; i--) {
      const item = flatItems[i - 1];
      if (dp[i][w] !== dp[i - 1][w]) {
        selectedFlat.push(item);
        w -= item.weight; // Deduct the cost of the selected item
      }
    }

    // 4. Re-group the selected individual units back into grouped quantities
    const groupedSelected = [];
    selectedFlat.forEach((flatItem) => {
      const existing = groupedSelected.find((item) => item.id === flatItem.id);
      if (existing) {
        existing.qty += 1;
        existing.finalPrice += flatItem.weight;
      } else {
        groupedSelected.push({
          ...flatItem,
          qty: 1,
          finalPrice: flatItem.weight // Initial price of 1 unit
        });
      }
    });

    // 5. Calculate summary metrics
    const totalCostPaid = W - w;
    const totalSavingsAmount = dp[N][W];
    const originalSubtotal = totalCostPaid + totalSavingsAmount;

    // Send the mathematical optimal results back to the React client
    return res.status(200).json({
      optimizedItems: groupedSelected,
      totalCost: totalCostPaid,
      totalSavings: totalSavingsAmount,
      originalTotal: originalSubtotal
    });

  } catch (error) {
    console.error("Optimization error:", error);
    return res.status(500).json({ error: "Internal server error during cart optimization." });
  }
});

// Start the Express Server
app.listen(PORT, () => {
  console.log(`[Server] Cartify Express API running successfully on port ${PORT}`);
  console.log(`[Algorithm] 0/1 Knapsack Dynamic Programming optimization active.`);
});
