import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  ChevronDown,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Heart,
  Snowflake,
  Dog,
} from "lucide-react";

// MUI Icons (shared with admin & icon selector)
import HomeIcon from '@mui/icons-material/Home';
import DevicesIcon from '@mui/icons-material/Devices';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PetsIcon from '@mui/icons-material/Pets';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SpaIcon from "@mui/icons-material/Spa";
import ToysIcon from "@mui/icons-material/Toys";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import YardIcon from "@mui/icons-material/Yard";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import DiamondIcon from "@mui/icons-material/Diamond";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import BuildIcon from "@mui/icons-material/Build";
import LuggageIcon from "@mui/icons-material/Luggage";

import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowRightIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SavingsIcon from '@mui/icons-material/Savings';

import { getIconSvg } from "@/shared/constants/categoryIcons";
import { motion, useScroll, useTransform } from "framer-motion";
import { customerApi } from "../services/customerApi";
import { toast } from "sonner";
import ProductCard from "../components/shared/ProductCard";
import MainLocationHeader from "../components/shared/MainLocationHeader";
import { useProductDetail } from "../context/ProductDetailContext";
import { cn } from "@/lib/utils";
import CardBanner from "@/assets/CardBanner.jpg";
import SectionRenderer from "../components/experience/SectionRenderer";

const DEFAULT_CATEGORY_THEME = {
  gradient: "linear-gradient(to bottom, #25D366, #4ADE80)",
  shadow: "shadow-green-500/20",
  accent: "text-[#1A1A1A]",
};

const CATEGORY_METADATA = {
  All: {
    icon: HomeIcon,
    theme: DEFAULT_CATEGORY_THEME,
    banner: {
      title: "HOUSEFULL",
      subtitle: "SALE",
      floatingElements: "sparkles",
    },
  },
  Grocery: {
    icon: LocalGroceryStoreIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #FF9F1C, #FFBF69)",
      shadow: "shadow-orange-500/20",
      accent: "text-orange-900",
    },
    banner: {
      title: "SUPERSAVER",
      subtitle: "FRESH & FAST",
      floatingElements: "leaves",
    },
  },
  Wedding: {
    icon: CardGiftcardIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #FF4D6D, #FF8FA3)",
      shadow: "shadow-rose-500/20",
      accent: "text-rose-900",
    },
    banner: { title: "WEDDING", subtitle: "BLISS", floatingElements: "hearts" },
  },
  "Home & Kitchen": {
    icon: KitchenIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #BC6C25, #DDA15E)",
      shadow: "shadow-amber-500/20",
      accent: "text-amber-900",
    },
    banner: { title: "HOME", subtitle: "KITCHEN", floatingElements: "smoke" },
  },
  Electronics: {
    icon: DevicesIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #7209B7, #B5179E)",
      shadow: "shadow-purple-500/20",
      accent: "text-purple-900",
    },
    banner: {
      title: "TECH FEST",
      subtitle: "GADGETS",
      floatingElements: "tech",
    },
  },
  Kids: {
    icon: ChildCareIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #4CC9F0, #A0E7E5)",
      shadow: "shadow-blue-500/20",
      accent: "text-blue-900",
    },
    banner: {
      title: "LITTLE ONE",
      subtitle: "CARE",
      floatingElements: "bubbles",
    },
  },
  "Pet Supplies": {
    icon: PetsIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #FB8500, #FFB703)",
      shadow: "shadow-yellow-500/20",
      accent: "text-yellow-900",
    },
    banner: { title: "PAWSOME", subtitle: "DEALS", floatingElements: "bones" },
  },
  Sports: {
    icon: SportsSoccerIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #4361EE, #4895EF)",
      shadow: "shadow-indigo-500/20",
      accent: "text-indigo-900",
    },
    banner: { title: "SPORTS", subtitle: "GEAR", floatingElements: "confetti" },
  },
};

const ALL_CATEGORY = {
  id: "all",
  _id: "all",
  name: "All",
  icon: HomeIcon,
  theme: DEFAULT_CATEGORY_THEME,
  banner: {
    title: "HOUSEFULL",
    subtitle: "SALE",
    floatingElements: "sparkles",
    textColor: "text-white",
  },
};

