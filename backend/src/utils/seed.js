import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "../config/database.js";
import User from "../models/User.js";
import BDE from "../models/BDE.js";
import Event from "../models/Event.js";
import Member from "../models/Member.js";
import Partner from "../models/Partner.js";
import slugify from "../utils/slugify.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
await connectDB();

// Clear database function
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await BDE.deleteMany({});
    await Event.deleteMany({});
    await Member.deleteMany({});
    await Partner.deleteMany({});
    console.log("✅ Base de données nettoyée");
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
  }
};

// Seed BDE
const seedBDEs = async () => {
  try {
    const bdes = await BDE.insertMany([
      {
        name: "BDE MMI",
        slug: slugify("BDE MMI"),
        fullName: "Bureau Des Étudiants MMI Lannion",
        description:
          "Le BDE des étudiants en Métiers du Multimédia et de l'Internet de Lannion",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "bde-mmi-logo",
        },
        colors: {
          primary: "#8B3FBF",
          secondary: "#A855F7",
        },
        socialLinks: {
          instagram: "https://instagram.com/bdemmi_lannion",
          facebook: "https://facebook.com/bdemmi.lannion",
        },
        contactEmail: "bde.mmi@iut-lannion.fr",
        displayOrder: 1,
      },
      {
        name: "BDE Info",
        slug: slugify("BDE Info"),
        fullName: "Bureau Des Étudiants Informatique Lannion",
        description: "Le BDE des étudiants en Informatique de Lannion",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "bde-info-logo",
        },
        colors: {
          primary: "#3B82F6",
          secondary: "#60A5FA",
        },
        socialLinks: {
          instagram: "https://instagram.com/bdeinfo_lannion",
        },
        contactEmail: "bde.info@iut-lannion.fr",
        displayOrder: 2,
      },
      {
        name: "BDE RT",
        slug: slugify("BDE RT"),
        fullName: "Bureau Des Étudiants Réseaux & Télécoms Lannion",
        description:
          "Le BDE des étudiants en Réseaux et Télécommunications de Lannion",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "bde-rt-logo",
        },
        colors: {
          primary: "#10B981",
          secondary: "#34D399",
        },
        socialLinks: {
          instagram: "https://instagram.com/bdert_lannion",
        },
        contactEmail: "bde.rt@iut-lannion.fr",
        displayOrder: 3,
      },
      {
        name: "BDE INFOCOM",
        slug: slugify("BDE INFOCOM"),
        fullName: "Bureau Des Étudiants Information et Communication",
        description:
          "Le BDE des étudiants en Information et Communication de Lannion",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "bde-gea-logo",
        },
        colors: {
          primary: "#F59E0B",
          secondary: "#FBBF24",
        },
        socialLinks: {
          instagram: "https://instagram.com/bdeinfo_lannion",
        },
        contactEmail: "bde.info@iut-lannion.fr",
        displayOrder: 4,
      },
      {
        name: "BDE MP",
        slug: slugify("BDE MP"),
        fullName: "Bureau Des Étudiants Matières physiques Lannion",
        description: "Le BDE des étudiants en MP de Lannion",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "bde-mp-logo",
        },
        colors: {
          primary: "#EF4444",
          secondary: "#F87171",
        },
        socialLinks: {
          instagram: "https://instagram.com/bde_mp_lannion",
        },
        contactEmail: "bde.mp@iut-lannion.fr",
        displayOrder: 5,
      },
    ]);

    console.log(`✅ ${bdes.length} BDE créés`);
    return bdes;
  } catch (error) {
    console.error("❌ Erreur lors de la création des BDE:", error);
    throw error;
  }
};

