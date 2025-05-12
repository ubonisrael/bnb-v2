export type Category = "haircare" | "facials" | "nails" | "massage";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: Category;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
}

export interface BusinessInfo {
  name: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  latitude: number;
  longitude: number;
}

export const BUSINESS_INFO: BusinessInfo = {
  name: "BeautySpot",
  logo: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
  email: "info@beautyspot.com",
  phone: "(555) 123-4567",
  address: "123 Beauty Lane",
  city: "Stylish City",
  state: "SC",
  zip: "12345",
  description: "Since 2010, BeautySpot has been helping clients look and feel their best with expert services and premium products.",
  hours: {
    monday: "9AM - 8PM",
    tuesday: "9AM - 8PM",
    wednesday: "9AM - 8PM",
    thursday: "9AM - 8PM",
    friday: "9AM - 8PM",
    saturday: "10AM - 6PM",
    sunday: "Closed"
  },
  latitude: 40.7128,
  longitude: -74.0060
};

export const SERVICES: Service[] = [
  {
    id: "haircut-women",
    name: "Women's Haircut",
    description: "Professional cut and style for all hair types",
    price: 65,
    duration: 45,
    category: "haircare"
  },
  {
    id: "haircut-men",
    name: "Men's Haircut",
    description: "Precise cut and styling for men",
    price: 45,
    duration: 30,
    category: "haircare"
  },
  {
    id: "hair-coloring",
    name: "Hair Coloring",
    description: "Full color service with premium products",
    price: 120,
    duration: 90,
    category: "haircare"
  },
  {
    id: "highlights",
    name: "Highlights",
    description: "Partial or full highlights to enhance your look",
    price: 150,
    duration: 120,
    category: "haircare"
  },
  {
    id: "basic-facial",
    name: "Basic Facial",
    description: "Cleansing, exfoliation, and moisturizing treatment",
    price: 75,
    duration: 60,
    category: "facials"
  },
  {
    id: "anti-aging-facial",
    name: "Anti-Aging Facial",
    description: "Specialized treatment to reduce fine lines and improve skin elasticity",
    price: 95,
    duration: 75,
    category: "facials"
  },
  {
    id: "acne-treatment",
    name: "Acne Treatment",
    description: "Deep cleansing facial designed for acne-prone skin",
    price: 85,
    duration: 60,
    category: "facials"
  },
  {
    id: "classic-manicure",
    name: "Classic Manicure",
    description: "Nail shaping, cuticle care, hand massage, and polish",
    price: 35,
    duration: 30,
    category: "nails"
  },
  {
    id: "gel-manicure",
    name: "Gel Manicure",
    description: "Long-lasting gel polish application with nail prep",
    price: 45,
    duration: 45,
    category: "nails"
  },
  {
    id: "pedicure",
    name: "Pedicure",
    description: "Foot soak, exfoliation, nail care, and polish",
    price: 50,
    duration: 45,
    category: "nails"
  },
  {
    id: "nail-art",
    name: "Nail Art",
    description: "Custom designs and embellishments for your nails",
    price: 25,
    duration: 30,
    category: "nails"
  },
  {
    id: "swedish-massage",
    name: "Swedish Massage",
    description: "Relaxing full-body massage with gentle pressure",
    price: 85,
    duration: 60,
    category: "massage"
  },
  {
    id: "deep-tissue-massage",
    name: "Deep Tissue Massage",
    description: "Therapeutic massage targeting deeper muscle layers",
    price: 95,
    duration: 60,
    category: "massage"
  },
  {
    id: "hot-stone-massage",
    name: "Hot Stone Massage",
    description: "Relaxing massage using heated stones to release tension",
    price: 110,
    duration: 90,
    category: "massage"
  }
];

export const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Jane Doe",
    role: "Regular Customer",
    content: "I've been coming to BeautySpot for over a year now, and I've never been disappointed. The staff is friendly and knowledgeable, and my hair always looks amazing!",
    rating: 5,
    initials: "JD"
  },
  {
    id: "2",
    name: "Mark Smith",
    role: "New Customer",
    content: "The facial I got at BeautySpot was incredible! My skin feels refreshed and looks noticeably better. The esthetician was very professional and made great recommendations for my skin type.",
    rating: 4.5,
    initials: "MS"
  },
  {
    id: "3",
    name: "Lisa Wong",
    role: "Regular Customer",
    content: "I love the atmosphere at BeautySpot! The salon is clean and modern, and the staff really takes their time to make sure you're happy with your service. The nail art I got was absolutely stunning!",
    rating: 5,
    initials: "LW"
  }
];

// Helper function to get services by category
export const getServicesByCategory = (category: Category): Service[] => {
  return SERVICES.filter(service => service.category === category);
};

// Generate available times for a given date (with consistent availability)
export const generateAvailableTimes = (date: string, totalDuration: number): string[] => {
  const times: string[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  
  // Simple hash function to get consistent availability based on date
  const getAvailability = (dateStr: string, timeStr: string): boolean => {
    const combined = dateStr + timeStr;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    // Use the hash to determine availability (about 70% available)
    return (Math.abs(hash) % 10) < 7;
  };
  
  // Generate time slots every 30 minutes with consistent availability for each date
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minutes of [0, 30]) {
      if (hour === endHour && minutes > 0) continue; // Don't go past end time
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Use our hash function for consistent availability
      if (getAvailability(date, timeString)) {
        times.push(timeString);
      }
    }
  }
  
  return times;
};
