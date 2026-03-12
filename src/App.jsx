import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Facebook,
  Headphones,
  Menu,
  Music,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Users,
  X,
  Youtube,
} from "lucide-react";
import {
  APK_CONFIG,
  handleAPKDownload,
  startDirectAPKDownload,
} from "./config/download";
import {
  fetchPublicMobileReleaseInfo,
  fetchPublicSiteMetrics,
  trackPublicDownload,
} from "./config/publicMetrics";
import {
  buildDownloadJsonLd,
  buildHomeJsonLd,
  buildPrivacyJsonLd,
  useSeo,
} from "./seo";

const DOWNLOAD_PATH = "/telecharger/android";
const PRIVACY_PATH = "/politique-confidentialite";
const AUTH_CALLBACK_PATH = "/auth-callback";

function getNormalizedPathname() {
  if (typeof window === "undefined") {
    return "/";
  }

  const pathname = window.location.pathname.replace(/\/+$/, "");
  return pathname === "" ? "/" : pathname;
}

export default function App() {
  const [pathname, setPathname] = useState(getNormalizedPathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(getNormalizedPathname());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (pathname === DOWNLOAD_PATH) {
    return <AndroidDownloadPage />;
  }

  if (pathname === PRIVACY_PATH) {
    return <PrivacyPolicyPage />;
  }

  if (pathname === AUTH_CALLBACK_PATH) {
    return <AuthCallbackPage />;
  }

  return <HomePage />;
}

function HomePage() {
  useSeo({
    title: "2Block Music - Application officielle Android",
    description:
      "Telecharge l'application officielle 2Block Music pour ecouter les titres, nouveautes, paroles synchronisees et contenus exclusifs sur Android.",
    path: "/",
    jsonLd: buildHomeJsonLd(),
  });

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("accueil");
  const [metrics, setMetrics] = useState({
    appDownloads: null,
    activeFans30d: null,
    publishedSongs: null,
  });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    let cancelled = false;

    fetchPublicSiteMetrics()
      .then((nextMetrics) => {
        if (!cancelled) {
          setMetrics(nextMetrics);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMetrics({
            appDownloads: null,
            activeFans30d: null,
            publishedSongs: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);
  const [releaseInfo, setReleaseInfo] = useState({
    version: APK_CONFIG.version,
    notes: null,
    publishedAt: null,
    sizeLabel: APK_CONFIG.size,
    downloadUrl: null,
    assetUrl: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetchPublicMobileReleaseInfo()
      .then((release) => {
        if (!cancelled) {
          setReleaseInfo({
            version: release.version || APK_CONFIG.version,
            notes: release.notes || null,
            publishedAt: release.publishedAt || null,
            sizeLabel:
              release.apkSizeBytes > 0
                ? formatBytes(release.apkSizeBytes)
                : APK_CONFIG.size,
            downloadUrl: release.downloadUrl || null,
            assetUrl: release.assetUrl || null,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReleaseInfo({
            version: APK_CONFIG.version,
            notes: null,
            publishedAt: null,
            sizeLabel: APK_CONFIG.size,
            downloadUrl: null,
            assetUrl: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const onDownload = () => {
    handleAPKDownload();
  };

  const navLink = (id, label) => (
    <a
      href={`#${id}`}
      onClick={() => {
        setActive(id);
        setOpen(false);
      }}
      className={`relative pb-1 transition-all duration-300 font-medium ${
        active === id ? "text-white" : "text-gray-400 hover:text-gray-200"
      }`}
    >
      {label}
      {active === id && (
        <motion.span
          layoutId="activeTab"
          className="absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-violet-500 to-purple-500"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </a>
  );

  return (
    <div className="bg-black text-white scroll-smooth overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div
          className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-2xl shadow-lg shadow-black/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-violet-500 bg-clip-text text-transparent"
          >
            2Block Music
          </motion.h1>

          <div className="mx-auto hidden items-center gap-8 md:flex">
            {navLink("accueil", "Accueil")}
            {navLink("features", "Fonctionnalités")}
            {navLink("download", "Téléchargement")}
            {navLink("about", "À propos")}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="rounded-lg p-2 transition-colors hover:bg-white/5"
              type="button"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 bg-black/95 px-6 pb-6 backdrop-blur-xl md:hidden"
          >
            {navLink("accueil", "Accueil")}
            {navLink("features", "Fonctionnalités")}
            {navLink("download", "Téléchargement")}
            {navLink("about", "À propos")}
          </motion.div>
        )}
      </nav>

      <section
        id="accueil"
        className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-32 text-center"
      >
        <motion.div style={{ opacity, scale }} className="relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="inline-block rounded-full border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-purple-500/10 px-4 py-2 text-sm font-medium text-violet-400 backdrop-blur-sm">
              Version {releaseInfo.version} disponible
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6 text-5xl font-black sm:text-6xl md:text-8xl"
          >
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-500 bg-clip-text text-transparent">
              2Block
            </span>
            <br />
            <span className="text-white">Music</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400"
          >
            Depuis 2020, 2Block construit son univers musical avec une identité forte.
            Des titres comme <span className="font-semibold text-violet-400">Billets</span>,
            <span className="font-semibold text-violet-400"> Vie d&apos;avant</span>,
            <span className="font-semibold text-violet-400"> Dream</span>,
            <span className="font-semibold text-violet-400"> Big Boss</span> et
            <span className="font-semibold text-violet-400"> 2025</span> marquent le parcours artistique.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-4 text-base text-gray-500"
          >
            Tous les sons sont disponibles sur YouTube
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={onDownload}
              className="group relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-lg font-semibold shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(168,85,247,0.6)]"
              type="button"
            >
              <Download size={22} className="group-hover:animate-bounce" />
              Télécharger l&apos;application
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400"
          >
            <MetaPill label="Mise à jour" value={formatReleaseDate(releaseInfo.publishedAt) || APK_CONFIG.releaseDate} />
            <MetaPill label="Taille" value={releaseInfo.sizeLabel} />
            <MetaPill label="Android" value="Installation directe" />
          </motion.div>
        </motion.div>
      </section>

      <section id="features" className="relative px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 text-center"
          >
            <h2 className="mb-6 text-4xl font-bold md:text-6xl">
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Une expérience unique
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-400">
              L&apos;application 2Block Music centralise tous les titres,
              les exclusivités et les nouveautés dans une interface moderne,
              fluide et immersive. Toutes les fonctions principales sont regroupées ici.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            <Feature
              icon={<Music size={40} />}
              title="Qualité studio"
              text="Une restitution audio optimisée pour casque, téléphone et voiture."
              delay={0}
            />
            <Feature
              icon={<Headphones size={40} />}
              title="Mode hors ligne"
              text="Télécharge tes sons préférés et écoute-les même sans connexion."
              delay={0.1}
            />
            <Feature
              icon={<Music size={40} />}
              title="Paroles synchronisées"
              text="Les paroles peuvent suivre la lecture pour une écoute plus vivante."
              delay={0.2}
            />
            <Feature
              icon={<CheckCircle2 size={40} />}
              title="Nouveautés signalées"
              text="Les nouveaux sons et les mises à jour sont mis en avant rapidement."
              delay={0.3}
            />
            <Feature
              icon={<Headphones size={40} />}
              title="Lecteur immersif"
              text="Un écran de lecture pensé pour le mobile et pour l&apos;écoute continue."
              delay={0.4}
            />
            <Feature
              icon={<Smartphone size={40} />}
              title="Navigation fluide"
              text="L&apos;application reste simple à utiliser, même sur téléphone."
              delay={0.5}
            />
            <Feature
              icon={<TrendingUp size={40} />}
              title="Mises à jour simplifiées"
              text="La dernière version reste accessible depuis le site officiel."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              La communauté grandit
            </h2>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3">
            <Stat
              number={formatMetricValue(metrics.appDownloads)}
              label="Téléchargements app"
              icon={<Download size={32} />}
              delay={0}
            />
            <Stat
              number={formatMetricValue(metrics.activeFans30d)}
              label="Fans actifs sur 30 jours"
              icon={<Users size={32} />}
              delay={0.1}
            />
            <Stat
              number={formatMetricValue(metrics.publishedSongs)}
              label="Titres disponibles"
              icon={<TrendingUp size={32} />}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      <section id="download" className="relative px-6 py-32">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/20 to-purple-600/20 p-12 text-center backdrop-blur-xl md:p-16"
          >
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative z-10">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">Prêt à découvrir ?</h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
                Accède à tous les titres officiels, exclusivités et nouveautés
                directement depuis ton smartphone Android.
              </p>

              <div className="mb-10 grid gap-4 text-left sm:grid-cols-3">
                <InfoTile label="Version" value={releaseInfo.version} />
                <InfoTile label="Taille" value={releaseInfo.sizeLabel} />
                <InfoTile
                  label="Publication"
                  value={formatReleaseDate(releaseInfo.publishedAt) || APK_CONFIG.releaseDate}
                />
              </div>

              {releaseInfo.notes ? (
                <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-white/10 bg-black/20 p-5 text-left">
                  <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gray-500">
                    Dernière mise à jour
                  </p>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {releaseInfo.notes}
                  </p>
                </div>
              ) : null}

              <button
                onClick={onDownload}
                className="inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-black shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-transform duration-300 hover:scale-105"
                type="button"
              >
                <Download size={24} />
                Télécharger maintenant
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-6 pb-32">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-violet-300">
              Installation Android
            </p>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Comment installer 2Block Music
            </h2>
            <p className="max-w-3xl text-base leading-relaxed text-gray-300">
              Le téléchargement se fait depuis le site officiel. Sur Android,
              l’installation d’un fichier APK reste rapide si le téléphone
              autorise l’installation depuis le navigateur ou le gestionnaire
              de fichiers.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <InstallStep
                step="1"
                title="Télécharge l’APK"
                text="Utilise le bouton officiel pour récupérer la dernière version publiée."
              />
              <InstallStep
                step="2"
                title="Autorise l’installation"
                text="Si Android le demande, valide l’installation depuis cette source."
              />
              <InstallStep
                step="3"
                title="Ouvre l’application"
                text="Connecte-toi, télécharge tes sons et profite du mode hors ligne."
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-violet-300">
              Pourquoi le site officiel
            </p>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Version propre et à jour
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-300">
              <p>
                Le site centralise la dernière version Android, les mises à
                jour de l’application et les informations utiles avant
                installation.
              </p>
              <p>
                Tu retrouves aussi la date de publication, la taille du fichier
                et les changements récents, ce qui évite les liens incertains
                ou les APK anciens.
              </p>
              <p>
                Pour les utilisateurs Android, cette page reste le point
                d’entrée officiel pour télécharger 2Block Music.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative border-t border-white/5 px-6 py-32">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-12 text-4xl font-bold md:text-6xl">
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                À propos de 2Block
              </span>
            </h2>

            <div className="space-y-6 text-lg leading-relaxed text-gray-400">
              <p>
                2Block débute officiellement en 2020 avec le titre
                <span className="font-semibold text-violet-400"> Billets</span>.
                Ce premier son marque le lancement d&apos;un univers artistique
                construit autour d&apos;une identité forte et moderne.
              </p>

              <p>
                Avec le titre <span className="font-semibold text-violet-400">Vie d&apos;avant</span>,
                le groupe confirme son évolution musicale et suscite de nombreuses réactions.
                Depuis, 2Block continue de développer son catalogue et d&apos;élargir sa communauté.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex justify-center gap-6">
            <a
              href="https://www.youtube.com/channel/UCyocrqnJAISwzSDuordRgyw"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:border-red-500/30 hover:bg-red-600/20"
            >
              <Youtube size={24} className="text-gray-400 transition-colors group-hover:text-red-500" />
            </a>

            <a
              href="http://www.tiktok.com/@2blockofficiel"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:border-pink-500/30 hover:bg-pink-600/20"
            >
              <svg
                className="h-6 w-6 text-gray-400 transition-colors group-hover:text-pink-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>

            <a
              href="https://bit.ly/4mfVSKK"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-600/20"
            >
              <Facebook size={24} className="text-gray-400 transition-colors group-hover:text-blue-500" />
            </a>
          </div>

          <div className="mb-6 flex justify-center">
            <a
              href={PRIVACY_PATH}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300 transition hover:border-violet-400/40 hover:text-white"
            >
              Politique de confidentialité
            </a>
          </div>
          
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} 2Block — Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}

function AndroidDownloadPage() {
  useSeo({
    title: "Telechargement Android - 2Block Music",
    description:
      "Page officielle de telechargement Android de 2Block Music. Recupere la derniere version de l'application en toute securite.",
    path: DOWNLOAD_PATH,
    jsonLd: buildDownloadJsonLd(),
  });

  const [status, setStatus] = useState("preparing");
  const [releaseInfo, setReleaseInfo] = useState({
    version: APK_CONFIG.version,
    notes: null,
    publishedAt: null,
    sizeLabel: APK_CONFIG.size,
    downloadUrl: null,
    assetUrl: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetchPublicMobileReleaseInfo()
      .then((release) => {
        if (!cancelled) {
          setReleaseInfo({
            version: release.version || APK_CONFIG.version,
            notes: release.notes || null,
            publishedAt: release.publishedAt || null,
            sizeLabel:
              release.apkSizeBytes > 0
                ? formatBytes(release.apkSizeBytes)
                : APK_CONFIG.size,
            downloadUrl: release.downloadUrl || null,
            assetUrl: release.assetUrl || null,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReleaseInfo({
            version: APK_CONFIG.version,
            notes: null,
            publishedAt: null,
            sizeLabel: APK_CONFIG.size,
            downloadUrl: null,
            assetUrl: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    trackPublicDownload("site").catch(() => {});

    const timer = window.setTimeout(() => {
      setStatus("redirecting");
      startDirectAPKDownload(releaseInfo.assetUrl || releaseInfo.downloadUrl);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [releaseInfo.assetUrl, releaseInfo.downloadUrl]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06030d] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
        <button
          onClick={() => window.location.assign("/")}
          className="mb-8 inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:border-violet-400/40 hover:text-white"
          type="button"
        >
          <ArrowLeft size={16} />
          Retour au site
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl md:p-10"
        >
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                <CheckCircle2 size={16} />
                Téléchargement Android officiel
              </span>
              <h1 className="text-3xl font-black md:text-5xl">
                2Block Music
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
                Tu es sur la page officielle de téléchargement. La redirection démarre
                automatiquement pour récupérer la dernière version de l&apos;application Android.
              </p>
            </div>

            <div className="grid min-w-[220px] gap-3">
              <InfoTile label="Version" value={releaseInfo.version} compact />
              <InfoTile label="Taille" value={releaseInfo.sizeLabel} compact />
              <InfoTile
                label="Publication"
                value={formatReleaseDate(releaseInfo.publishedAt) || APK_CONFIG.releaseDate}
                compact
              />
            </div>
          </div>

          {releaseInfo.notes ? (
            <div className="mb-8 rounded-3xl border border-white/10 bg-black/20 p-5">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gray-500">
                Ce que contient cette version
              </p>
              <p className="text-sm leading-relaxed text-gray-300">
                {releaseInfo.notes}
              </p>
            </div>
          ) : null}

          <div className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-5 md:grid-cols-3">
            <StatusRow
              icon={<ShieldCheck size={18} />}
              title="Source vérifiée"
              text="Le bouton ouvre le fichier officiel de l'application."
            />
            <StatusRow
              icon={<Download size={18} />}
              title={status === "redirecting" ? "Redirection en cours" : "Préparation"}
              text="Si rien ne se passe, tu peux lancer le téléchargement manuellement."
            />
            <StatusRow
              icon={<Smartphone size={18} />}
              title="Installation Android"
              text="Autorise l’installation si Android te le demande sur ton téléphone."
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => {
                setStatus("redirecting");
                startDirectAPKDownload(releaseInfo.assetUrl || releaseInfo.downloadUrl);
              }}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 font-semibold shadow-[0_0_40px_rgba(168,85,247,0.35)] transition hover:scale-[1.02]"
              type="button"
            >
              <Download size={20} />
              Télécharger maintenant
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gray-500">
                Avant l’installation
              </p>
              <p className="text-sm leading-relaxed text-gray-300">
                Vérifie que ton téléphone Android dispose d’assez d’espace,
                puis autorise l’installation si le système le demande.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gray-500">
                Après l’installation
              </p>
              <p className="text-sm leading-relaxed text-gray-300">
                Ouvre l’application, connecte-toi à ton compte et récupère les
                sons que tu veux garder hors ligne.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AuthCallbackPage() {
  useSeo({
    title: "Retour vers l’application - 2Block Music",
    description:
      "Page de retour vers l’application 2Block Music après confirmation ou connexion.",
    path: AUTH_CALLBACK_PATH,
    robots: "noindex,nofollow",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.assign("mymusic://auth-callback");
    }, 900);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06030d] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
        <div className="w-full rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-2xl md:p-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm text-violet-300">
            Retour sécurisé
          </span>
          <h1 className="text-3xl font-black md:text-5xl">
            Retour vers 2Block Music
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
            Si l’application est installée, elle va s’ouvrir automatiquement.
            Sinon, tu peux revenir au site officiel et reprendre plus tard.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => window.location.assign("mymusic://auth-callback")}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 font-semibold shadow-[0_0_40px_rgba(168,85,247,0.35)] transition hover:scale-[1.02]"
              type="button"
            >
              Ouvrir l’application
            </button>
            <button
              onClick={() => window.location.assign("/")}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-gray-200 transition hover:border-violet-400/40 hover:text-white"
              type="button"
            >
              Retour au site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyPolicyPage() {
  useSeo({
    title: "Politique de confidentialite - 2Block Music",
    description:
      "Consulte la politique de confidentialite de 2Block Music et comprends quelles donnees sont utilisees dans l'application et le site.",
    path: PRIVACY_PATH,
    jsonLd: buildPrivacyJsonLd(),
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06030d] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
        <button
          onClick={() => window.location.assign("/")}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:border-violet-400/40 hover:text-white"
          type="button"
        >
          <ArrowLeft size={16} />
          Retour au site
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl md:p-12"
        >
          <div className="mb-10">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm text-violet-300">
              Confidentialité
            </span>
            <h1 className="text-3xl font-black md:text-5xl">
              Politique de confidentialité
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
              Cette page explique de façon simple quelles informations peuvent être utilisées
              dans 2Block Music, pourquoi elles le sont, et comment elles sont protégées.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <PolicyCard
              title="Données utilisées"
              text="Lors de l’utilisation de l’application, certaines informations peuvent être traitées comme l’adresse email du compte, l’activité d’écoute, les téléchargements de sons et les préférences liées à l’application."
            />
            <PolicyCard
              title="Pourquoi ces données"
              text="Elles servent à faire fonctionner le compte utilisateur, proposer l’écoute hors ligne, afficher les contenus disponibles, améliorer l’expérience et suivre l’activité générale de la plateforme."
            />
            <PolicyCard
              title="Notifications"
              text="Si l’utilisateur l’accepte, l’application peut envoyer des notifications pour signaler de nouveaux sons ou des mises à jour importantes."
            />
            <PolicyCard
              title="Partage des données"
              text="Les données ne sont pas revendues. Elles peuvent uniquement être utilisées par les services techniques nécessaires au fonctionnement normal de l’application et du site."
            />
            <PolicyCard
              title="Sécurité"
              text="Des mesures techniques sont mises en place pour limiter les accès non autorisés et protéger les informations traitées par l’application."
            />
            <PolicyCard
              title="Droits de l’utilisateur"
              text="L’utilisateur peut demander des informations sur son compte, corriger certaines données ou demander la suppression de son accès lorsqu’elle est possible."
            />
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
            <h2 className="mb-3 text-xl font-bold text-white">Contact</h2>
            <p className="leading-relaxed text-gray-300">
              Pour toute question liée à la confidentialité ou au fonctionnement de l’application,
              tu peux contacter l’équipe 2Block via les canaux officiels déjà utilisés sur le projet.
            </p>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Dernière mise à jour : {new Intl.DateTimeFormat("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ icon, title, text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-10 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/0 to-purple-600/0 transition-all duration-300 group-hover:from-violet-600/10 group-hover:to-purple-600/10" />

      <div className="relative z-10">
        <div className="mb-6 flex justify-center text-violet-400 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
        <p className="leading-relaxed text-gray-400">{text}</p>
      </div>
    </motion.div>
  );
}

function Stat({ number, label, icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-10 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/0 to-purple-600/0 transition-all duration-300 group-hover:from-violet-600/10 group-hover:to-purple-600/10" />

      <div className="relative z-10">
        <div className="mb-4 flex justify-center text-violet-400">{icon}</div>
        <h3 className="mb-2 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent">
          {number}
        </h3>
        <p className="font-medium text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
}

function InfoTile({ label, value, compact = false }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-black/20 ${
        compact ? "px-4 py-3" : "px-5 py-4"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.22em] text-gray-500">{label}</p>
      <p className={`mt-2 font-semibold text-white ${compact ? "text-sm" : "text-base"}`}>
        {value}
      </p>
    </div>
  );
}

function StatusRow({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="mb-3 inline-flex rounded-full bg-violet-500/10 p-2 text-violet-300">
        {icon}
      </div>
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-400">{text}</p>
    </div>
  );
}

function PolicyCard({ title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <h2 className="mb-3 text-xl font-bold text-white">{title}</h2>
      <p className="leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}

function MetaPill({ label, value }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-gray-300">
      <span className="text-gray-500">{label} :</span> {value}
    </div>
  );
}

function InstallStep({ step, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15 text-sm font-bold text-violet-300">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-400">{text}</p>
    </div>
  );
}

function formatMetricValue(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "--";
  }

  return new Intl.NumberFormat("fr-FR").format(value);
}

function formatReleaseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) {
    return APK_CONFIG.size;
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}
