import dayjs from "@/utils/dayjsConfig";

export function getProgramPriceRange(program: IProgram & { upcoming_classes: IProgramClass[]}) {
  const classPrices = program.upcoming_classes.map((cls) => getProgramClassPrice(cls, program)) || [0];
  const minPrice = Math.min(...classPrices);
  const maxPrice = Math.max(...classPrices);

  return { minPrice, maxPrice };
}

export function getProgramClassPrice(cls: IProgramClass, program: IProgram) {
  // Calculate class price with service charge
  let basePrice = getProgramClassBasePrice(cls, program);

  // Add service charge
  const serviceCharge = Math.max(1, basePrice * 0.1);
  const finalPrice = basePrice + serviceCharge;

  return finalPrice;
}

export function getServiceFee(cls: IProgramClass, program: IProgram) {
  if (program.absorb_service_charge) return 0;

  return getProgramClassPrice(cls, program) - parseFloat(cls.price.toString());
}

export function calculateProgramClassDiscount(cls: IProgramClass) {
  // Check if early bird discount is applicable
  if (
    cls.offer_early_bird &&
    cls.early_bird_deadline &&
    cls.early_bird_discount_value
  ) {
    const now = dayjs();
    const deadline = dayjs(cls.early_bird_deadline);

    if (!now.isAfter(deadline)) {
      const price = parseFloat(cls.price.toString());

      if (cls.early_bird_discount_type === "percentage") {
        return (price * cls.early_bird_discount_value) / 100;
      } else {
        return parseFloat(cls.early_bird_discount_value.toString());
      }
    }
  }

  return 0;
}

export function getProgramClassPriceWithDiscount(cls: IProgramClass, program: IProgram) {
  const basePrice = getProgramClassBasePrice(cls, program);

  const discount = calculateProgramClassDiscount(cls);
  const discountedPrice = basePrice - discount;

  // Add service fee if not absorbed (calculated on discounted price)
  const serviceFee = program.absorb_service_charge
    ? 0
    : Math.max(1, basePrice * 0.1);

  return discountedPrice + serviceFee;
}

export function getProgramClassBasePrice(cls: IProgramClass, program: IProgram) {
    let displayPrice = parseFloat(cls.price.toString());

  // Determine if we should show deposit or full price
  if (program.set_deposit_instructions_per_class) {
    if (cls.allow_deposits && cls.deposit_amount) {
      displayPrice = parseFloat(cls.deposit_amount.toString());
    }
  } else {
    if (program.allow_deposits && program.deposit_amount) {
      displayPrice = parseFloat(program.deposit_amount.toString());
    }
  }
    return displayPrice;
}
