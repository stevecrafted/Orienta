import { Metadata } from "next";

export const baseMetadata: Metadata = {
    metadataBase: new URL("https://Orienta.omsharma.xyz"),
    title: {
        default: "Orienta | Resume Builder Prototype",
        template: "%s | Orienta",
    },
    description:
        "Orienta is a customizable, modern resume builder that helps users craft professional resumes with ease. Currently in prototype phase.",
    keywords: [
        "resume builder",
        "cv generator",
        "Orienta",
        "modern resume template",
        "customizable cv",
        "nextjs resume app",
    ],
    authors: [{ name: "Om Sharma" }],
    creator: "Om Sharma",
    publisher: "Orienta",

    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://Orienta.omsharma.xyz",
        title: "Orienta — Build Better Resumes, Effortlessly",
        description:
            "Create beautiful, customizable resumes with Orienta. Currently under development as a prototype.",
        siteName: "Orienta",
        images: [
            {
                url: "/brand/Orienta-preview.png",
                width: 1280,
                height: 720,
                alt: "Orienta - Resume Builder UI Preview",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Orienta — Build Better Resumes, Effortlessly",
        description:
            "Create beautiful, customizable resumes with Orienta. Currently under development as a prototype.",
        creator: "@1omsharma",
        images: ["/brand/Orienta-preview.png"],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    verification: {
        google: "your-google-site-verification-code",
    },

    alternates: {
        canonical: "https://Orienta.omsharma.xyz",
    },

    icons: {
        icon: [
            { url: "/brand/favicon.png" },
            { url: "/brand/favicon.png", sizes: "180x180", type: "image/png" },
        ],
        apple: [{ url: "/brand/favicon.png" }],
    },

    other: {
        "msapplication-TileColor": "#ffffff",
        "theme-color": "#ffffff",
    },
};

// Optional: JSON-LD structured data
export const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Orienta",
    url: "https://Orienta.omsharma.xyz",
    description:
        "Customizable and modern resume builder built with React and Redux Toolkit. Currently a prototype project.",
    applicationCategory: "Productivity",
    operatingSystem: "All",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
};
