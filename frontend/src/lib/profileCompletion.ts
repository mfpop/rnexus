export interface ProfileLike {
  email?: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  department?: string;
  phone1?: string; // Updated to use new phone field
  phonecc1?: string; // Added country code field
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  bio?: string;
  education?: Array<Record<string, any>>;
  work_history?: Array<Record<string, any>>;
}

export interface CompletionResult {
  percent: number;
  details: {
    basicInfo: boolean;
    contact: boolean;
    address: boolean;
    professional: boolean;
    education: boolean;
    work: boolean;
    bio: boolean;
  };
}

export function computeProfileCompletion(
  p: ProfileLike | null | undefined,
): CompletionResult {
  if (!p) {
    return {
      percent: 0,
      details: {
        basicInfo: false,
        contact: false,
        address: false,
        professional: false,
        education: false,
        work: false,
        bio: false,
      },
    };
  }

  const val = (s?: string) => !!(s && String(s).trim().length > 0);

  // Weights (sum to 100)
  const W_BASIC = 20;
  const W_CONTACT = 15;
  const W_ADDRESS = 15;
  const W_PRO = 15;
  const W_EDU = 20;
  const W_WORK = 10;
  const W_BIO = 5;

  // Basic: first_name, last_name, email
  const basicCount = [val(p.first_name), val(p.last_name), val(p.email)].filter(
    Boolean,
  ).length;
  const basicScore = (basicCount / 3) * W_BASIC;
  const basicInfo = basicCount === 3;

  // Contact: phone1 (primary phone number)
  const contact = val(p.phone1);
  const contactScore = contact ? W_CONTACT : 0;

  // Address: street, city, state, zip, country — partial credit
  const addrFields = [
    p.street,
    p.city,
    p.state,
    p.zipcode,
    p.country,
  ];
  const addrCount = addrFields.map(val).filter(Boolean).length;
  const addressScore = (addrCount / 5) * W_ADDRESS;

  // Professional: position OR department (more lenient)
  const proCount = [val(p.position), val(p.department)].filter(Boolean).length;
  const professionalScore = (proCount / 2) * W_PRO;

  // Education: at least one entry
  const eduCount = Array.isArray(p.education) ? p.education.length : 0;
  const education = eduCount > 0;
  const educationScore = education ? W_EDU : 0;

  // Work: at least one entry
  const workCount = Array.isArray(p.work_history) ? p.work_history.length : 0;
  const work = workCount > 0;
  const workScore = work ? W_WORK : 0;

  // Bio
  const bio = val(p.bio);
  const bioScore = bio ? W_BIO : 0;

  const percent = Math.min(
    100,
    Math.round(
      basicScore +
        contactScore +
        addressScore +
        professionalScore +
        educationScore +
        workScore +
        bioScore,
    ),
  );

  return {
    percent,
    details: {
      basicInfo,
      contact,
      address: addrCount >= 3,
      professional: proCount >= 1, // At least one professional field (more lenient)
      education,
      work,
      bio,
    },
  };
}
