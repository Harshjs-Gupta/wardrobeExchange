"use client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Users,
  TrendingUp,
  Sparkles,
  Globe,
  Award,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-500/30 rounded-full text-purple-200 text-sm font-semibold mb-6 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Sustainable Fashion Platform
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-8 drop-shadow-lg"
          >
            Wardrobe Exchange
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mb-12 leading-relaxed"
          >
            Swap, redeem, and give new life to unused clothes. Join our mission
            to promote
            <span className="text-purple-300 font-semibold">
              {" "}
              sustainable fashion{" "}
            </span>
            and reduce textile waste while building a vibrant community!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 mb-16"
          >
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="/auth"
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1"
            >
              Start Swapping
              <ArrowRight className="ml-3 w-6 h-6" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="/browse"
              className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse Items
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="/add-item"
              className="px-10 py-5 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-md border border-green-500/30 text-green-200 rounded-2xl font-semibold text-lg hover:from-green-600/30 hover:to-emerald-600/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25"
            >
              List an Item
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                1,234
              </div>
              <div className="text-gray-400">Items Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                567
              </div>
              <div className="text-gray-400">Successful Swaps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                890
              </div>
              <div className="text-gray-400">Active Members</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 px-4 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-20 text-white"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Wardrobe Exchange
            </span>
            ?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Heart className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white">
                Sustainable Fashion
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Reduce textile waste by giving clothes a second life through our
                community exchange platform. Every swap helps the environment.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Users className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white">
                Community Driven
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Connect with like-minded individuals who share your passion for
                sustainable fashion. Build meaningful relationships through
                fashion.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <TrendingUp className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white">
                Point System
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Earn points by listing items and redeem them for clothing from
                other community members. Fair and transparent exchange system.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Featured Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-24 px-4 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-white">
            Featured Items
          </h2>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-16 flex items-center justify-center shadow-xl">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Sparkles className="w-16 h-16 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Featured Items Coming Soon
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Browse through curated collections of sustainable fashion
              </p>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="/browse"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 text-purple-200 rounded-2xl hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 font-semibold"
              >
                <Globe className="w-5 h-5 mr-3" />
                Explore Items
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
