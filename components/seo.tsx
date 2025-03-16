import Head from "next/head"

interface SeoProps {
  title: string
  description?: string
  canonical?: string
  ogImage?: string
  noIndex?: boolean
}

export function Seo({
  title,
  description = "Lwie Platform - Swap and exchange items efficiently",
  canonical,
  ogImage = "/og-image.jpg",
  noIndex = false,
}: SeoProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lwie.com"
  const fullTitle = `${title} | Lwie Platform`
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Canonical URL */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonical || siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical || siteUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* No index if specified */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Head>
  )
}

