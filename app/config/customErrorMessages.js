// Cart & Checkout
const ITEM_OUT_OF_STOCK = "Sorry, this item’s currently out of stock. Please check back soon or have a browse through our other collections. Thanks for bearing with us.";

const QUANTITY_NOT_AVAILABLE = "Sorry, we’ve only got {{available}} of this item in stock right now. Please update the quantity. Cheers!";

const INVALID_DISCOUNT_CODE = "That code doesn’t seem to be valid. Please give it another go or double check for any typos. Thanks!";
const EXPIRED_DISCOUNT_CODE = "That promo code’s expired. Feel free to try another one or check out our latest offers. Thanks for your understanding.";
const PAYMENT_FAILED = "Unfortunately, we couldn’t process your payment. Please try another method or contact your bank. Thanks for your patience.";

// Login & Signup
const INVALID_CREDENTIALS = "Sorry, we didn’t recognise those details. Please try again or reset your password if you’ve forgotten it. Cheers!";
const ACCOUNT_LOCKED = "Your account’s been temporarily locked after too many unsuccessful attempts. Please try again later or reset your password. Sorry for the hassle.";
const EMAIL_NOT_VERIFIED = "Please verify your email to continue. We’ve just sent you a fresh link. Thanks for checking.";

// Orders & Delivery
const ADDRESS_NOT_DELIVERABLE = "Sorry, we don’t currently deliver to that address. Please try a different postcode. Thanks for bearing with us.";
const ORDER_NOT_FOUND = "We couldn’t find an order with that reference. Please double check and try again.";
const DELIVERY_DELAYED = "Sorry – your delivery’s taking a little longer than expected. We’ll keep you updated. Thanks for your patience.";

// Search Bar
const NO_RESULTS_FOUND = "Sorry, we couldn’t find any results for “{{searchTerm}}”. Please try something else or explore by category. Thanks!";
const PAGE_NOT_FOUND = "Oops – this page isn’t available. Please head back to the homepage or try another link. Cheers for your patience.";


// Contact & Feedback
const FEEDBACK_ERROR = "Sorry, there was an issue submitting your feedback. Please try again shortly – we really value your thoughts.";

// Technical & System
const SERVER_ERROR = "Sorry, something’s gone wrong on our end. Please try again soon. Thanks for bearing with us.";
const CONNECTION_TIMEOUT = "Sorry, we’re struggling to connect. Please check your internet and give it another go. Thanks!";
const SESSION_EXPIRED = "Your session has timed out. Please log in again to carry on. Apologies for the interruption.";

// Add Address
const MISSING_REQUIRED_FIELDS = "We’ll need all required details to save your address. Please fill in any missing bits. Thanks!";
const INVALID_POSTCODE = "That doesn’t look like a valid UK postcode. Please double check and try again. Cheers!";
const ADDRESS_NOT_SAVED = "Sorry, we couldn’t save your address just now. Please try again shortly. Thanks for your patience.";
const DUPLICATE_ADDRESS = "Looks like you’ve already saved this address. Please use a different one or edit the existing entry. Thanks!";

// Edit Address
const ADDRESS_UPDATE_FAILED = "Sorry, we couldn’t update your address. Please try again in a bit. Thanks for bearing with us.";
const INVALID_ADDRESS_FORMAT = "Something doesn’t look quite right with the format. Please check and try again. Cheers!";
const ADDRESS_DELETED_OR_NOT_FOUND = "We couldn’t find this address – it might’ve been removed. Please add it again if needed. Thanks!";

// User Account – Account Creation
const EMAIL_ALREADY_REGISTERED = "This email’s already linked to an account. Please sign in or use a different email. Thanks!";
const ACCOUNT_CREATION_FAILED = "Sorry, we couldn’t set up your account just now. Please try again soon. Cheers for your patience.";

// User Account – Update Details
const FAILED_TO_UPDATE_DETAILS = "Sorry, we couldn’t update your details at the moment. Please give it another try shortly.";
const INVALID_EMAIL_FORMAT = "That doesn’t seem to be a valid email. Please double check and try again. Thanks!";
const PASSWORD_MISMATCH = "The passwords don’t match. Please check and try again. Cheers!";
const CAMERA_ACCESS_REQUIRED = "Permission to access camera is required!";
const GALLERY_ACCESS_REQUIRED = "Permission to access gallery is required!";

// Change Password
const INCORRECT_CURRENT_PASSWORD = "That current password doesn’t seem right. Please try again. Thanks!";
const PASSWORD_CHANGE_FAILED = "Sorry, we couldn’t update your password just now. Please try again later. Thanks for your patience.";

// Delete Account
const ACCOUNT_DELETION_ERROR = "Sorry, we couldn’t delete your account at the moment. Please try again later or contact our support team. Thanks!";

