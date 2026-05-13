import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Globe, Code, Brain, Palette, Briefcase, GraduationCap, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Play, Award, Loader2, BookOpen, PenLine, Cpu, ChevronRight, CheckCircle, Save, Trash2, Zap } from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  modules: number;
  icon: string;
  color: string;
  bullets: string[];
  fullModules?: string[];
  isAIGenerated?: boolean;
}

interface UserProgress {
  [courseId: string]: {
    completedModules: number[];
    lastModuleIndex: number;
  };
}

const COURSES: Course[] = [
  // Idiomas
  {
    id: "en-0",
    title: "Inglês do Zero ao Fluente 🇺🇸",
    description: "Aprenda inglês de verdade! Pronúncia americana, gírias, frases...",
    category: "Idiomas",
    level: "Iniciante",
    modules: 10,
    icon: "🇺🇸",
    color: "border-orange-500/20",
    bullets: ["Alphabet, sounds & IPA", "Basic grammar: verbs, nouns", "Everyday phrases"],
    fullModules: [
      "Introduction to English Sounds",
      "The Alphabet & Spelling",
      "Essential Greeting & Phrases",
      "Nouns and Pronouns",
      "Present Simple Tense",
      "Common Verbs & Actions",
      "Numbers and Time",
      "Describing People & Places",
      "Shopping & Ordering Food",
      "Practical Conversations"
    ]
  },
  {
    id: "pt-0",
    title: "Português de Portugal 🇵🇹",
    description: "Aprenda o português europeu! Pronúncia, sotaque, expressões...",
    category: "Idiomas",
    level: "Iniciante",
    modules: 7,
    icon: "🇵🇹",
    color: "border-orange-500/20",
    bullets: ["Diferenças fonéticas", "Vocabulário típico", "Conjugação verbal"],
    fullModules: [
      "O Sotaque Europeu",
      "O 'Tu' vs 'Você'",
      "Expressões de Lisboa e Porto",
      "Comida e Cultura Lusa",
      "Gramática Essencial",
      "Verbos no Presente",
      "Conversa de Café"
    ]
  },
  {
    id: "es-0",
    title: "Espanhol Completo 🇪🇸",
    description: "De 'Hola!' ao espanhol fluente. Aprenda espanhol europeu, latino e...",
    category: "Idiomas",
    level: "Iniciante",
    modules: 7,
    icon: "🇪🇸",
    color: "border-orange-500/20",
    bullets: ["Pronúncia: ceceo", "Verbos ser/estar", "Gírias e cultura"],
    fullModules: [
      "Pronunciación y Alfabeto",
      "Saludos y Presentaciones",
      "Ser vs Estar",
      "En el Restaurante",
      "Viajes y Direcciones",
      "Tiempo Libre y Hobbies",
      "Cultura Hispánica"
    ]
  },
  {
    id: "jp-0",
    title: "Japonês do Zero 🇯🇵",
    description: "Hiragana, Katakana e seus primeiros Kanjis! Aprenda japonês com anime...",
    category: "Idiomas",
    level: "Iniciante",
    modules: 7,
    icon: "🇯🇵",
    color: "border-orange-500/20",
    bullets: ["Hiragana: o silabário", "Katakana: estrangeirismos", "Vocabulário básico"],
    fullModules: [
      "Introdução ao Hiragana",
      "Katakana e Estrangeirismos",
      "Saudações e Números",
      "Gramática Básica (Desu)",
      "Partículas Ni, Wa, Ga",
      "Primeiros Kanjis",
      "Cultura e Anime Phrases"
    ]
  },
  {
      id: "fr-0",
      title: "Francês do Zero 🇫🇷",
      description: "Bonjour! Aprenda francês com pronúncia, gramática, gírias...",
      category: "Idiomas",
      level: "Iniciante",
      modules: 6,
      icon: "🇫🇷",
      color: "border-orange-500/20",
      bullets: ["Pronúncia e alfabeto", "Artigos e gêneros", "Verbos presentes"],
      fullModules: [
        "L'alphabet et la prononciation",
        "Salutations et politesse",
        "Les articles et le genre",
        "Les verbes Être et Avoir",
        "Présent de l'indicatif",
        "La vie quotidienne"
      ]
  },
  {
      id: "de-0",
      title: "Alemão Básico 🇩🇪",
      description: "Aprenda alemão para trabalho, imigração ou viagem. Casos...",
      category: "Idiomas",
      level: "Iniciante",
      modules: 6,
      icon: "🇩🇪",
      color: "border-orange-500/20",
      bullets: ["Pronúncia e alfabeto", "Nominativo, acusativo", "Verbos regulares"],
      fullModules: [
        "Alphabet und Aussprache",
        "Begrüßung und Vorstellung",
        "Die Artikel (Der, Die, Das)",
        "Verben im Präsens",
        "Nominativ und Akkusativ",
        "Zahlen und Zeit"
      ]
  },
  {
      id: "it-0",
      title: "Italiano Básico 🇮🇹",
      description: "Mamma mia! Aprenda italiano com música, comida, cultura e expressõ...",
      category: "Idiomas",
      level: "Iniciante",
      modules: 6,
      icon: "🇮🇹",
      color: "border-orange-500/20",
      bullets: ["Pronúncia musical", "Verbos essenciais", "Expressões típicas"],
      fullModules: [
        "Pronuncia e Alfabeto",
        "Saluti e Cortesia",
        "Verbi Essere e Avere",
        "Al Ristorante",
        "La Famiglia",
        "Viaggio in Italia"
      ]
  },
  {
      id: "cn-0",
      title: "Mandarim Básico 🇨🇳",
      description: "Aprenda o idioma mais falado do mundo! Pinyin, tons, caracteres e...",
      category: "Idiomas",
      level: "Iniciante",
      modules: 6,
      icon: "🇨🇳",
      color: "border-orange-500/20",
      bullets: ["Sistema Pinyin", "Caracteres básicos", "Saudações básicas"],
      fullModules: [
        "Sistema Pinyin e Tons",
        "Saudações Básicas",
        "Números e Datas",
        "Caracteres Radicais",
        "Estrutura de Frases",
        "Mandarim para Negócios"
      ]
  },
  // Saúde & Bem-Estar
  {
    id: "mass-0",
    title: "Massagem Terapêutica 💆",
    description: "Aprenda massagem relaxante, desportiva e terapêutica do zero....",
    category: "Saúde & Bem-Estar",
    level: "Iniciante",
    modules: 8,
    icon: "💆",
    color: "border-green-500/20",
    bullets: ["Anatomia básica", "Massagem sueca", "Pontos de tensão"],
    fullModules: [
      "Anatomia Para Massoterapeutas",
      "Biossegurança e Ética",
      "Técnicas de Massagem Sueca",
      "Massagem Relaxante e Óleos",
      "Pontos de Tensão e Gatilho",
      "Massagem Desportiva",
      "Drenagem Linfática Básica",
      "Atendimento ao Cliente"
    ]
  },
  {
    id: "med-0",
    title: "Meditação & Mindfulness 🧘",
    description: "Técnicas de meditação, respiração e mindfulness para reduzir o estresse...",
    category: "Saúde & Bem-Estar",
    level: "Iniciante",
    modules: 6,
    icon: "🧘",
    color: "border-green-500/20",
    bullets: ["O que é meditação?", "Técnicas: 4-7-8", "Meditação guiada"],
    fullModules: [
      "O Despertar da Consciência",
      "Fisiologia do Relaxamento",
      "Práticas de Respiração (Pranayama)",
      "Mindfulness no Dia a Dia",
      "Meditação Caminhando",
      "Higiene do Sono e Repouso"
    ]
  },
  {
    id: "yoga-0",
    title: "Yoga para Iniciantes 🌿",
    description: "Posturas, respiração e filosofia do yoga para melhorar flexibilidade,...",
    category: "Saúde & Bem-Estar",
    level: "Iniciante",
    modules: 6,
    icon: "🌿",
    color: "border-green-500/20",
    bullets: ["História do yoga", "Posturas básicas", "Pranayama"],
    fullModules: [
      "Filosofia e História do Yoga",
      "Saudação ao Sol (Surya Namaskar)",
      "Asanas de Equilíbrio",
      "Asanas de Flexibilidade",
      "Pranayamas e Energia",
      "Savasana e Relaxamento Final"
    ]
  },
  // Negócios
  {
      id: "emp-0",
      title: "Empreendedorismo Digital 🚀",
      description: "Como tirar uma ideia do papel e construir um negócio digital do zer...",
      category: "Negócios",
      level: "Iniciante",
      modules: 6,
      icon: "🚀",
      color: "border-yellow-500/20",
      bullets: ["Ideia de negócio", "Validação rápida", "Modelo de negócio"],
      fullModules: [
        "Mindset Empreendedor",
        "Identificação de Oportunidades",
        "MVP: Mínimo Produto Viável",
        "Modelo de Negócios (Canvas)",
        "Marketing de Atração",
        "Gestão e Escala"
      ]
  },
  {
      id: "fin-0",
      title: "Finanças Pessoais 💰",
      description: "Controle financeiro, investimentos, reserva de emergência e como sair...",
      category: "Negócios",
      level: "Iniciante",
      modules: 6,
      icon: "💰",
      color: "border-yellow-500/20",
      bullets: ["Diagnóstico financeiro", "Orçamento e controle", "Reserva de emergência"],
      fullModules: [
        "Psicologia do Dinheiro",
        "Mapeamento de Gastos",
        "Eliminação de Dívidas",
        "A Magia dos Juros Compostos",
        "Investimentos para Iniciantes",
        "Planejamento de Aposentadoria"
      ]
  },
  // Programação
  {
    id: "html-0",
    title: "HTML do Zero 🌐",
    description: "Aprenda HTML do absoluto zero: estrutura de páginas, tags, semântica e acessibilidade.",
    category: "Programação",
    level: "Iniciante",
    modules: 8,
    icon: "🌐",
    color: "border-blue-500/20",
    bullets: ["Web e servidores", "Estrutura básica", "Tags de texto e links"],
    fullModules: [
      "O que é a web? Browsers e servidores",
      "Estrutura básica de um documento HTML",
      "Tags de texto, links e imagens",
      "Listas, tabelas e formulários",
      "HTML5 semântico: header, nav, main, footer",
      "Acessibilidade e boas práticas",
      "Projeto: crie sua primeira página web"
    ]
  },
  {
      id: "css-0",
      title: "CSS Completo 🎨",
      description: "Estilização moderna com CSS3: Flexbox, Grid, animações e design...",
      category: "Programação",
      level: "Iniciante",
      modules: 7,
      icon: "🎨",
      color: "border-blue-500/20",
      bullets: ["Seletores e herança", "Box model", "Flexbox e Layout"],
      fullModules: [
        "Seletores, Cores e Fontes",
        "Box Model: Margin, Padding, Border",
        "Posicionamento: Fixed, Absolute, Relative",
        "Flexbox: Alinhamentos e Eixos",
        "Grid Layout: Colunas e Áreas",
        "Animações e Transições",
        "Responsividade com Media Queries"
      ]
  },
  {
      id: "web-0",
      title: "Desenvolvimento Web Completo 💻",
      description: "Do HTML ao deploy: construa sites e aplicações web profissionais.",
      category: "Programação",
      level: "Intermediário",
      modules: 8,
      icon: "💻",
      color: "border-blue-500/20",
      bullets: ["HTML/CSS semântico", "JavaScript: DOM", "Deploy e Git"],
      fullModules: [
        "Fundações do Desenvolvimento Web",
        "HTML Avançado e Acessibilidade",
        "CSS Moderno: Grid e Flex",
        "JavaScript: Manipulação de DOM",
        "Trabalhando com APIs e Fetch",
        "Versionamento com Git e GitHub",
        "Deploy e Hospedagem",
        "Otimização de Performance"
      ]
  },
  {
      id: "react-0",
      title: "React do Zero ao Avançado ⚛️",
      description: "Construa aplicações modernas com React, hooks, Context API e...",
      category: "Programação",
      level: "Intermediário",
      modules: 8,
      icon: "⚛️",
      color: "border-blue-500/20",
      bullets: ["JSX e componentes", "Hooks e Hooks custom", "Gerenciamento de estado"],
      fullModules: [
        "Fundamentos: Componentes e Props",
        "Estado e Ciclo de Vida (useState, useEffect)",
        "Trabalhando com Listas e Chaves",
        "Formulários e Referências (useRef)",
        "Context API e Provider Pattern",
        "Hooks Customizados",
        "Roteamento com React Router",
        "Consumo de APIs com TanStack Query"
      ]
  },
  {
      id: "py-0",
      title: "Python Completo 🐍",
      description: "Do zero ao avançado: automações, análise de dados, web scraping e...",
      category: "Programação",
      level: "Iniciante",
      modules: 6,
      icon: "🐍",
      color: "border-blue-500/20",
      bullets: ["Sintaxe e tipos", "Controle e funções", "OOP em Python"],
      fullModules: [
        "Introdução e Ambiente Python",
        "Variáveis, Tipos e Operadores",
        "Estruturas de Controle (If, For, While)",
        "Funções e Módulos",
        "Listas, Dicionários e Tuplas",
        "Tratamento de Exceções"
      ]
  },
  {
      id: "js-0",
      title: "JavaScript Moderno ⚡",
      description: "ES6+, DOM, async/await, React hooks e desenvolvimento full-stack.",
      category: "Programação",
      level: "Iniciante",
      modules: 6,
      icon: "⚡",
      color: "border-blue-500/20",
      bullets: ["Fundamentos ES6+", "DOM e eventos", "Async/Await API"],
      fullModules: [
        "Let, Const e Arrow Functions",
        "Destructuring e Spread Operator",
        "Promessas e Async/Await",
        "Classes e Herança",
        "Módulos e NPM",
        "Manipulação Avançada de Arrays"
      ]
  },
  // IA & Dados
  {
      id: "ai-0",
      title: "Agentes de IA 🤖",
      description: "Construa agentes autônomos com LangChain, CrewAI e ferramentas d...",
      category: "IA & Dados",
      level: "Avançado",
      modules: 6,
      icon: "🤖",
      color: "border-purple-500/20",
      bullets: ["LLMs na prática", "LangChain e Memory", "RAG systems"],
      fullModules: [
        "Arquitetura de Modelos de Linguagem",
        "Prompt Engineering para Agentes",
        "LangChain: Correntes e Ferramentas",
        "Memória e Estado em Conversas",
        "RAG: Retrieval Augmented Generation",
        "Deploy de Agentes com Streamlit"
      ]
  },
  {
      id: "prompt-0",
      title: "Prompt Engineering ✨",
      description: "Domine técnicas avançadas de prompting para GPT, Claude e...",
      category: "IA & Dados",
      level: "Iniciante",
      modules: 6,
      icon: "✨",
      color: "border-purple-500/20",
      bullets: ["Fundamentos de LLMs", "Zero-shot e Chain-of-thought", "Estrutura de prompts"],
      fullModules: [
        "Princípios do Design de Prompts",
        "Few-shot Learning",
        "Chain of Thought Prompting",
        "Prompting de Role-play",
        "Técnicas de Delimitadores",
        "Iteração e Refinamento de Prompts"
      ]
  },
  {
      id: "ds-0",
      title: "Data Science com Python 📊",
      description: "Análise de dados, visualizações e machine learning.",
      category: "IA & Dados",
      level: "Intermediário",
      modules: 6,
      icon: "📊",
      color: "border-purple-500/20",
      bullets: ["Pandas e Numpy", "Matplotlib/Seaborn", "Modelagem básica"],
      fullModules: [
        "Exploração de Dados com Pandas",
        "Cálculo Numérico com Numpy",
        "Visualização de Dados (Matplotlib)",
        "Storytelling com Dados (Seaborn)",
        "Limpeza e Tratamento de Outliers",
        "Introdução a Modelos Preditivos"
      ]
  },
  // Design & Marketing
  {
      id: "dg-0",
      title: "Design Gráfico 🎨",
      description: "Teoria das cores, tipografia, composição e criação de identidad...",
      category: "Design & Marketing",
      level: "Iniciante",
      modules: 6,
      icon: "🎨",
      color: "border-pink-500/20",
      bullets: ["Teoria das cores", "Tipografia", "Identidade visual"],
      fullModules: [
        "Princípios do Design Visual",
        "Psicologia das Cores",
        "Grades e Sistemas de Layout",
        "Logotipia e Marca",
        "Formatos de Arquivo e Exportação",
        "Portfólio de Design"
      ]
  },
  {
      id: "mk-0",
      title: "Marketing Digital 📣",
      description: "SEO, tráfego pago, e-mail marketing e gestão de redes sociais.",
      category: "Design & Marketing",
      level: "Iniciante",
      modules: 6,
      icon: "📣",
      color: "border-pink-500/20",
      bullets: ["SEO on-page", "Tráfego pago", "E-mail marketing"],
      fullModules: [
        "Fundamentos do Marketing Moderno",
        "Estratégias de Conteúdo",
        "SEO: Otimização de Busca",
        "Anúncios (Facebook/Google Ads)",
        "Copywriting Persuasivo",
        "Métricas e ROI"
      ]
  },
  {
      id: "uiux-0",
      title: "UI/UX Design 🖼️",
      description: "Pesquisa de usuário, wireframes, protótipos no Figma e design...",
      category: "Design & Marketing",
      level: "Intermediário",
      modules: 6,
      icon: "🖼️",
      color: "border-pink-500/20",
      bullets: ["UX Research", "Wireframes", "Figma design"],
      fullModules: [
        "Entendendo o Usuário (Persona)",
        "Arquitetura de Informação",
        "Wireframing de Baixa Fidelidade",
        "Componentização no Figma",
        "Prototipagem Interativa",
        "Testes de Usabilidade"
      ]
  },
];

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeType, setActiveType] = useState("Gratuitos");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isViewingLesson, setIsViewingLesson] = useState(false);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [notes, setNotes] = useState<{[key: string]: string}>({});
  const [dynamicCourses, setDynamicCourses] = useState<Course[]>([]);
  const [lessonContent, setLessonContent] = useState("");

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("techify_progress");
    const savedNotes = localStorage.getItem("techify_notes");
    if (savedProgress) setUserProgress(JSON.parse(savedProgress));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("techify_progress", JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem("techify_notes", JSON.stringify(notes));
  }, [notes]);

  const allCourses = useMemo(() => [...COURSES, ...dynamicCourses], [dynamicCourses]);

  const categories = [
    { name: "Todos", count: allCourses.length, icon: null },
    { name: "Programação", count: allCourses.filter(c => c.category === "Programação").length, icon: Search },
    { name: "IA & Dados", count: allCourses.filter(c => c.category === "IA & Dados").length, icon: Brain },
    { name: "Idiomas", count: allCourses.filter(c => c.category === "Idiomas").length, icon: Globe },
    { name: "Design & Marketing", count: allCourses.filter(c => c.category === "Design & Marketing").length, icon: Palette },
    { name: "Saúde & Bem-Estar", count: allCourses.filter(c => c.category === "Saúde & Bem-Estar").length, icon: CheckCircle2 },
    { name: "Negócios", count: allCourses.filter(c => c.category === "Negócios").length, icon: Briefcase },
  ];

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "Todos" || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, allCourses]);

  const stats = useMemo(() => {
    const total = allCourses.length;
    const completedCount = Object.values(userProgress).filter((p: any) => {
       const courseId = Object.keys(userProgress).find(id => userProgress[id] === p);
       const course = allCourses.find(c => c.id === courseId);
       if (!course) return false;
       return p.completedModules.length === (course.fullModules?.length || course.bullets.length);
    }).length;
    return { total, completed: completedCount };
  }, [allCourses, userProgress]);

  const generateCourseWithAI = async () => {
    if (!searchQuery.trim()) return;
    setIsGeneratingCourse(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Chave API não configurada.");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Crie um currículo de curso para o tema: "${searchQuery}". Não use markdown chars como '#' nos títulos ou módulos.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              level: { type: Type.STRING },
              modules: { type: Type.NUMBER },
              icon: { type: Type.STRING },
              fullModules: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "category", "level", "modules", "icon", "fullModules"]
          }
        }
      });

      const courseData = JSON.parse(response.text || "{}");
      
      const newCourse: Course = {
        ...courseData,
        id: `ai-${Date.now()}`,
        color: "border-purple-500/20",
        bullets: courseData.fullModules.slice(0, 3),
        isAIGenerated: true
      };

      setDynamicCourses(prev => [newCourse, ...prev]);
      setSelectedCourse(newCourse);
    } catch (error) {
      console.error("Erro ao gerar curso:", error);
    } finally {
      setIsGeneratingCourse(false);
    }
  };

  const [lessonData, setLessonData] = useState<{content: string, quiz?: {question: string, options: string[], answer: number}} | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "wrong" | null>(null);

  const startLesson = async (idx: number) => {
    setCurrentModuleIndex(idx);
    setIsLoadingLesson(true);
    setIsViewingLesson(true);
    setLessonData(null);
    setSelectedOption(null);
    setQuizFeedback(null);

    try {
      if (!selectedCourse) return;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Chave API não configurada.");

      const ai = new GoogleGenAI({ apiKey });
      const modules = selectedCourse.fullModules || selectedCourse.bullets;
      
      const prompt = `Gere uma lição didática para o módulo "${modules[idx]}" do curso "${selectedCourse.title}". 
      Explique detalhadamente passo a passo. Utilize uma linguagem clara e acessível.
      Retorne APENAS um JSON no formato:
      {
        "content": "Conteúdo da aula em markdown explicando passo a passo. NÃO use '#' para títulos, use negrito ou apenas texto em destaque.",
        "quiz": {
          "question": "Pense em uma pergunta sobre o conteúdo acima",
          "options": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
          "answer": 0 (índice da resposta correta)
        }
      }
      Responda em Português.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              quiz: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  answer: { type: Type.NUMBER }
                },
                required: ["question", "options", "answer"]
              }
            },
            required: ["content", "quiz"]
          }
        }
      });
      
      const data = JSON.parse(response.text || "{}");
      setLessonData(data);
    } catch (error) {
      console.error("Erro na lição:", error);
      setLessonData({ content: "Erro ao carregar aula. Tente novamente." });
    } finally {
      setIsLoadingLesson(false);
    }
  };

  const handleQuizAnswer = (idx: number) => {
    if (!lessonData?.quiz) return;
    setSelectedOption(idx);
    if (idx === lessonData.quiz.answer) {
      setQuizFeedback("correct");
      markModuleCompleted(selectedCourse!.id, currentModuleIndex);
    } else {
      setQuizFeedback("wrong");
    }
  };

  const markModuleCompleted = (courseId: string, idx: number) => {
    setUserProgress(prev => {
      const current = prev[courseId] || { completedModules: [], lastModuleIndex: 0 };
      if (!current.completedModules.includes(idx)) {
        return {
          ...prev,
          [courseId]: {
            completedModules: [...current.completedModules, idx],
            lastModuleIndex: idx + 1 < (selectedCourse?.fullModules?.length || selectedCourse?.bullets.length || 0) ? idx + 1 : idx
          }
        };
      }
      return prev;
    });
  };

  const getProgressPercentage = (course: Course) => {
    const progress = userProgress[course.id];
    if (!progress) return 0;
    const moduleCount = course.fullModules?.length || course.bullets.length;
    return Math.min(100, Math.round((progress.completedModules.length / moduleCount) * 100));
  };

  const [isAiInsightLoading, setIsAiInsightLoading] = useState(false);

  const generateAiInsight = async (type: "resume" | "questions") => {
    if (!selectedCourse || !lessonData) return;
    setIsAiInsightLoading(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Chave API não configurada.");

      const ai = new GoogleGenAI({ apiKey });
      const prompt = type === "resume" 
        ? `Crie um resumo executivo em tópicos da aula: "${lessonData.content}". Adicione dicas práticas.`
        : `Com base no conteúdo: "${lessonData.content}", gere 3 perguntas extras para estudo com respostas curtas.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      setNotes(prev => ({
        ...prev,
        [selectedCourse.id]: (prev[selectedCourse.id] || "") + `\n\n--- AI ${type.toUpperCase()} ---\n` + (response.text || "")
      }));
    } catch (error) {
      console.error("AI Insight error:", error);
    } finally {
      setIsAiInsightLoading(false);
    }
  };

  if (isViewingLesson && selectedCourse) {
    const modules = selectedCourse.fullModules || selectedCourse.bullets;
    const isCompleted = userProgress[selectedCourse.id]?.completedModules.includes(currentModuleIndex);
    const progressPercent = getProgressPercentage(selectedCourse);

    return (
      <div className="pt-20 min-h-screen bg-black">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 pb-20">
          {/* Main Content Area */}
          <div className="flex-1 max-w-4xl">
            <button 
              onClick={() => setIsViewingLesson(false)}
              className="flex items-center gap-2 text-gray-500 mb-6 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} /> Voltar ao Currículo
            </button>

            <div className="flex justify-between items-center mb-4">
              <span className="text-brand text-[10px] font-black uppercase tracking-widest bg-brand/10 px-2 py-1 rounded">
                Módulo {currentModuleIndex + 1} de {modules.length}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 md:w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-brand"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold">{progressPercent}%</span>
              </div>
            </div>

            <h1 className="text-3xl font-black mb-8">{modules[currentModuleIndex]}</h1>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 mb-8 min-h-[400px]">
              {isLoadingLesson ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-center">
                  <Loader2 className="text-brand animate-spin mb-4" size={48} />
                  <p className="text-white font-bold text-lg mb-2">Construindo sua Aula...</p>
                  <p className="text-gray-400">A IA está preparando explicações passo a passo.</p>
                </div>
              ) : lessonData ? (
                <div className="space-y-12">
                  {/* Lesson Content */}
                  <div className="prose prose-invert max-w-none">
                    <div className="leading-relaxed text-gray-300 text-lg">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {lessonData.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Quiz Section */}
                  {lessonData.quiz && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 rounded-3xl bg-black/40 border border-brand/20 shadow-[0_0_50px_rgba(132,204,22,0.05)]"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-brand/10 text-brand">
                          <CheckCircle2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Teste seu Conhecimento</h3>
                      </div>
                      <p className="text-gray-200 mb-6 font-medium text-lg">{lessonData.quiz.question}</p>
                      <div className="grid grid-cols-1 gap-3">
                        {lessonData.quiz.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuizAnswer(i)}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              selectedOption === i 
                                ? (i === lessonData.quiz!.answer ? 'bg-brand/20 border-brand text-brand' : 'bg-red-500/20 border-red-500 text-red-500')
                                : 'bg-white/5 border-white/10 hover:border-brand/40 text-gray-300'
                            }`}
                          >
                            <span className="font-bold mr-3">{String.fromCharCode(65 + i)})</span> {opt}
                          </button>
                        ))}
                      </div>
                      
                      <AnimatePresence>
                        {quizFeedback && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={`mt-6 p-4 rounded-xl font-bold text-center ${
                              quizFeedback === "correct" ? "bg-brand text-black" : "bg-red-500 text-white"
                            }`}
                          >
                            {quizFeedback === "correct" ? "Parabéns! Resposta correta. Aula concluída!" : "Ops! Tente novamente."}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-red-400">
                   Erro ao gerar aula.
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button 
                disabled={currentModuleIndex === 0}
                onClick={() => startLesson(currentModuleIndex - 1)}
                className="px-6 py-4 rounded-2xl border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 flex items-center gap-2 transition-all"
              >
                <ArrowLeft size={18} /> Anterior
              </button>

              <button 
                disabled={!isCompleted || currentModuleIndex === modules.length - 1}
                onClick={() => startLesson(currentModuleIndex + 1)}
                className="px-10 py-4 rounded-2xl bg-brand text-black font-black hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(132,204,22,0.3)] disabled:opacity-30 disabled:grayscale"
              >
                Próximo Módulo <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Notebook Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-4 text-brand">
                  <PenLine size={20} />
                  <h3 className="font-bold">Seu Notebook</h3>
                </div>
                <textarea 
                  value={notes[selectedCourse.id] || ""}
                  onChange={(e) => setNotes(prev => ({ ...prev, [selectedCourse.id]: e.target.value }))}
                  placeholder="Anote aqui suas dúvidas e aprendizados sobre este curso..."
                  className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-gray-300 outline-none focus:border-brand/40 transition-all resize-none mb-4"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Salvo automaticamente</span>
                  <button onClick={() => setNotes(prev => ({ ...prev, [selectedCourse.id]: "" }))} className="text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-brand/5 border border-brand/20">
                <div className="flex items-center gap-2 mb-4 text-brand">
                  <Cpu size={20} />
                  <h3 className="font-bold">Techify AI Insights</h3>
                </div>
                <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
                  Dica: Use seus apontamentos para criar resumos com IA no Chat tutor!
                </p>
                <div className="space-y-2">
                   <button 
                    disabled={isAiInsightLoading}
                    onClick={() => generateAiInsight("resume")}
                    className="w-full py-2 rounded-lg bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold hover:bg-brand/20 transition-all flex items-center justify-center gap-2"
                   >
                     {isAiInsightLoading ? <Loader2 size={12} className="animate-spin" /> : "RESUMIR MÓDULO"}
                   </button>
                   <button 
                    disabled={isAiInsightLoading}
                    onClick={() => generateAiInsight("questions")}
                    className="w-full py-2 rounded-lg bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold hover:bg-brand/20 transition-all flex items-center justify-center gap-2"
                   >
                     {isAiInsightLoading ? <Loader2 size={12} className="animate-spin" /> : "CRIAR QUESTÕES"}
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    const modules = selectedCourse.fullModules || selectedCourse.bullets;
    const progress = userProgress[selectedCourse.id] || { completedModules: [], lastModuleIndex: 0 };
    
    return (
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <button 
            onClick={() => setSelectedCourse(null)}
            className="flex items-center gap-2 text-brand font-bold mb-8 hover:gap-3 transition-all cursor-pointer"
          >
            <ArrowLeft size={20} /> Voltar aos Cursos
          </button>

          {/* Course Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 rounded-[40px] bg-white/5 border border-white/10 relative overflow-hidden mb-12 shadow-2xl"
          >
            <div className="absolute inset-0 bg-brand/5 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="w-24 h-24 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-5xl">
                   {selectedCourse.icon}
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                     <span className="text-brand text-xs font-black uppercase tracking-widest bg-brand/10 px-2 py-1 rounded">
                       {selectedCourse.category}
                     </span>
                     {selectedCourse.isAIGenerated && (
                       <span className="text-purple-400 text-xs font-black uppercase tracking-widest bg-purple-400/10 px-2 py-1 rounded flex items-center gap-1">
                         <Zap size={12} /> IA Created
                       </span>
                     )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-4">
                    {selectedCourse.title}
                  </h1>
                  <p className="text-brand text-xs font-bold uppercase tracking-widest mb-2">
                    {selectedCourse.modules} módulos • Certificado Techify
                  </p>
                  <p className="text-gray-400 text-lg max-w-2xl">
                    {selectedCourse.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <button 
                  onClick={() => startLesson(progress.lastModuleIndex)}
                  className="w-full md:w-auto px-10 py-5 rounded-2xl bg-brand text-black font-black flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(132,204,22,0.3)]"
                >
                  <Play size={24} /> {progress.completedModules.length > 0 ? "Continuar Aula" : "Começar Agora"}
                </button>
                
                <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage(selectedCourse)}%` }}
                      className="h-full bg-brand"
                    />
                  </div>
                  <span className="text-sm font-black text-brand">{getProgressPercentage(selectedCourse)}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Modules List */}
          <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
            <h2 className="text-3xl font-bold mb-8">Módulos do Curso</h2>
            <div className="space-y-4">
              {modules.map((module, idx) => {
                const isCompleted = progress.completedModules.includes(idx);
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => startLesson(idx)}
                    className={`p-6 rounded-2xl border flex items-center gap-6 group transition-all cursor-pointer ${
                      isCompleted 
                      ? 'bg-brand/5 border-brand/20' 
                      : 'bg-black/40 border-white/5 hover:border-brand/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold shrink-0 transition-all ${
                      isCompleted 
                      ? 'bg-brand border-brand text-black scale-110 shadow-[0_0_15px_rgba(132,204,22,0.5)]' 
                      : 'bg-brand/10 border-brand/20 text-brand'
                    }`}>
                      {isCompleted ? <CheckCircle size={24} /> : (idx + 1)}
                    </div>
                    <span className={`text-lg font-medium transition-colors ${
                       isCompleted ? 'text-white font-bold' : 'group-hover:text-brand'
                    }`}>{module}</span>
                    <ChevronRight size={20} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
                  </motion.div>
                );
              })}
              
              {/* Final Test */}
              <div className="p-6 rounded-2xl bg-brand/5 border border-brand/20 flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-black shrink-0 shadow-[0_0_15px_rgba(132,204,22,0.5)]">
                  <Award size={24} />
                </div>
                <div>
                   <span className="text-lg font-bold text-brand">Teste Final & Certificação</span>
                   <p className="text-gray-500 text-xs">Desbloqueado ao concluir 100% dos módulos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Academy Header with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 max-w-7xl mx-auto border-b border-white/10 pb-12 gap-8">
          <div className="text-center md:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-black mb-4"
            >
              Academia <span className="text-brand">Techify</span>
            </motion.h1>
            <p className="text-gray-400 text-lg">Cursos inteligentes gerados por IA para o seu futuro digital</p>
          </div>
          
          <div className="flex gap-4">
             <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center min-w-[140px]">
                <div className="text-3xl font-black text-brand mb-1">{stats.total}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cursos Disponíveis</div>
             </div>
             <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center min-w-[140px]">
                <div className="text-3xl font-black text-blue-400 mb-1">{stats.completed}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cursos Concluídos</div>
             </div>
          </div>
        </div>

        {/* Search Bar Section - IA INTEGRATED */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-brand/10 border border-brand/20 text-brand">
                {isGeneratingCourse ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">🔍 IA Course Builder</h3>
                <p className="text-gray-400 text-sm">Digite qualquer tema e a Techify IA cria um curso imediato pra você!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateCourseWithAI()}
                  placeholder='Ex: "React Native Avançado", "Marketing Digital", "Piano Básico"...'
                  className="w-full h-14 bg-black border border-white/10 rounded-2xl px-6 outline-none focus:border-brand/50 transition-all text-gray-300"
                />
              </div>
              <button 
                onClick={generateCourseWithAI}
                disabled={isGeneratingCourse}
                className="h-14 px-8 rounded-2xl bg-brand text-black font-bold hover:bg-brand/90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingCourse ? "Criando..." : "Gerar Curso"} <Sparkles size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="max-w-5xl mx-auto mb-8 overflow-x-auto no-scrollbar py-2">
          <div className="flex gap-3 justify-center min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${
                  activeCategory === cat.name 
                    ? "bg-brand text-black border-brand scale-105" 
                    : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
          <span className="text-gray-500 text-sm">{filteredCourses.length} cursos encontrados</span>
          <div className="flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-widest">
             <Sparkles size={14} /> Certificado grátis em todos
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredCourses.map((course, idx) => {
            const progPercent = getProgressPercentage(course);
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCourse(course)}
                className={`p-6 md:p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-brand/40 transition-all group relative overflow-hidden cursor-pointer flex flex-col`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="text-4xl p-3 rounded-2xl bg-black border border-white/5 group-hover:scale-110 transition-transform">
                    {course.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {course.level}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      📚 {course.modules} módulos
                    </span>
                  </div>
                </div>

                {/* Progress Bar Mini */}
                {progPercent > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-bold text-brand uppercase mb-1">
                      <span>Seu Progresso</span>
                      <span>{progPercent}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: `${progPercent}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Title & Desc */}
                <h3 className="text-2xl font-bold mb-3 group-hover:text-brand transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {course.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
                  <div className="flex items-center gap-1.5 text-brand text-[10px] font-bold uppercase tracking-widest">
                    <CheckCircle2 size={12} /> {progPercent === 100 ? "Concluído" : "Grátis"}
                  </div>
                  <button className="flex items-center gap-1 text-sm font-bold hover:gap-2 transition-all group-hover:text-brand">
                    {progPercent > 0 ? "Continuar" : "Começar"} <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
