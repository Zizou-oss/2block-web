import { useEffect } from "react";

const SITE_URL = "https://2block-web-ctth.vercel.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertJsonLd(id, payload) {
  let element = document.head.querySelector(`#${id}`);
  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.id = id;
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(payload);
}

function removeJsonLd(id) {
  const element = document.head.querySelector(`#${id}`);
  if (element) {
    element.remove();
  }
}

export function useSeo({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  robots = "index,follow",
  jsonLd,
}) {
  useEffect(() => {
    const url = `${SITE_URL}${path === "/" ? "" : path}`;

    document.documentElement.lang = "fr";
    document.title = title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: robots,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: "fr_FR",
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: url,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: image,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "2Block Musique",
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: image,
    });
    upsertMeta('meta[name="theme-color"]', {
      name: "theme-color",
      content: "#06030d",
    });
    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: url,
    });

    if (jsonLd) {
      upsertJsonLd("seo-jsonld", jsonLd);
    } else {
      removeJsonLd("seo-jsonld");
    }
  }, [description, image, jsonLd, path, robots, title, type]);
}

export function buildHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "2Block Musique",
        url: SITE_URL,
        logo: DEFAULT_OG_IMAGE,
        sameAs: [
          "https://www.youtube.com/channel/UCyocrqnJAISwzSDuordRgyw",
          "http://www.tiktok.com/@2blockofficiel",
          "https://bit.ly/4mfVSKK",
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: "2Block Musique",
        operatingSystem: "Android",
        applicationCategory: "MusicApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "XOF",
        },
        downloadUrl: `${SITE_URL}/telecharger/android`,
        url: SITE_URL,
        image: DEFAULT_OG_IMAGE,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "2Block Musique",
        inLanguage: "fr",
      },
    ],
  };
}

export function buildDownloadJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "2Block Musique",
    operatingSystem: "Android",
    applicationCategory: "MusicApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "XOF",
    },
    downloadUrl: `${SITE_URL}/telecharger/android`,
    url: `${SITE_URL}/telecharger/android`,
    image: DEFAULT_OG_IMAGE,
  };
}

export function buildPrivacyJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Politique de confidentialite - 2Block Musique",
    url: `${SITE_URL}/politique-confidentialite`,
    isPartOf: {
      "@type": "WebSite",
      name: "2Block Musique",
      url: SITE_URL,
    },
  };
}

export { SITE_URL, DEFAULT_OG_IMAGE };
