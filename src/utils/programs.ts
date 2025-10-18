import { IExtendedProgram } from "@/types/response";

  export function getProgramPrice(program: IExtendedProgram) {
    const basePrice =
      program.allow_deposits && program.deposit_amount
        ? parseFloat(program.deposit_amount.toString())
        : parseFloat(program.price);

    // Add service fee if not absorbed
    const serviceFee = program.absorb_service_charge
      ? 0
      : Math.max(1, basePrice * 0.1);

    return basePrice + serviceFee;
  };

  export function getServiceFee(program: IExtendedProgram) {
    if (program.absorb_service_charge) return 0;

    const basePrice =
      program.allow_deposits && program.deposit_amount
        ? parseFloat(program.deposit_amount.toString())
        : parseFloat(program.price);

    return Math.max(1, basePrice * 0.1);
  };