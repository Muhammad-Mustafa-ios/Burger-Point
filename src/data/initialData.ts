import { Category, Product, RestaurantSettings } from '../types';

export const INITIAL_SETTINGS: RestaurantSettings = {
  id: 'main',
  name: 'Burger Joints',
  tagline: 'Best In Town',
  phone: '0370 0065241',
  email: 'order@burgerjoints.pk',
  address: 'Ghouri Town Phase 5, Crown King Residency, Islamabad, Pakistan',
  openingHours: 'Mon - Sun: 1:00 PM - 3:00 AM (Open late till 3 AM)',
  deliveryFee: 150,
  minDeliveryOrder: 500,
  estimatedDeliveryTime: '30 - 45 mins',
  estimatedPickupTime: '15 - 20 mins',
  isOpen: true,
  acceptedPaymentMethods: ['Cash on Delivery (COD)', 'Easypaisa / JazzCash', 'Online / Card on Delivery'],
  adminEmails: ['4529.muhammad@gmail.com'],
  heroBanners: [
    {
      id: 'hero-1',
      badge: 'BEST IN TOWN',
      title: 'SMASH BURGER &\nGRILL SANDWICH',
      subtitle: 'Bun, crisp ice burg, fresh onions, 2 signature secret sauces, juicy patty & melted cheese.',
      buttonText: 'Order Now',
      buttonLink: 'menu',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
      backgroundColor: '#073B24',
      textColor: '#FFFFFF',
      isActive: true
    },
    {
      id: 'hero-2',
      badge: 'REFRESHING SPECIAL',
      title: 'CHILLED MINT\nMARGARITA - RS. 300',
      subtitle: 'Signature crushed iced mint, fresh lime, fizz & rock salt. The perfect companion to our burgers!',
      buttonText: 'Order Drink',
      buttonLink: 'menu',
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
      backgroundColor: '#0E3B2A',
      textColor: '#FFFFFF',
      isActive: true
    },
    {
      id: 'hero-3',
      badge: 'EXCLUSIVE FEASTS',
      title: 'FAMILY COMBOS &\nPLATTERS FROM RS. 600',
      subtitle: 'Zinger, wings, loaded fries, shawarma, crispy strips and chilled drinks bundled for maximum value.',
      buttonText: 'Explore Deals',
      buttonLink: 'offers',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80',
      backgroundColor: '#1E1B18',
      textColor: '#FFFFFF',
      isActive: true
    }
  ],
  offerBanners: [
    {
      id: 'offer-1',
      badge: 'SPECIAL PLATTERS',
      title: 'ALL PLATTERS AT RS. 1,000',
      subtitle: 'Choose between 6 Wings + Shawarma, 3 Pcs Chicken + Paratha, or Shawarma + Paratha Combos!',
      buttonText: 'Order Platter',
      discountTag: 'RS. 1000',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80',
      backgroundColor: '#EAF4EC',
      isActive: true
    }
  ],
  updatedAt: new Date().toISOString()
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-burgers', name: "Burger's", slug: 'burgers', iconName: 'Beef', sortOrder: 1, isActive: true },
  { id: 'cat-sandwiches', name: 'Sandwich', slug: 'sandwiches', iconName: 'Layers', sortOrder: 2, isActive: true },
  { id: 'cat-starters', name: 'Starter & Fries', slug: 'starters', iconName: 'Flame', sortOrder: 3, isActive: true },
  { id: 'cat-platters', name: "Platter's", slug: 'platters', iconName: 'UtensilsCrossed', sortOrder: 4, isActive: true },
  { id: 'cat-deals', name: "Deal's & Combos", slug: 'deals', iconName: 'Sparkles', sortOrder: 5, isActive: true },
  { id: 'cat-beverages', name: 'Drinks & Beverages', slug: 'beverages', iconName: 'CupSoda', sortOrder: 6, isActive: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  // ================= BURGER'S (Exact from menu) =================
  {
    id: 'prod-smash-burger-single',
    name: 'Smash Burger (Single)',
    description: 'Bun, Ice Burg, Onion, 2 Sauces, Smashed Patty, Cheese.',
    price: 550,
    categoryId: 'cat-burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 380,
    badge: 'BESTSELLER',
    isAvailable: true,
    isPopular: true,
    calories: '650 kcal',
    options: [
      {
        name: 'Cheese Style',
        choices: [
          { label: 'Single Melted Cheddar', price: 0 },
          { label: 'Extra Cheddar Slice', price: 70 },
          { label: 'Jalapenos & Sauce', price: 50 }
        ]
      }
    ]
  },
  {
    id: 'prod-smash-burger-double',
    name: 'Smash Burger (Double)',
    description: 'Bun, Ice Burg, Onion, 2 Sauces, 2 Smashed Patties, Melted Cheese.',
    price: 1000,
    categoryId: 'cat-burgers',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 290,
    badge: "CHEF'S PICK",
    isAvailable: true,
    isPopular: true,
    calories: '980 kcal'
  },
  {
    id: 'prod-grill-burger',
    name: 'Grill Burger',
    description: 'Bun, Ice Burg, Onion, 2 Sauces, Tender Grilled Zinger Fillet.',
    price: 550,
    categoryId: 'cat-burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 310,
    badge: 'POPULAR',
    isAvailable: true,
    isPopular: true,
    calories: '590 kcal'
  },
  {
    id: 'prod-zinger-burger',
    name: 'Zinger Burger',
    description: 'Bun, Ice Burg, Onion, 2 Sauces, Crunchy Fried Crispy Zinger.',
    price: 450,
    categoryId: 'cat-burgers',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 520,
    badge: 'BESTSELLER',
    isAvailable: true,
    isPopular: true,
    calories: '610 kcal',
    options: [
      {
        name: 'Spice Level',
        choices: [
          { label: 'Mild Spicy', price: 0 },
          { label: 'Extra Fiery Hot', price: 30 }
        ]
      },
      {
        name: 'Add-ons',
        choices: [
          { label: 'No Add-on', price: 0 },
          { label: 'Add Cheese Slice', price: 70 }
        ]
      }
    ]
  },
  {
    id: 'prod-mighty-burger',
    name: 'Mighty Burger',
    description: 'Bun, Ice Burg, Onion, 2 Sauces, 2 Zinger Fillets, Melted Cheese.',
    price: 700,
    categoryId: 'cat-burgers',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 410,
    badge: "CHEF'S PICK",
    isAvailable: true,
    isPopular: true,
    calories: '890 kcal'
  },
  {
    id: 'prod-patty-burger',
    name: 'Patty Burger',
    description: 'Bun, Ice Burg, Onion, 2 Sauces, Seasoned Crispy Patty.',
    price: 350,
    categoryId: 'cat-burgers',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 220,
    isAvailable: true,
    calories: '480 kcal'
  },

  // ================= SANDWICH (Exact from menu) =================
  {
    id: 'prod-grill-chicken-sandwich',
    name: 'Grill Chicken Sandwich',
    description: 'Fresh toasted golden bread, tender spiced grilled chicken fillet, fresh lettuce & signature sauces.',
    price: 600,
    categoryId: 'cat-sandwiches',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 240,
    badge: 'BESTSELLER',
    isAvailable: true,
    isPopular: true,
    calories: '520 kcal'
  },
  {
    id: 'prod-club-chicken-sandwich',
    name: 'Club Chicken Sandwich',
    description: 'Traditional club sandwich with seasoned chicken, fried egg, fresh vegetables & creamy mayo.',
    price: 550,
    categoryId: 'cat-sandwiches',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 195,
    badge: 'POPULAR',
    isAvailable: true,
    calories: '580 kcal'
  },

  // ================= STARTERS, WINGS, ROLLS & FRIES (Exact from menu) =================
  {
    id: 'prod-hot-wings',
    name: 'Hot Wings',
    description: 'Crispy fried wings tossed in fiery hot sauce. Available in 6 Pcs or 12 Pcs.',
    price: 400,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 310,
    badge: 'BESTSELLER',
    isAvailable: true,
    isPopular: true,
    calories: '480 kcal',
    options: [
      {
        name: 'Portion Size',
        choices: [
          { label: '6 Pcs Wings (Rs. 400)', price: 0 },
          { label: '12 Pcs Wings (Rs. 800)', price: 400 }
        ]
      }
    ]
  },
  {
    id: 'prod-bbq-wings',
    name: 'BBQ Wings',
    description: 'Crispy chicken wings glazed with smoky barbecue sauce. Available in 6 Pcs or 12 Pcs.',
    price: 450,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1527477321055-43615b6294a5?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 280,
    badge: 'POPULAR',
    isAvailable: true,
    options: [
      {
        name: 'Portion Size',
        choices: [
          { label: '6 Pcs Wings (Rs. 450)', price: 0 },
          { label: '12 Pcs Wings (Rs. 900)', price: 450 }
        ]
      }
    ]
  },
  {
    id: 'prod-crispy-wings',
    name: 'Crispy Wings',
    description: 'Double-battered golden crunchy fried chicken wings. Available in 6 Pcs or 12 Pcs.',
    price: 450,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 270,
    isAvailable: true,
    options: [
      {
        name: 'Portion Size',
        choices: [
          { label: '6 Pcs Wings (Rs. 450)', price: 0 },
          { label: '12 Pcs Wings (Rs. 900)', price: 450 }
        ]
      }
    ]
  },
  {
    id: 'prod-crunchy-piece',
    name: 'Crunchy Piece Fried Chicken',
    description: 'Crunchy battered deep-fried chicken pieces. Available in 3 Pcs or 6 Pcs.',
    price: 500,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 190,
    isAvailable: true,
    options: [
      {
        name: 'Portion Size',
        choices: [
          { label: '3 Pcs Crunchy Piece (Rs. 500)', price: 0 },
          { label: '6 Pcs Crunchy Piece (Rs. 1000)', price: 500 }
        ]
      }
    ]
  },
  {
    id: 'prod-chicken-strip',
    name: 'Chicken Strip (3 Piece with Fries)',
    description: '3 tender boneless chicken strips fried to a crisp golden crunch, served with seasoned fries.',
    price: 500,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 215,
    badge: 'POPULAR',
    isAvailable: true
  },
  {
    id: 'prod-chicken-shawarma',
    name: 'Chicken Shawarma',
    description: 'Marinated spiced chicken shreds wrapped in warm pita bread with special garlic mayo and fresh salad.',
    price: 450,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1648504060862-2432d6657989?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 430,
    badge: 'BESTSELLER',
    isAvailable: true,
    isPopular: true
  },
  {
    id: 'prod-turkish-shawarma',
    name: 'Turkish Shawarma',
    description: 'Authentic Turkish-recipe marinated tender chicken wrapped with seasoned vegetables and house sauce.',
    price: 450,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 180,
    badge: 'NEW',
    isAvailable: true
  },
  {
    id: 'prod-paratha-roll',
    name: 'Paratha Roll',
    description: 'Crispy flaky fried paratha rolled with spiced juicy chicken chunks, chopped onions and tangy chutney.',
    price: 450,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 390,
    badge: 'BESTSELLER',
    isAvailable: true,
    isPopular: true
  },
  {
    id: 'prod-regular-fries',
    name: 'Regular Fries',
    description: 'Crispy golden potato fries seasoned with special house blend salt.',
    price: 350,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 160,
    isAvailable: true
  },
  {
    id: 'prod-family-fries',
    name: 'Family Fries',
    description: 'Large family-sized bucket of hot, crispy golden French fries.',
    price: 600,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 140,
    isAvailable: true
  },
  {
    id: 'prod-bbq-fries',
    name: 'BBQ Fries',
    description: 'French fries tossed in tangy, sweet & smoky BBQ seasoning and sauce.',
    price: 400,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 110,
    isAvailable: true
  },
  {
    id: 'prod-loaded-fries',
    name: 'Loaded Fries',
    description: 'Crispy fries topped with spiced diced chicken, melted cheddar cheese sauce and creamy garlic mayo drizzle.',
    price: 550,
    categoryId: 'cat-starters',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 310,
    badge: 'BESTSELLER',
    isAvailable: true,
    isPopular: true
  },

  // ================= PLATTER'S (Exact from menu) =================
  {
    id: 'prod-special-platter',
    name: 'Special Platter',
    description: '6 Wing, Shawarma, 1 Reg Drink, Fries.',
    price: 1000,
    categoryId: 'cat-platters',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 260,
    badge: "CHEF'S PICK",
    isAvailable: true,
    isPopular: true
  },
  {
    id: 'prod-2person-platter-pieces',
    name: '2 Person Platter (3 Piece Combo)',
    description: '3 Piece Chicken, Paratha, 1 Reg Drink, Fries.',
    price: 1000,
    categoryId: 'cat-platters',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 210,
    badge: 'BESTSELLER',
    isAvailable: true
  },
  {
    id: 'prod-2person-platter-shawarma',
    name: '2 Person Platter (Shawarma Combo)',
    description: '1 Shawarma, 1 Paratha, 1 Reg Drink, Fries.',
    price: 1000,
    categoryId: 'cat-platters',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 230,
    badge: 'BESTSELLER',
    isAvailable: true
  },

  // ================= DEAL,S (Exact from menu) =================
  {
    id: 'deal-1-zinger-combo',
    name: 'Deal 1: Zinger Burger Deal',
    description: '1 Zinger Burger, 1 Regular Drink, 1 Fries.',
    price: 600,
    categoryId: 'cat-deals',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 490,
    badge: 'BESTSELLER',
    isAvailable: true,
    isPopular: true
  },
  {
    id: 'deal-2-chicken-burger-combo',
    name: 'Deal 2: Chicken Burger Deal',
    description: '1 Chicken Burger, 1 Regular Drink, 1 Fries.',
    price: 650,
    categoryId: 'cat-deals',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 190,
    isAvailable: true
  },
  {
    id: 'deal-3-sandwich-combo',
    name: 'Deal 3: Sandwich Deal',
    description: '1 Sandwich, 1 Regular Drink, 1 Fries.',
    price: 700,
    categoryId: 'cat-deals',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 220,
    isAvailable: true
  },
  {
    id: 'deal-4-smash-burger-combo',
    name: 'Deal 4: Smash Burger Deal',
    description: '1 Smash Burger, 1 Regular Drink, 1 Fries.',
    price: 750,
    categoryId: 'cat-deals',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 340,
    badge: 'BESTSELLER',
    isAvailable: true,
    isPopular: true
  },
  {
    id: 'deal-5-mega-platter',
    name: 'Mega Platter Deal (Rs. 2,100)',
    description: '1 Grill Burger, 1 Sandwich, 3 Piece Strip, 1 Paratha Roll, 1 Drink 1.5 Litre.',
    price: 2100,
    categoryId: 'cat-deals',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 180,
    badge: "CHEF'S PICK",
    isAvailable: true
  },
  {
    id: 'deal-6-jumbo-feast',
    name: 'Jumbo Feast Deal (Rs. 2,550)',
    description: '1 Grill Burger, 1 Zinger Burger, 1 Sandwich, 5 Chicken Wing, 1 Shawarma, 1 Drink 1.5 Litre.',
    price: 2550,
    categoryId: 'cat-deals',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 230,
    badge: "CHEF'S PICK",
    isAvailable: true
  },
  {
    id: 'deal-7-zinger-paratha',
    name: 'Duo Deal: Zinger & Paratha (Rs. 1,000)',
    description: '1 Zinger Burger, 1 Paratha Roll, 1 Regular Drink, 1 Fries.',
    price: 1000,
    categoryId: 'cat-deals',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 270,
    badge: 'POPULAR',
    isAvailable: true
  },
  {
    id: 'deal-8-wings-paratha',
    name: 'Duo Deal: Wings & Paratha (Rs. 1,000)',
    description: '6 Wings, 1 Paratha, 1 Regular Drink, 1 Fries.',
    price: 1000,
    categoryId: 'cat-deals',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 215,
    isAvailable: true
  },
  {
    id: 'deal-9-shawarma-strips',
    name: 'Family Deal: Shawarma & Strips (Rs. 1,500)',
    description: '2 Shawarma, 3 Chicken Strip, 1 Regular Drink, 1 Fries.',
    price: 1500,
    categoryId: 'cat-deals',
    image: 'https://images.unsplash.com/photo-1648504060862-2432d6657989?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 310,
    badge: 'BESTSELLER',
    isAvailable: true
  },

  // ================= DRINKS & BEVERAGES =================
  {
    id: 'prod-mint-margarita',
    name: 'Mint Margarita (Special Green Drink)',
    description: 'Signature iced mint slush with fresh garden mint, lemon juice, sugar syrup, carbonated fizz & rock salt.',
    price: 300,
    categoryId: 'cat-beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 420,
    badge: 'BESTSELLER',
    isAvailable: true,
    isPopular: true
  },
  {
    id: 'prod-regular-drink',
    name: 'Regular Cold Drink',
    description: 'Chilled 330ml cold drink. Select Coca-Cola, Sprite, Fanta, or Mountain Dew.',
    price: 120,
    categoryId: 'cat-beverages',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 300,
    isAvailable: true,
    options: [
      {
        name: 'Cold Drink Choice',
        choices: [
          { label: 'Coca-Cola', price: 0 },
          { label: 'Sprite', price: 0 },
          { label: 'Fanta', price: 0 },
          { label: 'Mountain Dew', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'prod-1-5l-drink',
    name: '1.5 Litre Soft Drink Bottle',
    description: 'Chilled party bottle of Coca-Cola, Sprite, or Fanta.',
    price: 250,
    categoryId: 'cat-beverages',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 210,
    isAvailable: true,
    options: [
      {
        name: 'Bottle Flavor',
        choices: [
          { label: 'Coca-Cola 1.5L', price: 0 },
          { label: 'Sprite 1.5L', price: 0 },
          { label: 'Fanta 1.5L', price: 0 }
        ]
      }
    ]
  }
];

export const GOOGLE_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Ahson raza',
    avatar: 'A',
    rating: 5,
    relativeTime: '11 months ago',
    comment: "One of the best in terms of taste, quality and cost. Haven't had a chance to get this much fresh and quality in taste for a while. I didn't knew they were so good at it.",
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Rehman Zafar',
    avatar: 'R',
    rating: 5,
    relativeTime: '11 months ago',
    comment: 'Food was yummy...service bhi bht achi And on time. Order type: Delivery. Arrived steaming hot in Ghauri Town!',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Shahab khalid Malik',
    avatar: 'S',
    rating: 5,
    relativeTime: '7 months ago',
    comment: 'Exceptional smash burgers and crispy chicken wings in Crown King Residency! Super fresh taste and top quality ingredients.',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'Local Foodie Islamabad',
    avatar: 'L',
    rating: 5,
    relativeTime: '2 months ago',
    comment: 'The Mint Margarita and Smash Burger combo is unmatched in Ghauri Town. Truly the Best In Town!',
    verified: true
  }
];
