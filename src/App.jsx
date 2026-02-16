import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, Download, Music, Headphones, Smartphone, Play, TrendingUp, Users, Youtube, Facebook } from "lucide-react";

export default function App() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("accueil");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/2block-musique.apk';
    link.download = '2block-musique.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full backdrop-blur-2xl bg-black/40 border-b border-white/5 z-50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-violet-500 bg-clip-text text-transparent"
          >
            2Block Musique
          </motion.h1>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 mx-auto items-center">
            {navLink("accueil", "Accueil")}
            {navLink("features", "Fonctionnalités")}
            {navLink("download", "Téléchargement")}
            {navLink("about", "À propos")}
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button 
              onClick={() => setOpen(!open)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden flex flex-col gap-6 px-6 pb-6 bg-black/95 backdrop-blur-xl"
          >
            {navLink("accueil", "Accueil")}
            {navLink("features", "Fonctionnalités")}
            {navLink("download", "Téléchargement")}
            {navLink("about", "À propos")}
          </motion.div>
        )}
      </nav>

      {/* HERO */}
      <section
        id="accueil"
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-32"
      >
        <motion.div 
          style={{ opacity, scale }}
          className="relative z-10 max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium backdrop-blur-sm">
              🎵 Version 1.2.0 disponible
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black mb-6"
          >
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-500 bg-clip-text text-transparent">
              2Block
            </span>
            <br />
            <span className="text-white">Musique</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed"
          >
            Depuis 2020, 2Block construit son univers musical avec une identité forte.
            Des titres comme <span className="text-violet-400 font-semibold">Billets</span>, <span className="text-violet-400 font-semibold">Vie d'avant</span>, <span className="text-violet-400 font-semibold">Dream</span>, <span className="text-violet-400 font-semibold">Big Boss</span> et <span className="text-violet-400 font-semibold">2025</span> marquent le parcours artistique.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-4 text-gray-500 text-base"
          >
            Tous les sons sont disponibles sur YouTube
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={handleDownload}
              className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl flex items-center gap-3 font-semibold text-lg shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105"
            >
              <Download size={22} className="group-hover:animate-bounce" />
              Télécharger l'APK
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Une expérience unique
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              L'application 2Block Musique centralise tous les titres,
              les exclusivités et les nouveautés dans une interface moderne,
              fluide et immersive.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <Feature 
              icon={<Music size={40} />} 
              title="Qualité Studio" 
              text="Une restitution audio optimisée pour casque et voiture."
              delay={0}
            />
            <Feature 
              icon={<Headphones size={40} />} 
              title="Mode Hors Ligne" 
              text="Télécharge tes sons préférés et écoute-les partout."
              delay={0.1}
            />
            <Feature 
              icon={<Smartphone size={40} />} 
              title="Performance Optimale" 
              text="Application rapide, stable et adaptée à tous les écrans."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
              La communauté grandit
            </h2>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3">
            <Stat number="50" label="Téléchargements" icon={<Download size={32} />} delay={0} />
            <Stat number="40" label="Fans actifs" icon={<Users size={32} />} delay={0.1} />
            <Stat number="3.7★" label="Note moyenne" icon={<TrendingUp size={32} />} delay={0.2} />
          </div>
        </div>
      </section>

      {/* DOWNLOAD CTA */}
      <section id="download" className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-violet-600/20 to-purple-600/20 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-12 md:p-16 text-center overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Prêt à découvrir ?
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
                Accède à tous les titres officiels, exclusivités et nouveautés
                directement depuis ton smartphone Android.
              </p>

              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
              >
                <Download size={24} />
                Télécharger maintenant
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-12">
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                À propos de 2Block
              </span>
            </h2>

            <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
              <p>
                2Block débute officiellement en 2020 avec le titre <span className="text-violet-400 font-semibold">Billets</span>.
                Ce premier son marque le lancement d'un univers artistique
                construit autour d'une identité forte et moderne.
              </p>

              <p>
                Avec le titre <span className="text-violet-400 font-semibold">Vie d'avant</span>,
                le groupe confirme son évolution musicale et suscite de nombreuses réactions.
                Depuis, 2Block continue de développer son catalogue
                et d'élargir sa communauté.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          {/* Social icons */}
          <div className="flex justify-center gap-6 mb-8">
            <a 
              href="https://www.youtube.com/channel/UCyocrqnJAISwzSDuordRgyw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/30 rounded-full transition-all duration-300"
            >
              <Youtube size={24} className="text-gray-400 group-hover:text-red-500 transition-colors" />
            </a>
            
            <a 
              href="http://www.tiktok.com/@2blockofficiel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-pink-600/20 border border-white/10 hover:border-pink-500/30 rounded-full transition-all duration-300"
            >
              <svg className="w-6 h-6 text-gray-400 group-hover:text-pink-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            
            <a 
              href="https://bit.ly/4mfVSKK" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/30 rounded-full transition-all duration-300"
            >
              <Facebook size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </a>
          </div>
          
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} 2Block — Tous droits réservés
          </p>
        </div>
      </footer>
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
      className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-10 rounded-3xl border border-white/10 hover:border-violet-500/30 transition-all duration-300"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-purple-600/0 group-hover:from-violet-600/10 group-hover:to-purple-600/10 rounded-3xl transition-all duration-300"></div>
      
      <div className="relative z-10">
        <div className="mb-6 text-violet-400 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{text}</p>
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
      className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-10 rounded-3xl border border-white/10 hover:border-violet-500/30 transition-all duration-300 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-purple-600/0 group-hover:from-violet-600/10 group-hover:to-purple-600/10 rounded-3xl transition-all duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex justify-center mb-4 text-violet-400">
          {icon}
        </div>
        <h3 className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
          {number}
        </h3>
        <p className="text-gray-400 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}