const categories = [
  {
    id: 1,
    name: "All",
    icon: HomeIcon,
    theme: DEFAULT_CATEGORY_THEME,
    banner: {
      title: "HOUSEFULL",
      subtitle: "SALE",
      floatingElements: "sparkles",
      textColor: "text-white",
    },
  },
  {
    id: 5,
    name: "Electronics",
    icon: DevicesIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #7209B7, #B5179E)",
      shadow: "shadow-purple-500/20",
      accent: "text-purple-900",
    },
    banner: {
      title: "TECH FEST",
      subtitle: "GADGETS",
      floatingElements: "tech",
      textColor: "text-white",
    },
  },
  {
    id: 2,
    name: "Grocery",
    icon: LocalGroceryStoreIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #FF9F1C, #FFBF69)",
      shadow: "shadow-orange-500/20",
      accent: "text-orange-900",
    },
    banner: {
      title: "SUPERSAVER",
      subtitle: "FRESH & FAST",
      floatingElements: "leaves",
      textColor: "text-white",
    },
  },
  {
    id: 10,
    name: "Home & Kitchen",
    icon: KitchenIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #BC6C25, #DDA15E)",
      shadow: "shadow-amber-500/20",
      accent: "text-amber-900",
    },
    banner: { title: "HOME", subtitle: "KITCHEN", floatingElements: "smoke", textColor: "text-white" },
  },
  {
    id: 7,
    name: "Kids",
    icon: ChildCareIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #4CC9F0, #A0E7E5)",
      shadow: "shadow-blue-500/20",
      accent: "text-blue-900",
    },
    banner: {
      title: "LITTLE ONE",
      subtitle: "CARE",
      floatingElements: "bubbles",
      textColor: "text-white",
    },
  },
  {
    id: 8,
    name: "Pet Supplies",
    icon: PetsIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #FB8500, #FFB703)",
      shadow: "shadow-yellow-500/20",
      accent: "text-yellow-900",
    },
    banner: { title: "PAWSOME", subtitle: "DEALS", floatingElements: "bones", textColor: "text-white" },
  },
  {
    id: 11,
    name: "Sports",
    icon: SportsSoccerIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #4361EE, #4895EF)",
      shadow: "shadow-indigo-500/20",
      accent: "text-indigo-900",
    },
    banner: { title: "SPORTS", subtitle: "GEAR", floatingElements: "confetti", textColor: "text-white" },
  },
  {
    id: 3,
    name: "Wedding",
    icon: CardGiftcardIcon,
    theme: {
      gradient: "linear-gradient(to bottom, #FF4D6D, #FF8FA3)",
      shadow: "shadow-rose-500/20",
      accent: "text-rose-900",
    },
    banner: {
      title: "WEDDING",
      subtitle: "BLISS",
      floatingElements: "hearts",
      textColor: "text-white",
    },
  },
];

// Map icon ids saved from admin/category icon selector to MUI icons
const ICON_COMPONENTS = {
  electronics: DevicesIcon,
  fashion: CheckroomIcon,
  home: HomeIcon,
  food: LocalCafeIcon,
  sports: SportsSoccerIcon,
  books: MenuBookIcon,
  beauty: SpaIcon,
  toys: ToysIcon,
  automotive: DirectionsCarIcon,
  pets: PetsIcon,
  health: LocalHospitalIcon,
  garden: YardIcon,
  office: BusinessCenterIcon,
  music: MusicNoteIcon,
  jewelry: DiamondIcon,
  baby: ChildCareIcon,
  tools: BuildIcon,
  luggage: LuggageIcon,
  art: ColorLensIcon,
  grocery: LocalGroceryStoreIcon,
};

