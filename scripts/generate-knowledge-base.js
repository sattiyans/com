import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Helper to parse frontmatter and content
function parseMarkdown(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterText = frontmatterMatch[1];
  const body = frontmatterMatch[2];
  
  // Parse YAML-like frontmatter (simple parser)
  const frontmatter = {};
  frontmatterText.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/["']/g, ''));
      }
      
      // Parse booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      // Parse dates (ISO format) - only if value is a string
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        try {
          value = new Date(value).toISOString();
        } catch (e) {
          // Keep original value if date parsing fails
        }
      }
      
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, body };
}

// Helper to strip markdown and get plain text
function stripMarkdown(markdown) {
  if (!markdown) return '';
  
  return markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]*`/g, '')
    // Remove headers
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
    // Remove bold/italic
    .replace(/\*\*([^\*]+)\*\*/g, '$1')
    .replace(/\*([^\*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove horizontal rules
    .replace(/^---$/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Recursively get all markdown files
function getAllMarkdownFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

async function generateKnowledgeBase() {
  console.log('📚 Generating knowledge base...\n');

  const knowledgeBase = {
    generatedAt: new Date().toISOString(),
    about: {
      name: "Sattiyan Selvarajah",
      role: "Software Developer & Founder of Dotkod Solutions",
      location: "Kuala Lumpur, Malaysia",
      email: "hey@sattiyans.com",
      description: "Expert in building scalable web applications, SaaS platforms, and e-commerce solutions. Previously worked as a Game Developer using Unreal Engine 4 and Unity.",
      website: "https://sattiyans.com"
    },
    projects: [],
    work: [],
    blog: [],
    tools: [],
    watched: {
      description: "A collection of films Sattiyan has recently watched, tracked via Letterboxd. The page displays recently watched movies with ratings, posters, and watch dates. Sattiyan's Letterboxd profile: https://letterboxd.com/sattiyans. The page shows the most recent films he has watched, including movie titles, years, ratings (if given), and when they were watched."
    },
    uses: {
      hardware: [],
      software: [],
      development: [],
      services: []
    },
    skills: []
  };

  try {
    const contentDir = join(rootDir, 'src', 'content');
    
    // Get all projects
    console.log('📦 Gathering projects...');
    const projectFiles = getAllMarkdownFiles(join(contentDir, 'projects'));
    for (const filePath of projectFiles) {
      const { frontmatter, body } = parseMarkdown(filePath);
      
      if (frontmatter.draft || frontmatter.password) continue;
      
      const slug = filePath.split('/').pop().replace('.md', '');
      const plainText = stripMarkdown(body);
      
      knowledgeBase.projects.push({
        title: frontmatter.title || '',
        description: frontmatter.description || '',
        content: plainText,
        role: frontmatter.role || null,
        client: frontmatter.client || null,
        projectOwner: frontmatter.projectOwner || null,
        projectURL: frontmatter.projectURL || frontmatter.demoURL || null,
        repoURL: frontmatter.repoURL || null,
        techStack: Array.isArray(frontmatter.techStack) ? frontmatter.techStack : [],
        featuredImage: frontmatter.featuredImage || null,
        screenshots: Array.isArray(frontmatter.screenshots) ? frontmatter.screenshots : [],
        date: frontmatter.date || new Date().toISOString(),
        slug: slug,
        url: `/projects/${slug}`
      });
    }
    console.log(`   ✓ Found ${knowledgeBase.projects.length} projects\n`);

    // Get all work experience
    console.log('💼 Gathering work experience...');
    const workFiles = getAllMarkdownFiles(join(contentDir, 'work'));
    for (const filePath of workFiles) {
      const { frontmatter, body } = parseMarkdown(filePath);
      
      const slug = filePath.split('/').pop().replace('.md', '');
      const plainText = stripMarkdown(body);
      
      knowledgeBase.work.push({
        company: frontmatter.company || '',
        role: frontmatter.role || '',
        dateStart: frontmatter.dateStart || new Date().toISOString(),
        dateEnd: frontmatter.dateEnd || 'Current',
        content: plainText,
        slug: slug,
        url: `/work/${slug}`
      });
    }
    console.log(`   ✓ Found ${knowledgeBase.work.length} work entries\n`);

    // Get all blog posts
    console.log('📝 Gathering blog posts...');
    const blogFiles = getAllMarkdownFiles(join(contentDir, 'blog'));
    for (const filePath of blogFiles) {
      const { frontmatter, body } = parseMarkdown(filePath);
      
      if (frontmatter.draft) continue;
      
      // Get slug from directory structure (blog/01-title/index.md -> 01-title)
      const pathParts = filePath.split('/');
      const slug = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1].replace('.md', '');
      const plainText = stripMarkdown(body);
      
      knowledgeBase.blog.push({
        title: frontmatter.title || '',
        description: frontmatter.description || '',
        content: plainText,
        date: frontmatter.date || new Date().toISOString(),
        slug: slug,
        url: `/blog/${slug}`
      });
    }
    console.log(`   ✓ Found ${knowledgeBase.blog.length} blog posts\n`);

    // Add tools - read from tools/index.astro
    console.log('🛠️  Gathering tools...');
    try {
      const toolsPagePath = join(rootDir, 'src', 'pages', 'tools', 'index.astro');
      const toolsPageContent = readFileSync(toolsPagePath, 'utf-8');
      
      // Extract tools array from the page
      const toolsMatch = toolsPageContent.match(/const tools = \[([\s\S]*?)\];/);
      if (toolsMatch) {
        // Simple extraction - get tool names and descriptions
        const toolsArray = [];
        const toolMatches = toolsPageContent.matchAll(/name:\s*"([^"]+)",[\s\S]*?description:\s*"([^"]+)",[\s\S]*?href:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)"/g);
        for (const match of toolMatches) {
          toolsArray.push({
            name: match[1],
            description: match[2],
            href: match[3],
            category: match[4]
          });
        }
        knowledgeBase.tools = toolsArray.length > 0 ? toolsArray : knowledgeBase.tools;
      }
    } catch (e) {
      console.log('   ⚠️  Could not read tools page, using default list');
    }
    
    // Fallback to default if extraction failed
    if (knowledgeBase.tools.length === 0) {
      knowledgeBase.tools = [
        {
          name: "Letterboxd Analytics",
          description: "Analyze your Letterboxd activity with detailed statistics, ratings breakdown, and viewing patterns.",
          href: "/tools/letterboxd-analytics",
          category: "Analytics"
        },
        {
          name: "Base64 Encoder/Decoder",
          description: "Convert text to Base64 encoding or decode Base64 back to text. Simple and fast text conversion.",
          href: "/tools/base64",
          category: "Text Tools"
        },
        {
          name: "Color Converter",
          description: "Convert colors between HEX, RGB, HSL, and HSV formats. Pick colors visually and get all format codes.",
          href: "/tools/color-converter",
          category: "Design Tools"
        },
        {
          name: "Password Generator",
          description: "Generate secure, random passwords with customizable length and character sets. Create strong passwords.",
          href: "/tools/password-generator",
          category: "Security Tools"
        }
      ];
    }
    console.log(`   ✓ Found ${knowledgeBase.tools.length} tools\n`);

    // Add uses data - already correctly defined, just ensure it's included
    console.log('🎯 Gathering uses/setup...');
    knowledgeBase.uses = {
      hardware: [
        { name: "MacBook Air M2", description: "512GB SSD, 16GB RAM" },
        { name: "Acer PM161Q", description: "15.6\" Portable Monitor" },
        { name: "Logitech MX Keys for Mac", description: "Wireless keyboard" },
        { name: "Logitech MX Master 3S for Mac", description: "Wireless mouse" },
        { name: "UGREEN HiTune H6 Pro", description: "Wireless earbuds" }
      ],
      software: [
        { name: "Cursor", description: "AI-powered code editor" },
        { name: "macOS Terminal", description: "Built-in terminal app" },
        { name: "Safari", description: "Web browser" },
        { name: "Google Chrome", description: "Web browser" },
        { name: "Figma", description: "Design and prototyping" },
        { name: "Notion", description: "Note-taking and docs" },
        { name: "Spotify", description: "Music streaming" }
      ],
      development: [
        { name: "Laravel", description: "PHP framework" },
        { name: "PHP", description: "Backend language" },
        { name: "JavaScript/TypeScript", description: "Frontend language" },
        { name: "React", description: "Frontend framework" },
        { name: "Next.js", description: "React framework" },
        { name: "Express.js", description: "Node.js backend framework" },
        { name: "TypeScript", description: "Typed JavaScript for full-stack apps" },
        { name: "Blade", description: "Laravel templating engine" },
        { name: "ShadCN UI", description: "Component system for React apps" },
        { name: "Zod", description: "Schema validation for APIs" },
        { name: "Tailwind CSS", description: "CSS framework" },
        { name: "Bootstrap", description: "CSS framework" },
        { name: "Vite", description: "Frontend build tool" },
        { name: "Chart.js", description: "Data visualization library" },
        { name: "MySQL", description: "Database" },
        { name: "PostgreSQL", description: "Database" },
        { name: "Git", description: "Version control" },
        { name: "Nginx", description: "Web server" },
        { name: "n8n", description: "Workflow automation" }
      ],
      services: [
        { name: "GitHub", description: "Code hosting" },
        { name: "Vercel", description: "Frontend deployment" },
        { name: "Supabase", description: "Backend as a Service" },
        { name: "Digital Ocean", description: "VPS hosting" },
        { name: "Ultahost", description: "VPS and managed hosting" },
        { name: "Stripe", description: "Payment processing" },
        { name: "Resend", description: "Email delivery platform" },
        { name: "n8n", description: "Workflow automation" },
        { name: "Figma", description: "Design collaboration" },
        { name: "Redis", description: "Caching" },
        { name: "Sentry", description: "Error tracking" }
      ]
    };
    console.log(`   ✓ Found uses data\n`);

    // Extract skills from projects
    console.log('🎓 Extracting skills...');
    const allTechStacks = new Set();
    knowledgeBase.projects.forEach(project => {
      if (project.techStack && Array.isArray(project.techStack)) {
        project.techStack.forEach(tech => allTechStacks.add(tech));
      }
    });
    knowledgeBase.skills = Array.from(allTechStacks).sort();
    console.log(`   ✓ Found ${knowledgeBase.skills.length} unique skills\n`);

    // Add recently watched films from Letterboxd
    console.log('🎬 Gathering recently watched films...');
    try {
      const username = 'sattiyans';
      const rssUrl = `https://letterboxd.com/${username}/rss/`;
      
      const response = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; KnowledgeBaseBot/1.0)',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        }
      });
      
      if (response.ok) {
        const xmlText = await response.text();
        
        // Parse RSS XML to extract watched films
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const itemsMatch = xmlText.match(itemRegex);
        
        if (itemsMatch) {
          const recentFilms = [];
          
          for (const itemXml of itemsMatch.slice(0, 10)) { // Get latest 10 films
            try {
              // Extract title
              const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
              if (!titleMatch) continue;
              
              const fullTitle = titleMatch[1].trim();
              
              // Extract year from title (e.g., "Film Title, 2023 - ★★★★")
              const yearMatch = fullTitle.match(/, (\d{4}) - /);
              const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
              
              // Clean title - remove year and rating
              let cleanTitle = fullTitle.replace(/, \d{4} - [★☆½]+$/, '').replace(/ - [★☆½]+$/, '').trim();
              
              // Extract link
              const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
              const url = linkMatch ? linkMatch[1].trim() : '';
              
              // Extract pubDate (watched date)
              const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
              const watchedDate = dateMatch ? new Date(dateMatch[1].trim()) : new Date();
              
              // Extract rating if available
              let rating = null;
              const ratingMatch = fullTitle.match(/([★☆½]+)$/);
              if (ratingMatch) {
                const stars = ratingMatch[1];
                rating = stars.split('★').length - 1;
                if (stars.includes('½')) rating += 0.5;
              }
              
              // Only include films (not lists)
              if (cleanTitle && url && url.includes('/film/') && !url.includes('/list/')) {
                recentFilms.push({
                  title: cleanTitle,
                  year: year,
                  watchedDate: watchedDate.toISOString(),
                  rating: rating,
                  url: url
                });
              }
            } catch (itemError) {
              console.log(`   ⚠️  Error parsing film item: ${itemError.message}`);
              continue;
            }
          }
          
          // Sort by watched date (most recent first)
          recentFilms.sort((a, b) => new Date(b.watchedDate) - new Date(a.watchedDate));
          
          knowledgeBase.watched.recentFilms = recentFilms;
          console.log(`   ✓ Found ${recentFilms.length} recently watched films\n`);
        } else {
          console.log('   ⚠️  No films found in RSS feed\n');
        }
      } else {
        console.log(`   ⚠️  Could not fetch Letterboxd RSS (status: ${response.status})\n`);
      }
    } catch (e) {
      console.log(`   ⚠️  Could not fetch recently watched films: ${e.message}\n`);
    }

    // Write to public folder
    const outputPath = join(rootDir, 'public', 'knowledge-base.json');
    writeFileSync(outputPath, JSON.stringify(knowledgeBase, null, 2), 'utf-8');
    
    console.log('✅ Knowledge base generated successfully!');
    console.log(`📄 Saved to: ${outputPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   - Projects: ${knowledgeBase.projects.length}`);
    console.log(`   - Work Experience: ${knowledgeBase.work.length}`);
    console.log(`   - Blog Posts: ${knowledgeBase.blog.length}`);
    console.log(`   - Tools: ${knowledgeBase.tools.length}`);
    console.log(`   - Skills: ${knowledgeBase.skills.length}`);
    console.log(`   - Watched: Page information included`);
    
  } catch (error) {
    console.error('❌ Error generating knowledge base:', error);
    process.exit(1);
  }
}

generateKnowledgeBase();
