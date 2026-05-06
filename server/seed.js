import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User.js'
import Paint from './models/Paint.js'
import Hardware from './models/Hardware.js'
import Order from './models/Order.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mayurpaints'

// REAL PRODUCT DATA - 70+ Paint Products from Asian Paints, Berger, Shalimar, Nerolac
const paintData = [
  // ASIAN PAINTS - Interior (15 products)
  { name: 'Royale Shyne Luxury Emulsion', brand: 'Asian Paints', color: 'Moonlit Ivory', hexCode: '#FFF9E6', finish: 'satin', size: '4L', price: 2150, stock: 50, category: 'Interior', description: 'Premium luxury emulsion with Teflon surface protector for superior stain resistance and washability' },
  { name: 'Royale Matt Emulsion', brand: 'Asian Paints', color: 'Soft Cream', hexCode: '#FFFACD', finish: 'matte', size: '10L', price: 3850, stock: 40, category: 'Interior', description: 'Rich matt finish with excellent coverage and anti-bacterial properties' },
  { name: 'Apcolite Premium Emulsion', brand: 'Asian Paints', color: 'Pearl White', hexCode: '#F5F5F5', finish: 'satin', size: '20L', price: 6500, stock: 30, category: 'Interior', description: 'Premium quality interior emulsion with superior finish and durability' },
  { name: 'Tractor Emulsion', brand: 'Asian Paints', color: 'Bright White', hexCode: '#FFFFFF', finish: 'matte', size: '20L', price: 4200, stock: 60, category: 'Interior', description: 'Economy emulsion paint with good coverage for interior walls' },
  { name: 'Royale Aspira', brand: 'Asian Paints', color: 'Misty Grey', hexCode: '#D3D3D3', finish: 'matte', size: '4L', price: 1950, stock: 45, category: 'Interior', description: 'Advanced air-purifying paint that reduces indoor air pollutants' },
  { name: 'Royale Glitz', brand: 'Asian Paints', color: 'Silver Shimmer', hexCode: '#C0C0C0', finish: 'glossy', size: '1L', price: 850, stock: 35, category: 'Interior', description: 'Metallic finish paint for accent walls with sparkling effect' },
  { name: 'Ace Exterior Emulsion', brand: 'Asian Paints', color: 'Sandstone Beige', hexCode: '#F5DEB3', finish: 'satin', size: '4L', price: 1650, stock: 55, category: 'Interior', description: 'Durable emulsion suitable for both interior and exterior applications' },
  { name: 'Royale Health Shield', brand: 'Asian Paints', color: 'Pure White', hexCode: '#FAFAFA', finish: 'matte', size: '10L', price: 4200, stock: 40, category: 'Interior', description: 'Anti-bacterial paint with silver ion technology for healthier homes' },
  { name: 'Apcolite Advanced', brand: 'Asian Paints', color: 'Warm Beige', hexCode: '#F5F5DC', finish: 'eggshell', size: '4L', price: 1750, stock: 50, category: 'Interior', description: 'Advanced interior emulsion with excellent washability' },
  { name: 'Royale Play Special Effects', brand: 'Asian Paints', color: 'Champagne Gold', hexCode: '#F7E7CE', finish: 'satin', size: '1L', price: 1200, stock: 25, category: 'Interior', description: 'Designer finish paint for creating textured and metallic effects' },
  { name: 'Tractor Acrylic Distemper', brand: 'Asian Paints', color: 'Sky Blue', hexCode: '#87CEEB', finish: 'matte', size: '20L', price: 3500, stock: 65, category: 'Interior', description: 'Water-based acrylic distemper for smooth matt finish' },
  { name: 'Royale Luxury Emulsion', brand: 'Asian Paints', color: 'Lavender Mist', hexCode: '#E6E6FA', finish: 'satin', size: '4L', price: 2050, stock: 42, category: 'Interior', description: 'Luxury emulsion with silk-like finish and superior coverage' },
  { name: 'Apcolite Premium Satin', brand: 'Asian Paints', color: 'Mint Fresh', hexCode: '#F5FFFA', finish: 'satin', size: '10L', price: 3650, stock: 38, category: 'Interior', description: 'Premium satin finish with excellent stain resistance' },
  { name: 'Royale Matt Deep', brand: 'Asian Paints', color: 'Charcoal Grey', hexCode: '#36454F', finish: 'matte', size: '4L', price: 2250, stock: 30, category: 'Interior', description: 'Deep color matt emulsion for bold interior statements' },
  { name: 'Ace Emulsion', brand: 'Asian Paints', color: 'Lemon Yellow', hexCode: '#FFF44F', finish: 'matte', size: '4L', price: 1450, stock: 55, category: 'Interior', description: 'Value-for-money emulsion with good hiding power' },

  // ASIAN PAINTS - Exterior (8 products)
  { name: 'Apex Ultima Protek', brand: 'Asian Paints', color: 'Sandstone', hexCode: '#D2B48C', finish: 'satin', size: '20L', price: 9500, stock: 25, category: 'Exterior', description: 'Premium exterior emulsion with 12-year warranty and dirt-repellent technology' },
  { name: 'Apex Weatherproof', brand: 'Asian Paints', color: 'Terracotta', hexCode: '#E2725B', finish: 'matte', size: '20L', price: 7800, stock: 35, category: 'Exterior', description: 'All-weather protection with anti-algal and anti-fungal properties' },
  { name: 'Apex Ultima', brand: 'Asian Paints', color: 'Desert Sand', hexCode: '#EDC9AF', finish: 'glossy', size: '10L', price: 5200, stock: 40, category: 'Exterior', description: 'Weather-proof exterior emulsion with superior durability' },
  { name: 'Apex Dust Beater', brand: 'Asian Paints', color: 'Stone Grey', hexCode: '#928E85', finish: 'satin', size: '20L', price: 8200, stock: 30, category: 'Exterior', description: 'Self-cleaning exterior paint that repels dust and dirt' },
  { name: 'Apex Exterior Emulsion', brand: 'Asian Paints', color: 'Cream', hexCode: '#FFFDD0', finish: 'matte', size: '20L', price: 6800, stock: 45, category: 'Exterior', description: 'Durable exterior emulsion for long-lasting protection' },
  { name: 'Apex Ultima Protek Plus', brand: 'Asian Paints', color: 'Ivory', hexCode: '#FFFFF0', finish: 'satin', size: '10L', price: 5500, stock: 28, category: 'Exterior', description: 'Advanced exterior protection with heat-reflective technology' },
  { name: 'Apex Weatherproof Plus', brand: 'Asian Paints', color: 'Warm Grey', hexCode: '#808080', finish: 'matte', size: '10L', price: 4200, stock: 50, category: 'Exterior', description: 'Enhanced weather protection for harsh climates' },
  { name: 'Apex Duracast', brand: 'Asian Paints', color: 'Buff', hexCode: '#F0DC82', finish: 'satin', size: '20L', price: 7200, stock: 32, category: 'Exterior', description: 'Textured exterior coating for superior wall protection' },

  // ASIAN PAINTS - Wood & Metal (7 products)
  { name: 'Woodtech PU Clear', brand: 'Asian Paints', color: 'Clear', hexCode: '#FFFFFF', finish: 'glossy', size: '1L', price: 1050, stock: 40, category: 'Wood', description: 'Premium polyurethane clear coat for wood with UV protection' },
  { name: 'Woodtech PU Stain', brand: 'Asian Paints', color: 'Teak', hexCode: '#8B4513', finish: 'satin', size: '1L', price: 950, stock: 45, category: 'Wood', description: 'Polyurethane wood stain with rich color and durability' },
  { name: 'Apcolite Synthetic Enamel', brand: 'Asian Paints', color: 'Royal Blue', hexCode: '#4169E1', finish: 'glossy', size: '1L', price: 680, stock: 60, category: 'Metal', description: 'High-gloss synthetic enamel for metal and wood surfaces' },
  { name: 'Apcolite Premium Enamel', brand: 'Asian Paints', color: 'Fire Red', hexCode: '#DC143C', finish: 'glossy', size: '500ml', price: 420, stock: 70, category: 'Metal', description: 'Premium quality enamel with superior shine and durability' },
  { name: 'Woodtech NC Lacquer', brand: 'Asian Paints', color: 'Walnut', hexCode: '#5C4033', finish: 'glossy', size: '1L', price: 850, stock: 35, category: 'Wood', description: 'Nitrocellulose lacquer for professional wood finishing' },
  { name: 'Apcolite Advanced Enamel', brand: 'Asian Paints', color: 'Jet Black', hexCode: '#000000', finish: 'glossy', size: '1L', price: 720, stock: 55, category: 'Metal', description: 'Advanced enamel with anti-rust properties' },
  { name: 'Woodtech Melamine', brand: 'Asian Paints', color: 'Oak', hexCode: '#806517', finish: 'satin', size: '1L', price: 900, stock: 42, category: 'Wood', description: 'Melamine finish for furniture with scratch resistance' },

  // BERGER PAINTS - Interior (12 products)
  { name: 'Silk Luxury Emulsion', brand: 'Berger', color: 'Pearl White', hexCode: '#F8F8FF', finish: 'satin', size: '10L', price: 3950, stock: 38, category: 'Interior', description: 'Luxury silk finish emulsion with superior washability and stain resistance' },
  { name: 'Easy Clean Fresh', brand: 'Berger', color: 'Soft Cream', hexCode: '#FFFACD', finish: 'eggshell', size: '4L', price: 1750, stock: 50, category: 'Interior', description: 'Stain-resistant interior paint with fresh fragrance technology' },
  { name: 'Rangoli Total Care', brand: 'Berger', color: 'Bright White', hexCode: '#FFFFFF', finish: 'matte', size: '20L', price: 4500, stock: 55, category: 'Interior', description: 'Complete care interior emulsion with anti-bacterial protection' },
  { name: 'Silk Glamour', brand: 'Berger', color: 'Champagne', hexCode: '#F7E7CE', finish: 'satin', size: '4L', price: 2050, stock: 40, category: 'Interior', description: 'Glamorous silk finish with metallic sheen' },
  { name: 'Easy Clean Matt', brand: 'Berger', color: 'Sky Blue', hexCode: '#87CEEB', finish: 'matte', size: '10L', price: 3450, stock: 45, category: 'Interior', description: 'Matt finish with easy-to-clean surface technology' },
  { name: 'Bison Acrylic Distemper', brand: 'Berger', color: 'Lemon Yellow', hexCode: '#FFF44F', finish: 'matte', size: '20L', price: 3200, stock: 60, category: 'Interior', description: 'Acrylic distemper for smooth matt finish on interior walls' },
  { name: 'Silk Illusions', brand: 'Berger', color: 'Rose Pink', hexCode: '#FFB6C1', finish: 'satin', size: '4L', price: 1950, stock: 35, category: 'Interior', description: 'Designer silk finish for elegant interiors' },
  { name: 'Easy Clean Luxury', brand: 'Berger', color: 'Mint Green', hexCode: '#98FF98', finish: 'eggshell', size: '4L', price: 1850, stock: 48, category: 'Interior', description: 'Luxury emulsion with stain-guard technology' },
  { name: 'Rangoli Premium', brand: 'Berger', color: 'Warm Beige', hexCode: '#F5F5DC', finish: 'matte', size: '10L', price: 3150, stock: 52, category: 'Interior', description: 'Premium interior emulsion with excellent coverage' },
  { name: 'Silk Breathe Easy', brand: 'Berger', color: 'Lavender', hexCode: '#E6E6FA', finish: 'satin', size: '4L', price: 2150, stock: 38, category: 'Interior', description: 'Low-VOC emulsion for healthier indoor air quality' },
  { name: 'Easy Clean Advance', brand: 'Berger', color: 'Peach', hexCode: '#FFDAB9', finish: 'eggshell', size: '10L', price: 3650, stock: 42, category: 'Interior', description: 'Advanced stain-resistant technology for busy households' },
  { name: 'Silk Designer', brand: 'Berger', color: 'Silver Grey', hexCode: '#C0C0C0', finish: 'satin', size: '1L', price: 950, stock: 30, category: 'Interior', description: 'Designer finish for creating accent walls' },

  // BERGER PAINTS - Exterior (6 products)
  { name: 'WeatherCoat All Guard', brand: 'Berger', color: 'Sandstone', hexCode: '#D2B48C', finish: 'satin', size: '20L', price: 8500, stock: 30, category: 'Exterior', description: 'All-weather protection with 10-year warranty and anti-algal properties' },
  { name: 'WeatherCoat Long Life', brand: 'Berger', color: 'Terracotta', hexCode: '#E2725B', finish: 'matte', size: '20L', price: 7200, stock: 35, category: 'Exterior', description: 'Long-lasting exterior emulsion with superior durability' },
  { name: 'WeatherCoat Smooth', brand: 'Berger', color: 'Cream', hexCode: '#FFFDD0', finish: 'satin', size: '10L', price: 4200, stock: 45, category: 'Exterior', description: 'Smooth finish exterior paint with weather resistance' },
  { name: 'WeatherCoat Kool & Seal', brand: 'Berger', color: 'White', hexCode: '#FFFFFF', finish: 'satin', size: '20L', price: 9200, stock: 25, category: 'Exterior', description: 'Heat-reflective exterior paint that keeps homes cooler' },
  { name: 'WeatherCoat Anti Dustt', brand: 'Berger', color: 'Stone Grey', hexCode: '#928E85', finish: 'satin', size: '10L', price: 4800, stock: 38, category: 'Exterior', description: 'Self-cleaning exterior paint with dust-repellent technology' },
  { name: 'WeatherCoat Textured', brand: 'Berger', color: 'Desert Sand', hexCode: '#EDC9AF', finish: 'matte', size: '20L', price: 7800, stock: 32, category: 'Exterior', description: 'Textured exterior coating for enhanced wall protection' },

  // BERGER PAINTS - Wood & Metal (5 products)
  { name: 'Luxol Hi-Gloss Enamel', brand: 'Berger', color: 'Royal Blue', hexCode: '#4169E1', finish: 'glossy', size: '1L', price: 720, stock: 55, category: 'Metal', description: 'Premium synthetic enamel with superior gloss and durability' },
  { name: 'Luxol Satin Enamel', brand: 'Berger', color: 'Fire Red', hexCode: '#DC143C', finish: 'satin', size: '1L', price: 680, stock: 50, category: 'Metal', description: 'Satin finish enamel for metal and wood surfaces' },
  { name: 'Woodtech Melamine', brand: 'Berger', color: 'Walnut', hexCode: '#5C4033', finish: 'satin', size: '1L', price: 880, stock: 42, category: 'Wood', description: 'Melamine coating for furniture with scratch resistance' },
  { name: 'Luxol Quick Dry Enamel', brand: 'Berger', color: 'Jet Black', hexCode: '#000000', finish: 'glossy', size: '500ml', price: 420, stock: 65, category: 'Metal', description: 'Fast-drying enamel with excellent coverage' },
  { name: 'Woodtech PU Clear', brand: 'Berger', color: 'Clear', hexCode: '#FFFFFF', finish: 'glossy', size: '1L', price: 1020, stock: 38, category: 'Wood', description: 'Polyurethane clear coat for wood protection' },

  // SHALIMAR PAINTS (8 products)
  { name: 'Superlac Premier Hi-Gloss', brand: 'Shalimar', color: 'Royal Blue', hexCode: '#4169E1', finish: 'glossy', size: '1L', price: 650, stock: 50, category: 'Metal', description: 'Premium hi-gloss enamel for metal and wood with superior shine' },
  { name: 'Shalimar Sigmacover', brand: 'Shalimar', color: 'White', hexCode: '#FFFFFF', finish: 'satin', size: '20L', price: 7500, stock: 30, category: 'Exterior', description: 'Exterior emulsion with excellent weather resistance' },
  { name: 'Shalimar Synthetic Enamel', brand: 'Shalimar', color: 'Fire Red', hexCode: '#DC143C', finish: 'glossy', size: '1L', price: 620, stock: 55, category: 'Metal', description: 'Synthetic enamel for durable finish on metal surfaces' },
  { name: 'Shalimar Interior Emulsion', brand: 'Shalimar', color: 'Cream', hexCode: '#FFFDD0', finish: 'matte', size: '10L', price: 3200, stock: 45, category: 'Interior', description: 'Quality interior emulsion with good coverage' },
  { name: 'Superlac Satin Enamel', brand: 'Shalimar', color: 'Jet Black', hexCode: '#000000', finish: 'satin', size: '500ml', price: 380, stock: 60, category: 'Metal', description: 'Satin finish enamel for elegant look' },
  { name: 'Shalimar Exterior Emulsion', brand: 'Shalimar', color: 'Sandstone', hexCode: '#D2B48C', finish: 'matte', size: '20L', price: 6800, stock: 35, category: 'Exterior', description: 'Durable exterior emulsion for all weather conditions' },
  { name: 'Shalimar Wood Finish', brand: 'Shalimar', color: 'Teak', hexCode: '#8B4513', finish: 'satin', size: '1L', price: 820, stock: 40, category: 'Wood', description: 'Wood finish with natural grain enhancement' },
  { name: 'Superlac Quick Dry', brand: 'Shalimar', color: 'Green', hexCode: '#008000', finish: 'glossy', size: '1L', price: 640, stock: 48, category: 'Metal', description: 'Fast-drying enamel for quick project completion' },

  // NEROLAC PAINTS (9 products)
  { name: 'Excel Total', brand: 'Nerolac', color: 'White', hexCode: '#FFFFFF', finish: 'matte', size: '10L', price: 3450, stock: 50, category: 'Interior', description: 'Total protection interior emulsion with anti-bacterial properties' },
  { name: 'Impressions Luxury Emulsion', brand: 'Nerolac', color: 'Pearl', hexCode: '#F8F8FF', finish: 'satin', size: '4L', price: 1950, stock: 42, category: 'Interior', description: 'Luxury emulsion with silk-like finish' },
  { name: 'Suraksha Advanced', brand: 'Nerolac', color: 'Sandstone', hexCode: '#D2B48C', finish: 'satin', size: '20L', price: 8200, stock: 28, category: 'Exterior', description: 'Advanced exterior protection with 10-year warranty' },
  { name: 'Beauty Gold Emulsion', brand: 'Nerolac', color: 'Cream', hexCode: '#FFFDD0', finish: 'matte', size: '20L', price: 4200, stock: 55, category: 'Interior', description: 'Premium interior emulsion with excellent coverage' },
  { name: 'Suraksha Exterior Emulsion', brand: 'Nerolac', color: 'Stone Grey', hexCode: '#928E85', finish: 'matte', size: '10L', price: 4500, stock: 40, category: 'Exterior', description: 'Weather-resistant exterior emulsion' },
  { name: 'Enamel Finish', brand: 'Nerolac', color: 'Royal Blue', hexCode: '#4169E1', finish: 'glossy', size: '1L', price: 650, stock: 58, category: 'Metal', description: 'High-gloss enamel for metal and wood' },
  { name: 'Wood Stain', brand: 'Nerolac', color: 'Walnut', hexCode: '#5C4033', finish: 'matte', size: '500ml', price: 480, stock: 52, category: 'Wood', description: 'Natural wood stain for beautiful grain' },
  { name: 'Excel Anti Peel', brand: 'Nerolac', color: 'Sky Blue', hexCode: '#87CEEB', finish: 'matte', size: '4L', price: 1650, stock: 48, category: 'Interior', description: 'Anti-peel interior emulsion for damp walls' },
  { name: 'Synthetic Enamel', brand: 'Nerolac', color: 'Jet Black', hexCode: '#000000', finish: 'glossy', size: '500ml', price: 390, stock: 65, category: 'Metal', description: 'Durable synthetic enamel for lasting finish' }
]

