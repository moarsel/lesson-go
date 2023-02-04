import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Create a perfect lesson plan in seconds."
          />
          <meta property="og:site_name" content="lessongo.io" />
          <meta
            property="og:description"
            content="Create a perfect lesson plan in seconds."
          />
          <meta
            property="og:title"
            content="Lesson Go | Instant lesson plans"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Lesson go | Instant lesson plans"
          />
          <meta
            name="twitter:description"
            content="Create a perfect lesson plan in seconds."
          />
          <meta property="og:image" content="lessongo.io/og-image.png" />
          <meta name="twitter:image" content="lessongo.io/og-image.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