const bestsellerCategories = [
  {
    id: 1,
    name: "Chips & Namkeen",
    images: [
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1599490659223-e1539e76926a?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1621444541669-451006c1103d?auto=format&fit=crop&q=80&w=200&h=200",
    ],
  },
  {
    id: 2,
    name: "Bakery & Biscuits",
    images: [
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1581339399838-2a120c18bba3?auto=format&fit=crop&q=80&w=200&h=200",
    ],
  },
  {
    id: 3,
    name: "Vegetable & Fruits",
    images: [
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1518843025960-d70213740685?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=200&h=200",
    ],
  },
  {
    id: 4,
    name: "Oil, Ghee & Masala",
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1596797038558-9c50f16ee64b?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?auto=format&fit=crop&q=80&w=200&h=200",
    ],
  },
  {
    id: 5,
    name: "Sweet & Chocolates",
    images: [
      "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1526081347589-7fa3cb419ee7?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1542841791-192d99906b27?auto=format&fit=crop&q=80&w=200&h=200",
    ],
  },
  {
    id: 6,
    name: "Drinks & Juices",
    images: [
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1625772290748-39126cdd9fe9?auto=format&fit=crop&q=80&w=200&h=200",
      "https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80&w=200&h=200",
    ],
  },
];

const Home = () => {
  const { scrollY } = useScroll();
  const { isOpen: isProductDetailOpen } = useProductDetail();
  const navigate = useNavigate();
  const quickCatsRef = useRef(null);

  const [categories, setCategories] = useState([ALL_CATEGORY]);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [products, setProducts] = useState([]);
  const [quickCategories, setQuickCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [experienceSections, setExperienceSections] = useState([]);
  const [headerSections, setHeaderSections] = useState([]);
  const [mobileBannerIndex, setMobileBannerIndex] = useState(0);
  const [isInstantBannerJump, setIsInstantBannerJump] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});
  const [subcategoryMap, setSubcategoryMap] = useState({});
  const [pendingReturn, setPendingReturn] = useState(null);

  const scrollQuickCats = (direction) => {
    if (quickCatsRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      quickCatsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Read stored return context (header + section) when Home mounts
  useEffect(() => {
    const stored = window.sessionStorage.getItem("experienceReturn");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (parsed && (parsed.headerId || parsed.sectionId)) {
        setPendingReturn(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, prodRes, expRes] = await Promise.all([
        customerApi.getCategories(),
        customerApi.getProducts({ limit: 20 }),
        customerApi.getExperienceSections({ pageType: "home" }).catch(() => null),
      ]);

      if (catRes.data.success) {
        const dbCats = catRes.data.results || catRes.data.result || [];

        // Build lookup maps for categories & subcategories (used by SectionRenderer)
        const catMap = {};
        const subMap = {};
        dbCats.forEach((c) => {
          if (c.type === "category") {
            catMap[c._id] = c;
          } else if (c.type === "subcategory") {
            subMap[c._id] = c;
          }
        });
        setCategoryMap(catMap);
        setSubcategoryMap(subMap);

        // 1. Process Header Categories (Main Navigation)
        const formattedHeaders = dbCats
          .filter((cat) => cat.type === "header")
          .map((cat) => {
            const catName = cat.name;

            // Theme / banner still come from local metadata for now
            const meta =
              CATEGORY_METADATA[catName] ||
              CATEGORY_METADATA[
                catName.charAt(0).toUpperCase() + catName.slice(1).toLowerCase()
              ] ||
              CATEGORY_METADATA[catName.toUpperCase()] || {
                icon: Sparkles,
                theme: DEFAULT_CATEGORY_THEME,
                banner: {
                  title: catName.toUpperCase(),
                  subtitle: "TOP PICKS",
                  floatingElements: "sparkles",
                },
              };

            // Icon is fully driven by admin-chosen iconId, mapped to MUI
            const IconComp =
              (cat.iconId && ICON_COMPONENTS[cat.iconId]) || meta.icon || Sparkles;

            return {
              ...cat,
              id: cat._id,
              iconId: cat.iconId,
              icon: IconComp,
              theme: meta.theme,
              headerColor: cat.headerColor || null,
              banner: { ...meta.banner, textColor: "text-white" },
            };
          });
        setCategories([ALL_CATEGORY, ...formattedHeaders]);

        // If we have a stored header to restore (coming back from a category page), set it
        if (pendingReturn?.headerId) {
          const match = formattedHeaders.find((h) => h._id === pendingReturn.headerId);
          if (match) {
            setActiveCategory(match);
          }
        }

        // 2. Process Quick Navigation Categories (Horizontal Scroll)
        const formattedQuickCats = dbCats
          .filter(cat => cat.type === "category")
          .map(cat => ({
            id: cat._id,
            name: cat.name,
            image: cat.image || 'https://cdn-icons-png.flaticon.com/128/2321/2321831.png'
          }));
        setQuickCategories(formattedQuickCats);
      }

      if (prodRes.data.success) {
        const rawResult = prodRes.data.result;
        const dbProds = Array.isArray(prodRes.data.results)
          ? prodRes.data.results
          : Array.isArray(rawResult?.items)
          ? rawResult.items
          : Array.isArray(rawResult)
          ? rawResult
          : [];

        const formattedProds = dbProds.map((p) => ({
          ...p,
          id: p._id,
          image:
            p.mainImage ||
            p.image ||
            "https://images.unsplash.com/photo-1550989460-0adf9ea622e2",
          price: p.salePrice || p.price,
          originalPrice: p.price,
          weight: p.weight || "1 unit",
          deliveryTime: "8-15 mins",
        }));
        setProducts(formattedProds);
      }

      if (expRes && expRes.data && expRes.data.success) {
        const raw = expRes.data.result || expRes.data.results || expRes.data;
        setExperienceSections(Array.isArray(raw) ? raw : []);
      } else {
        setExperienceSections([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // toast.error("Failed to load content");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pendingReturn]);

  // Fetch header-specific experience sections when active header category changes
  useEffect(() => {
    const fetchHeaderSections = async () => {
      if (!activeCategory || activeCategory._id === "all") {
        setHeaderSections([]);
        return;
      }
      try {
        const res = await customerApi.getExperienceSections({
          pageType: "header",
          headerId: activeCategory._id,
        });
        if (res.data.success) {
          const raw = res.data.result || res.data.results || res.data;
          setHeaderSections(Array.isArray(raw) ? raw : []);
        } else {
          setHeaderSections([]);
        }
      } catch (e) {
        console.error("Error fetching header experience sections:", e);
        setHeaderSections([]);
      }
    };

    fetchHeaderSections();
  }, [activeCategory]);

  // Autoplay for Mobile Banner Carousel (smooth, one-direction loop)
  useEffect(() => {
    const totalSlides = 3; // keep in sync with rendered slides
    const intervalId = setInterval(() => {
      setMobileBannerIndex((prev) => {
        // Prevent index from growing unbounded (which would push banners off-screen)
        if (prev >= totalSlides - 1) return prev;
        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(intervalId);
  }, []);

  // After an instant jump back to first slide, re‑enable transition
  useEffect(() => {
    if (!isInstantBannerJump) return;
    const id = requestAnimationFrame(() => setIsInstantBannerJump(false));
    return () => cancelAnimationFrame(id);
  }, [isInstantBannerJump]);

  const handleBannerTransitionEnd = () => {
    const totalSlides = 3; // real1, real2, clone(real1)
    if (mobileBannerIndex === totalSlides - 1) {
      // Instantly jump back to the first slide without any reverse animation
      setIsInstantBannerJump(true);
      setMobileBannerIndex(0);
    }
  };

  const bestsellerCategories = useMemo(() => {
    // Group products by category and take top 4 images for each
    const grouped = {};
    products.forEach((p) => {
      const catId = p.categoryId?._id || "other";
      const catName = p.categoryId?.name || "Other";
      if (!grouped[catId]) {
        grouped[catId] = { id: catId, name: catName, images: [] };
      }
      if (grouped[catId].images.length < 4) {
        grouped[catId].images.push(p.image);
      }
    });
    return Object.values(grouped).slice(0, 6);
  }, [products]);

  const productsById = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p._id || p.id] = p;
    });
    return map;
  }, [products]);

  // Fade out banner as user scrolls (0 to 100px)
  // Parallax effect for banner - moves slower than scroll
  const opacity = useTransform(scrollY, [0, 300], [1, 0.6]);
  const y = useTransform(scrollY, [0, 300], [0, 80]); // Positive Y moves down as we scroll up = Parallax
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const pointerEvents = useTransform(scrollY, [0, 100], ["auto", "none"]);
  // When returning from a category page, scroll back to the section that was clicked
  useEffect(() => {
    if (!pendingReturn?.sectionId) return;

    const allSections = headerSections.length ? headerSections : experienceSections;
    if (!allSections.length) return;

    const exists = allSections.some((s) => s._id === pendingReturn.sectionId);
    if (!exists) return;

    const id = `section-${pendingReturn.sectionId}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "instant", block: "start" });
      window.sessionStorage.removeItem("experienceReturn");
      setPendingReturn(null);
    }
  }, [headerSections, experienceSections, pendingReturn]);

  // Helper to render dynamic floating elements
  const renderFloatingElements = (type) => {
    const count = 10; // Optimized count for performance

    const getParticleContent = (index) => {
      switch (type) {
        case "hearts":
          return <Heart fill="white" size={12 + (index % 5) * 2} className="drop-shadow-sm" />;
        case "snow":
          return <Snowflake fill="white" size={10 + (index % 4) * 3} className="drop-shadow-sm" />;
        case "stars":
        case "sparkles":
          return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="drop-shadow-md">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          );
        default:
          return (
            <div
              className="bg-white/40 rounded-full blur-[1px]"
              style={{ width: 4 + (index % 3) * 3, height: 4 + (index % 3) * 3 }}
            />
          );
      }
    };

    return [...Array(count)].map((_, i) => {
      const duration = 15 + Math.random() * 20;
      const delay = Math.random() * -20;
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const depth = 0.5 + Math.random() * 0.5; // Parallax depth

      return (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${startX}%`,
            top: `${startY}%`,
            opacity: 0.1 * depth,
            zIndex: Math.floor(depth * 10),
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -100, -50, 0],
            rotate: [0, 360],
            scale: [depth, depth * 1.2, depth],
          }}
          transition={{
            duration: duration / depth,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay,
          }}>
          <div className="transform-gpu">
            {getParticleContent(i)}
          </div>
        </motion.div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7F8] pt-[240px] md:pt-[250px]">
      {/* Top Dynamic Gradient Section */}
      <div className={cn("contents", isProductDetailOpen && "hidden md:contents")}>
        <MainLocationHeader
          categories={categories}
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
        />
      </div>

      {/* Hero Banners (mobile + desktop) */}
      <>
      {/* Mobile Banner Carousel / Static hero */}
      <div className="block md:hidden mb-10">
          <div className="container mx-auto px-4">
            <div className="relative w-full overflow-hidden">
              <div
                className={cn(
                  "flex",
                  !isInstantBannerJump && "transition-transform duration-500 ease-out"
                )}
                style={{ transform: `translateX(-${mobileBannerIndex * 100}%)` }}
                onTransitionEnd={handleBannerTransitionEnd}
              >
                {/* existing static banners fallback */}
                <motion.div
                  onClick={() => navigate('/category/all')}
                  whileTap={{ scale: 0.96 }}
                  className="min-w-full flex justify-center"
                >
                  <div className="w-[85vw] h-[190px] bg-[#E6F5EC] rounded-[2rem] p-6 relative overflow-hidden flex items-center border border-[#0c831f]/10 shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
                    <div className="relative z-10 w-3/5 flex flex-col items-start gap-2">
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-2xl font-[1000] text-[#1A1A1A] tracking-tighter leading-none">
                          Get <span className="text-[#0c831f]">Products</span>
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-sm font-black text-gray-700">at</span>
                          <div className="bg-[#0c831f] text-white px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                            <VerifiedIcon sx={{ fontSize: 16 }} />
                            <span className="text-xl font-[1000]">₹0</span>
                          </div>
                          <span className="text-sm font-[1000] text-gray-700">Fee</span>
                        </div>
                      </div>
                      <p className="text-[11px] font-bold text-gray-500 max-w-[150px] leading-tight">
                        Get groceries delivered in minutes
                      </p>
                      <button className="bg-[#FF1E56] text-white px-6 py-2.5 rounded-2xl font-black text-xs tracking-wide shadow-lg shadow-rose-200 mt-2">
                        Order now
                      </button>
                    </div>

                    <div className="absolute right-[-10px] bottom-0 top-0 w-2/5 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"
                        alt="Promo"
                        className="w-full h-full object-contain rotate-3 scale-110"
                      />
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#0c831f]/5 rounded-full blur-2xl -mt-12 -mr-12" />
                  </div>
                </motion.div>

                <motion.div
                  onClick={() => navigate('/categories')}
                  whileTap={{ scale: 0.96 }}
                  className="min-w-full flex justify-center"
                >
                  <div className="w-[85vw] h-[190px] bg-white rounded-[2rem] relative overflow-hidden flex border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.05)] group">
                    <img
                      src={CardBanner}
                      alt="Promotion"
                      className="w-full h-full object-fill"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent pointer-events-none" />
                  </div>
                </motion.div>

                <motion.div
                  onClick={() => navigate('/category/all')}
                  whileTap={{ scale: 0.96 }}
                  className="min-w-full flex justify-center"
                >
                  <div className="w-[85vw] h-[190px] bg-[#E6F5EC] rounded-[2rem] p-6 relative overflow-hidden flex items-center border border-[#0c831f]/10 shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
                    <div className="relative z-10 w-3/5 flex flex-col items-start gap-2">
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-2xl font-[1000] text-[#1A1A1A] tracking-tighter leading-none">
                          Get <span className="text-[#0c831f]">Products</span>
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-sm font-black text-gray-700">at</span>
                          <div className="bg-[#0c831f] text-white px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                            <VerifiedIcon sx={{ fontSize: 16 }} />
                            <span className="text-xl font-[1000]">₹0</span>
                          </div>
                          <span className="text-sm font-[1000] text-gray-700">Fee</span>
                        </div>
                      </div>
                      <p className="text-[11px] font-bold text-gray-500 max-w-[150px] leading-tight">
                        Get groceries delivered in minutes
                      </p>
                      <button className="bg-[#FF1E56] text-white px-6 py-2.5 rounded-2xl font-black text-xs tracking-wide shadow-lg shadow-rose-200 mt-2">
                        Order now
                      </button>
                    </div>

                    <div className="absolute right-[-10px] bottom-0 top-0 w-2/5 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"
                        alt="Promo"
                        className="w-full h-full object-contain rotate-3 scale-110"
                      />
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#0c831f]/5 rounded-full blur-2xl -mt-12 -mr-12" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </>


      {/* Quick Navigation Category Slider */}
      {quickCategories.length > 0 && (
        <div className="container mx-auto px-4 md:px-8 lg:px-[50px] mb-8 mt-4 overflow-hidden relative group">
          {/* Left Scroll Button */}
          <div className="absolute left-4 lg:left-10 top-1/2 -translate-y-[45px] z-20 hidden md:flex">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollQuickCats('left')}
              className="h-10 w-10 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center border border-gray-100 cursor-pointer hover:bg-white text-[#0c831f] transition-all"
            >
              <ChevronLeft size={22} strokeWidth={3} />
            </motion.button>
          </div>

          <div
            ref={quickCatsRef}
            className="flex items-start gap-2.5 md:gap-4 lg:gap-6 overflow-x-auto no-scrollbar py-2 px-1 snap-x scroll-smooth"
          >
            {quickCategories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="flex flex-col items-center gap-1.5 min-w-[75px] md:min-w-[110px] lg:min-w-[120px] cursor-pointer group/item snap-start"
              >
                <div className="w-[70px] h-[70px] md:w-[85px] md:h-[85px] lg:w-[105px] lg:h-[105px] rounded-2xl bg-[#F8F9FA] shadow-sm border border-gray-100 flex items-center justify-center p-2 transition-all group-hover/item:shadow-md group-hover/item:bg-white overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover/item:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] lg:text-[12px] font-bold text-gray-700 text-center leading-tight line-clamp-2 max-w-[70px] md:max-w-full group-hover/item:text-[#0c831f] transition-colors">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Right Scroll Button */}
          <div className="absolute right-4 lg:right-10 top-1/2 -translate-y-[45px] z-20 hidden md:flex">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollQuickCats('right')}
              className="h-10 w-10 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center border border-gray-100 cursor-pointer hover:bg-white text-[#0c831f] transition-all"
            >
              <ChevronRight size={22} strokeWidth={3} />
            </motion.button>
          </div>
        </div>
      )}







      {/* Lowest Price ever Section  (kept as static for now) */}
      <div className="mt-8 mb-4 md:mt-12 md:mb-8">
        <div className="relative overflow-hidden bg-linear-to-br from-[#0c831f]/10 via-[#0c831f]/5 to-transparent py-7 md:py-16 border-y border-[#0c831f]/10 shadow-sm md:shadow-[inset_0_-10px_40px_rgba(0,0,0,0.02)]">
          {/* Background Decoration */}
          <div className="absolute -top-10 -right-10 h-40 w-40 md:h-80 md:w-80 bg-[#0c831f]/10 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 md:h-80 md:w-80 bg-yellow-400/10 rounded-full blur-3xl opacity-60" />

          <div className="container mx-auto px-4 md:px-8 lg:px-[50px] relative z-10">
            <div className="flex justify-between items-center mb-6 md:mb-10 px-1">
              <div className="flex flex-col">
                <h3 className="text-xl md:text-4xl font-[1000] text-[#1A1A1A] tracking-tighter uppercase leading-none">
                  Lowest Price <span className="text-[#0c831f]">ever</span>
                </h3>
                <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 md:mt-3">
                  <div className="h-1 w-1 md:h-2 md:w-2 bg-[#0c831f] rounded-full animate-pulse shadow-[0_0_8px_rgba(12,131,31,0.5)]" />
                  <span className="text-[10px] md:text-xs font-black text-[#0c831f] uppercase tracking-wider md:tracking-[0.2em] opacity-80">
                    Unbeatable Savings • Updated hourly
                  </span>
                </div>
              </div>
              <motion.div
                onClick={() => navigate('/category/all')}
                whileHover={{ x: 5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 md:gap-2 bg-white px-3 py-1.5 md:px-6 md:py-3 rounded-full text-[#0c831f] font-bold text-[10px] md:text-sm cursor-pointer shadow-sm md:shadow-lg border border-[#0c831f]/5 transition-all">
                See all <ArrowRightIcon sx={{ fontSize: 12, ml: { xs: 0.2, md: 0.5 } }} />
              </motion.div>
            </div>

            <div className="relative z-10 flex overflow-x-auto gap-3 md:gap-6 pb-6 md:pb-8 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth">
              {products.slice(0, 12).map((product) => (
                <div
                  key={product.id}
                  className="w-[165px] md:w-[200px] shrink-0 snap-start">
                  <ProductCard
                    product={product}
                    className="bg-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.1)] md:shadow-[0_15px_30px_rgba(0,0,0,0.05)] border-green-50/50 md:border-slate-100 transition-all"
                    compact={true}
                  />
                </div>
              ))}
              {products.length === 0 && !isLoading && (
                <div className="w-full py-10 md:py-20 text-center text-slate-400 font-black italic md:text-xl">
                  Curating the best deals for you...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Main Content Area – show admin-configured sections in saved order */}
      {(headerSections.length ? headerSections : experienceSections).length > 0 && (
        <div className="container mx-auto px-4 md:px-8 lg:px-[50px] py-10 md:py-16">
          <SectionRenderer
            sections={headerSections.length ? headerSections : experienceSections}
            productsById={productsById}
            categoriesById={categoryMap}
            subcategoriesById={subcategoryMap}
          />
        </div>
      )}
    </div >
  );
};

export default Home;
