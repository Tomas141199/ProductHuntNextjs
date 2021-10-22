import Header from "./Header";
import Head from "next/head";

const Layout = (props) => {
  return (
    <>
      <Head>
        <title>Product Hunt Firebase y Next.js</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
          integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU="
          crossOrigin="anonymous"
        />
      </Head>

      <Header />

      <main>{props.children}</main>
    </>
  );
};

export default Layout;
