import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dns from "dns";
import User from "./models/user.model.js";
import Shop from "./models/shop.model.js";
import Item from "./models/item.model.js";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    // Set DNS servers to resolve MongoDB SRV records correctly
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    await mongoose.connect(MONGODB_URL);
    console.log("Connected successfully!");

    // Clear existing demo data (only demo users/shops/items to avoid clearing user's custom records)
    console.log("Cleaning up previous demo records...");
    await User.deleteMany({ email: { $in: ["demo_user@hungryhop.com", "demo_owner@hungryhop.com", "demo_delivery@hungryhop.com"] } });
    
    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Create Demo Users
    console.log("Creating demo users...");
    const demoUser = await User.create({
      fullName: "Demo Customer",
      email: "demo_user@hungryhop.com",
      password: hashedPassword,
      mobile: "9876543210",
      role: "user",
      location: {
        type: "Point",
        coordinates: [85.8245, 20.2961] // Bhubaneswar coordinates
      }
    });

    const demoOwner = await User.create({
      fullName: "Demo Shop Owner",
      email: "demo_owner@hungryhop.com",
      password: hashedPassword,
      mobile: "9876543211",
      role: "owner"
    });

    const demoDelivery = await User.create({
      fullName: "Demo Delivery Boy",
      email: "demo_delivery@hungryhop.com",
      password: hashedPassword,
      mobile: "9876543212",
      role: "deliveryBoy",
      isOnline: true,
      location: {
        type: "Point",
        coordinates: [85.8200, 20.3000] // Near Bhubaneswar
      }
    });

    console.log("Demo users created successfully!");

    // 2. Identify target cities
    // Find all cities in existing shops to seed more shops there, or default to some common ones
    const existingShops = await Shop.find({});
    const existingCities = [...new Set(existingShops.map(s => s.city.trim().toLowerCase()))];
    
    // We will seed shops in "Bhubaneswar" (default), plus any other cities already used in the DB
    const targetCities = ["bhubaneswar", "kolkata", "mumbai", "delhi"];
    existingCities.forEach(city => {
      if (!targetCities.includes(city)) {
        targetCities.push(city);
      }
    });

    console.log(`Seeding shops and items in the following cities: ${targetCities.join(", ")}`);

    // Clean up demo shops
    const demoShopNames = [
      "Pizza Paradise", 
      "The Burger Club", 
      "Spicy Tandoor", 
      "Sweet Delights", 
      "South Indian Express", 
      "Dragon Wok", 
      "The Sandwich Club"
    ];
    await Shop.deleteMany({ name: { $in: demoShopNames } });

    for (const cityName of targetCities) {
      const formattedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1);
      
      console.log(`Seeding for city: ${formattedCity}`);

      // 1. Create Pizza Paradise
      const pizzaShop = await Shop.create({
        name: "Pizza Paradise",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
        owner: demoOwner._id,
        city: formattedCity,
        state: "Odisha",
        address: `123 Pizza Street, Near Mall, ${formattedCity}`,
        items: []
      });

      const pizza1 = await Item.create({
        name: "Margherita Pizza",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500",
        shop: pizzaShop._id,
        category: "Pizza",
        price: 199,
        foodType: "veg",
        rating: { average: 4.5, count: 12 }
      });

      const pizza2 = await Item.create({
        name: "Double Cheese Pepperoni",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
        shop: pizzaShop._id,
        category: "Pizza",
        price: 299,
        foodType: "non veg",
        rating: { average: 4.8, count: 25 }
      });

      const pizza3 = await Item.create({
        name: "Veggie Supreme Pizza",
        image: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?w=500",
        shop: pizzaShop._id,
        category: "Pizza",
        price: 249,
        foodType: "veg",
        rating: { average: 4.6, count: 18 }
      });

      const pizza4 = await Item.create({
        name: "Garlic Breadsticks",
        image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=500",
        shop: pizzaShop._id,
        category: "Snacks",
        price: 110,
        foodType: "veg",
        rating: { average: 4.3, count: 15 }
      });

      pizzaShop.items.push(pizza1._id, pizza2._id, pizza3._id, pizza4._id);
      await pizzaShop.save();

      // 2. Create The Burger Club
      const burgerShop = await Shop.create({
        name: "The Burger Club",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        owner: demoOwner._id,
        city: formattedCity,
        state: "Odisha",
        address: `45 Burger Boulevard, Food Court, ${formattedCity}`,
        items: []
      });

      const burger1 = await Item.create({
        name: "Classic Veggie Burger",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
        shop: burgerShop._id,
        category: "Burgers",
        price: 99,
        foodType: "veg",
        rating: { average: 4.2, count: 18 }
      });

      const burger2 = await Item.create({
        name: "Crispy Chicken Burger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        shop: burgerShop._id,
        category: "Burgers",
        price: 149,
        foodType: "non veg",
        rating: { average: 4.6, count: 32 }
      });

      const burger3 = await Item.create({
        name: "Spicy Paneer Burger",
        image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500",
        shop: burgerShop._id,
        category: "Burgers",
        price: 129,
        foodType: "veg",
        rating: { average: 4.4, count: 14 }
      });

      const burger4 = await Item.create({
        name: "Crispy French Fries",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500",
        shop: burgerShop._id,
        category: "Snacks",
        price: 79,
        foodType: "veg",
        rating: { average: 4.5, count: 40 }
      });

      burgerShop.items.push(burger1._id, burger2._id, burger3._id, burger4._id);
      await burgerShop.save();

      // 3. Create Spicy Tandoor
      const tandoorShop = await Shop.create({
        name: "Spicy Tandoor",
        image: "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=600",
        owner: demoOwner._id,
        city: formattedCity,
        state: "Odisha",
        address: `88 Curry Lane, Main Road, ${formattedCity}`,
        items: []
      });

      const curry1 = await Item.create({
        name: "Butter Chicken",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500",
        shop: tandoorShop._id,
        category: "North Indian",
        price: 249,
        foodType: "non veg",
        rating: { average: 4.9, count: 45 }
      });

      const curry2 = await Item.create({
        name: "Paneer Butter Masala",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500",
        shop: tandoorShop._id,
        category: "North Indian",
        price: 199,
        foodType: "veg",
        rating: { average: 4.4, count: 20 }
      });

      tandoorShop.items.push(curry1._id, curry2._id);
      await tandoorShop.save();

      // 4. Create Sweet Delights
      const dessertShop = await Shop.create({
        name: "Sweet Delights",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600",
        owner: demoOwner._id,
        city: formattedCity,
        state: "Odisha",
        address: `12 Baker Street, Market Square, ${formattedCity}`,
        items: []
      });

      const dessert1 = await Item.create({
        name: "Chocolate Lava Cake",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500",
        shop: dessertShop._id,
        category: "Desserts",
        price: 120,
        foodType: "veg",
        rating: { average: 4.7, count: 15 }
      });

      const dessert2 = await Item.create({
        name: "Gulab Jamun (2 Pcs)",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500",
        shop: dessertShop._id,
        category: "Desserts",
        price: 60,
        foodType: "veg",
        rating: { average: 4.8, count: 50 }
      });

      const dessert3 = await Item.create({
        name: "New York Cheesecake",
        image: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?w=500",
        shop: dessertShop._id,
        category: "Desserts",
        price: 179,
        foodType: "veg",
        rating: { average: 4.6, count: 22 }
      });

      const dessert4 = await Item.create({
        name: "Mango Pudding",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500",
        shop: dessertShop._id,
        category: "Desserts",
        price: 89,
        foodType: "veg",
        rating: { average: 4.5, count: 16 }
      });

      dessertShop.items.push(dessert1._id, dessert2._id, dessert3._id, dessert4._id);
      await dessertShop.save();

      // 5. Create South Indian Express (NEW SHOP)
      const southShop = await Shop.create({
        name: "South Indian Express",
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600",
        owner: demoOwner._id,
        city: formattedCity,
        state: "Odisha",
        address: `10 Idli Chowk, Station Road, ${formattedCity}`,
        items: []
      });

      const south1 = await Item.create({
        name: "Masala Dosa",
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500",
        shop: southShop._id,
        category: "South Indian",
        price: 119,
        foodType: "veg",
        rating: { average: 4.7, count: 60 }
      });

      const south2 = await Item.create({
        name: "Idli Sambar (2 Pcs)",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500",
        shop: southShop._id,
        category: "South Indian",
        price: 69,
        foodType: "veg",
        rating: { average: 4.5, count: 48 }
      });

      const south3 = await Item.create({
        name: "Vada Pav (2 Pcs)",
        image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500",
        shop: southShop._id,
        category: "Snacks",
        price: 49,
        foodType: "veg",
        rating: { average: 4.8, count: 75 }
      });

      southShop.items.push(south1._id, south2._id, south3._id);
      await southShop.save();

      // 6. Create Dragon Wok (NEW SHOP)
      const chineseShop = await Shop.create({
        name: "Dragon Wok",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600",
        owner: demoOwner._id,
        city: formattedCity,
        state: "Odisha",
        address: `66 Noodle Street, Sector 5, ${formattedCity}`,
        items: []
      });

      const chinese1 = await Item.create({
        name: "Veg Hakka Noodles",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500",
        shop: chineseShop._id,
        category: "Chinese",
        price: 149,
        foodType: "veg",
        rating: { average: 4.4, count: 28 }
      });

      const chinese2 = await Item.create({
        name: "Chilli Chicken",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500",
        shop: chineseShop._id,
        category: "Chinese",
        price: 219,
        foodType: "non veg",
        rating: { average: 4.7, count: 35 }
      });

      const chinese3 = await Item.create({
        name: "Veg Fried Rice",
        image: "https://images.unsplash.com/photo-1603133872878-685f58882791?w=500",
        shop: chineseShop._id,
        category: "Chinese",
        price: 129,
        foodType: "veg",
        rating: { average: 4.3, count: 22 }
      });

      const chinese4 = await Item.create({
        name: "Steamed Veg Momos (6 Pcs)",
        image: "https://images.unsplash.com/photo-1625220194771-7ebded0d90ae?w=500",
        shop: chineseShop._id,
        category: "Chinese",
        price: 99,
        foodType: "veg",
        rating: { average: 4.6, count: 42 }
      });

      chineseShop.items.push(chinese1._id, chinese2._id, chinese3._id, chinese4._id);
      await chineseShop.save();

      // 7. Create The Sandwich Club (NEW SHOP)
      const sandwichShop = await Shop.create({
        name: "The Sandwich Club",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600",
        owner: demoOwner._id,
        city: formattedCity,
        state: "Odisha",
        address: `15 Grill Avenue, Commercial Area, ${formattedCity}`,
        items: []
      });

      const sandwich1 = await Item.create({
        name: "Club Sandwich",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500",
        shop: sandwichShop._id,
        category: "Sandwiches",
        price: 139,
        foodType: "non veg",
        rating: { average: 4.5, count: 17 }
      });

      const sandwich2 = await Item.create({
        name: "Paneer Grilled Sandwich",
        image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=500",
        shop: sandwichShop._id,
        category: "Sandwiches",
        price: 119,
        foodType: "veg",
        rating: { average: 4.4, count: 25 }
      });

      sandwichShop.items.push(sandwich1._id, sandwich2._id);
      await sandwichShop.save();
    }

    console.log("Database seeded successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Seeding error:", error);
    mongoose.disconnect();
  }
};

seedData();
