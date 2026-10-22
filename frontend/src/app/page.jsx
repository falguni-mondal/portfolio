import initialData from "@/data.json";
import PortfolioClientShell from "@/components/PortfolioClientShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://byfalguni.com";
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;

async function getPortfolioData() {
  if (!ADMIN_API_URL) {
    return initialData;
  }
  try {
    const res = await fetch(`${ADMIN_API_URL}/api/portfolio`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return initialData;
    const liveData = await res.json();
    if (liveData && Array.isArray(liveData.works)) {
      return { ...initialData, ...liveData };
    }
    return initialData;
  } catch {
    return initialData;
  }
}

function buildJsonLd(data) {
  const sameAsLinks = [
    data.contact?.linkedin,
    data.contact?.github,
    data.contact?.insta,
  ].filter(Boolean);

  const rawHeroImg = data.heroImageDark || "/me.webp";
  const resolvedHeroImg = rawHeroImg.startsWith("http")
    ? rawHeroImg
    : `${SITE_URL}${rawHeroImg.startsWith("/") ? "" : "/"}${rawHeroImg}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Falguni Mondal",
        givenName: "Falguni",
        familyName: "Mondal",
        url: SITE_URL,
        image: resolvedHeroImg,
        jobTitle: "Creative Full-Stack MERN Developer",
        description:
          "Creative Full-Stack MERN Developer based in Durgapur, West Bengal, India. Helping brands gain an unfair advantage by developing digital adrenaline.",
        email: `mailto:${data.contact?.mail || "heyafalguni@gmail.com"}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Durgapur",
          addressRegion: "West Bengal",
          addressCountry: "IN",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Bengal College of Engineering and Technology",
        },
        worksFor: {
          "@type": "Organization",
          name: data.experience?.[0]?.name || "Graphitage",
        },
        knowsAbout: data.arsenal || [],
        sameAs: sameAsLinks,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Falguni Mondal | Creative Full-Stack MERN Developer",
        description:
          "Portfolio of Falguni Mondal — Creative Full-Stack MERN Developer specializing in React, Next.js, Node.js, GSAP animations, and Three.js / WebGL.",
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: "Falguni Mondal Portfolio",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#person`,
        },
        mainEntity: {
          "@id": `${SITE_URL}/#person`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#works-list`,
        name: "Professional Works & Client Projects",
        itemListElement: (data.works || []).map((work, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "CreativeWork",
            name: work.name,
            description: work.description,
            url: work.url || SITE_URL,
            creator: {
              "@id": `${SITE_URL}/#person`,
            },
          },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#lab-list`,
        name: "The Lab — Personal R&D Projects",
        itemListElement: (data.lab || []).map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "SoftwareSourceCode",
            name: item.name,
            url: item.projectUrl || SITE_URL,
            image: item.image1,
            programmingLanguage: item.tools,
            author: {
              "@id": `${SITE_URL}/#person`,
            },
          },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#credentials-list`,
        name: "Verified Credentials & Certifications",
        itemListElement: (data.certificates || []).map((cert, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "EducationalOccupationalCredential",
            name: cert.name,
            url: cert.url,
            dateCreated: cert.year,
            recognizedBy: {
              "@type": "Organization",
              name: cert.organization,
            },
          },
        })),
      },
    ],
  };
}

export default async function HomePage() {
  const portfolioData = await getPortfolioData();
  const jsonLd = buildJsonLd(portfolioData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\u003c"),
        }}
      />
      <PortfolioClientShell initialData={portfolioData} />
    </>
  );
}