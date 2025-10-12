import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  /**
   * Initialiser le transporteur email
   */
  initTransporter() {
    // Vérifier si la config email est présente
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠️  Email non configuré - Les emails ne seront pas envoyés');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      console.log('✅ Service email initialisé');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du service email:', error);
    }
  }

  /**
   * Envoyer un email
   */
  async sendEmail(to, subject, html) {
    if (!this.transporter) {
      console.log('⚠️  Email non configuré - Email non envoyé');
      return null;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"Interasso" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      });

      console.log(`✅ Email envoyé: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  }

  /**
   * Email: Événement soumis (Admin Interasso)
   */
  async sendEventSubmittedEmail(event, bde, adminEmail) {
    const subject = `🆕 Nouvel événement à valider - ${bde.name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563EB;">Nouvel événement à valider</h2>
        
        <p>Bonjour,</p>
        
        <p>Le <strong>${bde.name}</strong> a soumis un nouvel événement qui attend votre validation :</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${event.title}</h3>
          <p><strong>📅 Date :</strong> ${new Date(event.date).toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p><strong>📍 Lieu :</strong> ${event.location}</p>
          <p><strong>🏷️ Catégorie :</strong> ${event.category}</p>
          <p><strong>📝 Description :</strong></p>
          <p>${event.description.substring(0, 200)}${event.description.length > 200 ? '...' : ''}</p>
        </div>
        
        <p>Connectez-vous à votre dashboard pour valider ou refuser cet événement.</p>
        
        <p style="margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}/dashboard/interasso" 
             style="background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Voir l'événement
          </a>
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="color: #6b7280; font-size: 12px;">
          Cet email a été envoyé automatiquement par la plateforme Interasso.
        </p>
      </div>
    `;

    return this.sendEmail(adminEmail, subject, html);
  }

  /**
   * Email: Événement validé (Admin BDE)
   */
  async sendEventValidatedEmail(event, bde, adminBDEEmail) {
    const subject = `✅ Votre événement "${event.title}" a été validé !`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">✅ Événement validé !</h2>
        
        <p>Bonjour ${bde.name},</p>
        
        <p>Félicitations ! Votre événement a été validé par l'équipe Interasso et est maintenant visible sur le site.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
          <h3 style="margin-top: 0; color: #10B981;">${event.title}</h3>
          <p><strong>📅 Date :</strong> ${new Date(event.date).toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p><strong>📍 Lieu :</strong> ${event.location}</p>
          <p><strong>✅ Statut :</strong> Publié</p>
        </div>
        
        <p>L'événement est désormais visible par tous les étudiants sur la plateforme.</p>
        
        <p style="margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}/events/${event.slug}" 
             style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Voir l'événement
          </a>
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="color: #6b7280; font-size: 12px;">
          Cet email a été envoyé automatiquement par la plateforme Interasso.
        </p>
      </div>
    `;

    return this.sendEmail(adminBDEEmail, subject, html);
  }

  /**
   * Email: Événement refusé (Admin BDE)
   */
  async sendEventRejectedEmail(event, bde, adminBDEEmail, rejectionReason) {
    const subject = `❌ Votre événement "${event.title}" a été refusé`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #EF4444;">Événement refusé</h2>
        
        <p>Bonjour ${bde.name},</p>
        
        <p>Malheureusement, votre événement n'a pas été validé par l'équipe Interasso.</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444;">
          <h3 style="margin-top: 0; color: #EF4444;">${event.title}</h3>
          <p><strong>📅 Date prévue :</strong> ${new Date(event.date).toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p><strong>📍 Lieu :</strong> ${event.location}</p>
        </div>
        
        <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #F59E0B;">Raison du refus :</h4>
          <p style="color: #92400E;">${rejectionReason}</p>
        </div>
        
        <p>Vous pouvez modifier votre événement et le soumettre à nouveau en tenant compte de ces remarques.</p>
        
        <p style="margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}/dashboard/bde" 
             style="background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Accéder au dashboard
          </a>
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="color: #6b7280; font-size: 12px;">
          Cet email a été envoyé automatiquement par la plateforme Interasso.
        </p>
      </div>
    `;

    return this.sendEmail(adminBDEEmail, subject, html);
  }
}

export default new EmailService();
