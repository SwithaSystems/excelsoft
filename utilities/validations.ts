export const isValidPassword = (password: string): string | null => {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  
  return null;
};

export const isValidEmail = (email: string): boolean => {
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return trimmed.length > 0 && emailRegex.test(trimmed);
};

export const isValidName = (name: string): string | null => {
  const trimmed = name.trim();

  if (!trimmed) return "Recipient name is required";
  if (trimmed.length < 2) return "Name must be at least 2 characters long";
  if (trimmed.length > 50) return "Name cannot exceed 50 characters";
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed))
    return "Name can only contain letters, spaces, hyphens (-), and apostrophes (')";
  if (/[\s\-']{2,}/.test(trimmed))
    return "Name cannot have consecutive special characters";
  if (!/^[a-zA-Z].*[a-zA-Z]$/.test(trimmed) && trimmed.length > 1)
    return "Name must start and end with a letter";

  return null;
};

export const isValidPostalCode = (postal: string): string | null => {
  const trimmed = postal.trim();

  if (!trimmed) return "Postcode is required";
  if (trimmed.length < 3) return "Postcode must be at least 3 characters long";
  if (trimmed.length > 10) return "Postcode cannot exceed 10 characters";
  if (!/^[a-zA-Z0-9\s\-]+$/.test(trimmed))
    return "Postcode can only contain letters, numbers, spaces, and hyphens";
  if (!/[a-zA-Z0-9]/.test(trimmed))
    return "Postcode must contain at least one letter or number";

  return null;
};

export const isValidAddressLine1 = (line: string): string | null => {
  const trimmed = line.trim();

  if (!trimmed) return "Address Line 1 is required";
  if (trimmed.length < 5) return "Address must be at least 5 characters long";
  if (trimmed.length > 100) return "Address cannot exceed 100 characters";
  if (!/^[a-zA-Z0-9\s,.\-/#'()]+$/.test(trimmed))
    return "Address contains invalid characters. Only letters, numbers, spaces, and common punctuation (, . - / # ' ( )) are allowed";
  if (!/[a-zA-Z0-9]/.test(trimmed))
    return "Address must contain at least one letter or number";

  return null;
};

export const isValidAddressLine2 = (line: string): string | null => {
  const trimmed = line.trim();

  if (trimmed.length > 100)
    return "Address Line 2 cannot exceed 100 characters";
  if (trimmed && !/^[a-zA-Z0-9\s,.\-/#'()]+$/.test(trimmed))
    return "Address Line 2 contains invalid characters. Only letters, numbers, spaces, and common punctuation (, . - / # ' ( )) are allowed";

  return null;
};

export const isValidTownCity = (city: string): string | null => {
  const trimmed = city.trim();

  if (!trimmed) return "Town/City is required";
  if (trimmed.length < 2)
    return "Town/City must be at least 2 characters long";
  if (trimmed.length > 50)
    return "Town/City cannot exceed 50 characters";
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed))
    return "Town/City can only contain letters, spaces, hyphens (-), and apostrophes (')";
  if (!/^[a-zA-Z].*[a-zA-Z]$/.test(trimmed) && trimmed.length > 1)
    return "Town/City must start and end with a letter";

  return null;
};

export const isValidState = (state: string): string | null => {
  const trimmed = state.trim();

  if (trimmed.length > 50) return "State cannot exceed 50 characters";
  if (trimmed && !/^[a-zA-Z\s\-']+$/.test(trimmed))
    return "State can only contain letters, spaces, hyphens (-), and apostrophes (')";
  if (trimmed && trimmed.length > 1 && !/^[a-zA-Z].*[a-zA-Z]$/.test(trimmed))
    return "State must start and end with a letter";

  return null;
};

export const isValidPhoneNumber = (phone: string): string | null => {
  const trimmed = phone.trim();
  const digitsOnly = trimmed.replace(/\D/g, "");

  if (!trimmed) return "Phone number is required";
  if (digitsOnly.length < 10)
    return "Phone number must contain at least 10 digits";
  if (digitsOnly.length > 15)
    return "Phone number cannot exceed 15 digits";
  if (!/^[\+]?[\d\s()\-]+$/.test(trimmed))
    return "Phone number can only contain digits, spaces, parentheses, hyphens, and plus sign";
  if (!/^[\+\d]/.test(trimmed))
    return "Phone number must start with a digit or plus sign";

  return null;
};

export const isValidProductName = (name: string): string | null => {
  if (!name.trim()) return "Product name is required";
  if (name.trim().length < 2)
    return "Product name must be at least 2 characters";
  if (name.trim().length > 100)
    return "Product name cannot exceed 100 characters";
  if (!/^[a-zA-Z0-9\s\-_'.&]+$/.test(name.trim()))
    return "Product name contains invalid characters";
  return null;
};

export const isValidProductTitle = (title: string): string | null => {
  if (!title.trim()) return "Title is required";
  if (title.trim().length < 3) return "Title must be at least 3 characters";
  if (title.trim().length > 150) return "Title cannot exceed 150 characters";
  return null;
};

export const isValidProductDescription = (description: string): string | null => {
  if (description.trim().length > 1000)
    return "Description cannot exceed 1000 characters";
  return null;
};

export const isValidStock = (stock: string): string | null => {
  if (!stock.trim()) return "Stock is required";
  const stockNum = parseInt(stock);
  if (isNaN(stockNum)) return "Stock must be a valid number";
  if (stockNum < 0) return "Stock cannot be negative";
  if (stockNum > 99999) return "Stock cannot exceed 99,999";
  return null;
};

export const isValidPrice = (price: string): string | null => {
  if (!price.trim()) return "Price is required";
  const priceNum = parseFloat(price);
  if (isNaN(priceNum)) return "Price must be a valid number";
  if (priceNum <= 0) return "Price must be greater than 0";
  if (priceNum > 999999) return "Price cannot exceed 999,999";
  if (!/^\d+(\.\d{1,2})?$/.test(price))
    return "Price can have maximum 2 decimal places";
  return null;
};

export const isValidDiscountPrice = (
  discountPrice: string,
  originalPrice: string
): string | null => {
  if (!discountPrice.trim()) return null; 
  const discountNum = parseFloat(discountPrice);
  const originalNum = parseFloat(originalPrice);

  if (isNaN(discountNum)) return "Discount price must be a valid number";
  if (discountNum <= 0) return "Discount price must be greater than 0";
  if (discountNum > 999999) return "Discount price cannot exceed 999,999";
  if (!/^\d+(\.\d{1,2})?$/.test(discountPrice))
    return "Discount price can have maximum 2 decimal places";

  if (!isNaN(originalNum) && discountNum >= originalNum) {
    return "Discount price must be less than original price";
  }
  return null;
};

export const isValidMinimumOrderQuantity = (quantity: string): string | null => {
  if (!quantity.trim()) return null; 
  const qtyNum = parseInt(quantity);
  if (isNaN(qtyNum)) return "Minimum order quantity must be a valid number";
  if (qtyNum < 0) return "Minimum order quantity cannot be negative";
  if (qtyNum > 1000) return "Minimum order quantity cannot exceed 1000";
  return null;
};

export const isValidProductImages = (images: any[], maxImages: number = 5): string | null => {
  if (images.length === 0) return "At least one product image is required";
  if (images.length > maxImages)
    return `Maximum ${maxImages} images allowed`;
  return null;
};

export const isValidCategory = (category: string): string | null => {
  if (!category) return "Please select a category";
  return null;
};
