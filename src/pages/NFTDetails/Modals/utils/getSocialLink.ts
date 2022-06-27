function objectToGetParams(object: Record<string, string | number | undefined | null>) {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );

  return params.length > 0 ? `?${params.join('&')}` : '';
}

export type Social = 'twitter' | 'reddit' | 'telegram' | 'facebook';

const socialLinks: Record<Social, string> = {
  twitter: 'https://twitter.com/share',
  reddit: 'https://www.reddit.com/submit',
  telegram: 'https://telegram.me/share/url',
  facebook: 'https://www.facebook.com/sharer/sharer.php',
};

export default function getSocialLink(
  socialTitle: Social,
  params: Record<string, string | number | undefined | null>,
) {
  return socialLinks[socialTitle] + objectToGetParams(params);
}
