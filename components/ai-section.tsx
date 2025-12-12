'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Sparkles, Brain, FileText, Users, Zap } from 'lucide-react';

export function AISection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Generation',
      description: 'Intelligent meal plan creation using your saved meals and client preferences',
      delay: 0.1,
    },
    {
      icon: Users,
      title: 'Client-Aware',
      description: 'Automatically considers client goals, dietary restrictions, and preferences',
      delay: 0.2,
    },
    {
      icon: FileText,
      title: 'Professional PDFs',
      description: 'Generates beautiful, branded PDFs ready to send to your clients instantly',
      delay: 0.3,
    },
  ];

  return (
    <section
      ref={ref}
      id="ai-assistant"
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Assistant</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 tracking-tight"
          >
            Create Meal Plans with{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AI Intelligence
              </span>
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-3 bg-emerald-200/40 -z-0"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
                style={{ transformOrigin: 'left' }}
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto"
          >
            Let our AI assistant create personalized meal plan PDFs for your clients using your saved meals and their specific information. Save time while delivering professional results.
          </motion.p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-neutral-200/50 hover:border-emerald-300 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/0 to-teal-50/0 group-hover:from-emerald-50/50 group-hover:to-teal-50/50 transition-all duration-300 -z-10" />

              <motion.div
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </motion.div>

              <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-emerald-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="relative"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-12 sm:p-16 overflow-hidden group cursor-pointer"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }} />
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute top-8 right-8 w-20 h-20 bg-white/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-8 left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-10 text-center">
              <motion.div
                className="inline-flex items-center gap-2 mb-6"
                whileHover={{ scale: 1.1 }}
              >
                <Zap className="w-6 h-6 text-white" />
                <span className="text-white/90 font-medium">Powered by AI</span>
              </motion.div>

              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Workflow?
              </h3>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Start creating personalized meal plan PDFs in seconds. Our AI uses your saved meals and client data to generate professional plans automatically.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Started Free
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

