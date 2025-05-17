export interface Service {
  id: string;
  CategoryId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  availableDays: string[];
}

export interface Category {
  id: string;
  name: string;
}

export type BusinessDataType = {
  name: string;
  bUrl: string;
  banner: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string;
  utcOffset: number;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  latitude?: number;
  longitude?: number;
  bannerHeader: string;
  bannerMessage: string;
  aboutSubHeader: string;
  maxNotice: number;
  minNotice: number;
  categories: Category[];
  services: Service[];
};

export interface ServicesTabPropsInterface {
    name: string;
    logo: string;
  categories: Category[];
  services: Service[];
  gotoNextTab: () => void;
  gotoPrevTab: () => void;
}

export interface LandingTabPropsInterface {
  gotoBooking: (index: number) => void;
  name: string;
  email: string;
  description: string;
  state: string;
  zip: string;
  address: string;
  city: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  phone: string;
  latitude?: number;
  longitude?: number;
  aboutSubHeader: string;
  banner: string;
  bannerHeader: string;
  bannerMessage: string;
  categories: {
    id: string;
    name: string;
  }[];
}
