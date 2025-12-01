
import { addMonths } from 'date-fns';
import { LoanSchema, type LoanFormValues, type AmortizationResult, type ActionResult } from '@/lib/types';

export async function generateAmortizationSchedule(formData: LoanFormValues): Promise<ActionResult> {
  const validatedFields = LoanSchema.safeParse(formData);

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return { error: firstError || 'Invalid input. Please check the form fields.' };
  }

  const { principal, interestRate, loanTerm, interestType, startDate } = validatedFields.data;

  const annualRate = interestRate / 100;
  const months = loanTerm * 12;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date

  let schedule: AmortizationResult['schedule'] = [];
  let monthlyPayment: number;
  let totalInterest: number;
  let totalPayment: number;

  try {
    if (interestType === 'compound') {
      const monthlyRate = annualRate / 12;
      if (monthlyRate === 0) {
        monthlyPayment = principal / months;
      } else {
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      }
      
      let balance = principal;
      let totalInterestPaid = 0;

      for (let i = 1; i <= months; i++) {
        const paymentDate = startDate ? addMonths(startDate, i) : addMonths(today, i);
        const interestPaid = balance * monthlyRate;
        const principalPaid = monthlyPayment - interestPaid;
        balance -= principalPaid;
        totalInterestPaid += interestPaid;

        schedule.push({
          month: i,
          payment: monthlyPayment,
          principal: principalPaid,
          interest: interestPaid,
          balance: balance > 0 ? balance : 0,
          paymentDate: paymentDate,
          paid: paymentDate < today,
        });
      }
      totalPayment = monthlyPayment * months;
      totalInterest = totalInterestPaid;
    } else { // Simple interest
      totalInterest = principal * annualRate * loanTerm;
      totalPayment = principal + totalInterest;
      monthlyPayment = totalPayment / months;
      const monthlyInterest = totalInterest / months;
      const monthlyPrincipal = principal / months;

      let balance = principal;
      for (let i = 1; i <= months; i++) {
        const paymentDate = startDate ? addMonths(startDate, i) : addMonths(today, i);
        balance -= monthlyPrincipal;
        schedule.push({
          month: i,
          payment: monthlyPayment,
          principal: monthlyPrincipal,
          interest: monthlyInterest,
          balance: balance > 0 ? balance : 0,
          paymentDate: paymentDate,
          paid: paymentDate < today,
        });
      }
    }

    if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) {
      return { error: 'Could not calculate monthly payment. Check your inputs.'}
    }

    return {
      data: {
        schedule,
        monthlyPayment,
        totalInterest,
        totalPayment,
      },
    };
  } catch (e) {
    return { error: 'An unexpected error occurred during calculation.' };
  }
}
