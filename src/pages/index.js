import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Panel from "../components/form";

function IndexPage() {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />

      <section className="text-center">
        <Panel />
      </section>
    </Layout>
  );
}

export default IndexPage;