// Seed Users (Admin Interasso + Admin BDE)
const seedUsers = async (bdes) => {
  try {
    const users = [];

    // Admin Interasso
    users.push({
      username: "admin.interasso",
      email: "admin@interasso-lannion.fr",
      password: await bcrypt.hash("AdminInterasso2024!", 10),
      firstName: "Admin",
      lastName: "Interasso",
      role: "admin_interasso",
      bdeId: null,
    });

    // Admin BDE pour chaque BDE
    for (const bde of bdes) {
      const bdeName = bde.name.toLowerCase().replace(/\s+/g, "");
      users.push({
        username: `admin.${bdeName}`,
        email: `admin@${bdeName}-lannion.fr`,
        password: await bcrypt.hash(`Admin${bde.name}2024!`, 10),
        firstName: "Admin",
        lastName: bde.name,
        role: "admin_bde",
        bdeId: bde._id,
      });
    }

    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} utilisateurs créés`);
    return createdUsers;
  } catch (error) {
    console.error("❌ Erreur lors de la création des utilisateurs:", error);
    throw error;
  }
};

// Seed Members
const seedMembers = async (bdes) => {
  try {
    const members = [];

    for (const bde of bdes) {
      // Président
      members.push({
        firstName: "Jean",
        lastName: "Dupont",
        role: "Président",
        bio: `Président du ${bde.name} pour l'année 2024-2025`,
        email: `president@${bde.name
          .toLowerCase()
          .replace(/\s+/g, "")}-lannion.fr`,
        photo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: `${bde.slug}-president`,
        },
        promotion: "BUT 3",
        bdeId: bde._id,
        displayOrder: 1,
      });

      // Vice-Président
      members.push({
        firstName: "Marie",
        lastName: "Martin",
        role: "Vice-Président",
        bio: `Vice-Présidente du ${bde.name}`,
        email: `vp@${bde.name.toLowerCase().replace(/\s+/g, "")}-lannion.fr`,
        photo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: `${bde.slug}-vp`,
        },
        promotion: "BUT 2",
        bdeId: bde._id,
        displayOrder: 2,
      });

      // Trésorier
      members.push({
        firstName: "Thomas",
        lastName: "Bernard",
        role: "Trésorier",
        bio: `Trésorier du ${bde.name}`,
        email: `tresorier@${bde.name
          .toLowerCase()
          .replace(/\s+/g, "")}-lannion.fr`,
        photo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: `${bde.slug}-tresorier`,
        },
        promotion: "BUT 3",
        bdeId: bde._id,
        displayOrder: 3,
      });
    }

    const createdMembers = await Member.insertMany(members);
    console.log(`✅ ${createdMembers.length} membres créés`);
    return createdMembers;
  } catch (error) {
    console.error("❌ Erreur lors de la création des membres:", error);
    throw error;
  }
};

