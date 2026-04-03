export const AGE_RESTRICTION_NOTE_MESSAGE =
  "One or more products require ID verification at delivery or pickup.";

export const AGE_RESTRICTION_PRODUCT_NOTE_MESSAGE =
  "Age-restricted product. Valid photo ID is required at delivery or pickup.";

export const LEGACY_AGE_RESTRICTION_PRODUCT_NOTE_MESSAGE =
  "Age-restricted product. Valid 18+ photo ID is required at delivery or pickup.";

export const AGE_RESTRICTION_PRODUCT_NOTES = [
  AGE_RESTRICTION_PRODUCT_NOTE_MESSAGE,
  LEGACY_AGE_RESTRICTION_PRODUCT_NOTE_MESSAGE,
];

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const stripAgeRestrictionProductNotes = (value: string = "") =>
  AGE_RESTRICTION_PRODUCT_NOTES.reduce((text, note) => {
    return text
      .replace(new RegExp(`\\s*${escapeRegExp(note)}\\s*`, "gi"), "")
      .trim();
  }, value.trim());

export const hasAgeRestrictionProductNote = (value: string = "") =>
  AGE_RESTRICTION_PRODUCT_NOTES.some((note) => value.includes(note));

export const isAgeRestrictedValue = (value: unknown): boolean => {
  if (value === true) return true;
  if (value === false || value == null) return false;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return (
      normalized === "true" ||
      normalized === "1" ||
      normalized === "yes" ||
      normalized === "y"
    );
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return false;
};

export const isAgeRestrictedItem = (item: any): boolean =>
  isAgeRestrictedValue(item?.isAgeRestricted) ||
  isAgeRestrictedValue(item?.ageRestricted) ||
  isAgeRestrictedValue(item?.age_restricted) ||
  isAgeRestrictedValue(item?.ageRestriction);

export const isAgeRestrictedCartItem = (item: any): boolean =>
  isAgeRestrictedItem(item) || isAgeRestrictedItem(item?.product);
