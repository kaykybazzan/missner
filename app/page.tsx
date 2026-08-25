'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, Clock3, HeartPulse, MapPin, Menu, MessageCircle, Phone, Sparkles, X } from 'lucide-react'
import { BeforeAfterSlider } from '@/components/before-after-slider'

const whatsappUrl = 'https://wa.me/5547991539466?text=Olá%2C%20gostaria%20de%20agendar%20uma%20avaliação.'

function useReveal<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.unobserve(el) }
    }, { threshold, rootMargin: '0px 0px -10% 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return <div ref={ref} className={`reveal-up ${visible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

declare global {
  interface Window {
    SplitType: any
    gsap: any
  }
}

function PremiumTextAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!window.SplitType || !window.gsap || !containerRef.current) return

      // 1. Divide o título e subtítulo em letras individuais
      const titleSplit = new window.SplitType('#hero-title', { types: 'chars, words' })
      const subtitleSplit = new window.SplitType('#hero-subtitle', { types: 'chars, words' })

      // 2. Timeline GSAP desacelerada
      const tl = window.gsap.timeline({ 
        defaults: { ease: 'power3.out', duration: 1.8 } 
      })

      // Tag superior (Eyebrow)
      tl.fromTo(
        '.eyebrow', 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 1.2 }
      )

      // Título Principal (Mais lento e cadenciado letra por letra)
      tl.fromTo(
        titleSplit.chars,
        { opacity: 0, y: 60, rotateX: -45 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.035 },
        '-=0.6'
      )

      // Subtítulo (Subindo suavemente em seguida)
      tl.fromTo(
        subtitleSplit.chars,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.018, duration: 1.4 },
        '-=1.0'
      )

      // Botão CTA (Aparecendo com suavidade no final)
      tl.fromTo(
        '.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0 },
        '-=0.8'
      )
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={containerRef} className="hero-copy">
      <p className="eyebrow">MISSNER · ODONTOLOGIA EM BLUMENAU</p>

      <h1 id="hero-title" className="split-mask">
        Chega de sorrir com a boca fechada.
      </h1>

      <p id="hero-subtitle" className="hero-support split-mask">
        Um cuidado transparente, explicado com calma, para você recuperar a confiança no seu sorriso.
      </p>

      <a className="button button-cyan hero-cta" href={whatsappUrl}>
        <MessageCircle size={16} /> Marcar uma conversa sem compromisso
      </a>
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      
      // Detect which section is currently in view
      const sections = ['inicio', 'caminho', 'cuidados', 'como-funciona', 'contato']
      const scrollPosition = window.scrollY + 100
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  
  return <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
    <a className="brand" href="#inicio" aria-label="Missner início"><img src="/logo.png" alt="Missner" className="brand-logo" /></a>
    <nav className={open ? 'nav open' : 'nav'} aria-label="Navegação principal">
      <a href="#caminho" onClick={() => setOpen(false)} className={activeSection === 'caminho' ? 'active' : ''}>Encontre seu caminho</a>
      <a href="#cuidados" onClick={() => setOpen(false)} className={activeSection === 'cuidados' ? 'active' : ''}>Cuidados</a>
      <a href="#como-funciona" onClick={() => setOpen(false)} className={activeSection === 'como-funciona' ? 'active' : ''}>Como funciona</a>
      <a href="#contato" onClick={() => setOpen(false)} className={activeSection === 'contato' ? 'active' : ''}>Contato</a>
    </nav>
    <a className="header-whatsapp" href={whatsappUrl}><MessageCircle size={15} /> WhatsApp</a>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'}>{open ? <X /> : <Menu />}</button>
  </header>
}
function SmileLine({ className = '' }: { className?: string }) {
  const { ref, visible } = useReveal<SVGSVGElement>(0.5)
  return <svg ref={ref} className={`smile-line ${className} ${visible ? 'is-drawn' : ''}`} viewBox="0 0 800 150" aria-hidden="true"><path d="M8 56 C 170 125, 270 128, 400 78 S 635 20, 792 92" /></svg>
}
function Hero() {
  return (
    <section id="inicio" className="hero">
      <img src="/hero-dentist.png" alt="Paciente sorrindo em um ambiente clínico odontológico" />
      <div className="hero-overlay" />
      <Header />
      <PremiumTextAnimation />
      <div className="hero-scroll">
        Role para conhecer a Missner <span>↓</span>
      </div>
    </section>
  )
}
const paths = [['Quero um sorriso mais bonito', 'Clareamento, facetas e reconstrução, com resultado que você vê antes de decidir.', Sparkles], ['Estou com dor ou um dente quebrado', 'Atendimento sem enrolação para quem não pode esperar.', HeartPulse], ['É para meu filho', 'Um primeiro contato pensado para deixar crianças à vontade.', MessageCircle]] as const
function PathSection() { return <section id="caminho" className="section path-section"><Reveal className="section-intro"><p className="kicker">O seu momento</p><h2>O que te trouxe<br />até aqui <em>hoje?</em></h2></Reveal><div className="path-grid">{paths.map(([title, desc, Icon], i) => <Reveal key={title} delay={i * 90}><a className="path-card" href="#cuidados"><Icon className="tiny-icon" /><h3>{title}</h3><p>{desc}</p><span className="path-arrow"><ArrowUpRight size={16} /></span></a></Reveal>)}</div></section> }const services = [['Estética', 'Porcelanas, facetas, clareamento e preenchimento labial.', 'Do clareamento simples às facetas de porcelana, você vê simulações do resultado antes de decidir qualquer procedimento.'], ['Saúde e urgência', 'Endodontia e tratamentos para dor ou problemas dentários.', 'Dor não espera, e aqui você também não. Casos de urgência são avaliados no mesmo dia sempre que possível.'], ['Estrutura e função', 'Implantes, próteses, reabilitação oral e tratamento de DTM.', 'De um implante único a uma reabilitação completa, começamos com um diagnóstico claro de o que seu caso realmente precisa.'], ['Família', 'Ortodontia e odontopediatria para todas as idades.', 'Do primeiro dente de leite ao aparelho na adolescência, um atendimento pensado para deixar crianças e pais à vontade.']]
function Services() {
  const [active, setActive] = useState(0)
  const [, forceRecalc] = useState(0)
  const detailRefs = useRef<(HTMLParagraphElement | null)[]>([])
  useEffect(() => { forceRecalc((n) => n + 1) }, [])
  return <section className="services-section">
    <div className="services-intro">
      <Reveal><p className="kicker">Cuidado completo</p><h2>Para cada fase,<br />uma forma de<br /><em>cuidar.</em></h2><p className="section-note">A gente olha para o que você precisa hoje e explica os caminhos possíveis.</p></Reveal>
      <div className="services-image"><img src="/missner-care.png" alt="Detalhe do atendimento na clínica Missner" loading="lazy" /></div>
    </div>
    <div className="service-list">
      {services.map(([title, desc, detail], i) => {
        const isActive = active === i
        return <div className={`service-item ${isActive ? 'active' : ''}`} key={title}>
          <button onClick={() => setActive(isActive ? -1 : i)} aria-expanded={isActive}><span className="service-number">0{i + 1}</span><span><strong>{title}</strong><small>{desc}</small></span><ChevronDown className="service-chevron" /></button>
          <div className="service-detail-wrap" style={{ maxHeight: isActive ? `${detailRefs.current[i]?.scrollHeight ?? 0}px` : '0px' }}>
            <p className="service-detail" ref={(el) => { detailRefs.current[i] = el }}>{detail}</p>
          </div>
        </div>
      })}
    </div>
  </section>
}
function CareSection() { return <section id="cuidados" className="care-section"><div className="care-photo"><img src="/clinic-consultation.png" alt="Dentista conversando com paciente durante uma consulta" /></div><div className="care-text"><Reveal><p className="kicker">Sem julgamentos</p><h2>Não sentir dor<br />não significa que<br /><em>está tudo bem.</em></h2><p>Muitas vezes a gente adia ir ao dentista por medo, vergonha ou falta de tempo. Aqui, você encontra escuta e clareza para cuidar sem pressa.</p><a className="text-link" href={whatsappUrl}>Conversar sobre o meu caso <ArrowUpRight size={15} /></a></Reveal></div><Services /></section> }
const steps = [['Você chama no WhatsApp', 'Conta o que está sentindo ou o que gostaria de mudar. É rápido e direto.'], ['Avaliação presencial', 'Entendemos seu caso com tecnologia e tempo dedicado só para você.'], ['Plano claro', 'Você sabe o que precisa ser feito, quanto tempo leva e como funciona o pagamento.']]
function ProcessSection() { return <section id="como-funciona" className="process-section"><Reveal className="process-heading"><p className="kicker">Transparência de processo</p><h2>Do primeiro contato<br />ao seu <em>sorriso.</em></h2><p>Você nunca fica sem saber qual é o próximo passo.</p></Reveal><div className="timeline"><SmileLine className="timeline-line" />{steps.map(([title, desc], i) => <article className="timeline-step" key={title}><span className="step-number">0{i + 1}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section> }
function ResultsSection() { return <section className="result-section"><Reveal className="result-copy"><p className="kicker">O que importa</p><h2>Resultado <em>real,</em><br />não promessa.</h2><p>Quando o plano é claro, o resultado começa antes mesmo do tratamento. Ele começa na confiança.</p></Reveal><div className="result-photo"><BeforeAfterSlider before="/antes.png" after="/depois.png" beforeAlt="Sorriso antes do tratamento na Missner" afterAlt="Sorriso depois do tratamento na Missner" /></div></section> }
function TeamSection() { return <section className="team-section"><Reveal className="team-heading"><p className="kicker">Quem cuida de você</p><h2>Profissionais<br />que cuidam<br />de <em>pessoas.</em></h2></Reveal><div className="team-gallery"><div className="team-member"><img src="/vivian.png" alt="Dra. Vivian Bettina Missner" /><strong>Dra. Vivian<br />Bettina Missner</strong><small>CRO/SC 2039</small><em>Vivian</em></div><div className="team-member"><img src="/rodolfo.png" alt="Dr. Rodolfo Missner Hoffmann" /><strong>Dr. Rodolfo<br />Missner Hoffmann</strong><small>CRO/SC 11941 · RT</small><em>Rodolfo</em></div></div></section> }
function WhySection() { const items = [['11+', 'Anos de Blumenau', 'Mais de uma década cuidando de sorrisos na mesma cidade, com a mesma equipe.'], ['20h', 'Atendimento até as 20h', 'De segunda a sexta, para você não precisar sair do trabalho no meio do dia.'], ['02', 'Dois profissionais registrados', 'Dra. Vivian e Dr. Rodolfo cuidando do seu sorriso com responsabilidade.'], ['3D', 'Escaneamento intraoral', 'Mais conforto e precisão para entender seu caso com mais detalhes.']]; return <section className="why-section"><Reveal className="why-heading"><p className="kicker">Por dentro da Missner</p><h2>Por que escolher<br />a <em>Missner?</em></h2></Reveal><div className="why-list">{items.map(([big, title, desc]) => <article key={title}><strong>{big}</strong><div><h3>{title}</h3><p>{desc}</p></div></article>)}</div></section> }
function Contact() { return <><section id="contato" className="contact-section"><Reveal className="contact-copy"><p className="kicker">Seu próximo passo</p><h2>Vamos conversar<br />sobre o seu <em>sorriso?</em></h2><p>O primeiro passo pode ser mais simples do que você imagina.</p><a className="button button-outline" href={whatsappUrl}><MessageCircle size={16} /> Falar no WhatsApp agora</a></Reveal><img src="/clinic-consultation.png" alt="Recepção da clínica Missner" /><div className="contact-details"><p><MapPin /> <strong>Edifício Stein Tower</strong><br />R. Floriano Peixoto, 222, sala 603<br />Centro, Blumenau</p><p><Clock3 /> <strong>Segunda a sexta, das 8h às 20h</strong></p><p><Phone /> <strong>(47) 3322-4266</strong></p></div></section><footer><span className="brand">Missner</span><small>Clínica Odontológica no Centro de Blumenau</small><a href="#inicio">Voltar ao início ↑</a></footer><a className="floating-whatsapp" href={whatsappUrl} aria-label="Falar no WhatsApp"><MessageCircle /></a></> }
export default function Page() { return <main><Hero /><PathSection /><CareSection /><ProcessSection /><ResultsSection /><TeamSection /><WhySection /><Contact /></main> }