// Seed Events
const seedEvents = async (bdes, users) => {
  try {
    const events = [];
    const now = new Date();

    // Récupérer les admins BDE
    const adminBDEs = users.filter((u) => u.role === "admin_bde");

    // Événements pour chaque BDE
    for (let i = 0; i < bdes.length; i++) {
      const bde = bdes[i];
      const adminBDE = adminBDEs.find(
        (admin) => admin.bdeId.toString() === bde._id.toString()
      );

      // Événement publié (passé)
      events.push({
        title: `Soirée ${bde.name} - Rentrée 2024`,
        slug: slugify(`Soirée ${bde.name} - Rentrée 2024`),
        description: `Grande soirée de rentrée organisée par le ${bde.name} ! Venez nombreux pour célébrer le début de l'année !`,
        shortDescription: "Soirée de rentrée à ne pas manquer !",
        date: new Date(now.getFullYear(), 8, 15 + i, 20, 0), // Septembre  
        startDate: new Date(now.getFullYear(), 8, 15 + i, 20, 0), // Septembre
        endDate: new Date(now.getFullYear(), 8, 16 + i, 2, 0),
        location: "Le Viaduc - Lannion",
        address: "1 Rue du Viaduc, 22300 Lannion",
        price: 5,
        category: "soirée",
        image: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: `event-${bde.slug}-1`,
        },
        tags: ["soirée", "rentrée", "fête"],
        bdeId: bde._id,
        createdBy: adminBDE._id,
        status: "PUBLISHED",
        publishedAt: new Date(now.getFullYear(), 8, 1 + i),
        publishedBy: users.find((u) => u.role === "admin_interasso")._id,
      });

      // Événement publié (futur)
      events.push({
        title: `Tournoi ${bde.name} - Football`,
        slug: slugify(`Tournoi ${bde.name} - Football`),
        description: `Tournoi de football inter-promotions ! Inscrivez votre équipe dès maintenant.`,
        shortDescription: "Tournoi de football entre étudiants",
        date: new Date(now.getFullYear(), now.getMonth() + 1, 15, 14, 0),
        startDate: new Date(now.getFullYear(), now.getMonth() + 1, 15, 14, 0),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 15, 18, 0),
        location: "Stade municipal",
        address: "Avenue du Général de Gaulle, 22300 Lannion",
        price: 0,
        maxParticipants: 80,
        registrationRequired: true,
        registrationDeadline: new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          10
        ),
        category: "sport",
        image: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: `event-${bde.slug}-2`,
        },
        tags: ["sport", "football", "tournoi"],
        bdeId: bde._id,
        createdBy: adminBDE._id,
        status: "PUBLISHED",
        publishedAt: new Date(),
        publishedBy: users.find((u) => u.role === "admin_interasso")._id,
      });

      // Événement en attente
      if (i < 3) {
        events.push({
          title: `Soirée Noël ${bde.name}`,
          slug: slugify(`Soirée Noël ${bde.name}`),
          description: `Soirée de Noël pour célébrer les fêtes de fin d'année !`,
          shortDescription: "Célébrons Noël ensemble !",
          date: new Date(now.getFullYear(), 11, 15, 19, 0),
          startDate: new Date(now.getFullYear(), 11, 15, 19, 0),
          endDate: new Date(now.getFullYear(), 11, 16, 1, 0),
          location: "À définir",
          address: "Lannion",
          price: 8,
          category: "soirée",
          image: {
            url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            publicId: `event-${bde.slug}-3`,
          },
          tags: ["soirée", "noël", "fêtes"],
          bdeId: bde._id,
          createdBy: adminBDE._id,
          status: "PENDING",
        });
      }

      // Événement rejeté
      if (i === 0) {
        events.push({
          title: `Pool Party ${bde.name}`,
          slug: slugify(`Pool Party ${bde.name}`),
          description: `Pool party géante dans une piscine privée`,
          shortDescription: "Pool party entre amis",
          date: new Date(now.getFullYear(), 6, 20, 15, 0),
          startDate: new Date(now.getFullYear(), 6, 20, 15, 0),
          endDate: new Date(now.getFullYear(), 6, 20, 23, 0),
          location: "Piscine privée",
          address: "Adresse privée",
          price: 15,
          category: "soirée",
          image: {
            url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            publicId: `event-${bde.slug}-4`,
          },
          tags: ["soirée", "piscine", "été"],
          bdeId: bde._id,
          createdBy: adminBDE._id,
          status: "REJECTED",
          rejectionReason: "Événement ne respectant pas les normes de sécurité",
          rejectedAt: new Date(now.getFullYear(), 6, 15),
          rejectedBy: users.find((u) => u.role === "admin_interasso")._id,
        });
      }
    }

    const createdEvents = await Event.insertMany(events);
    console.log(`✅ ${createdEvents.length} événements créés`);
    return createdEvents;
  } catch (error) {
    console.error("❌ Erreur lors de la création des événements:", error);
    throw error;
  }
};

