#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  templatePath: './_i18n/template.html',
  csvPath: './_i18n/translations.csv',
  outputDir: './',
  languages: {
    en: '',      // root (index.html)
    ko: 'kr',    // /kr/index.html
    ja: 'jp',    // /jp/index.html
    es: 'es',    // /es/index.html
    zh_HK: 'hk'  // /hk/index.html
  }
};

// Parse CSV (simple parser for our format)
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const translations = {};

  // Initialize translations object for each language
  headers.slice(1).forEach(lang => {
    translations[lang.trim()] = {};
  });

  // Parse each row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Handle CSV with potential commas in quoted fields
    const values = parseCSVLine(line);
    const key = values[0];

    headers.slice(1).forEach((lang, index) => {
      translations[lang.trim()][key] = values[index + 1] || '';
    });
  }

  return translations;
}

// Parse a single CSV line handling quoted fields
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values;
}

// Generate HTML for a specific language
function generateHTML(template, translations, langCode, basePath) {
  let html = template;

  // Generate Animation Block dynamically
  const anim1 = translations['HERO_ANIM_1'] || 'Mobile';
  const anim2 = translations['HERO_ANIM_2'] || 'Galaxy';
  const anim3 = translations['HERO_ANIM_3'] || 'Pixel';
  const anim4 = translations['HERO_ANIM_4'] || 'Sony';
  const anim5 = translations['HERO_ANIM_5'] || 'Xiaomi';

  const animBlock = `<span class="hero__title-animation-wrapper"><span class="hero__title-animation"><span>${anim1}</span><span>${anim2}</span><span>${anim3}</span><span>${anim4}</span><span>${anim5}</span><span>${anim1}</span></span></span>`;

  html = html.replace(/\{\{ANIM_BLOCK\}\}/g, animBlock);

  // Replace BASE_PATH placeholder
  html = html.replace(/\{\{BASE_PATH\}\}/g, basePath);

  // Replace all translation placeholders
  Object.entries(translations).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, value);
  });


  // Replace ANIM_BLOCK after translations have been injected
  html = html.replace(/\{\{ANIM_BLOCK\}\}/g, animBlock);

  return html;
}

// Main build function
function build() {
  console.log('🐕 ClipDoggy i18n Build Starting...\n');

  // Read template
  const templatePath = path.join(__dirname, CONFIG.templatePath);
  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template not found: ${templatePath}`);
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf8');
  console.log('✅ Template loaded');

  // Read and parse CSV
  const csvPath = path.join(__dirname, CONFIG.csvPath);
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV not found: ${csvPath}`);
    process.exit(1);
  }
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const translations = parseCSV(csvContent);
  console.log('✅ Translations loaded');

  // Generate HTML for each language
  Object.entries(CONFIG.languages).forEach(([langCode, folder]) => {
    const langTranslations = translations[langCode];
    if (!langTranslations) {
      console.warn(`⚠️  No translations found for: ${langCode}`);
      return;
    }

    // Calculate base path for relative URLs
    const basePath = folder ? '../' : './';

    // Generate HTML
    const html = generateHTML(template, langTranslations, langCode, basePath);

    // Determine output path
    let outputPath;
    if (folder) {
      const folderPath = path.join(__dirname, CONFIG.outputDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      outputPath = path.join(folderPath, 'index.html');
    } else {
      outputPath = path.join(__dirname, CONFIG.outputDir, 'index.html');
    }

    // Write file
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`✅ Generated: ${folder || '/'}/index.html (${langCode})`);
  });

  console.log('\n🎉 Build complete!');
}

// Run build
build();
