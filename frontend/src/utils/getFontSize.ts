function getFontSizeClass(amount: number): string {
  const length = Math.floor(amount).toString().length;
  if(length > 10) return "text-sm"; 
  if (length > 8) return "text-base";      
  if (length > 6) return "text-xl";
  return "text-2xl";
}

export default getFontSizeClass;