// Seed Partners
const seedPartners = async () => {
  try {
    const partners = await Partner.insertMany([
      {
        name: "Pizza Hut Lannion",
        description:
          "10% de réduction sur toutes les pizzas pour les étudiants avec la carte BDE",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "partner-pizzahut",
        },
        website: "https://www.pizzahut.fr",
        category: "restauration",
        benefits: ["10% de réduction", "Livraison gratuite dès 20€"],
        featured: true,
        displayOrder: 1,
      },
      {
        name: "Fnac Lannion",
        description:
          "Réductions exclusives sur les livres, musique et high-tech",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "partner-fnac",
        },
        website: "https://www.fnac.com",
        category: "culture",
        benefits: ["5% sur les livres", "10% sur les vinyles"],
        featured: true,
        displayOrder: 2,
      },
      {
        name: "Basic Fit Lannion",
        description: "Tarif préférentiel pour les étudiants",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "partner-basicfit",
        },
        website: "https://www.basic-fit.com",
        category: "sport",
        benefits: [
          "Abonnement étudiant à 19.99€/mois",
          "1 mois offert à l'inscription",
        ],
        featured: false,
        displayOrder: 3,
      },
      {
        name: "Le Viaduc",
        description:
          "Bar/Club partenaire avec réductions pour les soirées étudiantes",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "partner-viaduc",
        },
        website: "https://www.leviaduc-lannion.fr",
        category: "autre",
        benefits: [
          "Entrée gratuite sur présentation carte BDE",
          "-1€ sur les consommations",
        ],
        featured: true,
        displayOrder: 4,
      },
      {
        name: "Cultura Lannion",
        description: "Fournitures scolaires et loisirs créatifs à prix réduit",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "partner-cultura",
        },
        website: "https://www.cultura.com",
        category: "culture",
        benefits: [
          "15% sur les fournitures scolaires",
          "10% sur les loisirs créatifs",
        ],
        featured: false,
        displayOrder: 5,
      },
      {
        name: "Subway Lannion",
        description: "Sandwichs frais avec réduction étudiante",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "partner-subway",
        },
        website: "https://www.subway.com",
        category: "restauration",
        benefits: ["10% de réduction", "Cookie offert le mercredi"],
        featured: false,
        displayOrder: 6,
      },
      {
        name: "Cinéma Les Baladins",
        description: "Tarif préférentiel pour les séances ciné",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "partner-cinema",
        },
        website: "https://www.allocine.fr",
        category: "autre",
        benefits: ["Tarif étudiant à 6€", "Popcorn offert le lundi"],
        featured: true,
        displayOrder: 7,
      },
      {
        name: "Decathlon Lannion",
        description: "Équipement sportif à prix réduit",
        logo: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "partner-decathlon",
        },
        website: "https://www.decathlon.fr",
        category: "sport",
        benefits: ["10% sur tout le magasin", "Livraison gratuite en magasin"],
        featured: false,
        displayOrder: 8,
      },
    ]);

    console.log(`✅ ${partners.length} partenaires créés`);
    return partners;
  } catch (error) {
    console.error("❌ Erreur lors de la création des partenaires:", error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log("🌱 Démarrage du seeding...\n");

    // Clear database
    await clearDatabase();
    console.log("");

    // Seed data
    const bdes = await seedBDEs();
    console.log("");

    const users = await seedUsers(bdes);
    console.log("");

    const members = await seedMembers(bdes);
    console.log("");

    const events = await seedEvents(bdes, users);
    console.log("");

    const partners = await seedPartners();
    console.log("");

    // Summary
    console.log("📊 RÉSUMÉ DU SEEDING");
    console.log("═".repeat(50));
    console.log(`✅ ${bdes.length} BDE créés`);
    console.log(`✅ ${users.length} utilisateurs créés`);
    console.log(`   - 1 Admin Interasso`);
    console.log(`   - ${users.length - 1} Admin BDE`);
    console.log(`✅ ${members.length} membres de bureau créés`);
    console.log(`✅ ${events.length} événements créés`);
    console.log(
      `   - ${events.filter((e) => e.status === "PUBLISHED").length} publiés`
    );
    console.log(
      `   - ${events.filter((e) => e.status === "PENDING").length} en attente`
    );
    console.log(
      `   - ${events.filter((e) => e.status === "REJECTED").length} rejetés`
    );
    console.log(`✅ ${partners.length} partenaires créés`);
    console.log("═".repeat(50));
    console.log("\n🎉 Seeding terminé avec succès!\n");

    console.log("📝 COMPTES DE TEST");
    console.log("═".repeat(50));
    console.log("Admin Interasso:");
    console.log("  Email: admin@interasso-lannion.fr");
    console.log("  Password: AdminInterasso2024!");
    console.log("");
    for (const bde of bdes) {
      const bdeName = bde.name.toLowerCase().replace(/\s+/g, "");
      console.log(`Admin ${bde.name}:`);
      console.log(`  Email: admin@${bdeName}-lannion.fr`);
      console.log(`  Password: Admin${bde.name}2024!`);
    }
    console.log("═".repeat(50));

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ Connexion MongoDB fermée");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erreur lors du seeding:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
