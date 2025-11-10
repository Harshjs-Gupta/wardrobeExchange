"use client";
import { motion } from "framer-motion";
import TextType from "@/components/BitsComponents/TextType";
import BlurText from "@/components/BitsComponents/BlurText";
import CountUp from "@/components/BitsComponents/CountNumber";
import {
  ArrowRight,
  Heart,
  Users,
  TrendingUp,
  Sparkles,
  Globe,
  Award,
  Zap,
  GlobeIcon,
  ListChecks,
} from "lucide-react";
import Button from "@/components/Button";
import BackgroundPattern from "@/animation/BackgroundPattern";
import { textVariants } from "@/animation/textAnimation";
import { containerVariants } from "@/animation/containerAnimation";
import { itemVariants } from "@/animation/itemsAnimation";
import { buttonVariants } from "@/animation/buttonAnimation";
import EnhanceState from "@/layout/EnhanceState";
import FeaturesCard from "@/components/FeaturesCard";
import LightRaysUsage from "@/components/LightRaysUsage";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, userProfile } = useAuth();
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-x-hidden">
      {/* Enhanced Hero Section */}
      <BackgroundPattern />
      <LightRaysUsage />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.2,
              ease: [0.68, -0.55, 0.265, 1.55],
            }}
            className="mt-4"
          >
            <motion.div
              className="inline-flex animate-bounce items-center px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-500/30 rounded-full text-purple-200 text-sm font-semibold mb-6 shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Sustainable Fashion Platform
            </motion.div>
          </motion.div>

          <BlurText
            text="Wardrobe Exchange"
            delay={200}
            animateBy="words"
            direction="top"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 font-bold leading-tight"
          />

          <div className="flex gap-2 mb-3">
            <span className="text-3xl text-gray-300 sm:text-4xl md:text-5xl lg:text-6xl font-medium">
              Welcome,
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium capitalize text-purple-300">
              {userProfile?.displayName || user?.email?.split("@")[0] || "User"}
            </span>
          </div>

          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mb-14 leading-relaxed"
          >
            Swap, redeem, and give new life to unused clothes. Join our mission
            to promote
            <span className="text-purple-300 ml-1 mr-1 font-semibold">
              sustainable fashion
            </span>
            and reduce textile waste while building a vibrant community!
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-6 mb-16"
          >
            <Button
              text="Start Swapping"
              path="/auth"
              emoji={<ArrowRight className="ml-3 w-6 h-6 " />}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1"
            />
            <Button
              text="Browse Items"
              path="/browse"
              emoji={<GlobeIcon className="ml-3 w-6 h-6 " />}
              className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
            />
            <Button
              text="List an Item"
              path="/add-item"
              emoji={<ListChecks className="ml-3 w-6 h-6" />}
              className="px-10 py-5 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-md border border-green-500/30 text-green-200 rounded-2xl font-semibold text-lg hover:from-green-600/30 hover:to-emerald-600/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25"
            />
          </motion.div>

          <EnhanceState />
        </div>
      </motion.div>

      {/* Enhanced Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="py-24 px-4 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-4xl md:text-5xl font-bold text-center mb-20 text-white"
          >
            Why Choose
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Wardrobe Exchange
            </span>
            ?
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <FeaturesCard
              title="Sustainable Fashion"
              description="Reduce textile waste by giving clothes a second life through our community exchange platform. Every swap helps the environment."
              icon={<Heart className="w-10 h-10 text-purple-400" />}
              cardShadow="hover:shadow-purple-500/20"
              iconContainerColor="from-purple-600/20 to-pink-600/20"
            />
            <FeaturesCard
              title="Community Driven"
              description="Connect with like-minded individuals who share your passion for sustainable fashion. Join our community and
            start swapping today!"
              icon={<Users className="w-10 h-10 text-blue-400" />}
              cardShadow="hover:shadow-blue-500/20"
              iconContainerColor="from-blue-600/20 to-cyan-600/20"
            />
            <FeaturesCard
              title="Point System"
              description="Earn points for every swap and redeem them for exclusive rewards and discounts. The more you swap, the more you earn!"
              icon={<TrendingUp className="w-10 h-10 text-green-400" />}
              cardShadow="hover:shadow-green-500/20"
              iconContainerColor="from-green-600/20 to-emerald-600/20"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Featured Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="py-24 px-4 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-20 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Featured Items
          </motion.h2>
          <motion.div
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-16 flex items-center justify-center shadow-xl"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px rgba(139, 92, 246, 0.2)",
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                className="w-32 h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
                whileHover={{
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.8 },
                }}
              >
                <Sparkles className="w-16 h-16 text-purple-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Featured Items Coming Soon
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Browse through curated collections of sustainable fashion
              </p>
              <motion.a
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                href="/browse"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 text-purple-200 rounded-2xl hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 font-semibold"
              >
                <Globe className="w-5 h-5 mr-3" />
                Explore Items
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
