"use client";
import { useState } from 'react';
import Header from '../Header';

export default function Contact() {
  const [formType, setFormType] = useState('message'); 
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("Envoi en cours...");

    // On récupère les données du formulaire
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // On ajoute le sujet manuellement selon le bouton choisi
    data.subject = formType === 'proposition' 
      ? "Proposition de Film" 
      : "Message Contact";

    try {
      // C'est ici qu'on appelle TON fichier route.js
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (json.success) {
        setResult("Merci ! Votre message a bien été envoyé.");
        e.target.reset();
      } else {
        setResult("Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } catch (error) {
      setResult("Une erreur s'est produite.");
    }
    
    setIsSubmitting(false);
  };

  // --- STYLES (Identiques à avant) ---
  const inputStyle = {
    width: '100%', padding: '15px', marginBottom: '20px',
    borderRadius: '12px', border: '2px solid #ddd',
    fontFamily: 'var(--font-montserrat)', fontSize: '1rem', outline: 'none'
  };

  const buttonStyle = (isActive) => ({
    padding: '10px 20px', borderRadius: '30px', border: '2px solid #33a002',
    backgroundColor: isActive ? '#33a002' : 'transparent',
    color: isActive ? 'white' : '#33a002',
    fontFamily: 'var(--font-bebas)', fontSize: '1.2rem', cursor: 'pointer',
    marginRight: '15px', transition: 'all 0.3s'
  });

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '140px' }}>
      <Header />

      <section style={{ padding: '0 5%', maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '4rem', color: '#1a1a1a', margin: 0 }}>
            Contact & <span style={{ color: '#33a002' }}>Propositions</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-montserrat)', color: '#666' }}>
            Une question ou un documentaire à nous partager ?
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <button type="button" onClick={() => setFormType('message')} style={buttonStyle(formType === 'message')}>
            ✉️ Envoyer un Message
          </button>
          <button type="button" onClick={() => setFormType('proposition')} style={buttonStyle(formType === 'proposition')}>
            🎬 Proposer un Film
          </button>
        </div>

        <div style={{ backgroundColor: '#f9f9f9', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit}>
            
            <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'var(--font-bebas)', fontSize: '1.1rem' }}>Votre Nom</label>
            <input type="text" name="name" required placeholder="Jean-Henri Meunier" style={inputStyle} />

            <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'var(--font-bebas)', fontSize: '1.1rem' }}>Votre Email</label>
            <input type="email" name="email" required placeholder="meunier@email.com" style={inputStyle} />

            {formType === 'proposition' && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '10px', marginBottom: '20px', borderLeft: '4px solid #33a002' }}>
                  <p style={{ margin: 0, fontFamily: 'var(--font-montserrat)', fontSize: '0.9rem', color: '#1b5e20' }}>
                    Merci de contribuer à la Docuthèque !
                  </p>
                </div>
                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'var(--font-bebas)', fontSize: '1.1rem' }}>Titre du Film</label>
                <input type="text" name="filmTitle" required placeholder="Ex: La Marche de l'Empereur" style={inputStyle} />

                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'var(--font-bebas)', fontSize: '1.1rem' }}>Réalisateur</label>
                <input type="text" name="director" placeholder="Nom du réalisateur" style={inputStyle} />
                
                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'var(--font-bebas)', fontSize: '1.1rem' }}>Lien vers le film</label>
                <input type="url" name="filmLink" placeholder="https://..." style={inputStyle} />
              </div>
            )}

            <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'var(--font-bebas)', fontSize: '1.1rem' }}>
              {formType === 'proposition' ? "Pourquoi ce film ?" : "Votre Message"}
            </label>
            <textarea 
              name="message" required rows="5" 
              placeholder={formType === 'proposition' ? "Dites-nous pourquoi ce film a sa place ici..." : "Écrivez votre message ici..."}
              style={{ ...inputStyle, resize: 'vertical' }}
            ></textarea>

            <button type="submit" disabled={isSubmitting} style={{
              backgroundColor: '#1a1a1a', color: 'white', border: 'none',
              padding: '15px 40px', borderRadius: '50px',
              fontFamily: 'var(--font-bebas)', fontSize: '1.5rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer', width: '100%', marginTop: '10px',
              opacity: isSubmitting ? 0.7 : 1
            }}>
              {isSubmitting ? "Envoi..." : "Envoyer"}
            </button>

            {result && (
              <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'var(--font-montserrat)', fontWeight: 'bold', color: result.includes('Merci') ? '#33a002' : 'red' }}>
                {result}
              </p>
            )}

          </form>
        </div>
      </section>
      <style jsx>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </main>
  );
}