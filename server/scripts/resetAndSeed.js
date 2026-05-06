// scripts/resetAndSeed.js
// Run with: node scripts/resetAndSeed.js
// Or add to package.json: "seed": "node scripts/resetAndSeed.js"

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// ── adjust this import path to match your project ──
import Product from "../models/Product.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mayur";

// ─────────────────────────────────────────────
//  PAINT PRODUCTS  (60 items)
// ─────────────────────────────────────────────
const paintProducts = [
  // ── ASIAN PAINTS ──
  {
    name: "Asian Paints Royale Matt",
    brand: "Asian Paints",
    category: "Interior",
    finish: "matte",
    size: "10L",
    price: 3150,
    stock: 45,
    color: "Brilliant White",
    hexCode: "#F8F8F5",
    description:
      "Royale Matt is Asian Paints' flagship luxury interior emulsion. It offers a smooth, velvety matt finish that hides surface imperfections beautifully. Superior washability and stain resistance make it ideal for living rooms and bedrooms.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints Royale Matt",
    brand: "Asian Paints",
    category: "Interior",
    finish: "matte",
    size: "4L",
    price: 1450,
    stock: 60,
    color: "Ivory Cream",
    hexCode: "#FFFFF0",
    description:
      "Royale Matt in a compact 4L pack. Perfect for accent walls or smaller rooms. Rich pigmentation gives vibrant, long-lasting colour with a luxury matt finish.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints Royale Shyne",
    brand: "Asian Paints",
    category: "Interior",
    finish: "silk",
    size: "10L",
    price: 3650,
    stock: 40,
    color: "Pearl White",
    hexCode: "#F5F0E8",
    description:
      "Royale Shyne delivers a luxurious silk finish that adds a subtle sheen to interiors. Anti-bacterial and anti-fungal properties ensure a healthier living environment. Excellent scrub resistance.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints Royale Shyne",
    brand: "Asian Paints",
    category: "Interior",
    finish: "silk",
    size: "1L",
    price: 480,
    stock: 80,
    color: "Butter Milk",
    hexCode: "#FFF8DC",
    description:
      "Trial pack of the celebrated Royale Shyne. Silk finish with anti-bacterial formula. Ideal for testing colour on your wall before committing to larger quantities.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints Apex Exterior Emulsion",
    brand: "Asian Paints",
    category: "Exterior",
    finish: "satin",
    size: "10L",
    price: 2950,
    stock: 35,
    color: "Sandstone",
    hexCode: "#C2B280",
    description:
      "Apex is India's No.1 exterior emulsion. Provides superior weather resistance, UV protection, and anti-algae protection. Keeps your exterior walls looking fresh for years even in harsh Indian weather.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints Apex Exterior Emulsion",
    brand: "Asian Paints",
    category: "Exterior",
    finish: "satin",
    size: "20L",
    price: 5500,
    stock: 25,
    color: "Colonial Cream",
    hexCode: "#FFFDD0",
    description:
      "Economy 20L pack of Apex Exterior. Best value for large bungalows or commercial buildings. All-weather protection with 7-year performance guarantee.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints Tractor Emulsion",
    brand: "Asian Paints",
    category: "Interior",
    finish: "matte",
    size: "20L",
    price: 2800,
    stock: 55,
    color: "Snow White",
    hexCode: "#FFFAFA",
    description:
      "Tractor Emulsion is the most trusted economy interior paint in India. Smooth application, good coverage, and durable finish at an affordable price. Ideal for residential and rental properties.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints Apcolite Premium Gloss Enamel",
    brand: "Asian Paints",
    category: "Enamel",
    finish: "gloss",
    size: "4L",
    price: 1750,
    stock: 42,
    color: "Brilliant White",
    hexCode: "#FFFFFF",
    description:
      "Apcolite Premium Gloss Enamel offers a hard, durable high-gloss finish for wood and metal surfaces. Excellent adhesion, smooth levelling, and long-lasting protection against rust and corrosion.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints Wood Finish Melamine",
    brand: "Asian Paints",
    category: "Wood Finish",
    finish: "gloss",
    size: "1L",
    price: 890,
    stock: 30,
    color: "Clear",
    hexCode: "#F5DEB3",
    description:
      "Premium melamine wood finish that enhances the natural grain of wood. Provides a hard, scratch-resistant surface ideal for furniture, cabinets, and wooden floors.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints SmartCare Damp Proof",
    brand: "Asian Paints",
    category: "Waterproofing",
    finish: "matte",
    size: "4L",
    price: 2200,
    stock: 28,
    color: "White",
    hexCode: "#FFFFFF",
    description:
      "SmartCare Damp Proof is an interior waterproofing solution that prevents dampness, seepage, and moisture penetration through walls. Creates a strong waterproof barrier.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints Royale Luxury Putty",
    brand: "Asian Paints",
    category: "Primer & Putty",
    finish: "matte",
    size: "20kg",
    price: 1100,
    stock: 50,
    color: "White",
    hexCode: "#F5F5F5",
    description:
      "Royale Luxury Wall Putty provides a smooth base for premium paints. Excellent bonding strength, easy sanding, and a perfectly even surface for topcoats.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },

  // ── BERGER PAINTS ──
  {
    name: "Berger Silk Luxury Emulsion",
    brand: "Berger",
    category: "Interior",
    finish: "silk",
    size: "10L",
    price: 3350,
    stock: 38,
    color: "Brilliant White",
    hexCode: "#F9F9F9",
    description:
      "Berger Silk is a premium interior emulsion with an ultra-smooth silk finish. Stain Guard technology repels everyday stains. Anti-bacterial formula for a hygienic home. Excellent coverage and durability.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Berger Silk Luxury Emulsion",
    brand: "Berger",
    category: "Interior",
    finish: "silk",
    size: "4L",
    price: 1550,
    stock: 52,
    color: "Vanilla Custard",
    hexCode: "#F3E5AB",
    description:
      "Berger Silk 4L in warm Vanilla Custard. Stain Guard technology, silk sheen finish, and anti-bacterial properties. Ideal for dining rooms and children's rooms.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Berger WeatherCoat All Guard",
    brand: "Berger",
    category: "Exterior",
    finish: "satin",
    size: "10L",
    price: 3100,
    stock: 33,
    color: "Warm Beige",
    hexCode: "#D4B896",
    description:
      "WeatherCoat All Guard is Berger's most advanced exterior paint. 3-layer protection system guards against rain, UV rays, and algae. Elastomeric technology bridges micro-cracks to keep walls dry.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Berger WeatherCoat All Guard",
    brand: "Berger",
    category: "Exterior",
    finish: "satin",
    size: "20L",
    price: 5800,
    stock: 22,
    color: "Terracotta",
    hexCode: "#E2725B",
    description:
      "Economy 20L pack of WeatherCoat All Guard. Protects large exterior surfaces from all Indian weather conditions. 8+ year performance warranty.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Berger Bison Acrylic Distemper",
    brand: "Berger",
    category: "Interior",
    finish: "matte",
    size: "10kg",
    price: 950,
    stock: 65,
    color: "White",
    hexCode: "#FFFFFF",
    description:
      "Berger Bison Acrylic Distemper is a cost-effective interior finish with a smooth, chalky texture. Good coverage and breathability make it ideal for plastered walls in budget projects.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Berger Rangoli Total Care",
    brand: "Berger",
    category: "Interior",
    finish: "matte",
    size: "10L",
    price: 1850,
    stock: 48,
    color: "Cream",
    hexCode: "#FFFDD0",
    description:
      "Berger Rangoli Total Care is a premium economy emulsion with anti-bacterial and anti-fungal properties. Great value for money with good washability and 6-year durability.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Berger Rangoli Total Care",
    brand: "Berger",
    category: "Interior",
    finish: "matte",
    size: "4L",
    price: 850,
    stock: 70,
    color: "Lemon Yellow",
    hexCode: "#FFF44F",
    description:
      "Berger Rangoli 4L pack. Vibrant colour, good coverage, anti-fungal finish. Perfect for kitchens and utility areas where budget is a priority.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Berger Luxol Hi-Gloss Enamel",
    brand: "Berger",
    category: "Enamel",
    finish: "gloss",
    size: "4L",
    price: 1680,
    stock: 36,
    color: "Signal Red",
    hexCode: "#C40233",
    description:
      "Berger Luxol Hi-Gloss Enamel is India's top-selling enamel paint. Mirror-like finish, superior durability, and rust protection for all metal and wood surfaces.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Berger Breathe Easy Interior Emulsion",
    brand: "Berger",
    category: "Interior",
    finish: "matte",
    size: "10L",
    price: 3800,
    stock: 25,
    color: "Soft Sage",
    hexCode: "#B2AC88",
    description:
      "Berger Breathe Easy is India's first VOC-free interior emulsion. Zero harmful emissions, safe for children and asthma patients. Luxury matt finish with superior washability.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Berger Walmasta Interior Primer",
    brand: "Berger",
    category: "Primer & Putty",
    finish: "matte",
    size: "4L",
    price: 620,
    stock: 60,
    color: "White",
    hexCode: "#F5F5F5",
    description:
      "Berger Walmasta is a premium interior primer that seals porous surfaces and improves adhesion of topcoats. Reduces paint consumption and gives a uniform base.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },

  // ── SHALIMAR PAINTS ──
  {
    name: "Shalimar Superlac Hi-Gloss Enamel",
    brand: "Shalimar",
    category: "Enamel",
    finish: "gloss",
    size: "4L",
    price: 1580,
    stock: 40,
    color: "Brilliant White",
    hexCode: "#FFFFFF",
    description:
      "Shalimar Superlac is the original Indian enamel brand. Hard, durable gloss finish with excellent flow and levelling. Superior rust and corrosion protection for metal grills, gates, and furniture.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Shalimar Superlac Hi-Gloss Enamel",
    brand: "Shalimar",
    category: "Enamel",
    finish: "gloss",
    size: "1L",
    price: 480,
    stock: 75,
    color: "British Racing Green",
    hexCode: "#004225",
    description:
      "Shalimar Superlac 1L for small touch-up and DIY jobs. Classic gloss enamel with rock-hard finish. Ideal for doors, window frames, and metal railings.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Shalimar Premium Acrylic Distemper",
    brand: "Shalimar",
    category: "Interior",
    finish: "matte",
    size: "10kg",
    price: 880,
    stock: 58,
    color: "Ivory",
    hexCode: "#FFFFF0",
    description:
      "Shalimar Premium Distemper gives a smooth, chalky finish at an economical price. Good breathability and adhesion on cement and plaster surfaces.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Shalimar Granocryl Smooth Exterior Emulsion",
    brand: "Shalimar",
    category: "Exterior",
    finish: "satin",
    size: "10L",
    price: 2780,
    stock: 30,
    color: "Off White",
    hexCode: "#FAF9F6",
    description:
      "Granocryl Smooth provides excellent weather resistance and UV protection for exterior walls. Anti-algal and anti-fungal formula keeps walls clean and fresh in humid climates.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Shalimar Synthetic Enamel",
    brand: "Shalimar",
    category: "Enamel",
    finish: "gloss",
    size: "4L",
    price: 1380,
    stock: 45,
    color: "Canary Yellow",
    hexCode: "#FFEF00",
    description:
      "Shalimar Synthetic Enamel is a durable oil-based enamel for wood and metal. Excellent coverage, hard finish, and resistance to weather and abrasion.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Shalimar Acrylic Wall Primer",
    brand: "Shalimar",
    category: "Primer & Putty",
    finish: "matte",
    size: "10L",
    price: 980,
    stock: 50,
    color: "White",
    hexCode: "#F5F5F5",
    description:
      "Shalimar Acrylic Wall Primer seals porous surfaces and ensures superior adhesion of topcoats. Water-based, low odour, and fast drying. Reduces overall paint consumption.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Shalimar Sigmacover Primer",
    brand: "Shalimar",
    category: "Primer & Putty",
    finish: "matte",
    size: "4L",
    price: 1450,
    stock: 28,
    color: "Grey",
    hexCode: "#808080",
    description:
      "Sigmacover is a high-build anti-corrosive primer for metal surfaces. Excellent adhesion to steel and iron. Provides a strong base for topcoat enamel or epoxy systems.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },

  // ── NEROLAC ──
  {
    name: "Nerolac Excel Total",
    brand: "Nerolac",
    category: "Exterior",
    finish: "satin",
    size: "10L",
    price: 2990,
    stock: 35,
    color: "Misty White",
    hexCode: "#F2F0EB",
    description:
      "Nerolac Excel Total is an advanced exterior emulsion with 10-year performance warranty. 5-in-1 protection: weatherproofing, anti-algae, UV resistance, crack bridging, and colour lock technology.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Nerolac Beauty Gold Interior Emulsion",
    brand: "Nerolac",
    category: "Interior",
    finish: "silk",
    size: "10L",
    price: 3250,
    stock: 42,
    color: "Rose Dust",
    hexCode: "#C4A3A3",
    description:
      "Nerolac Beauty Gold is a premium interior emulsion with a rich silk finish. Lead-free, anti-bacterial, and scrubbable. Smooth application and excellent colour retention.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Nerolac Impressions HD Interior",
    brand: "Nerolac",
    category: "Interior",
    finish: "matte",
    size: "10L",
    price: 4100,
    stock: 20,
    color: "Arctic Blue",
    hexCode: "#B0D0E0",
    description:
      "Nerolac Impressions HD is the ultimate luxury interior emulsion. 4K smooth finish, superior stain resistance, and anti-bacterial technology. Perfect for high-end residences and luxury hotels.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Nerolac Suraksha Exterior Primer",
    brand: "Nerolac",
    category: "Primer & Putty",
    finish: "matte",
    size: "10L",
    price: 850,
    stock: 55,
    color: "White",
    hexCode: "#F5F5F5",
    description:
      "Nerolac Suraksha Exterior Primer is a water-based primer for exterior masonry. Excellent alkali resistance and deep penetration for a strong bond with topcoats.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Nerolac Excel Enamel",
    brand: "Nerolac",
    category: "Enamel",
    finish: "gloss",
    size: "4L",
    price: 1620,
    stock: 38,
    color: "Sky Blue",
    hexCode: "#87CEEB",
    description:
      "Nerolac Excel Enamel is a high-quality synthetic enamel for metal and wood. Superior gloss, hard finish, and excellent rust inhibition. Smooth flow and levelling for a professional finish.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Nerolac Waterproofing Solution",
    brand: "Nerolac",
    category: "Waterproofing",
    finish: "matte",
    size: "4L",
    price: 2450,
    stock: 24,
    color: "White",
    hexCode: "#FFFFFF",
    description:
      "Nerolac Waterproofing Solution is a flexible acrylic waterproofing coating for terraces, bathrooms, and wet areas. Bridges cracks and prevents water seepage effectively.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  // Additional paint entries for diversity
  {
    name: "Asian Paints Apex Ultima",
    brand: "Asian Paints",
    category: "Exterior",
    finish: "satin",
    size: "10L",
    price: 4200,
    stock: 18,
    color: "Antique White",
    hexCode: "#FAEBD7",
    description:
      "Apex Ultima is Asian Paints' premium exterior paint with ProSurface Technology. 3D colour depth, dirt-pick-up resistance, and 10+ year protection guarantee.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Berger Easy Clean Interior Emulsion",
    brand: "Berger",
    category: "Interior",
    finish: "silk",
    size: "10L",
    price: 2750,
    stock: 32,
    color: "Mint Green",
    hexCode: "#98FF98",
    description:
      "Berger Easy Clean is an ultra-washable interior emulsion. Stains wipe off effortlessly. 10,000 scrub cycle tested. Ideal for kitchens, kids' rooms, and high-traffic areas.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Nerolac Beauty Smooth Finish",
    brand: "Nerolac",
    category: "Interior",
    finish: "matte",
    size: "20L",
    price: 2600,
    stock: 40,
    color: "Pastel Peach",
    hexCode: "#FFCBA4",
    description:
      "Nerolac Beauty Smooth is a value-for-money interior emulsion. Good coverage, smooth matt finish, and mild sheen. Excellent adhesion and alkali resistance.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Shalimar Durocem Cement Primer",
    brand: "Shalimar",
    category: "Primer & Putty",
    finish: "matte",
    size: "10L",
    price: 720,
    stock: 48,
    color: "Off White",
    hexCode: "#FAF9F6",
    description:
      "Shalimar Durocem is a water-based cement primer for new masonry surfaces. Controls alkali and ensures superior adhesion of water-based topcoats.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints Wood Primer",
    brand: "Asian Paints",
    category: "Primer & Putty",
    finish: "matte",
    size: "1L",
    price: 320,
    stock: 65,
    color: "Pink",
    hexCode: "#FFB6C1",
    description:
      "Asian Paints Wood Primer fills the grain of wood, seals knots, and provides excellent adhesion for enamel topcoats. Reduces overall paint absorption for a smoother finish.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Berger Illusions Mica Marble",
    brand: "Berger",
    category: "Texture",
    finish: "gloss",
    size: "1L",
    price: 1800,
    stock: 15,
    color: "Gold Pearl",
    hexCode: "#FFD700",
    description:
      "Berger Illusions Mica Marble creates a stunning faux marble effect on interior walls. Metallic pearl pigments give a luxurious, three-dimensional look. Perfect for feature walls.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Nerolac Texture Coat",
    brand: "Nerolac",
    category: "Texture",
    finish: "matte",
    size: "10kg",
    price: 2200,
    stock: 20,
    color: "Sandstone",
    hexCode: "#C2B280",
    description:
      "Nerolac Texture Coat is an exterior texture finish that adds depth and character to facades. Weather-resistant, anti-algal, and available in multiple texture patterns.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
  {
    name: "Asian Paints Stucco",
    brand: "Asian Paints",
    category: "Texture",
    finish: "matte",
    size: "5kg",
    price: 1650,
    stock: 22,
    color: "Travertine",
    hexCode: "#D4C5A9",
    description:
      "Asian Paints Stucco creates authentic Italian stucco textures on interior walls. Gives a sophisticated, textured look similar to polished plaster. Suitable for feature walls and reception areas.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=600&fit=crop&q=85",
    type: "paint",
  },
];

// ─────────────────────────────────────────────
//  HARDWARE PRODUCTS  (50 items)
// ─────────────────────────────────────────────
const hardwareProducts = [
  // ── BOSCH ──
  {
    name: "Bosch GSB 550 Impact Drill",
    brand: "Bosch",
    category: "Power Tools",
    finish: "",
    size: "550W",
    price: 3499,
    stock: 20,
    color: "Blue",
    hexCode: "#0057A8",
    description:
      "Bosch GSB 550 is a powerful 550W impact drill for masonry, wood, and metal drilling. Variable speed trigger, forward/reverse function, and ergonomic grip. Includes drill bits and carry case.",
    image:
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Bosch GSB 750 Impact Drill",
    brand: "Bosch",
    category: "Power Tools",
    finish: "",
    size: "750W",
    price: 5299,
    stock: 15,
    color: "Blue",
    hexCode: "#0057A8",
    description:
      "Bosch GSB 750 professional-grade impact drill. 750W motor with electronic speed control. 13mm keyless chuck, 2-speed gearbox, and all-metal housing for durability.",
    image:
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Bosch GWS 600 Angle Grinder",
    brand: "Bosch",
    category: "Power Tools",
    finish: "",
    size: "600W / 100mm",
    price: 2899,
    stock: 25,
    color: "Blue",
    hexCode: "#0057A8",
    description:
      "Bosch GWS 600 compact angle grinder. 600W motor, 100mm disc diameter, spindle lock for quick disc changes. Lightweight at 1.4kg. Ideal for cutting, grinding, and surface finishing.",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Bosch GDC 120 Cut-Off Machine",
    brand: "Bosch",
    category: "Power Tools",
    finish: "",
    size: "1200W / 355mm",
    price: 9499,
    stock: 10,
    color: "Blue",
    hexCode: "#0057A8",
    description:
      "Bosch GDC 120 professional cut-off machine. 1200W motor, 355mm blade. Cuts steel pipes, rods, and profiles quickly and accurately. Sturdy cast-iron base for stability.",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Bosch PST 700 E Jigsaw",
    brand: "Bosch",
    category: "Power Tools",
    finish: "",
    size: "500W",
    price: 4299,
    stock: 12,
    color: "Blue",
    hexCode: "#0057A8",
    description:
      "Bosch PST 700E jigsaw for cutting curves and shapes in wood, metal, and plastic. 500W, variable speed, orbital action for faster cutting. Quick blade change system.",
    image:
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },

  // ── STANLEY ──
  {
    name: "Stanley STHT0-77932 Measuring Tape",
    brand: "Stanley",
    category: "Measuring Tools",
    finish: "",
    size: "5m",
    price: 549,
    stock: 80,
    color: "Yellow/Black",
    hexCode: "#FFD700",
    description:
      "Stanley FatMax measuring tape with magnetic hook. 5m length, 25mm blade width. SurveyGrip rubber overmould for secure grip. Double-sided printing for horizontal and vertical reading.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Stanley STHT0-77932 Measuring Tape",
    brand: "Stanley",
    category: "Measuring Tools",
    finish: "",
    size: "8m",
    price: 749,
    stock: 65,
    color: "Yellow/Black",
    hexCode: "#FFD700",
    description:
      "Stanley FatMax 8m tape measure. Blade stays rigid for 3.5m without bending. Ideal for large rooms and outdoor measurements. Durable ABS casing with belt clip.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Stanley Claw Hammer",
    brand: "Stanley",
    category: "Hand Tools",
    finish: "",
    size: "20oz",
    price: 699,
    stock: 55,
    color: "Silver/Red",
    hexCode: "#C0C0C0",
    description:
      "Stanley Claw Hammer with fibreglass handle. 20oz head weight, polished face for accurate strikes, and curved claw for nail extraction. Anti-vibration grip for reduced fatigue.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Stanley Hand Saw",
    brand: "Stanley",
    category: "Hand Tools",
    finish: "",
    size: "22 inch",
    price: 849,
    stock: 40,
    color: "Orange/Grey",
    hexCode: "#FF6B35",
    description:
      "Stanley FatMax hand saw with hardpoint teeth. 22-inch blade with 10 TPI for fast, clean cuts in wood. Induction-hardened teeth stay sharp 5x longer than ordinary saws.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Stanley Screwdriver Set",
    brand: "Stanley",
    category: "Hand Tools",
    finish: "",
    size: "6-piece",
    price: 599,
    stock: 70,
    color: "Yellow/Black",
    hexCode: "#FFD700",
    description:
      "Stanley 6-piece screwdriver set. Includes 3 flathead and 3 Phillips screwdrivers. Chrome-vanadium steel tips, bi-material handles for comfort and grip. Durable and corrosion resistant.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Stanley Combination Plier",
    brand: "Stanley",
    category: "Hand Tools",
    finish: "",
    size: "8 inch",
    price: 449,
    stock: 60,
    color: "Silver",
    hexCode: "#C0C0C0",
    description:
      "Stanley 8-inch combination plier. Drop-forged alloy steel, induction-hardened cutting edges. PVC grip handles for comfort. Ideal for gripping, cutting wire, and bending.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Stanley Spirit Level",
    brand: "Stanley",
    category: "Measuring Tools",
    finish: "",
    size: "24 inch",
    price: 899,
    stock: 35,
    color: "Yellow",
    hexCode: "#FFD700",
    description:
      "Stanley 24-inch box beam level. 3 acrylic vials for horizontal, vertical, and 45° measurement. Aluminium box frame, accuracy of 0.5mm/m. Non-slip end caps.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },

  // ── TAPARIA ──
  {
    name: "Taparia Combination Spanner Set",
    brand: "Taparia",
    category: "Hand Tools",
    finish: "",
    size: "8-32mm / 10 piece",
    price: 1299,
    stock: 45,
    color: "Chrome",
    hexCode: "#C0C0C0",
    description:
      "Taparia 10-piece combination spanner set. Chrome vanadium steel, mirror-polished finish. Sizes 8 to 32mm. Ideal for automotive and industrial maintenance.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Taparia Allen Key Set",
    brand: "Taparia",
    category: "Hand Tools",
    finish: "",
    size: "1.5-10mm / 9 piece",
    price: 349,
    stock: 90,
    color: "Black",
    hexCode: "#222222",
    description:
      "Taparia 9-piece hex allen key set. High-quality chrome vanadium steel, black oxide finish. Sizes 1.5mm to 10mm. Ideal for furniture assembly and machine maintenance.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Taparia Ball Peen Hammer",
    brand: "Taparia",
    category: "Hand Tools",
    finish: "",
    size: "500g",
    price: 499,
    stock: 50,
    color: "Silver",
    hexCode: "#C0C0C0",
    description:
      "Taparia ball peen hammer with fibreglass handle. 500g head, heat-treated for hardness. Ideal for metal shaping, riveting, and general workshop use.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Taparia Adjustable Wrench",
    brand: "Taparia",
    category: "Hand Tools",
    finish: "",
    size: "12 inch",
    price: 649,
    stock: 42,
    color: "Chrome",
    hexCode: "#C0C0C0",
    description:
      "Taparia 12-inch adjustable wrench. Drop-forged chrome vanadium steel, smooth jaw adjustment. Jaw opens to 35mm. Ideal for plumbing and maintenance work.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Taparia Hacksaw Frame",
    brand: "Taparia",
    category: "Hand Tools",
    finish: "",
    size: "12 inch",
    price: 399,
    stock: 55,
    color: "Silver/Blue",
    hexCode: "#4682B4",
    description:
      "Taparia junior hacksaw frame with tensioning screw. Accepts standard 12-inch blades. Tubular steel frame with plastic handle. Includes one bi-metal blade.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },

  // ── DEWALT ──
  {
    name: "DeWalt DCD778 Cordless Drill",
    brand: "DeWalt",
    category: "Power Tools",
    finish: "",
    size: "18V / 2Ah",
    price: 12999,
    stock: 10,
    color: "Yellow/Black",
    hexCode: "#FFD700",
    description:
      "DeWalt DCD778 18V XR brushless cordless drill. Compact and lightweight at 1.5kg. 65Nm torque, 2-speed gearbox, and 13 clutch settings. Includes 2Ah battery and fast charger.",
    image:
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "DeWalt DCG405 Angle Grinder",
    brand: "DeWalt",
    category: "Power Tools",
    finish: "",
    size: "18V / 125mm",
    price: 14499,
    stock: 8,
    color: "Yellow/Black",
    hexCode: "#FFD700",
    description:
      "DeWalt DCG405 18V XR brushless cordless angle grinder. 125mm disc, no-load speed 9000 RPM. Kick-back brake for safety. Compatible with all 18V DeWalt batteries.",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "DeWalt DCS391 Circular Saw",
    brand: "DeWalt",
    category: "Power Tools",
    finish: "",
    size: "18V / 165mm",
    price: 18999,
    stock: 6,
    color: "Yellow/Black",
    hexCode: "#FFD700",
    description:
      "DeWalt DCS391 18V circular saw. 165mm blade, 3700 RPM, 55mm cutting depth at 90°. Lightweight 3.4kg body. Includes rip fence for straight cuts.",
    image:
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },

  // ── PIDILITE / FEVICOL ──
  {
    name: "Fevicol SH Synthetic Resin Adhesive",
    brand: "Pidilite",
    category: "Adhesives",
    finish: "",
    size: "1kg",
    price: 199,
    stock: 120,
    color: "White",
    hexCode: "#FFFFFF",
    description:
      "Fevicol SH is India's most trusted furniture adhesive. Bonds wood, plywood, laminates, and veneers permanently. Water resistant, heat resistant, and easy to apply.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Fevicol SH Synthetic Resin Adhesive",
    brand: "Pidilite",
    category: "Adhesives",
    finish: "",
    size: "5kg",
    price: 870,
    stock: 80,
    color: "White",
    hexCode: "#FFFFFF",
    description:
      "Fevicol SH 5kg economy pack for carpenters and contractors. High solid content for excellent bond strength. Ideal for large furniture manufacturing projects.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Fevicol SH Synthetic Resin Adhesive",
    brand: "Pidilite",
    category: "Adhesives",
    finish: "",
    size: "20kg",
    price: 3200,
    stock: 30,
    color: "White",
    hexCode: "#FFFFFF",
    description:
      "Fevicol SH 20kg bulk pack for professional furniture workshops. Industrial-grade bonding strength. Cost-effective solution for high-volume production.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Fevikwik Instant Adhesive",
    brand: "Pidilite",
    category: "Adhesives",
    finish: "",
    size: "3g",
    price: 49,
    stock: 200,
    color: "Clear",
    hexCode: "#F0F0F0",
    description:
      "Fevikwik super glue. Bonds metal, rubber, ceramic, and most plastics in seconds. Strong, permanent bond. Precision nozzle for controlled application.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Dr. Fixit Waterproof Coating",
    brand: "Pidilite",
    category: "Waterproofing",
    finish: "",
    size: "4L",
    price: 1350,
    stock: 45,
    color: "White",
    hexCode: "#FFFFFF",
    description:
      "Dr. Fixit Dampguard is a ready-to-use waterproofing coating for interior and exterior walls. Prevents damp, seepage, and efflorescence. Can be painted over with any wall paint.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Dr. Fixit Pidifin 2K",
    brand: "Pidilite",
    category: "Waterproofing",
    finish: "",
    size: "5kg",
    price: 2200,
    stock: 28,
    color: "Grey",
    hexCode: "#808080",
    description:
      "Dr. Fixit Pidifin 2K is a two-component flexible cementitious waterproofing slurry. Ideal for bathrooms, water tanks, swimming pools, and terraces. Excellent bond to concrete and masonry.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Fevicol MR Multipurpose Adhesive",
    brand: "Pidilite",
    category: "Adhesives",
    finish: "",
    size: "500ml",
    price: 149,
    stock: 150,
    color: "White",
    hexCode: "#FFFFFF",
    description:
      "Fevicol MR is a water-resistant multipurpose adhesive for wood, paper, fabric, and leather. Bonds instantly on contact, dries clear and flexible.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },

  // ── HARDWARE CONSUMABLES & FIXTURES ──
  {
    name: "Anchor Roma 6A Switch Board",
    brand: "Anchor",
    category: "Electrical",
    finish: "",
    size: "6-module",
    price: 349,
    stock: 85,
    color: "White",
    hexCode: "#FFFFFF",
    description:
      "Anchor Roma 6-module switch board. Flame-retardant ABS material. Accepts standard Anchor Roma switches and sockets. UV stabilised and scratch resistant surface.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Havells Oro 16A Switch",
    brand: "Havells",
    category: "Electrical",
    finish: "",
    size: "16A",
    price: 199,
    stock: 100,
    color: "White",
    hexCode: "#FFFFFF",
    description:
      "Havells Oro 16A heavy-duty switch. Superior contact material for long life. Suitable for high-current appliances like geysers and ACs. 6000 operations life.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "GI Binding Wire",
    brand: "Generic",
    category: "Fasteners & Fixtures",
    finish: "",
    size: "2kg coil",
    price: 249,
    stock: 100,
    color: "Silver",
    hexCode: "#C0C0C0",
    description:
      "Galvanised iron binding wire for construction use. 18 gauge, 2kg coil. Used for tying rebar, shuttering, and general construction binding. Rust resistant coating.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "MS Hex Bolt Set",
    brand: "Generic",
    category: "Fasteners & Fixtures",
    finish: "",
    size: "M10x50mm / 50 pcs",
    price: 349,
    stock: 75,
    color: "Silver",
    hexCode: "#C0C0C0",
    description:
      "Mild steel hex bolts M10x50mm with matching nuts and washers. Grade 4.8. 50-piece assorted pack. Ideal for structural, mechanical, and construction applications.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Stainless Steel Screws Assorted",
    brand: "Generic",
    category: "Fasteners & Fixtures",
    finish: "",
    size: "200 pcs assorted",
    price: 299,
    stock: 90,
    color: "Silver",
    hexCode: "#C0C0C0",
    description:
      "200-piece assorted stainless steel wood screws. Sizes 1 inch to 2.5 inch. Countersunk head, Philips drive. Rust-proof for indoor and outdoor use.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Rawlplug Wall Plugs",
    brand: "Rawlplug",
    category: "Fasteners & Fixtures",
    finish: "",
    size: "6mm / 100 pcs",
    price: 149,
    stock: 150,
    color: "Yellow",
    hexCode: "#FFD700",
    description:
      "Rawlplug 6mm yellow nylon wall plugs. 100-piece pack. Suitable for light to medium loads in brick, concrete, and masonry. Ribbed body prevents rotation.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Cumi Waterproof Sandpaper",
    brand: "Cumi",
    category: "Abrasives",
    finish: "",
    size: "220 grit / 10 sheets",
    price: 129,
    stock: 120,
    color: "Brown",
    hexCode: "#A0522D",
    description:
      "Cumi wet-and-dry waterproof sandpaper. 220 grit, 10 sheets pack. Silicon carbide abrasive for sanding metal, wood, and plastic. Can be used wet or dry.",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Cumi Grinding Wheel",
    brand: "Cumi",
    category: "Abrasives",
    finish: "",
    size: "100mm / 60 grit",
    price: 89,
    stock: 80,
    color: "Grey",
    hexCode: "#808080",
    description:
      "Cumi aluminium oxide grinding wheel for bench grinders. 100mm diameter, 60 grit. Suitable for sharpening tools and grinding steel. Safe operating speed 3600 RPM.",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "3M Masking Tape",
    brand: "3M",
    category: "Tapes & Sealants",
    finish: "",
    size: "24mm x 40m",
    price: 149,
    stock: 100,
    color: "Beige",
    hexCode: "#D2B48C",
    description:
      "3M general purpose masking tape. 24mm wide, 40m long. Clean removal without residue. Ideal for painting, masking, bundling, and light-duty holding.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "3M Double Sided Tape",
    brand: "3M",
    category: "Tapes & Sealants",
    finish: "",
    size: "18mm x 5m",
    price: 199,
    stock: 85,
    color: "Clear",
    hexCode: "#F0F0F0",
    description:
      "3M double-sided foam tape. 18mm wide, 5m long. Strong adhesion to metal, plastic, glass, and wood. Ideal for mounting pictures, mirrors, and panels without drilling.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Silicone Sealant Clear",
    brand: "Sika",
    category: "Tapes & Sealants",
    finish: "",
    size: "280ml",
    price: 349,
    stock: 60,
    color: "Clear",
    hexCode: "#F0F0F0",
    description:
      "Sika transparent silicone sealant. Waterproof, flexible, and UV resistant. Ideal for sealing around glass, aluminium windows, bathrooms, and kitchens. 300°C heat resistance.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Paint Roller Set",
    brand: "Generic",
    category: "Painting Accessories",
    finish: "",
    size: "9 inch",
    price: 299,
    stock: 70,
    color: "Yellow",
    hexCode: "#FFD700",
    description:
      "9-inch paint roller kit. Includes roller frame, 2 foam rollers, extension pole socket, and paint tray. Suitable for all emulsion and enamel paints. Easy to clean.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Paint Brush Set",
    brand: "Asian Paints Tools",
    category: "Painting Accessories",
    finish: "",
    size: "5-piece assorted",
    price: 399,
    stock: 65,
    color: "Brown/Black",
    hexCode: "#8B4513",
    description:
      "5-piece synthetic paint brush set. Sizes 1\", 1.5\", 2\", 2.5\", and 3\". Pure synthetic bristles for smooth application of emulsion, enamel, and primer. Comfortable wooden handle.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Paint Sprayer Electric",
    brand: "Bosch",
    category: "Painting Accessories",
    finish: "",
    size: "400W",
    price: 2999,
    stock: 18,
    color: "Blue",
    hexCode: "#0057A8",
    description:
      "Bosch PFS 2000 electric paint sprayer. 400W, airless spray system. Suitable for emulsions, varnishes, and wood stains. 800ml container, adjustable spray pattern.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Putty Knife Set",
    brand: "Stanley",
    category: "Painting Accessories",
    finish: "",
    size: "3-piece",
    price: 349,
    stock: 55,
    color: "Silver",
    hexCode: "#C0C0C0",
    description:
      "Stanley 3-piece putty knife set. Stainless steel blades, 1\", 2\", and 3\" widths. Flexible blades for filling cracks, applying putty, and scraping. Comfortable plastic handles.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Heavy Duty Safety Gloves",
    brand: "Karam",
    category: "Safety Equipment",
    finish: "",
    size: "Large",
    price: 249,
    stock: 100,
    color: "Orange",
    hexCode: "#FF6B35",
    description:
      "Karam heavy-duty nitrile-coated safety gloves. EN388 certified. Cut and abrasion resistant. Ideal for construction, painting, and general hardware work.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Safety Helmet",
    brand: "Karam",
    category: "Safety Equipment",
    finish: "",
    size: "Universal",
    price: 399,
    stock: 50,
    color: "Yellow",
    hexCode: "#FFD700",
    description:
      "Karam PN521 safety helmet. IS 2925 certified. High-density polyethylene shell, ratchet suspension. Ventilation slots, sweat band, and adjustable chin strap. Protects from falling objects.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Safety Goggles",
    brand: "Karam",
    category: "Safety Equipment",
    finish: "",
    size: "Universal",
    price: 149,
    stock: 80,
    color: "Clear",
    hexCode: "#F0F0F0",
    description:
      "Karam safety goggles with anti-scratch and anti-fog coating. EN166 certified. Adjustable elastic strap. Protects eyes from dust, splashes, and flying particles.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Plywood 19mm BWR Grade",
    brand: "CenturyPly",
    category: "Building Materials",
    finish: "",
    size: "8x4 ft / 19mm",
    price: 3200,
    stock: 30,
    color: "Natural",
    hexCode: "#DEB887",
    description:
      "CenturyPly BWR (Boiling Water Resistant) plywood. 19mm thickness, 8x4 feet sheet. IS:303 certified. Formaldehyde-free adhesive. Ideal for furniture, cabinets, and structural use.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "MDF Board 12mm",
    brand: "Greenply",
    category: "Building Materials",
    finish: "",
    size: "8x4 ft / 12mm",
    price: 1800,
    stock: 25,
    color: "Natural",
    hexCode: "#C19A6B",
    description:
      "Greenply 12mm MDF (Medium Density Fibreboard). Smooth, uniform surface ideal for painting and lamination. Suitable for furniture, wall panelling, and decorative work.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "PVC Pipe 4 inch",
    brand: "Astral",
    category: "Plumbing",
    finish: "",
    size: "4 inch / 3m",
    price: 599,
    stock: 40,
    color: "White",
    hexCode: "#FFFFFF",
    description:
      "Astral 4-inch UPVC pipe for drainage and sewage applications. IS:4985 certified. UV stabilised and chemical resistant. 3-metre length. Suitable for underground and above-ground use.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "CPVC Hot Water Pipe",
    brand: "Astral",
    category: "Plumbing",
    finish: "",
    size: "25mm / 3m",
    price: 420,
    stock: 50,
    color: "Yellow",
    hexCode: "#FFD700",
    description:
      "Astral CPVC 25mm hot and cold water pipe. Handles temperatures up to 93°C. Lead-free, corrosion resistant, and smooth bore for high flow rates. NSF certified for potable water.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
  {
    name: "Cement OPC 53 Grade",
    brand: "UltraTech",
    category: "Building Materials",
    finish: "",
    size: "50kg bag",
    price: 420,
    stock: 100,
    color: "Grey",
    hexCode: "#808080",
    description:
      "UltraTech OPC 53 Grade Portland Cement. BIS certified. High early strength, ideal for RCC structures, prestressed concrete, and high-performance flooring.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=600&fit=crop&q=85",
    type: "hardware",
  },
];

// ─────────────────────────────────────────────
//  SEED FUNCTION
// ─────────────────────────────────────────────
async function seedDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Step 1: Wipe existing products
    console.log("🗑️  Deleting all existing products...");
    const deleted = await Product.deleteMany({});
    console.log(`✅ Deleted ${deleted.deletedCount} existing products\n`);

    // Step 2: Combine all products
    const allProducts = [...paintProducts, ...hardwareProducts];
    console.log(
      `📦 Inserting ${allProducts.length} products (${paintProducts.length} paints + ${hardwareProducts.length} hardware)...` 
    );

    // Step 3: Insert all products
    const inserted = await Product.insertMany(allProducts);
    console.log(`\n✅ Successfully inserted ${inserted.length} products!`);
    console.log(
      `   🎨 Paint products: ${paintProducts.length}` 
    );
    console.log(
      `   🔧 Hardware products: ${hardwareProducts.length}` 
    );
    console.log(`   📦 Total: ${inserted.length}`);

    // Summary by brand
    const brands = {};
    allProducts.forEach((p) => {
      brands[p.brand] = (brands[p.brand] || 0) + 1;
    });
    console.log("\n📊 Products by brand:");
    Object.entries(brands)
      .sort((a, b) => b[1] - a[1])
      .forEach(([brand, count]) => {
        console.log(`   ${brand}: ${count} products`);
      });
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
    console.log("🎉 Seeding complete!");
  }
}

seedDatabase();
