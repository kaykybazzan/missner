'use client'

import { motion } from 'framer-motion';

interface StaggerTextProps {
  text: string
  className?: string
  delayOffset?: number
}

export function StaggerText({ text, className = '', delayOffset = 0 }: StaggerTextProps) {
  const words = text.split(' ')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // Tempo entre cada letra aparecer
        delayChildren: delayOffset, // Tempo de espera para iniciar
      },
    },
  }

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 12, 
      filter: 'blur(4px)' // Efeito de foco/desfoque sofisticado
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] as const }
    },
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split('').map((char, charIdx) => (
            <motion.span
              key={charIdx}
              className="inline-block"
              variants={letterVariants}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  )
}