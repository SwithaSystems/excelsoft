
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
