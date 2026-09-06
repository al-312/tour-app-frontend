import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  type CountryCode,
} from "libphonenumber-js";

export interface CountryPhoneInfo {
  iso: CountryCode;
  countryName: string;
  callingCode: string;
}

const regionNames =
  typeof Intl !== "undefined" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

export function getAllCountries(): CountryPhoneInfo[] {
  const list = getCountries().map((iso) => {
    let name = iso as string;
    try {
      if (regionNames) {
        name = regionNames.of(iso) ?? iso;
      }
    } catch {
      name = iso;
    }
    return {
      iso,
      countryName: name,
      callingCode: `+${getCountryCallingCode(iso)}`,
    };
  });

  return list.sort((a, b) => a.countryName.localeCompare(b.countryName));
}

/**
 * Finds country ISO code from a calling code (e.g. "+91" -> "IN", "+1" -> "US")
 */
function getCountryIsoFromCallingCode(callingCode?: string): CountryCode {
  if (!callingCode) return "US";
  const cleanCode = callingCode.replace(/[^\d]/g, "");
  const found = getCountries().find((iso) => getCountryCallingCode(iso) === cleanCode);
  return found ?? "US";
}

/**
 * Get estimated maximum digits for national phone number input given a country or calling code
 */
export function getMaxPhoneLengthForCountry(callingCodeOrIso?: string): number {
  if (!callingCodeOrIso) return 15;
  let iso: CountryCode;
  if (callingCodeOrIso.length === 2 && /^[A-Z]{2}$/.test(callingCodeOrIso)) {
    iso = callingCodeOrIso as CountryCode;
  } else {
    iso = getCountryIsoFromCallingCode(callingCodeOrIso);
  }

  switch (iso) {
    case "US":
    case "CA":
    case "IN":
      return 10;
    case "GB":
      return 11;
    case "AE":
    case "QA":
    case "SA":
    case "KW":
    case "BH":
    case "OM":
      return 9;
    case "LK":
    case "BD":
    case "PK":
      return 10;
    default:
      return 15;
  }
}

/**
 * Validates phone number length and format based on country code
 */
export function validatePhoneForCountry(
  number?: string,
  callingCodeOrIso?: string
): { isValid: boolean; error?: string } {
  if (!number?.trim()) {
    return { isValid: true };
  }

  const cleanNumber = number.replace(/[^\d]/g, "");
  if (!cleanNumber) {
    return { isValid: false, error: "Phone number contains no digits" };
  }

  let iso: CountryCode = "US";
  if (callingCodeOrIso) {
    if (callingCodeOrIso.length === 2 && /^[A-Z]{2}$/.test(callingCodeOrIso)) {
      iso = callingCodeOrIso as CountryCode;
    } else {
      iso = getCountryIsoFromCallingCode(callingCodeOrIso);
    }
  }

  const lengthResult = validatePhoneNumberLength(cleanNumber, iso);

  if (lengthResult === "TOO_SHORT") {
    return {
      isValid: false,
      error: `Phone number is too short for selected country (+${getCountryCallingCode(iso)})`,
    };
  }

  if (lengthResult === "TOO_LONG") {
    return {
      isValid: false,
      error: `Phone number is too long for selected country (+${getCountryCallingCode(iso)})`,
    };
  }

  if (lengthResult === "INVALID_LENGTH") {
    return {
      isValid: false,
      error: `Invalid phone number length for selected country (+${getCountryCallingCode(iso)})`,
    };
  }

  const parsed = parsePhoneNumberFromString(cleanNumber, iso);
  if (parsed && !parsed.isValid()) {
    return {
      isValid: false,
      error: `Invalid phone number for selected country (+${getCountryCallingCode(iso)})`,
    };
  }

  return { isValid: true };
}
