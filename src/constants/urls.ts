/**
 * URL Constants
 * Centralized URL configuration for external services
 */

export const API_URLS = {
  // Radio Stream URLs
  livestream: {
    iframe: 'https://iframe.iono.fm/s/187',
    iframeWithParams: (background: string, accent: string) =>
      `https://iframe.iono.fm/s/187?background=${background}&accent=${accent}`,
    defaultIframe: 'https://iframe.iono.fm/s/187?background=c0cacb&accent=07477B',
  },

  // Podcast URLs
  podcasts: {
    perspectivesOnTheWeek: 'https://iframe.iono.fm/e/1155406',
    perspectives: 'https://iframe.iono.fm/p/187?station_id=187',
    sundayServiceMessages: 'https://iframe.iono.fm/e/1155407',
    bibleKidsPerspective: 'https://iframe.iono.fm/e/1155405',
    tuesdayHealth: 'https://iframe.iono.fm/e/1155408',
    wednesdayHealth: 'https://iframe.iono.fm/e/1155409',
    thursdayHealth: 'https://iframe.iono.fm/e/1155410',
    friday: 'https://iframe.iono.fm/e/1155411',
    saturdayMusic: 'https://iframe.iono.fm/e/1155412',
  },

  // Website URLs
  website: {
    main: 'https://sidmedia.org',
    donate: 'https://sidmedia.org/donate',
    paypal: 'https://www.paypal.com/donate/?hosted_button_id=JQ5Y5ZY5Z5Z5Z',
    about: 'https://sidmedia.org/about',
  },

  // Contact URLs
  contact: {
    whatsapp: {
      base: 'https://api.whatsapp.com/send',
      prayer: 'https://api.whatsapp.com/send?phone=19498607007&text=sid7pray',
      phone: '19498607007',
      prayerText: 'sid7pray',
    },
    email: 'info@sidmedia.org',
    phone: '+1 (949) 860-7007',
  },

  // Social Media URLs
  social: {
    facebook: 'https://www.facebook.com/AWRSID7',
    instagram: 'https://www.instagram.com/awr.sid7/',
    youtube: 'https://www.youtube.com/@AWRSID',
    twitter: 'https://twitter.com/awrsid',
  },
} as const;

/**
 * Helper function to build WhatsApp URL
 */
export const buildWhatsAppUrl = (phone: string, text?: string): string => {
  const baseUrl = API_URLS.contact.whatsapp.base;
  const params = new URLSearchParams({ phone });
  if (text) params.append('text', text);
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Helper function to build iframe URL with custom params
 */
export const buildIframeUrl = (background?: string, accent?: string): string => {
  if (!background && !accent) {
    return API_URLS.livestream.defaultIframe;
  }
  return API_URLS.livestream.iframeWithParams(
    background || 'c0cacb',
    accent || '07477B'
  );
};

export default API_URLS;
