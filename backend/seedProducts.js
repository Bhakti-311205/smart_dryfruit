require("dotenv").config();
const connectDB = require("./config/db");
const Product = require("./models/Product");

connectDB();

const products = [
  {
    name: "Cashew Nuts",
    category: "Nuts",
    variety: "W320",
    quality: "Premium",
    pricePerKg: 950,
    stock: 100,
    image: "cashew.jpg",
    description: "Premium Kashmiri cashew nuts"
  },
  {
    name: "Almonds",
    category: "Nuts",
    variety: "Mamra",
    quality: "Premium",
    pricePerKg: 1200,
    stock: 80,
    image: "almond.jpg",
    description: "High quality Mamra almonds"
  },
  {
    name: "Pistachio",
    category: "Nuts",
    variety: "Iranian",
    quality: "Standard",
    pricePerKg: 1400,
    stock: 60,
    image: "pistachio.jpg",
    description: "Fresh Iranian pistachios"
  },
  {
    name: "Raisins",
    category: "Raisins",
    variety: "Afghan",
    quality: "Standard",
    pricePerKg: 480,
    stock: 150,
    image: "raisins.jpg",
    description: "Natural Afghan raisins"
  },
  {
    name: "Dates",
    category: "Dates",
    variety: "Medjool",
    quality: "Premium",
    pricePerKg: 900,
    stock: 120,
    image: "dates.jpg",
    description: "Premium Medjool dates"
  },
  {
    name: "Walnuts",
    category: "Nuts",
    variety: "Kashmiri",
    quality: "Premium",
    pricePerKg: 1100,
    stock: 70,
    image: "walnut.jpg",
    description: "Fresh Kashmiri walnuts"
  },
  {
    name: "Dried Figs (Anjeer)",
    category: "Dried Fruits",
    variety: "Turkish",
    quality: "Premium",
    pricePerKg: 850,
    stock: 90,
    image: "dryfig.jpg",
    description: "Soft, naturally sweet Turkish dried figs rich in fiber"
  },
  {
    name: "Dried Apricots",
    category: "Dried Fruits",
    variety: "Mediterranean",
    quality: "Standard",
    pricePerKg: 780,
    stock: 75,
    image: "dryApricots.jpg",
    description: "Tangy, juicy dried apricots perfect for snacking and desserts"
  },
  {
    name: "Mixed Dry Fruit Gift Box",
    category: "Assorted",
    variety: "Festive Mix",
    quality: "Premium",
    pricePerKg: 1500,
    stock: 40,
    image: "mixed dry fruit gift box.jpg",
    description: "Assorted almonds, cashews, pistachios and raisins in a gift box"
  },
  {
    name: "Roasted Salted Cashews",
    category: "Nuts",
    variety: "Roasted",
    quality: "Standard",
    pricePerKg: 1050,
    stock: 65,
    image: "roasted salted cashew.jpg",
    description: "Crispy roasted cashews lightly salted for a perfect snack"
  },
  {
    name: "Premium Dry Fruit Mix",
    category: "Assorted",
    variety: "Breakfast Blend",
    quality: "Premium",
    pricePerKg: 1300,
    stock: 55,
    image: "premium dry fruit mix.jpg",
    description: "Healthy mix of nuts and dried fruits ideal for breakfast bowls"
  },
  {
    name: "Black Raisins (Kali Kishmish)",
    category: "Raisins",
    variety: "Seedless",
    quality: "Standard",
    pricePerKg: 520,
    stock: 110,
    image: "black raisins.jpg",
    description: "Naturally sweet black raisins, great for desserts and garnishing"
  }
];

const seedProducts = async () => {
  try {
    await Product.deleteMany(); // remove old products
    await Product.insertMany(products);
    console.log("✅ Dry fruits inserted successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error inserting products:", error);
    process.exit(1);
  }
};

seedProducts();
