// src/app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json(); // On récupère les infos du formulaire

    // 1. Configuration du "facteur" (Transporteur Zoho)
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.eu", // ou smtp.zoho.com si ton compte n'est pas en Europe
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    // 2. Préparation du mail
    const mailOptions = {
      from: process.env.ZOHO_EMAIL, // L'expéditeur doit être ton adresse Zoho
      to: process.env.ZOHO_EMAIL,   // Tu te l'envoies à toi-même
      replyTo: data.email,          // Pour que tu puisses répondre directement au visiteur
      subject: `[SITE WEB] ${data.subject} : ${data.name}`,
      text: `
        Nouveau message depuis le site Focus Documentaire :
        
        Nom : ${data.name}
        Email : ${data.email}
        Type de demande : ${data.subject}
        
        --- MESSAGE ---
        ${data.message}
        
        ${data.filmTitle ? `--- PROPOSITION DE FILM ---\nTitre : ${data.filmTitle}\nRéa : ${data.director}\nLien : ${data.filmLink}` : ''}
      `,
    };

    // 3. Envoi du mail
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email envoyé !" });

  } catch (error) {
    console.error("Erreur d'envoi email:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}