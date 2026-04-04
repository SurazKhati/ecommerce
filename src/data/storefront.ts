import stove1 from "../assets/images/stove1.jpg";
import stove2 from "../assets/images/stove2.jpg";
import stove3 from "../assets/images/stove3.jpg";
import stove4 from "../assets/images/stove4.png";
import stove5 from "../assets/images/stove5.jpg";
import stove6 from "../assets/images/stove6.jpg";
import stove7 from "../assets/images/stove7.jpg";

export interface CategoryItem {
  _id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  accent: string;
  productCount: number;
  highlights: string[];
}

export interface ProductItem {
  _id: string;
  title: string;
  image: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  category: string;
  rating: number;
  summary: string;
}

export interface HeroSlide {
  _id: string;
  title: string;
  image: string;
  link: string | null;
  eyebrow: string;
  description: string;
  ctaLabel: string;
  ctaLink: string;
  stats: string[];
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    _id: "hero-1",
    title: "Impressive electric burners built for modern kitchens",
    image: stove6,
    link: "/category/electric-stove",
    eyebrow: "Electric burner collection",
    description:
      "Showcase-ready electric burners with bold styling, reliable heating performance, and durable bodies for daily cooking.",
    ctaLabel: "Browse electric burners",
    ctaLink: "/category/electric-stove",
    stats: ["Fast heating", "Premium finish", "Delivery across Nepal"],
  },
  {
    _id: "hero-2",
    title: "High-performance burners with sleek glass design",
    image: stove4,
    link: "/category/premium-cooktops",
    eyebrow: "Premium burner picks",
    description:
      "A more premium showroom look with smooth control panels, cleaner surfaces, and impressive countertop presence.",
    ctaLabel: "Explore premium models",
    ctaLink: "/category/premium-cooktops",
    stats: ["Glass top style", "Modern controls", "Elegant presentation"],
  },
  {
    _id: "hero-3",
    title: "Commercial electric burners ready for serious daily use",
    image: stove7,
    link: "/category/commercial-burners",
    eyebrow: "Heavy duty burners",
    description:
      "Designed for busy food businesses and demanding kitchens where steady heat, stronger build quality, and long use matter.",
    ctaLabel: "See commercial range",
    ctaLink: "/category/commercial-burners",
    stats: ["Strong output", "Business ready", "Support included"],
  },
];

export const CATEGORIES: CategoryItem[] = [
  {
    _id: "electric-stove",
    title: "Electric stove",
    slug: "/category/electric-stove",
    image: stove6,
    description:
      "Dependable countertop electric models with steady heating, simple knobs, and family-friendly durability.",
    accent: "For home kitchens",
    productCount: 7,
    highlights: ["Easy heat control", "Budget friendly", "Long-lasting body"],
  },
  {
    _id: "induction-stove",
    title: "Induction stove",
    slug: "/category/induction-stove",
    image: stove3,
    description:
      "High-efficiency induction cookers with touch panels, faster boiling, and cleaner cooking surfaces.",
    accent: "Fast and efficient",
    productCount: 5,
    highlights: ["Quick response", "Less heat loss", "Safer for families"],
  },
  {
    _id: "premium-cooktops",
    title: "Premium cooktops",
    slug: "/category/premium-cooktops",
    image: stove4,
    description:
      "Stylish premium stoves designed for modern interiors, showroom kitchens, and gift-worthy upgrades.",
    accent: "Premium finish",
    productCount: 4,
    highlights: ["Elegant design", "Modern control panel", "Top-tier finishing"],
  },
  {
    _id: "commercial-burners",
    title: "Commercial burners",
    slug: "/category/commercial-burners",
    image: stove7,
    description:
      "Heavy-duty cooking units for cafes, hostels, and small food businesses that need consistent output.",
    accent: "Business ready",
    productCount: 3,
    highlights: ["High output", "Stable frame", "Built for daily demand"],
  },
];

export const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  "/category/electric-stove": stove6,
  "/category/induction-stove": stove3,
  "/category/premium-cooktops": stove4,
  "/category/commercial-burners": stove7,
};

export const FEATURED_PRODUCTS: ProductItem[] = [
  {
    _id: "1",
    price: "15,999",
    oldPrice: "17,500",
    title: "NovaHeat Electric Stove 1800W",
    image: stove1,
    badge: "Best value",
    category: "Electric stove",
    rating: 4.8,
    summary: "Compact electric cooker with fast warm-up and reliable steel body.",
  },
  {
    _id: "2",
    price: "16,999",
    oldPrice: "18,900",
    title: "SmartCook Induction Plate",
    image: stove2,
    badge: "Top rated",
    category: "Induction stove",
    rating: 4.9,
    summary: "Touch panel induction stove ideal for quick and efficient family meals.",
  },
  {
    _id: "3",
    price: "17,499",
    oldPrice: "19,200",
    title: "QuickFlame Ceramic Cooker",
    image: stove3,
    badge: "New arrival",
    category: "Induction stove",
    rating: 4.7,
    summary: "Elegant ceramic top with precise heat stages and easy cleaning.",
  },
  {
    _id: "4",
    price: "18,499",
    oldPrice: "20,500",
    title: "EliteGlass Premium Cooktop",
    image: stove4,
    badge: "Premium",
    category: "Premium cooktops",
    rating: 4.9,
    summary: "Premium glass-finish cooktop built for stylish and modern kitchens.",
  },
  {
    _id: "5",
    price: "19,000",
    oldPrice: "21,000",
    title: "DailyChef Double Burner",
    image: stove5,
    badge: "Popular",
    category: "Electric stove",
    rating: 4.6,
    summary: "Balanced two-burner setup for busy households and regular cooking.",
  },
  {
    _id: "6",
    price: "20,500",
    oldPrice: "22,800",
    title: "PowerPlate Pro Stove",
    image: stove6,
    badge: "Heavy duty",
    category: "Commercial burners",
    rating: 4.8,
    summary: "Strong performance stove for frequent cooking with dependable heating.",
  },
  {
    _id: "7",
    price: "21,999",
    oldPrice: "24,000",
    title: "ChefMaster Business Burner",
    image: stove7,
    badge: "Commercial",
    category: "Commercial burners",
    rating: 4.7,
    summary: "High-capacity burner built for cafes, canteens, and demanding kitchens.",
  },
  {
    _id: "8",
    price: "22,499",
    oldPrice: "24,900",
    title: "UrbanGlow Touch Induction",
    image: stove2,
    badge: "Hot deal",
    category: "Induction stove",
    rating: 4.8,
    summary: "Slim induction model with responsive touch interface and safety lock.",
  },
];

export const getFeaturedProductById = (id?: string) =>
  FEATURED_PRODUCTS.find((product) => product._id === id);

export const getCategoryBySlug = (slug?: string) =>
  CATEGORIES.find((category) => category.slug === `/category/${slug}`);
