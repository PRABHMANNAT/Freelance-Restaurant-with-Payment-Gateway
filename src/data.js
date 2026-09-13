const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;
export const photos = {
  logo: asset("brand-logo.jpg"),
  hero: asset("022214.webp"),
  story: asset("022258.webp"),
  wrap: asset("022017.webp"),
  pizza: asset("022124.webp"),
  drink: asset("022206.webp"),
};
export const restaurant = {
  name: "Kale Da Dhaba",
  tagline: "Taste you trust.",
  instagram: "https://www.instagram.com/kaledadhaba/",
  location: "Amritsar",
  services: "Dine in · Takeaway · Delivery",
  visit: {
    address: "Address awaiting owner verification",
    phone: "Phone number awaiting owner verification",
    hours: "Opening hours awaiting owner verification",
  },
  authoring: {
    pendingVerification: [
      "Address, phone number and opening hours",
      "Founding-year claim and extended history",
      "Production menu, pricing and testimonials",
    ],
    demoDisclosure:
      "Demo content only. Please verify restaurant details before publishing.",
  },
  about: {
    interimIntroduction:
      "Kale Da Dhaba brings Punjabi favourites to the table in Amritsar. The restaurant’s history and kitchen details are being confirmed with the owner.",
    factualHistory: null,
    ownerQuote: null,
  },
  menuDisclosure:
    "Demo menu: dish names, descriptions, prices and photography await owner verification.",
  story:
    "From comforting Punjabi classics to the joy of sharing a meal, Kale Da Dhaba is about food that brings people together. Rich gravies, warm breads, and a generous helping of hospitality — there’s always a little more love at our table.",
  storyNote:
    "Extended story is editable demo copy and awaits owner verification.",
};
export const categories = [
  "All dishes",
  "Starters",
  "Main Course",
  "Breads",
  "Rice",
  "Beverages",
  "Desserts",
];
export const menu = [
  {
    id: "dal",
    name: "Dal Makhani",
    description:
      "Slow-simmered black lentils, cream, and a generous swirl of butter.",
    price: 260,
    category: "Main Course",
    veg: true,
    image: "022250.webp",
    tag: "House favourite",
  },
  {
    id: "paneer",
    name: "Paneer Lababdar",
    description:
      "Soft paneer in a rich tomato gravy with warming Punjabi spices.",
    price: 320,
    category: "Main Course",
    veg: true,
    image: "022243.webp",
    tag: "Must try",
  },
  {
    id: "chicken",
    name: "Butter Chicken",
    description: "Tender chicken in a velvety tomato, butter, and cream sauce.",
    price: 380,
    category: "Main Course",
    veg: false,
    image: "022144.webp",
    tag: "Comfort classic",
  },
  {
    id: "naan",
    name: "Garlic Butter Naan",
    description:
      "Tandoor-baked bread brushed with garlic butter and fresh coriander.",
    price: 70,
    category: "Breads",
    veg: true,
    image: "022137.webp",
    tag: "The perfect pairing",
  },
  {
    id: "rolls",
    name: "Crispy Cigar Rolls",
    description: "Golden, crunchy vegetable rolls with a sweet chilli dip.",
    price: 240,
    category: "Starters",
    veg: true,
    image: "022118.webp",
  },
  {
    id: "wrap",
    name: "Paneer Tikka Wrap",
    description:
      "Smoky paneer, crunchy vegetables, and a little tang, all wrapped up.",
    price: 220,
    category: "Starters",
    veg: true,
    image: "022017.webp",
  },
  {
    id: "chicken-wrap",
    name: "Chicken Tikka Wrap",
    description: "Spiced chicken, fresh onion, and creamy mint dressing.",
    price: 260,
    category: "Starters",
    veg: false,
    image: "022024.webp",
  },
  {
    id: "mushroom",
    name: "Mushroom Masala",
    description: "Tender mushrooms and aromatic spices in a homestyle masala.",
    price: 290,
    category: "Main Course",
    veg: true,
    image: "022223.webp",
  },
  {
    id: "kulcha",
    name: "Amritsari Kulcha",
    description:
      "A crisp, stuffed kulcha, finished with butter and served with chole.",
    price: 160,
    category: "Breads",
    veg: true,
    image: "022258.webp",
  },
  {
    id: "rice",
    name: "Jeera Rice",
    description: "Fluffy basmati rice tempered with cumin and a touch of ghee.",
    price: 180,
    category: "Rice",
    veg: true,
    image: "rice.jpg",
  },
  {
    id: "biryani",
    name: "Chicken Biryani",
    description:
      "Fragrant basmati, spiced chicken, and herbs, served with raita.",
    price: 340,
    category: "Rice",
    veg: false,
    image: "biryani.jpg",
  },
  {
    id: "cooler",
    name: "Watermelon Cooler",
    description:
      "Watermelon, fresh mint, and lime for a refreshing little pause.",
    price: 150,
    category: "Beverages",
    veg: true,
    image: "022037.webp",
  },
  {
    id: "mojito",
    name: "Blue Lagoon Mojito",
    description:
      "A sparkling, alcohol-free mix of citrus, mint, and blue curaçao syrup.",
    price: 160,
    category: "Beverages",
    veg: true,
    image: "022206.webp",
  },
  {
    id: "jamun",
    name: "Gulab Jamun",
    description: "Two soft milk dumplings soaked in fragrant cardamom syrup.",
    price: 120,
    category: "Desserts",
    veg: true,
    image: "jamun.jpg",
  },
  {
    id: "pizza",
    name: "Overloaded Cheese Pizza",
    description:
      "A golden crust, melty mozzarella, and colourful vegetable toppings.",
    price: 340,
    category: "Starters",
    veg: true,
    image: "022124.webp",
  },
  {
    id: "pasta",
    name: "Creamy White Sauce Pasta",
    description: "Comforting pasta tossed in a creamy sauce with garlic toast.",
    price: 280,
    category: "Main Course",
    veg: true,
    image: "022201.webp",
  },
].map((d) => ({ ...d, image: asset(d.image) }));
export const sampleReviews = [
  {
    id: "s1",
    name: "Simran K.",
    rating: 5,
    text: "The dal makhani and garlic naan are the kind of comfort food you keep coming back for. Every bite feels like home.",
    sample: true,
  },
  {
    id: "s2",
    name: "Arjun S.",
    rating: 5,
    text: "A proper Punjabi feast! Rich flavours, generous portions, and something for everyone at the table.",
    sample: true,
  },
  {
    id: "s3",
    name: "Mehak R.",
    rating: 4,
    text: "Loved the creamy paneer and those crispy cigar rolls. The perfect pick for a relaxed family dinner.",
    sample: true,
  },
];
