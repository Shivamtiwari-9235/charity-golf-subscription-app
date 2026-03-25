import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ user }) => {
  const charities = [
    { id: 1, name: 'Cancer Research UK', category: 'Health', description: 'Fighting cancer through research' },
    { id: 2, name: 'WWF', category: 'Environment', description: 'Protecting wildlife and nature' },
    { id: 3, name: 'Red Cross', category: 'Humanitarian', description: 'Emergency response and aid' },
  ];

  const faqs = [
    { question: 'How does the subscription work?', answer: 'Subscribe monthly or yearly via Stripe. Enter your golf scores and get automatically entered into monthly prize draws.' },
    { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time through your dashboard.' },
    { question: 'How fair are the draws?', answer: 'All draws are conducted fairly using random selection based on your entered scores.' },
    { question: 'How do charities receive funds?', answer: 'A portion of every subscription (minimum 10%) goes directly to your chosen charity.' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="glass-card p-8 md:p-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
              Win monthly prizes · Support real charities
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Turn your golf scores into{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                real-world impact
              </span>{' '}
              & prizes.
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Subscribe monthly or yearly, enter your recent Stableford scores, and get automatically entered into exciting monthly draws.
              A portion of every subscription supports the charity you choose.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary text-center">
                Get Started Now
              </Link>
              <a href="#how-it-works" className="btn-ghost text-center">
                How it works ↓
              </a>
            </div>
          </div>
          <div className="space-y-6">
            <div className="glass-card p-6 hover:scale-[1.01] transition-transform duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">$12,450</div>
                <div className="text-slate-400">Monthly Prize Pool</div>
              </div>
            </div>
            <div className="glass-card p-6 hover:scale-[1.01] transition-transform duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400 mb-2">$8,320</div>
                <div className="text-slate-400">Donated This Month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Join our community in just four simple steps and start making a difference while competing for prizes.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 text-center hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Subscribe</h3>
            <p className="text-slate-400">Pay monthly or yearly via secure Stripe payment.</p>
          </div>
          <div className="glass-card p-6 text-center hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Enter Scores</h3>
            <p className="text-slate-400">Submit your last 5 Stableford scores (1-45 points).</p>
          </div>
          <div className="glass-card p-6 text-center hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Monthly Draws</h3>
            <p className="text-slate-400">Get entered into draws for 3/4/5-number matches.</p>
          </div>
          <div className="glass-card p-6 text-center hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Support Charity</h3>
            <p className="text-slate-400">10%+ of your subscription helps your chosen charity.</p>
          </div>
        </div>
      </section>

      {/* Charity Impact Section */}
      <section className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Making Real Impact Together</h2>
            <p className="text-slate-300 leading-relaxed">
              Every subscription contributes to meaningful causes. We ensure transparency in how funds are distributed
              and provide regular updates on the impact your support creates. Choose from a variety of charities
              making a difference in health, environment, and humanitarian efforts.
            </p>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-emerald-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Transparent fund allocation
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-emerald-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Regular impact reports
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {charities.map((charity) => (
              <div key={charity.id} className="glass-card p-4 hover:scale-[1.01] transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{charity.name}</h3>
                    <p className="text-sm text-slate-400">{charity.category}</p>
                    <p className="text-sm text-slate-500 mt-1">{charity.description}</p>
                  </div>
                  <button className="btn-ghost text-sm">View details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Charity */}
      <section className="space-y-8">
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
            Featured
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Cancer Research UK</h2>
              <p className="text-slate-300 leading-relaxed">
                Every year, cancer affects millions of lives. Your support through our platform helps fund
                groundbreaking research that brings us closer to beating cancer for good.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center text-emerald-400">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  $2.3M raised this year
                </div>
                <div className="flex items-center text-slate-400">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  50K+ supporters
                </div>
              </div>
              <button className="btn-primary">Support This Charity</button>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-emerald-400 mb-2">92%</div>
              <div className="text-slate-300">Survival rate improvement</div>
              <div className="text-sm text-slate-500 mt-2">Thanks to research funded by donations</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about participating in our charity subscription platform.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card p-6 hover:scale-[1.01] transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
              <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="glass-card p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
          Join thousands of golfers who are turning their passion into positive impact while competing for exciting prizes.
        </p>
        {!user ? (
          <Link to="/register" className="btn-primary inline-block">
            Start Your Journey Today
          </Link>
        ) : (
          <Link to="/dashboard" className="btn-primary inline-block">
            Go to Your Dashboard
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-4">
              Golf Charity
            </div>
            <p className="text-slate-400 text-sm">
              Turning golf scores into real-world impact and prizes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div><a href="#" className="hover:text-white transition-colors">How it works</a></div>
              <div><a href="#" className="hover:text-white transition-colors">Charities</a></div>
              <div><a href="#" className="hover:text-white transition-colors">Prizes</a></div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div><a href="#" className="hover:text-white transition-colors">Help Center</a></div>
              <div><a href="#" className="hover:text-white transition-colors">Contact Us</a></div>
              <div><a href="#" className="hover:text-white transition-colors">FAQ</a></div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></div>
              <div><a href="#" className="hover:text-white transition-colors">Terms of Service</a></div>
              <div><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-slate-500">
          © 2024 Golf Charity Platform. Built with ❤️ for charitable impact.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
