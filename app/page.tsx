'use client';

import { ArrowRight, Shield, Zap, Globe, ChartBar, Users, ArrowUpRight, Check, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="Earth from space"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Revolutionizing Sustainability with Crypto Carbon Credits
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Join the future of environmental conservation through blockchain technology. Trade verified carbon credits seamlessly and make a real impact on climate change.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/signup"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 backdrop-blur-sm transition-colors">
                Learn More <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-emerald-900 py-8 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">1M+</div>
              <div className="text-emerald-200">Carbon Credits Traded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-emerald-200">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">50K+</div>
              <div className="text-emerald-200">Users Worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">$100M+</div>
              <div className="text-emerald-200">Trading Volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Vectorium?
            </h2>
            <p className="text-gray-600">
              Our platform combines blockchain technology with environmental sustainability to create a transparent and efficient carbon credit trading ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Blockchain</h3>
              <p className="text-gray-600 mb-4">
                Every transaction is recorded on our immutable blockchain, ensuring complete transparency and security.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-600" /> Immutable records
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-600" /> Smart contracts
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-600" /> Audit trails
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Impact</h3>
              <p className="text-gray-600 mb-4">
                Support verified environmental projects worldwide and track your contribution to global sustainability.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-600" /> Verified projects
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-600" /> Real-time impact
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-600" /> Global reach
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Efficient Trading</h3>
              <p className="text-gray-600 mb-4">
                Experience fast, low-cost trading with our advanced matching engine and liquidity pools.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-600" /> Instant matching
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-600" /> Low fees
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-600" /> Deep liquidity
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Vectorium Works
            </h2>
            <p className="text-gray-600">
              Get started with carbon credit trading in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Create Account</h3>
              <p className="text-gray-600">
                Set up your digital wallet and complete verification in minutes
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChartBar className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Start Trading</h3>
              <p className="text-gray-600">
                Browse verified projects and trade carbon credits instantly
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Track Impact</h3>
              <p className="text-gray-600">
                Monitor your environmental impact and project contributions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-emerald-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Making a Real Impact
              </h2>
              <p className="text-lg text-emerald-100 mb-8">
                Our platform has already contributed to the reduction of over 1 million tons of CO2 emissions through verified carbon credit projects worldwide.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-3xl font-bold mb-2">1M+</div>
                  <div className="text-emerald-200">Tons of CO2 Offset</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-emerald-200">Active Projects</div>
                </div>
              </div>
              <button className="bg-white text-emerald-900 px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2 hover:bg-emerald-50 transition-colors">
                View Impact Report <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070&auto=format&fit=crop"
                alt="Renewable energy project"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-emerald-50 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the Green Revolution
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Be part of the solution to climate change. Start trading carbon credits on our platform today and make a lasting impact on our planet's future.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/signup"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2 transition-colors"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image
                  src="/vectorium-logo.png"
                  alt="Vectorium"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-xl font-bold">Vectorium</span>
              </Link>
              <p className="text-gray-400">
                Revolutionizing sustainability through blockchain technology
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 Vectorium. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}