// REAL HARDWARE DATA - 45+ Products from Stanley, Bosch, Taparia, DeWalt, Pidilite
const hardwareData = [
  // BRUSHES (8 products)
  { name: 'Professional Paint Brush Set 5pc', brand: 'Stanley', category: 'Brushes', price: 520, stock: 75, description: 'Professional 5-piece brush set with ergonomic handles for all painting applications', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
  { name: 'Flat Wall Brush 4 inch', brand: 'Asian Paints', category: 'Brushes', price: 220, stock: 100, description: 'Wide flat brush with synthetic bristles for smooth wall painting', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
  { name: 'Angle Sash Brush 2 inch', brand: 'Stanley', category: 'Brushes', price: 180, stock: 85, description: 'Angled brush for cutting in and detailed work', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
  { name: 'Round Paint Brush Set', brand: 'Berger', category: 'Brushes', price: 350, stock: 90, description: '3-piece round brush set for trim and detail work', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
  { name: 'Chip Brush Pack of 10', brand: 'Taparia', category: 'Brushes', price: 280, stock: 120, description: 'Disposable chip brushes for glue and stain application', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
  { name: 'Radiator Brush Long Handle', brand: 'Stanley', category: 'Brushes', price: 240, stock: 65, description: 'Long-handled brush for hard-to-reach areas', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
  { name: 'Artist Detail Brush Set', brand: 'Asian Paints', category: 'Brushes', price: 420, stock: 70, description: 'Fine detail brushes for decorative painting', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
  { name: 'Stencil Brush Set 4pc', brand: 'Nerolac', category: 'Brushes', price: 320, stock: 80, description: 'Stencil brushes for pattern and texture work', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },

  // ROLLERS (7 products)
  { name: 'Foam Roller Kit with Tray', brand: 'Stanley', category: 'Rollers', price: 450, stock: 85, description: 'Complete roller kit with tray, extension pole and 2 refills', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400' },
  { name: 'Texture Roller 9 inch', brand: 'Asian Paints', category: 'Rollers', price: 320, stock: 95, description: 'Professional texture roller for decorative finishes', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400' },
  { name: 'Mini Roller Set 4 inch', brand: 'Berger', category: 'Rollers', price: 180, stock: 110, description: 'Mini roller set perfect for small areas and touch-ups', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400' },
  { name: 'Extension Pole 6ft', brand: 'Stanley', category: 'Rollers', price: 420, stock: 70, description: 'Telescopic extension pole for high walls and ceilings', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400' },
  { name: 'Microfiber Roller Cover 9 inch', brand: 'Nerolac', category: 'Rollers', price: 280, stock: 100, description: 'High-quality microfiber roller for smooth finish', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400' },
  { name: 'Paint Roller Tray Large', brand: 'Asian Paints', category: 'Rollers', price: 220, stock: 90, description: 'Heavy-duty paint tray with deep well', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400' },
  { name: 'Roller Frame Heavy Duty', brand: 'Stanley', category: 'Rollers', price: 350, stock: 75, description: 'Professional roller frame with comfortable grip', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400' },

  // TAPE (5 products)
  { name: 'Blue Painters Tape 2 inch x 50m', brand: 'Asian Paints', category: 'Tape', price: 180, stock: 150, description: 'Clean removal masking tape for sharp paint lines', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=400' },
  { name: 'Masking Tape Roll 1 inch', brand: 'Pidilite', category: 'Tape', price: 95, stock: 200, description: 'General purpose masking tape for painting projects', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=400' },
  { name: 'Green Painters Tape 1.5 inch', brand: 'Stanley', category: 'Tape', price: 150, stock: 180, description: 'Multi-surface painters tape with UV resistance', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=400' },
  { name: 'Delicate Surface Tape', brand: 'Berger', category: 'Tape', price: 120, stock: 160, description: 'Low-tack tape for delicate surfaces', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=400' },
  { name: 'Heavy Duty Masking Tape', brand: 'Taparia', category: 'Tape', price: 140, stock: 170, description: 'Extra-strong masking tape for rough surfaces', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=400' },

  // TOOLS - Power Tools (8 products)
  { name: 'Cordless Drill Driver 18V', brand: 'Bosch', category: 'Tools', price: 4850, stock: 35, description: 'Professional cordless drill with 2 batteries and charger', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },
  { name: 'Impact Driver 20V MAX', brand: 'DeWalt', category: 'Tools', price: 5200, stock: 30, description: 'High-torque impact driver for heavy-duty applications', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },
  { name: 'Angle Grinder 4 inch', brand: 'Bosch', category: 'Tools', price: 2850, stock: 45, description: 'Compact angle grinder for cutting and grinding', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },
  { name: 'Orbital Sander 300W', brand: 'DeWalt', category: 'Tools', price: 3200, stock: 40, description: 'Random orbital sander for smooth surface finishing', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },
  { name: 'Heat Gun 2000W', brand: 'Bosch', category: 'Tools', price: 2450, stock: 50, description: 'Variable temperature heat gun for paint stripping', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },
  { name: 'Jigsaw 550W', brand: 'DeWalt', category: 'Tools', price: 3850, stock: 38, description: 'Variable speed jigsaw for curved and straight cuts', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },
  { name: 'Circular Saw 7.25 inch', brand: 'Bosch', category: 'Tools', price: 4200, stock: 32, description: 'Powerful circular saw for straight cuts in wood', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },
  { name: 'Multi-Tool Oscillating', brand: 'DeWalt', category: 'Tools', price: 3650, stock: 42, description: 'Versatile oscillating multi-tool with accessories', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },

  // TOOLS - Hand Tools (10 products)
  { name: 'Putty Knife Set 3pc', brand: 'Stanley', category: 'Tools', price: 420, stock: 80, description: 'Professional putty knife set for wall preparation', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400' },
  { name: 'Paint Scraper Heavy Duty', brand: 'Taparia', category: 'Tools', price: 280, stock: 95, description: 'Heavy-duty scraper for removing old paint and wallpaper', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },
  { name: 'Caulking Gun Professional', brand: 'Stanley', category: 'Tools', price: 380, stock: 70, description: 'Smooth-flow caulking gun for sealant application', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400' },
  { name: 'Utility Knife Retractable', brand: 'Stanley', category: 'Tools', price: 180, stock: 120, description: 'Heavy-duty retractable utility knife with blade storage', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400' },
  { name: 'Measuring Tape 8m', brand: 'Stanley', category: 'Tools', price: 320, stock: 100, description: 'Professional measuring tape with auto-lock', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400' },
  { name: 'Spirit Level 24 inch', brand: 'Taparia', category: 'Tools', price: 450, stock: 65, description: 'Magnetic spirit level with 3 vials for accurate leveling', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400' },
  { name: 'Hammer Claw 16oz', brand: 'Stanley', category: 'Tools', price: 520, stock: 85, description: 'Forged steel claw hammer with fiberglass handle', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400' },
  { name: 'Screwdriver Set 6pc', brand: 'Taparia', category: 'Tools', price: 380, stock: 90, description: 'Professional screwdriver set with magnetic tips', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400' },
  { name: 'Pliers Set 3pc', brand: 'Taparia', category: 'Tools', price: 650, stock: 75, description: 'Combination, needle-nose and cutting pliers set', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400' },
  { name: 'Adjustable Wrench 10 inch', brand: 'Stanley', category: 'Tools', price: 420, stock: 80, description: 'Chrome-plated adjustable wrench with wide jaw capacity', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400' },

  // ACCESSORIES (7 products)
  { name: 'Sandpaper Assorted Pack 50pc', brand: 'Bosch', category: 'Accessories', price: 280, stock: 150, description: 'Assorted grit sandpaper for all surface preparation needs', image: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400' },
  { name: 'Drop Cloth Canvas 12x15ft', brand: 'Stanley', category: 'Accessories', price: 520, stock: 60, description: 'Heavy-duty canvas drop cloth for floor protection', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400' },
  { name: 'Plastic Drop Sheet Roll', brand: 'Asian Paints', category: 'Accessories', price: 180, stock: 100, description: 'Disposable plastic sheeting for covering furniture', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400' },
  { name: 'Paint Mixer Attachment', brand: 'Bosch', category: 'Accessories', price: 320, stock: 70, description: 'Drill attachment for mixing paint and plaster', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400' },
  { name: 'Safety Goggles Clear', brand: 'Stanley', category: 'Accessories', price: 150, stock: 120, description: 'Impact-resistant safety goggles with anti-fog coating', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400' },
  { name: 'Work Gloves Leather', brand: 'DeWalt', category: 'Accessories', price: 280, stock: 95, description: 'Durable leather work gloves with reinforced palms', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400' },
  { name: 'Fevicol MR 1kg', brand: 'Pidilite', category: 'Accessories', price: 220, stock: 140, description: 'Moisture-resistant wood adhesive for all carpentry work', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400' }
]

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI)
    console.log('\n✅ Connected to MongoDB\n')

    // Drop existing collections
    await User.deleteMany({})
    await Paint.deleteMany({})
    await Hardware.deleteMany({})
    await Order.deleteMany({})
    console.log('🗑️  Cleared existing data\n')

    // Create users
    const hashedPassword = await bcrypt.hash('admin123', 12)
    const hashedUserPassword = await bcrypt.hash('user123', 12)

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@mayurpaints.com',
        password: hashedPassword,
        phone: '+91 98765 43210',
        role: 'admin'
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: hashedUserPassword,
        phone: '+91 98765 11111',
        role: 'user'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: hashedUserPassword,
        phone: '+91 98765 22222',
        role: 'user'
      }
    ])
    console.log(`👤 Created ${users.length} users`)

    // Create paints
    const paints = await Paint.insertMany(paintData)
    console.log(`🎨 Created ${paints.length} paint products`)

    // Create hardware
    const hardware = await Hardware.insertMany(hardwareData)
    console.log(`🔧 Created ${hardware.length} hardware products`)

    // Create sample orders
    const sampleOrders = [
      {
        orderId: 'ORD-2024-001',
        user: users[1]._id,
        items: [
          { product: paints[0]._id, productType: 'Paint', name: paints[0].name, price: paints[0].price, quantity: 2 },
          { product: hardware[0]._id, productType: 'Hardware', name: hardware[0].name, price: hardware[0].price, quantity: 1 }
        ],
        totalAmount: paints[0].price * 2 + hardware[0].price,
        shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 11111' },
        paymentMethod: 'online',
        status: 'delivered'
      },
      {
        orderId: 'ORD-2024-002',
        user: users[2]._id,
        items: [
          { product: paints[5]._id, productType: 'Paint', name: paints[5].name, price: paints[5].price, quantity: 1 },
          { product: hardware[2]._id, productType: 'Hardware', name: hardware[2].name, price: hardware[2].price, quantity: 2 }
        ],
        totalAmount: paints[5].price + hardware[2].price * 2,
        shippingAddress: { street: '456 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 22222' },
        paymentMethod: 'cod',
        status: 'shipped'
      },
      {
        orderId: 'ORD-2024-003',
        user: users[1]._id,
        items: [
          { product: paints[2]._id, productType: 'Paint', name: paints[2].name, price: paints[2].price, quantity: 3 }
        ],
        totalAmount: paints[2].price * 3,
        shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 11111' },
        paymentMethod: 'online',
        status: 'confirmed'
      },
      {
        orderId: 'ORD-2024-004',
        user: users[2]._id,
        items: [
          { product: hardware[4]._id, productType: 'Hardware', name: hardware[4].name, price: hardware[4].price, quantity: 5 },
          { product: hardware[5]._id, productType: 'Hardware', name: hardware[5].name, price: hardware[5].price, quantity: 3 }
        ],
        totalAmount: hardware[4].price * 5 + hardware[5].price * 3,
        shippingAddress: { street: '456 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 22222' },
        paymentMethod: 'cod',
        status: 'pending'
      },
      {
        orderId: 'ORD-2024-005',
        user: users[1]._id,
        items: [
          { product: paints[9]._id, productType: 'Paint', name: paints[9].name, price: paints[9].price, quantity: 2 },
          { product: paints[10]._id, productType: 'Paint', name: paints[10].name, price: paints[10].price, quantity: 1 }
        ],
        totalAmount: paints[9].price * 2 + paints[10].price,
        shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 11111' },
        paymentMethod: 'online',
        status: 'delivered'
      },
      {
        orderId: 'ORD-2024-006',
        user: users[2]._id,
        items: [
          { product: paints[1]._id, productType: 'Paint', name: paints[1].name, price: paints[1].price, quantity: 1 }
        ],
        totalAmount: paints[1].price,
        shippingAddress: { street: '456 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 22222' },
        paymentMethod: 'cod',
        status: 'cancelled'
      },
      {
        orderId: 'ORD-2024-007',
        user: users[1]._id,
        items: [
          { product: hardware[6]._id, productType: 'Hardware', name: hardware[6].name, price: hardware[6].price, quantity: 1 },
          { product: hardware[7]._id, productType: 'Hardware', name: hardware[7].name, price: hardware[7].price, quantity: 2 }
        ],
        totalAmount: hardware[6].price + hardware[7].price * 2,
        shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 11111' },
        paymentMethod: 'online',
        status: 'delivered'
      },
      {
        orderId: 'ORD-2024-008',
        user: users[2]._id,
        items: [
          { product: paints[12]._id, productType: 'Paint', name: paints[12].name, price: paints[12].price, quantity: 4 }
        ],
        totalAmount: paints[12].price * 4,
        shippingAddress: { street: '456 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 22222' },
        paymentMethod: 'cod',
        status: 'shipped'
      },
      {
        orderId: 'ORD-2024-009',
        user: users[1]._id,
        items: [
          { product: paints[7]._id, productType: 'Paint', name: paints[7].name, price: paints[7].price, quantity: 1 },
          { product: hardware[1]._id, productType: 'Hardware', name: hardware[1].name, price: hardware[1].price, quantity: 3 }
        ],
        totalAmount: paints[7].price + hardware[1].price * 3,
        shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 11111' },
        paymentMethod: 'online',
        status: 'confirmed'
      },
      {
        orderId: 'ORD-2024-010',
        user: users[2]._id,
        items: [
          { product: paints[3]._id, productType: 'Paint', name: paints[3].name, price: paints[3].price, quantity: 2 },
          { product: hardware[8]._id, productType: 'Hardware', name: hardware[8].name, price: hardware[8].price, quantity: 1 }
        ],
        totalAmount: paints[3].price * 2 + hardware[8].price,
        shippingAddress: { street: '456 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 22222' },
        paymentMethod: 'cod',
        status: 'pending'
      }
    ]

    await Order.insertMany(sampleOrders)
    console.log(`📦 Created ${sampleOrders.length} sample orders\n`)

    console.log('✅ Database seeded successfully!\n')
    console.log('═══════════════════════════════════════')
    console.log('📊 SEED SUMMARY')
    console.log('═══════════════════════════════════════')
    console.log(`Total Users: ${users.length}`)
    console.log(`Total Paints: ${paints.length} (70+ real products)`)
    console.log(`Total Hardware: ${hardware.length} (45+ real products)`)
    console.log(`Total Orders: ${sampleOrders.length}`)
    console.log('═══════════════════════════════════════')
    console.log('🎨 PAINT BRANDS: Asian Paints, Berger, Shalimar, Nerolac')
    console.log('🔧 HARDWARE BRANDS: Stanley, Bosch, DeWalt, Taparia, Pidilite')
    console.log('═══════════════════════════════════════\n')
    console.log('🔐 LOGIN CREDENTIALS')
    console.log('═══════════════════════════════════════')
    console.log('Admin Account:')
    console.log('  Email: admin@mayurpaints.com')
    console.log('  Password: admin123')
    console.log('\nCustomer Accounts:')
    console.log('  Email: rajesh@example.com')
    console.log('  Password: user123')
    console.log('\n  Email: priya@example.com')
    console.log('  Password: user123')
    console.log('═══════════════════════════════════════\n')

    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB\n')
  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  }
}

seed()
