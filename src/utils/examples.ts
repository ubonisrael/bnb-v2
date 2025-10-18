import { BusinessDataResponse } from "@/types/response";

export const businessData: BusinessDataResponse = {
  programs: [],
  currencySymbol: "£",
  allowDeposits: true,
  depositAmount: 20,
  bUrl: "sample",
  logo: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
  name: "Serenity Wellness Spa",
  address: "123 Broadway Street, Downtown Manhattan, New York",
  city: "New York",
  state: "NY",
  zip: "10001",
  latitude: 40.7505045,
  longitude: -73.9934387,
  phone: "(123) 456-7890",
  email: "info@serenityspa.com",
  utcOffset: 60,
  maxNotice: 30,
  minNotice: 1,
  aboutUs:
    "Welcome to Serenity Wellness Spa, where tranquility meets luxury in the heart of Manhattan. For over 15 years, we have been dedicated to providing our clients with the ultimate relaxation experience through our comprehensive range of therapeutic treatments and wellness services. Our team of licensed professionals combines ancient healing techniques with modern wellness practices to rejuvenate your body, mind, and spirit. We believe that self-care is not a luxury but a necessity, and our serene environment provides the perfect escape from the bustling city life. Every treatment is customized to meet your individual needs, ensuring you leave feeling refreshed, renewed, and ready to take on the world.",
  images: [
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Spa interior",
    },
    {
      src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Massage therapy room",
    },
    {
      src: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Facial treatment room",
    },
  ],
  serviceCategories: [
    {
      id: 1,
      name: "Massage Therapy",
      services: [
        {
          id: "massage-1",
          name: "Swedish Massage",
          description:
            "A gentle, relaxing massage using long strokes and circular movements to relieve tension and promote overall wellness.",
          price: 120,
          duration: 60,
          availableDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        {
          id: "massage-2",
          name: "Deep Tissue Massage",
          description:
            "Intense pressure targeting deeper muscle layers to release chronic tension and knots.",
          price: 140,
          duration: 75,
          availableDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        {
          id: "massage-3",
          name: "Hot Stone Massage",
          description:
            "Smooth heated stones placed on key points of the body to warm and loosen tight muscles.",
          price: 160,
          duration: 90,
          availableDays: [
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        {
          id: "massage-4",
          name: "Prenatal Massage",
          description:
            "Specially designed massage for expecting mothers to reduce pregnancy discomfort and stress.",
          price: 130,
          duration: 60,
          availableDays: [
            "Monday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        {
          id: "massage-5",
          name: "Aromatherapy Massage",
          description:
            "Relaxing massage combined with essential oils to enhance emotional and physical well-being.",
          price: 135,
          duration: 60,
          availableDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        {
          id: "massage-6",
          name: "Sports Massage",
          description:
            "Targeted therapy for athletes to prevent injury, enhance performance, and aid recovery.",
          price: 150,
          duration: 75,
          availableDays: [
            "Monday",
            "Tuesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        {
          id: "massage-7",
          name: "Couples Massage",
          description:
            "Side-by-side massage experience for two people in our specially designed couples room.",
          price: 280,
          duration: 60,
          availableDays: ["Friday", "Saturday", "Sunday"],
        },
        {
          id: "massage-8",
          name: "Reflexology",
          description:
            "Pressure point massage focusing on feet, hands, and ears to promote healing throughout the body.",
          price: 90,
          duration: 45,
          availableDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Facial Treatments",
      services: [
        {
          id: "facial-1",
          name: "European Facial",
          description:
            "Classic deep cleansing facial with exfoliation, extractions, and hydrating mask for all skin types.",
          price: 95,
          duration: 60,
          availableDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        {
          id: "facial-2",
          name: "Anti-Aging Facial",
          description:
            "Advanced treatment targeting fine lines and wrinkles with peptides and antioxidants.",
          price: 125,
          duration: 75,
          availableDays: [
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        {
          id: "facial-3",
          name: "Hydrating Facial",
          description:
            "Intensive moisture treatment for dry and dehydrated skin using hyaluronic acid serums.",
          price: 110,
          duration: 60,
          availableDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        {
          id: "facial-4",
          name: "Acne Treatment",
          description:
            "Specialized facial targeting acne-prone skin with deep cleansing and antibacterial treatments.",
          price: 105,
          duration: 75,
          availableDays: [
            "Monday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        {
          id: "facial-5",
          name: "Microdermabrasion",
          description:
            "Diamond-tip exfoliation treatment to improve skin texture and reduce appearance of scars.",
          price: 140,
          duration: 60,
          availableDays: [
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        {
          id: "facial-6",
          name: "Chemical Peel",
          description:
            "Professional-grade acid treatment to resurface skin and improve tone and texture.",
          price: 180,
          duration: 45,
          availableDays: ["Wednesday", "Thursday", "Friday"],
        },
      ],
    },
    {
      id: 3,
      name: "Body Treatments",
      services: [
        {
          id: "body-1",
          name: "Body Wrap",
          description:
            "Detoxifying treatment using mineral-rich clay to purify and tighten skin.",
          price: 150,
          duration: 90,
          availableDays: [
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        {
          id: "body-2",
          name: "Salt Scrub",
          description:
            "Full-body exfoliation using sea salt and nourishing oils to reveal smooth, glowing skin.",
          price: 120,
          duration: 60,
          availableDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        {
          id: "body-3",
          name: "Mud Treatment",
          description:
            "Therapeutic mud application rich in minerals to detoxify and rejuvenate the skin.",
          price: 135,
          duration: 75,
          availableDays: [
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        {
          id: "body-4",
          name: "Cellulite Treatment",
          description:
            "Specialized treatment combining massage and topical applications to improve skin texture.",
          price: 160,
          duration: 60,
          availableDays: [
            "Monday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        {
          id: "body-5",
          name: "Detox Package",
          description:
            "Comprehensive treatment combining body wrap, scrub, and lymphatic drainage massage.",
          price: 220,
          duration: 120,
          availableDays: ["Friday", "Saturday", "Sunday"],
        },
      ],
    },
  ],
  reviews: [
    {
      id: "review-1",
      customerName: "Sarah M.",
      rating: 5,
      comment:
        "Absolutely amazing experience! The Swedish massage was incredibly relaxing and the staff was so professional. The spa atmosphere is perfect for unwinding after a stressful week.",
      date: "2024-01-15",
      service: "Swedish Massage",
    },
    {
      id: "review-2",
      customerName: "Michael R.",
      rating: 5,
      comment:
        "Best facial I've ever had! The anti-aging treatment really made a difference in my skin. Highly recommend this place to anyone looking for quality spa services.",
      date: "2024-01-10",
      service: "Anti-Aging Facial",
    },
    {
      id: "review-3",
      customerName: "Jennifer L.",
      rating: 4,
      comment:
        "Great location and very clean facilities. The hot stone massage was wonderful, though I wish the session was a bit longer. Will definitely be back!",
      date: "2024-01-08",
      service: "Hot Stone Massage",
    },
    {
      id: "review-4",
      customerName: "David K.",
      rating: 5,
      comment:
        "My wife and I booked the couples massage for our anniversary. It was perfect! The private room was beautiful and both therapists were excellent. Thank you for making our day special.",
      date: "2024-01-05",
      service: "Couples Massage",
    },
    {
      id: "review-5",
      customerName: "Lisa T.",
      rating: 5,
      comment:
        "The body wrap treatment exceeded my expectations. I felt so refreshed and my skin was glowing afterwards. The spa environment is so peaceful and the staff is incredibly welcoming.",
      date: "2024-01-03",
      service: "Body Wrap",
    },
  ],
  businessHours: [
    { day: "Monday", hours: "9:00 AM - 8:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 8:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 8:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 9:00 PM" },
    { day: "Friday", hours: "9:00 AM - 9:00 PM" },
    { day: "Saturday", hours: "8:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 6:00 PM" },
  ],
  socialMedia: [
    {
      platform: "Instagram",
      url: "https://instagram.com/serenityspa",
      icon: "Instagram",
      color: "text-pink-500",
      hoverColor: "hover:from-purple-50 hover:to-pink-50",
    },
    {
      platform: "Facebook",
      url: "https://facebook.com/serenityspa",
      icon: "Facebook",
      color: "text-blue-600",
      hoverColor: "hover:bg-blue-50",
    },
    {
      platform: "YouTube",
      url: "https://youtube.com/serenityspa",
      icon: "Youtube",
      color: "text-red-500",
      hoverColor: "hover:bg-red-50",
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/company/serenityspa",
      icon: "Linkedin",
      color: "text-blue-700",
      hoverColor: "hover:bg-blue-50",
    },
    {
      platform: "X (Twitter)",
      url: "https://twitter.com/serenityspa",
      icon: "Twitter",
      color: "text-slate-800",
      hoverColor: "hover:bg-slate-50",
    },
  ],
  bookingPolicy: [
    {
      type: "cancellation",
      policy: "24-hour notice required for cancellations",
    },
    {
      type: "cancellation",
      policy: "Late cancellations (less than 24 hours) subject to 50% charge",
    },
    {
      type: "no show",
      policy: "No-shows will be charged the full service amount",
    },
    {
      type: "rescheduling",
      policy: "Rescheduling is allowed up to 24 hours before the appointment.",
    },
    {
      type: "rescheduling",
      policy:
        "One reschedule is allowed per booking without additional charges.",
    },
    {
      type: "refund",
      policy: "Refunds are processed within 5-7 business days.",
    },
    {
      type: "refund",
      policy: "No refunds will be issued for missed appointments.",
    },
    {
      type: "deposit",
      policy: "A 30% deposit is required to secure your booking.",
    },
    {
      type: "deposit",
      policy: "Deposits are non-refundable if cancellation is within 24 hours.",
    },
    {
      type: "deposit",
      policy: "Your deposit will be applied toward the total service cost.",
    },
  ],
  customPolicies: [
    {
      id: "cancellation",
      title: "Cancellation Policy",
      policies: ["24-hour notice required for cancellations"],
    },
  ],
  absorbServiceCharge: false,
  cancellationAllowed: true,
};