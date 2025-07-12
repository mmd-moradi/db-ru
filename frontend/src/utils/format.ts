/**
 * Format a number as currency (BRL)
 * @param value The value to format
 * @returns Formatted currency string (e.g. R$ 10,00)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
