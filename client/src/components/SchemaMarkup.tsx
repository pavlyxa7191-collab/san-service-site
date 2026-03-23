/**
 * SchemaMarkup — injects JSON-LD structured data for SEO.
 * Supports: LocalBusiness, Service, FAQPage, BreadcrumbList
 */

import { SITE_URL } from "@/siteConfig";

interface LocalBusinessSchemaProps {
  type?: "local_business";
}

interface ServiceSchemaProps {
  type: "service";
  name: string;
  description: string;
  priceFrom: number;
  url: string;
  faq?: Array<{ q: string; a: string }>;
}

interface BreadcrumbSchemaProps {
  type: "breadcrumb";
  items: Array<{ name: string; url: string }>;
}

interface FaqSchemaProps {
  type: "faq";
  items: Array<{ q: string; a: string }>;
}

interface WebsiteSchemaProps {
  type: "website";
}

interface ArticleSchemaProps {
  type: "article";
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}

type SchemaMarkupProps =
  | LocalBusinessSchemaProps
  | ServiceSchemaProps
  | BreadcrumbSchemaProps
  | FaqSchemaProps
  | WebsiteSchemaProps
  | ArticleSchemaProps;

const PHONE = "+74951452169";
const PHONE_CLEAN = "+74951452169";
const ORG_NAME = "ЭкоЦентр — Санитарная служба";
const ORG_DESCRIPTION =
  "Профессиональная дезинсекция, дезинфекция и дератизация в Москве и Московской области. Уничтожение клопов, тараканов, грызунов, клещей, плесени. Гарантия до 3 лет.";

export default function SchemaMarkup(props: SchemaMarkupProps) {
  let schema: object | null = null;

  if (!props.type || props.type === "local_business") {
    schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#organization`,
      name: ORG_NAME,
      description: ORG_DESCRIPTION,
      url: SITE_URL,
      telephone: PHONE,
      priceRange: "от 1500 ₽",
      image: `${SITE_URL}/og-image.svg`,
      logo: `${SITE_URL}/favicon.svg`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Москва",
        addressRegion: "Московская область",
        addressCountry: "RU",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 55.7558,
        longitude: 37.6173,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
      ],
      areaServed: [
        { "@type": "City", name: "Москва" },
        { "@type": "AdministrativeArea", name: "Московская область" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Услуги дезинфекции",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Уничтожение клопов" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Уничтожение тараканов" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Уничтожение грызунов" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Уничтожение клещей" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Уничтожение плесени" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Дезинфекция помещений" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Устранение запахов и озонация" } },
        ],
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "312",
        bestRating: "5",
      },
      sameAs: [
        "https://vk.com/ecocentr_ses",
      ],
    };
  } else if (props.type === "service") {
    const schemas: object[] = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: props.name,
        description: props.description,
        url: props.url,
        provider: {
          "@type": "LocalBusiness",
          "@id": `${SITE_URL}/#organization`,
          name: ORG_NAME,
          telephone: PHONE_CLEAN,
        },
        areaServed: { "@type": "City", name: "Москва" },
        offers: {
          "@type": "Offer",
          priceCurrency: "RUB",
          price: props.priceFrom.toString(),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            priceCurrency: "RUB",
            price: props.priceFrom.toString(),
            name: "от",
          },
        },
      },
    ];

    if (props.faq && props.faq.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: props.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      });
    }

    return (
      <>
        {schemas.map((s, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(s, null, 0) }}
          />
        ))}
      </>
    );
  } else if (props.type === "breadcrumb") {
    schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: props.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      })),
    };
  } else if (props.type === "faq") {
    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: props.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };
  } else if (props.type === "website") {
    schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: ORG_NAME,
      url: SITE_URL,
      inLanguage: "ru-RU",
      publisher: { "@id": `${SITE_URL}/#organization` },
    };
  } else if (props.type === "article") {
    schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: props.headline,
      description: props.description,
      url: props.url,
      datePublished: props.datePublished,
      dateModified: props.dateModified ?? props.datePublished,
      image: props.image ?? `${SITE_URL}/og-image.svg`,
      author: {
        "@type": "Organization",
        name: ORG_NAME,
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: ORG_NAME,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/favicon.svg`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": props.url,
      },
    };
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}
