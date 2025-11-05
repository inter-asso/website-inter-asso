import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import PublicLayout from "../../components/layout/PublicLayout";
import eventService from "../../services/eventService";
import bdeService from "../../services/bdeService";
import partnerService from "../../services/partnerService";
import { formatDate } from "../../utils/dateUtils";
import { EVENT_CATEGORIES } from "../../utils/constants";
import AnimatedCard from "@/components/magicui/animated-card";
import NumberTicker from "@/components/magicui/number-ticker";
import { Marquee } from "@/components/ui/marquee";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { Pointer } from "@/components/ui/pointer";

// Convert EVENT_CATEGORIES object to array for easier usage
const EVENT_CATEGORIES_ARRAY = [
  { value: "soirée", label: "Soirée", emoji: "🎉" },
  { value: "sport", label: "Sport", emoji: "⚽" },
  { value: "culture", label: "Culture", emoji: "🎭" },
  { value: "atelier", label: "Atelier", emoji: "🛠️" },
  { value: "sortie", label: "Sortie", emoji: "🚌" },
  { value: "autre", label: "Autre", emoji: "📌" },
];

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  // States for dynamic content
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredBDEs, setFeaturedBDEs] = useState([]);
  const [partners, setPartners] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBDEs: 0,
    totalPartners: 0,
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load upcoming events (3 most recent published events)
      const eventsData = await eventService.getAllEvents({
        upcoming: true,
        limit: 3,
      });
      setUpcomingEvents(eventsData.slice(0, 3));

      // Load BDEs (first 3)
      const bdesData = await bdeService.getAllBDEs();
      setFeaturedBDEs(bdesData.slice(0, 3));

      // Load partners (first 6)
      const partnersData = await partnerService.getAllPartners();
      setPartners(partnersData.slice(0, 6));

      // Calculate stats
      setStats({
        totalEvents: eventsData.length,
        totalBDEs: bdesData.length,
        totalPartners: partnersData.length,
      });
    } catch (error) {
      console.error("Erreur chargement données homepage:", error);
    }
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-light_orange-900 via-white to-salmon_pink-900">
        {/* <Pointer className="text-purple-600">
          <div className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
            ✨ Explore !
          </div>
        </Pointer> */}
        {/* <Pointer className="fill-blue-500" /> */}

        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Bienvenue à l'
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blush to-raspberry_rose">
                IUT de Lannion
              </span>{" "}
              🎓
            </h1>
            <p className="text-xl text-chocolate_cosmos mb-8">
              Découvre les BDE, les événements et toute la vie étudiante de ton
              campus !
            </p>

            {isAuthenticated ? (
              <div className="space-x-4 hero-buttons">
                <Link
                  to="/events"
                  className="inline-block px-8 py-3 bg-blush text-white font-medium rounded-lg hover:bg-blush-600 transition-colors shadow-lg shadow-blush/30"
                >
                  🎉 Découvrir les événements
                </Link>
                <Link
                  to="/bdes"
                  className="inline-block px-8 py-3 bg-raspberry_rose text-white font-medium rounded-lg hover:bg-raspberry_rose-600 transition-colors"
                >
                  🎓 Les BDE
                </Link>
                <Link
                  to={
                    user?.role === "admin_interasso"
                      ? "/admin/validation"
                      : "/admin/events"
                  }
                  className="inline-block px-8 py-3 text-sm bg-light_orange-800 text-chocolate_cosmos font-medium rounded-lg hover:bg-light_orange-700 transition-colors"
                >
                  ⚙️ Espace Admin
                </Link>
              </div>
            ) : (
              <div className="space-x-4 hero-buttons">
                <Link
                  to="/events"
                  className="inline-block px-8 py-3 bg-blush text-white font-medium rounded-lg hover:bg-blush-600 transition-colors shadow-lg shadow-blush/30"
                >
                  🎉 Découvrir les événements
                </Link>
                <Link
                  to="/bdes"
                  className="inline-block px-8 py-3 bg-raspberry_rose text-white font-medium rounded-lg hover:bg-raspberry_rose-600 transition-colors"
                >
                  🎓 Les BDE
                </Link>
                <Link
                  to="/login"
                  className="inline-block px-6 py-2 text-sm bg-light_orange-800 text-chocolate_cosmos font-medium rounded-lg hover:bg-light_orange-700 transition-colors"
                >
                  Connexion
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <AnimatedCard delay={0.1}>
              <Link
                to="/events"
                className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Événements à venir
                </h3>
                <p className="text-gray-600">
                  Soirées, concerts, afterworks... Ne rate aucun événement de
                  ton campus !
                </p>
              </Link>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <Link
                to="/bdes"
                className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nos BDE
                </h3>
                <p className="text-gray-600">
                  Découvre tous les BDE de l'IUT et leurs équipes passionnées
                </p>
              </Link>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <Link
                to="/partners"
                className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nos Partenaires
                </h3>
                <p className="text-gray-600">
                  Profite de réductions exclusives chez nos partenaires locaux
                </p>
              </Link>
            </AnimatedCard>
          </div>

          {/* Features */}
          <div className="mt-16 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-chocolate_cosmos mb-12">
              Pourquoi rejoindre la communauté ? 🚀
            </h2>

            <BentoGrid>
              <BentoCard
                name="Des événements toute l'année"
                className="col-span-2"
                background={<div className="absolute inset-0 bg-blush" />}
                Icon={() => <span className="text-5xl">🎊</span>}
                description="Soirées, concerts, afterworks, intégrations... Il y a toujours quelque chose à faire sur le campus !"
                href="/events"
                cta="Voir les événements"
              />

              <BentoCard
                name="Rencontre des étudiants"
                className="col-span-1"
                background={
                  <div className="absolute inset-0 bg-raspberry_rose" />
                }
                Icon={() => <span className="text-5xl">🤝</span>}
                description="Fais de nouvelles rencontres, crée des liens et intègre-toi facilement dans la vie étudiante"
                href="/bdes"
                cta="Découvrir les BDE"
              />

              <BentoCard
                name="Réductions exclusives"
                className="col-span-1"
                background={<div className="absolute inset-0 bg-salmon_pink" />}
                Icon={() => <span className="text-5xl">💰</span>}
                description="Profite de réductions chez nos partenaires : restaurants, bars, boutiques et plus encore"
                href="/partners"
                cta="Voir les offres"
              />

              <BentoCard
                name="Toujours informé"
                className="col-span-2"
                background={
                  <div className="absolute inset-0 bg-light_orange" />
                }
                Icon={() => <span className="text-5xl">📱</span>}
                description="Toutes les infos en temps réel : événements, actualités, bons plans... Ne rate plus rien !"
                href="/events"
                cta="Rester connecté"
              />
            </BentoGrid>
          </div>

          {/* Stats Section */}
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <AnimatedCard delay={0.1}>
                <div className="relative bg-white rounded-xl shadow-lg p-8">
                  <BorderBeam
                    size={100}
                    duration={8}
                    colorFrom="#da627d"
                    colorTo="#a53860"
                  />
                  <div className="text-5xl font-bold text-blush mb-2">
                    <NumberTicker value={stats.totalEvents} delay={0.3} />+
                  </div>
                  <div className="text-xl font-semibold text-chocolate_cosmos mb-1">
                    Événements
                  </div>
                  <div className="text-chocolate_cosmos-400">
                    organisés cette année
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.2}>
                <div className="relative bg-white rounded-xl shadow-lg p-8">
                  <BorderBeam
                    size={100}
                    duration={9}
                    delay={1}
                    colorFrom="#a53860"
                    colorTo="#450920"
                  />
                  <div className="text-5xl font-bold text-raspberry_rose mb-2">
                    <NumberTicker value={stats.totalBDEs} delay={0.4} />
                  </div>
                  <div className="text-xl font-semibold text-chocolate_cosmos mb-1">
                    BDE Actifs
                  </div>
                  <div className="text-chocolate_cosmos-400">
                    dans l'établissement
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.3}>
                <div className="relative bg-white rounded-xl shadow-lg p-8">
                  <BorderBeam
                    size={100}
                    duration={10}
                    delay={2}
                    colorFrom="#ffa5ab"
                    colorTo="#da627d"
                  />
                  <div className="text-5xl font-bold text-salmon_pink mb-2">
                    <NumberTicker value={stats.totalPartners} delay={0.5} />+
                  </div>
                  <div className="text-xl font-semibold text-chocolate_cosmos mb-1">
                    Partenaires
                  </div>
                  <div className="text-chocolate_cosmos-400">
                    avec réductions exclusives
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-chocolate_cosmos mb-4">
                📅 Prochains Événements
              </h2>
              <p className="text-xl text-blush-400">
                Ne rate pas les événements à venir sur le campus !
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <AnimatedCard key={event._id} delay={0.1 * (index + 1)}>
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <BorderBeam
                      size={150}
                      duration={10}
                      delay={index * 2}
                      colorFrom="#da627d"
                      colorTo="#a53860"
                      borderWidth={2}
                    />

                    {event.coverImage?.url ? (
                      <img
                        src={event.coverImage.url}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-blush flex items-center justify-center">
                        <span className="text-6xl">
                          {EVENT_CATEGORIES_ARRAY.find(
                            (c) => c.value === event.category
                          )?.emoji || "🎉"}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-blush text-white text-sm font-semibold rounded-full">
                          {EVENT_CATEGORIES_ARRAY.find(
                            (c) => c.value === event.category
                          )?.label || event.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-chocolate_cosmos mb-2">
                        {event.title}
                      </h3>

                      <p className="text-chocolate_cosmos-400 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex items-center text-chocolate_cosmos-400 text-sm mb-2">
                        <span className="mr-2">📍</span>
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center text-chocolate_cosmos-400 text-sm mb-4">
                        <span className="mr-2">📅</span>
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <Link
                        to="/events"
                        className="block w-full text-center px-4 py-2 bg-blush text-white font-medium rounded-lg hover:bg-blush-600 transition-colors shadow-lg shadow-blush/20"
                      >
                        En savoir plus
                      </Link>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/events"
                className="inline-block px-8 py-3 bg-blush text-white font-medium rounded-lg hover:bg-blush-600 transition-colors shadow-lg shadow-blush/30"
              >
                Voir tous les événements →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured BDEs Section */}
      {featuredBDEs.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-light_orange-900 via-salmon_pink-900 to-light_orange-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-chocolate_cosmos mb-4">
                🎓 Nos BDE
              </h2>
              <p className="text-xl text-blush-400">
                Découvre les Bureaux Des Étudiants et leurs équipes passionnées
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredBDEs.map((bde, index) => (
                <AnimatedCard key={bde._id} delay={0.1 * (index + 1)}>
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <BorderBeam
                      size={120}
                      duration={12}
                      delay={index * 3}
                      colorFrom="#a53860"
                      colorTo="#450920"
                      borderWidth={2}
                    />

                    {bde.logo?.url ? (
                      <div className="w-full h-48 bg-light_orange-200 flex items-center justify-center p-6">
                        <img
                          src={bde.logo.url}
                          alt={bde.name}
                          className="max-h-32 max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-raspberry_rose flex items-center justify-center">
                        <span className="text-6xl">🎓</span>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-chocolate_cosmos mb-2">
                        {bde.name}
                      </h3>

                      <p className="text-chocolate_cosmos-400 mb-4 line-clamp-3">
                        {bde.description}
                      </p>

                      {/* Avatar Circles pour les membres */}
                      <div className="flex items-center gap-3 mb-4">
                        <AvatarCircles
                          numPeople={bde.membersCount || 15}
                          avatarUrls={[
                            {
                              imageUrl: `https://i.pravatar.cc/150?img=${
                                index * 3 + 1
                              }`,
                              profileUrl: "#",
                            },
                            {
                              imageUrl: `https://i.pravatar.cc/150?img=${
                                index * 3 + 2
                              }`,
                              profileUrl: "#",
                            },
                            {
                              imageUrl: `https://i.pravatar.cc/150?img=${
                                index * 3 + 3
                              }`,
                              profileUrl: "#",
                            },
                          ]}
                        />
                        <span className="text-sm text-chocolate_cosmos-400">
                          {bde.membersCount || 15}+ membres actifs
                        </span>
                      </div>

                      {bde.socialMedia && (
                        <div className="flex gap-3 mb-4">
                          {bde.socialMedia.instagram && (
                            <a
                              href={bde.socialMedia.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-salmon_pink hover:text-blush transition-colors"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                              </svg>
                            </a>
                          )}
                          {bde.socialMedia.facebook && (
                            <a
                              href={bde.socialMedia.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blush hover:text-blush-600 transition-colors"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}

                      <Link
                        to="/bdes"
                        className="block w-full text-center px-4 py-2 bg-raspberry_rose text-white font-medium rounded-lg hover:bg-raspberry_rose-600 transition-colors shadow-lg shadow-raspberry_rose/20"
                      >
                        En savoir plus
                      </Link>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/bdes"
                className="inline-block px-8 py-3 bg-raspberry_rose text-white font-medium rounded-lg hover:bg-raspberry_rose-600 transition-colors shadow-lg shadow-raspberry_rose/30"
              >
                Découvrir tous les BDE →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-chocolate_cosmos mb-4">
              💬 Ils ont participé
            </h2>
            <p className="text-xl text-blush-400">
              Découvre les témoignages des étudiants
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedCard delay={0.1}>
              <div className="bg-gradient-to-br from-salmon_pink-900 to-light_orange-900 rounded-xl p-6 shadow-lg border border-salmon_pink-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blush rounded-full flex items-center justify-center text-white text-xl font-bold">
                    A
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-chocolate_cosmos">
                      Alexandre
                    </div>
                    <div className="text-sm text-blush-400">Étudiant GEA</div>
                  </div>
                </div>
                <p className="text-chocolate_cosmos-400 italic">
                  "Les événements organisés par les BDE sont incroyables ! J'ai
                  rencontré plein de monde et je me suis super bien intégré. 🎉"
                </p>
                <div className="mt-3 text-salmon_pink">⭐⭐⭐⭐⭐</div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="bg-gradient-to-br from-salmon_pink-900 to-light_orange-900 rounded-xl p-6 shadow-lg border border-salmon_pink-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-raspberry_rose rounded-full flex items-center justify-center text-white text-xl font-bold">
                    M
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-chocolate_cosmos">
                      Marie
                    </div>
                    <div className="text-sm text-blush-400">Étudiante INFO</div>
                  </div>
                </div>
                <p className="text-chocolate_cosmos-400 italic">
                  "Les réductions partenaires sont vraiment top ! J'économise
                  sur mes sorties et mes courses. Merci les BDE ! 💰"
                </p>
                <div className="mt-3 text-salmon_pink">⭐⭐⭐⭐⭐</div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <div className="bg-gradient-to-br from-salmon_pink-900 to-light_orange-900 rounded-xl p-6 shadow-lg border border-salmon_pink-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-salmon_pink rounded-full flex items-center justify-center text-white text-xl font-bold">
                    L
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-chocolate_cosmos">
                      Lucas
                    </div>
                    <div className="text-sm text-blush-400">Étudiant MMI</div>
                  </div>
                </div>
                <p className="text-chocolate_cosmos-400 italic">
                  "Ambiance de fou lors des soirées ! Les BDE font un travail
                  incroyable pour animer le campus. 🔥"
                </p>
                <div className="mt-3 text-salmon_pink">⭐⭐⭐⭐⭐</div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      {partners.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-light_orange-900 to-salmon_pink-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-chocolate_cosmos mb-4">
                🤝 Nos Partenaires
              </h2>
              <p className="text-xl text-blush-400">
                Profite de réductions exclusives chez nos partenaires
              </p>
            </div>

            <Marquee pauseOnHover className="[--duration:40s] py-4">
              {partners.map((partner) => (
                <div
                  key={partner._id}
                  className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center justify-center w-48 mx-3 hover:shadow-2xl transition-shadow"
                >
                  {partner.logo?.url ? (
                    <img
                      src={partner.logo.url}
                      alt={partner.name}
                      className="h-20 object-contain mb-3"
                    />
                  ) : (
                    <div className="text-4xl mb-3">🏢</div>
                  )}
                  <h3 className="font-semibold text-chocolate_cosmos text-center text-sm">
                    {partner.name}
                  </h3>
                  {partner.discount && (
                    <span className="mt-2 px-3 py-1 bg-salmon_pink text-white text-xs font-semibold rounded-full shadow-lg">
                      {partner.discount}
                    </span>
                  )}
                </div>
              ))}
            </Marquee>

            <div className="text-center mt-10">
              <Link
                to="/partners"
                className="inline-block px-8 py-3 bg-salmon_pink text-white font-medium rounded-lg hover:bg-salmon_pink-600 transition-colors shadow-lg shadow-salmon_pink/30"
              >
                Voir tous les partenaires →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-raspberry_rose to-chocolate_cosmos text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à rejoindre l'aventure ? 🚀
          </h2>
          <p className="text-xl mb-8 text-salmon_pink-900">
            Découvre tous les événements, rencontre les BDE et profite des
            avantages exclusifs dès maintenant !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="px-8 py-3 bg-white hover:bg-light_orange-900 text-raspberry_rose hover:text-chocolate_cosmos font-medium rounded-lg transition-colors shadow-lg"
            >
              🎉 Voir les événements
            </Link>
            <Link
              to="/bdes"
              className="px-8 py-3 bg-salmon_pink hover:bg-blush text-white font-medium rounded-lg transition-colors shadow-lg shadow-salmon_pink/30"
            >
              🎓 Découvrir les BDE
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
