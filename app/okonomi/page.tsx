// app/okonomi/page.tsx

import React from 'react';
import ReverseProxyPage from '@/components/reverseProxy/reverseProxy';

async function fetchContent() {
  try {
    const res = await fetch('https://cybernetisk.github.io/okotools/');

    if (!res.ok) {
      throw new Error(`An error occurred while fetching the data: ${res.statusText}`);
    }

    const text = await res.text();
    return text;
  } catch (error) {
    console.error('Failed to fetch HTML content:', error);
    return '<p>Failed to load content</p>';
  }
}

const OkonomiPageComponent = async () => {
  const content = await fetchContent();

  return <ReverseProxyPage content={content} />;
};

export default OkonomiPageComponent;
