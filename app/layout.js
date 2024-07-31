
export const metadata = {
  title: "cyb.no",
  description: "the website for Cybernetisk Selskab",
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  ) 
}