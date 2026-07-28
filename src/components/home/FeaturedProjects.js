// src/components/home/FeaturedProjects.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowRight, HiExternalLink, HiCode } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import { getProjects } from "../../services/projectService";

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects(true).then((data) => {
      setProjects(data.slice(0, 6));
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (projects.length === 0) return null;

  return (
    <section className="section-padding bg-dark-900">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="section-tag">Recent Work</span>
            <h2 className="section-title mt-2 text-white">
              Featured <span className="gradient-text">Projects</span>
            </h2>
          </div>
          <Link to="/portfolio" className="btn-outline shrink-0">
            All Projects <HiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl overflow-hidden bg-dark-800 border border-dark-700 hover:border-primary-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden bg-dark-700">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/50 to-blue-900/50">
                    <HiCode className="text-5xl text-primary-500/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-dark-800 text-xs font-semibold hover:bg-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HiExternalLink /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700/90 text-white text-xs font-semibold hover:bg-dark-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaGithub /> Code
                    </a>
                  )}
                </div>
              </div>
              <div className="p-5">
                {project.category && (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-semibold mb-2">
                    {project.category}
                  </span>
                )}
                <h3 className="font-display font-bold text-white text-lg mb-1.5 group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-dark-400 text-sm line-clamp-2">{project.description}</p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs bg-dark-700 text-dark-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;