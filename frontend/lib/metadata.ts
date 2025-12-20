import { Metadata } from "next";

export const baseMetadata: Metadata = {
    metadataBase: new URL("https://Hirion.omsharma.xyz"),
    title: {
        default: "Hirion | Resume Builder Prototype",
        template: "%s | Hirion",
    },
    description:
        "Hirion is a customizable, modern resume builder that helps users craft professional resumes with ease. Currently in prototype phase.",
    keywords: [
        "resume builder",
        "cv generator",
        "Hirion",
        "modern resume template",
        "customizable cv",
        "nextjs resume app",
    ],
    authors: [{ name: "Om Sharma" }],
    creator: "Om Sharma",
    publisher: "Hirion",

    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://Hirion.omsharma.xyz",
        title: "Hirion — Build Better Resumes, Effortlessly",
        description:
            "Create beautiful, customizable resumes with Hirion. Currently under development as a prototype.",
        siteName: "Hirion",
        images: [
            {
                url: "/brand/Hirion-preview.png",
                width: 1280,
                height: 720,
                alt: "Hirion - Resume Builder UI Preview",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Hirion — Build Better Resumes, Effortlessly",
        description:
            "Create beautiful, customizable resumes with Hirion. Currently under development as a prototype.",
        creator: "@1omsharma",
        images: ["/brand/Hirion-preview.png"],
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
        canonical: "https://Hirion.omsharma.xyz",
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
    name: "Hirion",
    url: "https://Hirion.omsharma.xyz",
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
