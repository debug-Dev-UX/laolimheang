// src/components/common/SEO.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, image, url, type = "website" }) => {
  const defaultTitle = "LaolimHeang — Portfolio & Digital Services";
  const defaultDesc =
    "Full Stack Developer specializing in modern web applications, 3D experiences, and digital solutions.";

  const finalTitle = title ? `${title} | LaolimHeang` : defaultTitle;
  const finalDesc = description || defaultDesc;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      {url && <link rel="canonical" href={url} />}
      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;