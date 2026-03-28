import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/solid';

const TermsConditions = () => {
  const lastUpdated = 'March 28, 2026';

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        'By accessing or using FF Tourney (fftourney.com), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our platform.',
        'We reserve the right to modify these terms at any time. Continued use of the platform after any modifications indicates your acceptance of the updated terms.',
      ],
    },
    {
      title: '2. Eligibility',
      content: [
        'You must be at least 13 years of age to use FF Tourney. If you are under 18, you must have parental or guardian consent to use our services.',
        'To participate in tournaments, you must have a valid Free Fire account with the required minimum level (Level 60 or above) as verified through our registration process.',
        'You must provide accurate and complete information during registration. Providing false or misleading information may result in account suspension or termination.',
      ],
    },
    {
      title: '3. Account Responsibilities',
      content: [
        'You are responsible for maintaining the confidentiality of your account credentials. You are fully responsible for all activities that occur under your account.',
        'Each user may only maintain one account on our platform. Creating multiple accounts is strictly prohibited and may result in permanent bans.',
        'You must immediately notify us of any unauthorized use of your account or any other security breach.',
      ],
    },
    {
      title: '4. Tournament Rules',
      content: [
        'All tournament participants must adhere to the specific rules and guidelines outlined for each tournament. These rules include, but are not limited to, match timing, team composition, and fair play requirements.',
        'The use of hacks, cheats, exploits, or any unauthorized third-party software during tournaments is strictly prohibited and will result in immediate disqualification and permanent account ban.',
        'Tournament results declared by moderators are final. Disputes must be raised through our Support Center within 24 hours of the match conclusion.',
        'Players who fail to join a tournament match within the designated time window will be considered as having forfeited and will not be eligible for a refund of the entry fee.',
      ],
    },
    {
      title: '5. Wallet and Payments',
      content: [
        'FF Tourney uses an internal wallet system for managing tournament entry fees and prize distributions. Wallet balances are denominated in Indian Rupees (₹).',
        'All wallet recharges are processed through Razorpay, our authorized payment gateway. By making a payment, you also agree to Razorpay\'s terms of service.',
        'Tournament entry fees are non-refundable once the tournament has started, unless the tournament is cancelled by the moderators.',
        'Prize winnings will be credited to your wallet balance. Withdrawal requests are subject to verification and may take up to 7 business days to process.',
        'We reserve the right to withhold or deduct amounts from your wallet in cases of fraudulent activity, policy violations, or erroneous credits.',
      ],
    },
    {
      title: '6. Fair Play and Conduct',
      content: [
        'All users are expected to maintain respectful and sportsmanlike conduct on the platform. Harassment, abuse, hate speech, or threatening behavior towards other users or moderators will not be tolerated.',
        'Collusion, match-fixing, or any form of competitive manipulation is strictly prohibited.',
        'Users found violating fair play standards will face penalties ranging from temporary suspension to permanent account termination, depending on the severity of the offense.',
      ],
    },
    {
      title: '7. Intellectual Property',
      content: [
        'All content on FF Tourney, including but not limited to logos, design, text, graphics, and software, is the property of FF Tourney or its content suppliers and is protected by intellectual property laws.',
        'Free Fire and related graphics and trademarks are the property of Garena. FF Tourney is an independent platform and is not affiliated with, endorsed by, or sponsored by Garena.',
        'You may not reproduce, distribute, modify, or create derivative works from any content on our platform without explicit written permission.',
      ],
    },
    {
      title: '8. Advertising',
      content: [
        'FF Tourney displays advertisements through third-party advertising networks including Google AdSense. By using our platform, you acknowledge and accept the presence of advertisements.',
        'We are not responsible for the content or accuracy of third-party advertisements. Interaction with advertisements is at your own risk and subject to the advertiser\'s terms.',
      ],
    },
    {
      title: '9. Limitation of Liability',
      content: [
        'FF Tourney is provided on an "as-is" and "as-available" basis. We make no warranties, express or implied, regarding the platform\'s availability, reliability, or suitability for any particular purpose.',
        'In no event shall FF Tourney be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.',
        'Our total liability for any claims relating to our services shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.',
      ],
    },
    {
      title: '10. Termination',
      content: [
        'We reserve the right to suspend or terminate your account at any time, with or without cause, and with or without notice. Upon termination, your right to use the platform ceases immediately.',
        'Any outstanding wallet balance at the time of termination due to policy violations may be forfeited.',
      ],
    },
    {
      title: '11. Governing Law',
      content: [
        'These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.',
      ],
    },
    {
      title: '12. Contact Information',
      content: [
        'For any questions regarding these Terms and Conditions, please contact us through our Support Center or email us at support@fftourney.com.',
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
              <DocumentTextIcon className="h-8 w-8 text-ff-orange" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FFB835]">Conditions</span>
            </h1>
            <p className="text-gray-400 text-lg">Last updated: {lastUpdated}</p>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto leading-relaxed">
              Please read these Terms and Conditions carefully before using FF Tourney. These terms govern your access to and use of our tournament platform.
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

export default TermsConditions;
