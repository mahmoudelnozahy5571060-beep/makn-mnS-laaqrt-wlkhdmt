export type Property = {
  id: number;
  title: string;
  propertyType: string;
  listingType: string;
  price: number;
  area: number;
  rooms: number;
  bathrooms: number;
  governorate: string;
  district: string;
  finish: string;
  image: string;
  description?: string;
  featured: boolean;
  status: string;
  views?: number;
  amenities?: string[];
};

export const properties: Property[] = [
  {
    id: 1,
    title: "شقة مضيئة بإطلالة مفتوحة",
    propertyType: "شقة",
    listingType: "للبيع",
    price: 3250000,
    area: 168,
    rooms: 3,
    bathrooms: 2,
    governorate: "الإسكندرية",
    district: "سموحة",
    finish: "تشطيب فاخر",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    description:
      "مساحة هادئة بتقسيم عملي، إضاءة طبيعية طوال اليوم وتشطيب جاهز للسكن في قلب سموحة.",
    featured: true,
    status: "Approved",
    views: 1248,
    amenities: ["أسانسير", "جراج", "أمن 24 ساعة", "غاز طبيعي"],
  },
  {
    id: 2,
    title: "فيلا عائلية بحديقة خاصة",
    propertyType: "فيلا",
    listingType: "للبيع",
    price: 8900000,
    area: 420,
    rooms: 5,
    bathrooms: 4,
    governorate: "القاهرة",
    district: "التجمع الخامس",
    finish: "تشطيب كامل",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    description:
      "فيلا مستقلة بتصميم عصري، حديقة واسعة ومساحات مناسبة للعائلة والضيافة.",
    featured: true,
    status: "Approved",
    views: 986,
    amenities: ["حديقة", "جراج مزدوج", "مطبخ مجهز", "Smart Home"],
  },
  {
    id: 3,
    title: "شاليه راقٍ على البحر مباشرة",
    propertyType: "شاليه",
    listingType: "للإيجار",
    price: 28000,
    area: 115,
    rooms: 2,
    bathrooms: 2,
    governorate: "الإسكندرية",
    district: "سيدي بشر",
    finish: "سوبر لوكس",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85",
    description:
      "إطلالة بحرية كاملة وتشطيب مميز، مناسب للإقامة الموسمية أو الطويلة.",
    featured: false,
    status: "Approved",
    views: 742,
    amenities: ["إطلالة بحرية", "أسانسير", "تكييف", "إنترنت"],
  },
  {
    id: 4,
    title: "مكتب إداري جاهز في شارع رئيسي",
    propertyType: "مكتب",
    listingType: "للإيجار",
    price: 42000,
    area: 185,
    rooms: 4,
    bathrooms: 2,
    governorate: "القاهرة",
    district: "مدينة نصر",
    finish: "تشطيب كامل",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    description:
      "مكتب إداري بتقسيم مرن وموقع مناسب للشركات والعيادات.",
    featured: false,
    status: "Approved",
    views: 514,
    amenities: ["استقبال", "أسانسير", "أمن", "عداد تجاري"],
  },
];

export const finishingServices = [
  {
    id: 1,
    name: "تركيب السيراميك",
    category: "تشطيبات",
    description: "تركيب احترافي للأرضيات والحوائط مع ضبط الميول والفواصل.",
    unit: "م²",
    laborPrice: 185,
    accent: "terracotta",
  },
  {
    id: 2,
    name: "دهانات داخلية",
    category: "تشطيبات",
    description: "دهانات داخلية بطبقات متناسقة وتجهيز كامل للحوائط.",
    unit: "م²",
    laborPrice: 95,
    accent: "sand",
  },
  {
    id: 3,
    name: "إضاءة ذكية",
    category: "Smart Home",
    description: "تحكم ذكي في الإضاءة والمشاهد اليومية من مكان واحد.",
    unit: "نقطة",
    laborPrice: 450,
    accent: "teal",
  },
  {
    id: 4,
    name: "أقفال ذكية",
    category: "Smart Home",
    description: "تركيب وبرمجة أقفال ذكية مع إدارة دخول آمنة.",
    unit: "وحدة",
    laborPrice: 1200,
    accent: "indigo",
  },
];

export const professionals = [
  {
    id: 1,
    name: "د. ليلى مراد",
    title: "طبيبة عيون",
    category: "طبي",
    specialty: "طب وجراحة العيون",
    governorate: "الإسكندرية",
    district: "سموحة",
    experience: 12,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=85",
    available: true,
    bio: "خبرة طويلة في فحوصات النظر ومتابعة صحة العين للأطفال والكبار.",
  },
  {
    id: 2,
    name: "م. عمر الشاذلي",
    title: "مهندس تشطيبات",
    category: "منزل",
    specialty: "إدارة وتنفيذ التشطيبات",
    governorate: "القاهرة",
    district: "المعادي",
    experience: 9,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=85",
    available: true,
    bio: "إدارة مشاريع تشطيب سكنية وتجارية من التصميم حتى التسليم.",
  },
  {
    id: 3,
    name: "أ. حسام فوزي",
    title: "محامي ومستشار قانوني",
    category: "قانوني",
    specialty: "العقود والعقارات",
    governorate: "الإسكندرية",
    district: "العصافرة",
    experience: 15,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=85",
    available: false,
    bio: "استشارات قانونية متخصصة في العقود والملكية والنزاعات العقارية.",
  },
];

export const products = [
  {
    id: 1,
    name: "مفتاح إضاءة ذكي",
    category: "Smart Home",
    vendor: "بيت التقنية",
    price: 1290,
    oldPrice: 1490,
    image:
      "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=900&q=85",
    stock: 18,
    badge: "الأكثر طلبًا",
    description: "مفتاح لمس ذكي يدعم التحكم من الهاتف والجداول الزمنية.",
  },
  {
    id: 2,
    name: "كرسي استرخاء مخملي",
    category: "أثاث",
    vendor: "البرنس للأثاث",
    price: 7800,
    oldPrice: 8900,
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=85",
    stock: 7,
    badge: "عرض محدود",
    description: "قطعة مريحة بتنجيد مخملي وتصميم يناسب غرف المعيشة الهادئة.",
  },
  {
    id: 3,
    name: "كاميرا مراقبة داخلية",
    category: "أمان",
    vendor: "سيكيور تك",
    price: 2350,
    oldPrice: 2600,
    image:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=85",
    stock: 25,
    badge: "وصل حديثًا",
    description: "كاميرا بدقة عالية مع رؤية ليلية وتنبيهات فورية.",
  },
  {
    id: 4,
    name: "فلتر مياه 5 مراحل",
    category: "منزل",
    vendor: "نقاء للمياه",
    price: 3150,
    oldPrice: 3500,
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=85",
    stock: 12,
    badge: "اختيار بوابة",
    description: "تنقية متعددة المراحل للاستخدام اليومي في المنزل.",
  },
];

export const viewingRequests: Array<Record<string, unknown>> = [];
export const appointments: Array<Record<string, unknown>> = [];
export const orders: Array<Record<string, unknown>> = [];
export const favorites = new Set<number>();
