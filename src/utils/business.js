// Business details shown across the site. Change them here only.
export const BUSINESS = {
  name: 'Laddu Gopal Enterprise',
  phoneDisplay: '93069 58575',
  phoneTel: '+919306958575',
  whatsapp: '919306958575',
  email: 'info@laddugopalwelding.com',
  address: 'Near Balaji Dharam Kanta, Ram Nagar Street No. 3, Jatal Road, Panipat, Haryana 132105',
  addressShort: 'Jatal Road, Panipat',
  hours: 'Somvar – Shanivar, subah 8 se shaam 7 baje tak',
  mapsLink: 'https://maps.app.goo.gl/MDbgHCU9Udf7Pqq18',
  mapsEmbed: 'https://maps.google.com/maps?q=29.391195,76.974785+(Laddu+Gopal+Enterprise)&z=17&output=embed',
};

export const telLink = `tel:${BUSINESS.phoneTel}`;

export function whatsappLink(text = 'Namaste, mujhe gate / grill ke baare mein jaankari chahiye.') {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';