// Cart & Checkout
const ITEM_ADDED_TO_BASKET = "Great choice – it’s in your basket!";
const DISCOUNT_CODE_APPLIED = "Nice one! Your promo code has been applied.";
const PAYMENT_SUCCESSFUL = "Thanks – your payment went through. We’re getting your order ready!";

// Login & Signup
const SIGNED_IN_SUCCESSFULLY = "You’re in – welcome back!";
const ACCOUNT_CREATED = "All set – your account’s ready to go. Thanks for joining us!";
const EMAIL_VERIFIED = "Thanks for verifying – you're all set now.";

// Orders & Delivery
const ADDRESS_SAVED = "Got it! Your address has been saved.";

// Pickup Screen
const PICKUP_TIME_IN_PAST = "That time’s already passed – please pick a slot in the future. Cheers!";
const PICKUP_TIME_REQUIRED = "Just need you to pick a pickup time before we carry on. Thanks!";
const PICKUP_DETAILS_REQUIRED = "Please pop in all the pickup details so we can get things sorted. Much appreciated!";

// Search & Navigation
const SEARCH_SUCCESSFUL = "Here’s what we found for “{{searchTerm}}” – happy browsing!";
const SEARCH_QUERY_REQUIRED_MESSAGE = "Please enter something to search before continuing.";

// Contact & Feedback
const FEEDBACK_SUBMITTED = "Thanks so much – we really appreciate your feedback.";

// Technical & System
const RECONNECTED = "You’re back online – all sorted!";
const SESSION_REFRESHED = "You’re good to go – your session’s been refreshed.";

// User Account – Update Details
const DETAILS_UPDATED = "All sorted – your details have been updated.";
const PASSWORD_CHANGED = "Done – your password’s been updated. Don’t forget it!";

// Delete Account
const ACCOUNT_DELETED = "Your account’s been deleted. We’re sorry to see you go!";

// Validation & Alerts
const FIX_VALIDATION_ERRORS = "A few details need a quick check. Please take a look and try again. Cheers!";
const PHONE_NUMBER_VALIDATION = "A phone number must be 10 digits. Recheck it again. Thanks!"
const REGISTRATION_FAILED = "We couldn’t complete your registration just now. Please try again in a bit. Thanks!";
const OTP_SEND_FAILED = "Couldn’t send the OTP. Please check your number and try again.";
const PHONE_ALREADY_REGISTERED = "This phone number’s already in use. Try signing in or use a different number.";

export {
  ITEM_OUT_OF_STOCK,
  QUANTITY_NOT_AVAILABLE,
  INVALID_DISCOUNT_CODE,
  EXPIRED_DISCOUNT_CODE,
  PAYMENT_FAILED,
  INVALID_CREDENTIALS,
  ACCOUNT_LOCKED,
  EMAIL_NOT_VERIFIED,
  ADDRESS_NOT_DELIVERABLE,
  ORDER_NOT_FOUND,
  DELIVERY_DELAYED,
  NO_RESULTS_FOUND,
  PAGE_NOT_FOUND,
  FEEDBACK_ERROR,
  SERVER_ERROR,
  CONNECTION_TIMEOUT,
  SESSION_EXPIRED,
  MISSING_REQUIRED_FIELDS,
  INVALID_POSTCODE,
  ADDRESS_NOT_SAVED,
  DUPLICATE_ADDRESS,
  ADDRESS_UPDATE_FAILED,
  INVALID_ADDRESS_FORMAT,
  ADDRESS_DELETED_OR_NOT_FOUND,
  EMAIL_ALREADY_REGISTERED,
  ACCOUNT_CREATION_FAILED,
  FAILED_TO_UPDATE_DETAILS,
  INVALID_EMAIL_FORMAT,
  PASSWORD_MISMATCH,
  INCORRECT_CURRENT_PASSWORD,
  PASSWORD_CHANGE_FAILED,
  CAMERA_ACCESS_REQUIRED,
  GALLERY_ACCESS_REQUIRED,
  ACCOUNT_DELETION_ERROR,
  ITEM_ADDED_TO_BASKET,
  DISCOUNT_CODE_APPLIED,
  PAYMENT_SUCCESSFUL,
  SIGNED_IN_SUCCESSFULLY,
  ACCOUNT_CREATED,
  EMAIL_VERIFIED,
  PICKUP_TIME_IN_PAST,
  PICKUP_TIME_REQUIRED,
  PICKUP_DETAILS_REQUIRED,
  ADDRESS_SAVED,
  SEARCH_SUCCESSFUL,
  SEARCH_QUERY_REQUIRED_MESSAGE,
  FEEDBACK_SUBMITTED,
  RECONNECTED,
  SESSION_REFRESHED,
  DETAILS_UPDATED,
  PASSWORD_CHANGED,
  ACCOUNT_DELETED,
  FIX_VALIDATION_ERRORS, 
  PHONE_NUMBER_VALIDATION,
  REGISTRATION_FAILED,
  OTP_SEND_FAILED,
  PHONE_ALREADY_REGISTERED,
};
