// components/OkonomiPage.tsx

import React from 'react';

interface ReverseProxyPageProps {
  content: string;
}

export default function ReverseProxyPage({ content }: ReverseProxyPageProps)  {
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
};
