import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Credit Card Fraud Payment Predcition",
  description: "This model lets you check for fraud payment of credit card base on the dataset it was trained on.",
  keywords: ["credit", "credit card", "credit-card", "credit card fraud", "fraud", "fraud payment", "payment fraud", "credit card fraud detection", "credit card fraud prediction", "fraud detection", "fraud prediction"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
