import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Create an engaging lesson plan in seconds."
          />
          <meta property="og:site_name" content="lessonrobot.com" />
          <meta
            property="og:description"
            content="Create an engaging lesson plan in seconds."
          />
          <meta
            property="og:title"
            content="Lesson Robot | Instant lesson plans"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Lesson Robot | Instant lesson plans"
          />
          <meta
            name="twitter:description"
            content="Create an engaging lesson plan in seconds."
          />
          <meta property="og:image" content="lessonrobot.com/og-image.png" />
          <meta name="twitter:image" content="lessonrobot.com/og-image.png" />
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
