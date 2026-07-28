// src/components/home/StatsSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "../../data/staticData";

const CountUp = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const num = parseInt(target.replace(/\D/g, ""));
  const suffix = target.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = num / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, num, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const StatsSection = () => (
  <section className="py-16 bg-dark-900">
    <div className="container-max px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map(({ value, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
              <CountUp target={value} />
            </div>
            <p className="text-dark-400 text-sm">{label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// src/components/home/ServicesPreview.jsx
import { Link } from "react-router-dom";
import { HiArrowRight, HiCheck } from "react-icons/hi";
import { useEffect, useState as useState2 } from "react";
import { getServices } from "../../services/serviceService";

export const ServicesPreview = () => {
  const [services, setServices] = useState2([]);

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  return (
    <section className="section-padding bg-white dark:bg-dark-950">
      <div className="container-max">
        <div className="text-center mb-16">
          <span className="section-tag">What I Offer</span>
          <h2 className="section-title mb-4">Services & <span className="gradient-text">Pricing</span></h2>
          <p className="section-subtitle mx-auto">
            Transparent pricing for every project size. From simple websites to complex enterprise applications.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {services.slice(0, 4).map((s, i) => (
            <motion.div
              key={s.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                s.popular
                  ? "bg-primary-600 border-primary-500 shadow-glow text-white"
                  : "bg-white dark:bg-dark-800 border-dark-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xl"
              }`}
            >
              {s.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-white text-primary-600 text-xs font-bold shadow">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className={`font-display font-bold text-xl mb-1 ${s.popular ? "text-white" : "text-dark-900 dark:text-white"}`}>
                {s.title}
              </h3>
              <p className={`text-sm mb-4 ${s.popular ? "text-primary-100" : "text-dark-500 dark:text-dark-400"}`}>
                {s.description}
              </p>
              <div className={`mb-6 ${s.popular ? "text-white" : "text-dark-900 dark:text-white"}`}>
                <span className="text-3xl font-display font-bold">
                  ${s.price}
                </span>
                <span className={`text-sm ${s.popular ? "text-primary-200" : "text-dark-400"}`}>
                  /{s.period}
                </span>
              </div>
              <ul className="space-y-2 mb-6">
                {(s.features || []).slice(0, 5).map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2 text-sm">
                    <HiCheck className={`flex-shrink-0 ${s.popular ? "text-white" : "text-emerald-500"}`} />
                    <span className={s.popular ? "text-primary-100" : "text-dark-600 dark:text-dark-300"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/services"
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  s.popular
                    ? "bg-white text-primary-600 hover:bg-primary-50"
                    : "border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white"
                }`}
              >
                {s.buttonText || "Get Started"} <HiArrowRight />
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="btn-outline">
            View All Services <HiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

// src/components/home/ContactCTA.jsx
import { HiMail } from "react-icons/hi";
import { FaTelegram as FaTele } from "react-icons/fa";

export const ContactCTA = () => (
  <section className="section-padding bg-dark-950">
    <div className="container-max px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 to-blue-700 p-12 md:p-20 text-center"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-6">
            Let's Work Together
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Have a project in mind?
          </h2>
          <p className="text-primary-100 text-lg max-w-xl mx-auto mb-10">
            I'm currently available for freelance work and exciting collaborations. Let's turn your vision into reality.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-600 font-bold hover:bg-primary-50 transition-all duration-200 shadow-lg">
              <HiMail className="text-lg" /> Start a Project
            </Link>
            <a
              href="https://t.me/laolimheang"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/30 text-white font-bold hover:bg-white/20 transition-all duration-200"
            >
              <FaTele className="text-lg" /> Telegram Me
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default StatsSection;