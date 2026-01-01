import { Montserrat, Antonio } from "next/font/google";
import "./globals.css";
// Si Footer.js est dans src/app, cet import fonctionne :
import Footer from "@/app/Footer";

// Configuration des polices
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const antonio = Antonio({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  // On garde le nom de variable --font-bebas pour que ton CSS existant continue de fonctionner
  variable: "--font-bebas", 
});

export const metadata = {
  title: "Focus Documentaire",
  description: "Plateforme de documentaires indépendants",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${montserrat.variable} ${antonio.variable}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        
        {/* Le contenu de tes pages s'affiche ici */}
        {children}
        
        {/* Le pied de page s'affiche en bas de toutes les pages */}
        <Footer />
        
      </body>
    </html>
  );
}