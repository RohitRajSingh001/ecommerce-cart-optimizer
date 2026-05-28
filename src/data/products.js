import watch from "../images/watch.jpg";
import shoes from "../images/shoes.jpg";
import headphones from "../images/headphones.jpg";
import bag from "../images/bag.jpg";
import deskMat from "../images/desk_mat.png";

const products = [
  {
    id: 1,
    name: "Aero Chrono Smartwatch",
    price: 2500,
    discount: "20% OFF",
    image: watch,
    category: "Electronics",
    rating: 4.8,
    reviews: 245,
    description: "Premium fitness tracking with customized widgets, SPO2 sensor, and 7-day battery life."
  },
  {
    id: 2,
    name: "SwiftStride Running Shoes",
    price: 4500,
    discount: "15% OFF",
    image: shoes,
    category: "Footwear",
    rating: 4.7,
    reviews: 189,
    description: "Ultra-breathable running shoes featuring specialized shock absorption and lightweight foam."
  },
  {
    id: 3,
    name: "SonicWave Wireless ANC Headphones",
    price: 3000,
    discount: "25% OFF",
    image: headphones,
    category: "Electronics",
    rating: 4.9,
    reviews: 512,
    description: "Hybrid active noise cancellation, high-fidelity drivers, and soft memory foam earcups."
  },
  {
    id: 4,
    name: "Vanguard Leather Backpack",
    price: 2000,
    discount: "10% OFF",
    image: bag,
    category: "Accessories",
    rating: 4.6,
    reviews: 98,
    description: "Waterproof canvas and genuine leather trims, optimized with a 15.6-inch padded laptop sleeve."
  },
  {
    id: 5,
    name: "ApexRGB Mechanical Keyboard",
    price: 3500,
    discount: "20% OFF",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60",
    category: "Electronics",
    rating: 4.8,
    reviews: 167,
    description: "Hot-swappable tactile switches, double-shot PBT keycaps, and customizable dynamic RGB backlighting."
  },
  {
    id: 6,
    name: "HydroFlow Insulated Flask",
    price: 1200,
    discount: "10% OFF",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
    category: "Accessories",
    rating: 4.5,
    reviews: 320,
    description: "Double-walled vacuum insulated stainless steel water bottle, keeps cold for 24 hours."
  },
  {
    id: 7,
    name: "UrbanPrism Retro Sunglasses",
    price: 1500,
    discount: "30% OFF",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60",
    category: "Footwear", // Placing under Accessories or Footwear, let's use Accessories
    rating: 4.4,
    reviews: 84,
    description: "Polarized UV400 protection lenses fitted into a handcrafted lightweight acetate frame."
  },
  {
    id: 8,
    name: "ErgoComfort Orthopedic Desk Mat",
    price: 1000,
    discount: "15% OFF",
    image: deskMat,
    category: "Accessories",
    rating: 4.7,
    reviews: 142,
    description: "Sleek non-slip water-resistant felt desk pads, optimal for optical mice precision tracking."
  }
];

// Quick category adjustment for sunglasses
products[6].category = "Accessories";

export default products;