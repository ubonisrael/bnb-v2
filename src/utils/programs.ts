import dayjs from "@/utils/dayjsConfig";

export function getProgramPrice(program: IProgram) {
  const basePrice =
    program.allow_deposits && program.deposit_amount
      ? parseFloat(program.deposit_amount.toString())
      : parseFloat(program.price);

  // Add service fee if not absorbed
  const serviceFee = program.absorb_service_charge
    ? 0
    : Math.max(1, basePrice * 0.1);

  return basePrice + serviceFee;
}

export function getServiceFee(program: IProgram) {
  if (program.absorb_service_charge) return 0;

  const basePrice =
    program.allow_deposits && program.deposit_amount
      ? parseFloat(program.deposit_amount.toString())
      : parseFloat(program.price);

  return Math.max(1, basePrice * 0.1);
}

export function calculateProgramDiscount(program: IProgram) {
  // Check if early bird discount is applicable
  if (
    program.offer_early_bird &&
    program.early_bird_deadline &&
    program.early_bird_discount_value
  ) {
    const now = dayjs();
    const deadline = dayjs(program.early_bird_deadline);

    if (!now.isAfter(deadline)) {
      const price = parseFloat(program.price);

      if (program.early_bird_discount_type === "percentage") {
        return (price * program.early_bird_discount_value) / 100;
      } else {
        return parseFloat(program.early_bird_discount_value.toString());
      }
    }
  }
  
  return 0;
}

export function getProgramPriceWithDiscount(program: IProgram) {
  const basePrice =
    program.allow_deposits && program.deposit_amount
      ? parseFloat(program.deposit_amount.toString())
      : parseFloat(program.price);

  const discount = calculateProgramDiscount(program);
  const discountedPrice = basePrice - discount;

  // Add service fee if not absorbed (calculated on discounted price)
  const serviceFee = program.absorb_service_charge
    ? 0
    : Math.max(1, basePrice * 0.1);

  return discountedPrice + serviceFee;
}

export function getProgramBasePrice(program: IProgram) {
  return program.allow_deposits && program.deposit_amount
    ? parseFloat(program.deposit_amount.toString())
    : parseFloat(program.price);
}
