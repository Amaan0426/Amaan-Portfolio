/**
 * Site data — centralized content for all sections.
 * Populated in later steps; imported by section components.
 */

export const siteData = {
  name: 'Amaan F. Khatib',
  title: 'Full-Stack Developer & AI/ML Engineer',
  projects: [
    {
      id: 'mira',
      title: 'MIRA – AI Powered Marketing and CMO Agent',
      duration: '3 months',
      categories: ['AI/LLM', 'Java/Backend'],
      tech: ['React', 'Java', 'Spring Boot', 'MySQL', 'Grok LLM API', 'n8n'],
      description: 'AI-powered virtual CMO for marketing strategy generation and automated email marketing. Built complete frontend, backend, and database with REST APIs for campaign management.',
      github: '#',
      demo: '#',
    },
    {
      id: 'querygpt',
      title: 'QueryGPT – NLP Database Management',
      duration: '1 month',
      categories: ['AI/LLM', 'Java/Backend'],
      tech: ['React', 'Java', 'Spring Boot', 'MySQL', 'Gemini API', 'SerpAPI'],
      description: 'Natural language interface for MySQL CRUD operations. Integrated SerpAPI to fetch campaign data from Instagram, Facebook, YouTube, and Reddit.',
      github: '#',
      demo: '#',
    },
    {
      id: 'multi-llm',
      title: 'Multi-LLM Response Platform',
      duration: '1 month',
      categories: ['AI/LLM', 'Java/Backend'],
      tech: ['React', 'Java', 'Spring Boot', 'Multiple LLM APIs'],
      description: 'Queries multiple LLMs simultaneously and compares response times. RESTful backend built for API orchestration across providers.',
      github: '#',
      demo: '#',
    },
    {
      id: 'web-scraping',
      title: 'Web Scraping & Data Extraction System',
      duration: '6 months',
      categories: ['Python'],
      tech: ['Python', 'Flask', 'SQLite', 'HTML', 'CSS', 'BeautifulSoup', 'Pandas'],
      description: 'Automated data extraction pipeline using BeautifulSoup and Requests, with data storage and analysis for reporting purposes.',
      github: '#',
      demo: '#',
    },
    {
      id: 'library-system',
      title: 'Library Management System',
      duration: '3 months',
      categories: ['Java/Backend'],
      tech: ['Java', 'Spring Boot', 'Hibernate', 'MySQL', 'Thymeleaf'],
      description: 'Full CRUD library management application built with Spring Data JPA and Lombok for clean entity management.',
      github: '#',
      demo: '#',
    },
    {
      id: 'product-api',
      title: 'Product Management System – REST API',
      duration: '3 months',
      categories: ['Java/Backend'],
      tech: ['Java', 'Spring Boot', 'MySQL', 'Postman'],
      description: 'RESTful API system with clean layered architecture, fully tested using Postman.',
      github: '#',
      demo: '#',
    },
  ],
};
