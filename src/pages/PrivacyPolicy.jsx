import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

const PrivacyPolicy = () => {
  const lastUpdated = 'March 28, 2026';

  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'When you register on FF Tourney, we collect personal information including your name, email address, Free Fire UID, in-game name (IGN), and account level. This information is necessary to verify your eligibility and facilitate tournament participation.',
        'We automatically collect certain technical data when you visit our platform, including your IP address, browser type, device information, operating system, referring URLs, and pages visited. This data helps us improve our services and ensure security.',
        'Financial information such as wallet transactions, tournament entry fees, and prize winnings are recorded to maintain accurate account balances and comply with applicable regulations.',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'We use your personal information to create and manage your account, verify your Free Fire account level, process tournament registrations, manage wallet transactions, and distribute prizes.',
        'Technical data is used to improve platform performance, analyze usage patterns, detect fraud or abuse, and enhance security measures.',
        'We may use your email address to send important notifications about tournaments, account activity, policy changes, and promotional content. You can opt out of promotional emails at any time.',
      ],
    },
    {
      title: '3. Cookies and Tracking Technologies',
      content: [
        'FF Tourney uses cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and provide personalized content.',
        'We use essential cookies for authentication and session management, analytics cookies to understand how our platform is used, and advertising cookies to deliver relevant advertisements through services like Google AdSense.',
        'You can manage your cookie preferences through your browser settings. Please note that disabling certain cookies may affect the functionality of our platform.',
      ],
    },
    {
      title: '4. Third-Party Advertising',
      content: [
        'We use Google AdSense and other third-party advertising services to display advertisements on our platform. These services may use cookies and web beacons to collect information about your visits to this and other websites to provide targeted advertisements.',
        'Google, as a third-party vendor, uses cookies to serve ads on our site. Google\'s use of the DART cookie enables it to serve ads to you based on your visit to our site and other sites on the Internet.',
        'You may opt out of personalized advertising by visiting Google\'s Ads Settings (https://adssettings.google.com) or the Network Advertising Initiative opt-out page (http://optout.networkadvertising.org).',
      ],
    },
    {
      title: '5. Data Sharing and Disclosure',
      content: [
        'We do not sell your personal information to third parties. We may share your data with trusted service providers who assist us in operating our platform, processing payments (such as Razorpay), and analyzing usage data.',
        'We may disclose your information when required by law, to protect our rights, prevent fraud, or respond to government requests.',
        'Tournament-related data such as your IGN, match results, and rankings may be displayed publicly on leaderboards and tournament results pages.',
      ],
    },
    {
      title: '6. Data Security',
      content: [
        'We implement industry-standard security measures including encryption, secure socket layer (SSL) technology, and access controls to protect your personal information.',
        'While we strive to protect your data, no method of transmission over the Internet is 100% secure. We cannot guarantee the absolute security of your information.',
      ],
    },
    {
      title: '7. Your Rights',
      content: [
        'You have the right to access, update, or delete your personal information at any time through your profile settings or by contacting our support team.',
        'You may request a copy of the data we hold about you, or ask us to restrict or cease processing your personal information.',
        'If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR).',
      ],
    },
    {
      title: '8. Children\'s Privacy',
      content: [
        'FF Tourney is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected data from a child under 13, we will take steps to delete that information promptly.',
      ],
    },
    {
      title: '9. Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.',
        'Your continued use of our platform after any changes constitutes your acceptance of the updated Privacy Policy.',
      ],
    },
    {
      title: '10. Contact Us',
      content: [
        'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us through our Support Center or email us at support@fftourney.com.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,53,0.1)_0,transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ff-orange/20 to-orange-600/20 rounded-2xl border border-ff-orange/30 mb-6">
              <ShieldCheckIcon className="h-8 w-8 text-ff-orange" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FFB835]">Policy</span>
            </h1>
            <p className="text-gray-400 text-lg">Last updated: {lastUpdated}</p>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto leading-relaxed">
              At FF Tourney (<a href="https://fftourney.com" className="text-ff-orange hover:underline">fftourney.com</a>), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our tournament platform.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-gray-600/50 transition-colors"
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-wide">{section.title}</h2>
              <div className="space-y-4">
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-ff-orange hover:text-orange-400 font-bold uppercase tracking-wider transition group"
          >
            <span className="group-hover:-translate-x-1 transition inline-block">←</span>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
