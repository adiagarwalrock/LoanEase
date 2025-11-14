import { z } from 'zod';

export const LoanSchema = z.object({
  principal: z.coerce.number().positive({ message: 'Principal must be a positive number.' }),
  interestRate: z.coerce.number().positive({ message: 'Interest rate must be a positive number.' }),
  loanTerm: z.coerce.number().int().positive({ message: 'Loan term must be a positive number of years.' }),
  interestType: z.enum(['compound', 'simple']),
  startDate: z.date(),
});

export type LoanFormValues = z.infer<typeof LoanSchema>;

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  paymentDate: Date;
  paid: boolean;
}

export interface AmortizationResult {
  schedule: AmortizationEntry[];
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export interface ActionResult {
  data?: AmortizationResult;
  error?: string;
}
