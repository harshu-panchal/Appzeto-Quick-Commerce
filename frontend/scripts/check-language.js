#!/usr/bin/env node

/**
 * Language Simplification Checker
 * 
 * This script scans the codebase for complex language, jargon, and banned terms.
 * Run with: npm run lint:language
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  srcDir: path.join(__dirname, '../src'),
  excludeDirs: ['node_modules', 'dist', 'build', '.git'],
  fileExtensions: ['.jsx', '.js', '.tsx', '.ts'],
  maxLineLength: 100,
  maxSentenceWords: 20
};

// Banned words and their simple replacements
const BANNED_WORDS = {
  // Business Jargon
  'leverage': 'use',
  'utilize': 'use',
  'facilitate': 'help',
  'optimize': 'improve',
  'maximize': 'increase',
  'streamline': 'simplify',
  'synergy': 'teamwork',
  'paradigm': 'model',
  'ecosystem': 'system',
  'robust': 'strong',
  'scalable': 'flexible',
  'enterprise': 'business',
  
  // Technical Jargon
  'instantiate': 'create',
  'persist': 'save',
  'terminate': 'end',
  'nomenclature': 'name',
  'taxonomy': 'categories',
  'hierarchy': 'structure',
  'acquisition': 'getting',
  'retention': 'keeping',
  'churn': 'leaving',
  'funnel': 'process',
  'pipeline': 'process',
  'logistics': 'delivery',
  'fulfillment': 'delivery',
  
  // Formal Language
  'commence': 'start',
  'initiate': 'start',
  'proceed': 'go',
  'obtain': 'get',
  'retrieve': 'get',
  'transmit': 'send',
  'dispatch': 'send',
  'verify': 'check',
  'validate': 'check',
  'rectify': 'fix',
  'remediate': 'fix',
  'resolve': 'fix',
  
  // Acronyms (should be expanded or replaced)
  'SKU': 'Product Code',
  'LTV': 'Total Spent',
  'COD': 'Cash on Delivery',
  'KPI': 'Goal',
  'ROI': 'Return',
  'API': 'Connection'
};

// Complex phrases to avoid
const COMPLEX_PHRASES = [
  { phrase: 'in order to', replacement: 'to' },
  { phrase: 'at this point in time', replacement: 'now' },
  { phrase: 'due to the fact that', replacement: 'because' },
  { phrase: 'for the purpose of', replacement: 'to' },
  { phrase: 'in the event that', replacement: 'if' },
  { phrase: 'with regard to', replacement: 'about' },
  { phrase: 'in relation to', replacement: 'about' },
  { phrase: 'prior to', replacement: 'before' },
  { phrase: 'subsequent to', replacement: 'after' },
  { phrase: 'in close proximity to', replacement: 'near' },
  { phrase: 'at the present time', replacement: 'now' },
  { phrase: 'in the near future', replacement: 'soon' },
  { phrase: 'make a decision', replacement: 'decide' },
  { phrase: 'give consideration to', replacement: 'consider' },
  { phrase: 'take into account', replacement: 'consider' }
];

// Passive voice indicators
const PASSIVE_INDICATORS = [
  'will be',
  'has been',
  'have been',
  'was being',
  'were being',
  'is being',
  'are being'
];

// Results storage
const results = {
  bannedWords: [],
  complexPhrases: [],
  passiveVoice: [],
  longSentences: [],
  totalFiles: 0,
  totalIssues: 0
};

/**
 * Check if a file should be scanned
 */
function shouldScanFile(filePath) {
  const ext = path.extname(filePath);
  return CONFIG.fileExtensions.includes(ext);
}

/**
 * Check if a directory should be excluded
 */
function shouldExcludeDir(dirName) {
  return CONFIG.excludeDirs.includes(dirName);
}

/**
 * Extract text content from JSX/JS files
 * Looks for strings in JSX attributes and text content
 */
function extractTextContent(content) {
  const texts = [];
  
  // Match JSX text content: >text<
  const jsxTextRegex = />([^<>]+)</g;
  let match;
  while ((match = jsxTextRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text && !text.startsWith('{') && text.length > 2) {
      texts.push({ text, line: getLineNumber(content, match.index) });
    }
  }
  
  // Match string literals: "text" or 'text'
  const stringRegex = /["']([^"']+)["']/g;
  while ((match = stringRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text && text.length > 2) {
      texts.push({ text, line: getLineNumber(content, match.index) });
    }
  }
  
  // Match template literals: `text`
  const templateRegex = /`([^`]+)`/g;
  while ((match = templateRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text && !text.includes('${') && text.length > 2) {
      texts.push({ text, line: getLineNumber(content, match.index) });
    }
  }
  
  return texts;
}

/**
 * Get line number from character index
 */
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

/**
 * Check for banned words in text
 */
function checkBannedWords(text, filePath, lineNumber) {
  Object.keys(BANNED_WORDS).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(text)) {
      results.bannedWords.push({
        file: filePath,
        line: lineNumber,
        word: word,
        replacement: BANNED_WORDS[word],
        context: text.substring(0, 80)
      });
      results.totalIssues++;
    }
  });
}

/**
 * Check for complex phrases in text
 */
function checkComplexPhrases(text, filePath, lineNumber) {
  COMPLEX_PHRASES.forEach(({ phrase, replacement }) => {
    const regex = new RegExp(phrase, 'gi');
    if (regex.test(text)) {
      results.complexPhrases.push({
        file: filePath,
        line: lineNumber,
        phrase: phrase,
        replacement: replacement,
        context: text.substring(0, 80)
      });
      results.totalIssues++;
    }
  });
}

/**
 * Check for passive voice in text
 */
function checkPassiveVoice(text, filePath, lineNumber) {
  PASSIVE_INDICATORS.forEach(indicator => {
    const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
    if (regex.test(text)) {
      results.passiveVoice.push({
        file: filePath,
        line: lineNumber,
        indicator: indicator,
        context: text.substring(0, 80)
      });
      results.totalIssues++;
    }
  });
}

/**
 * Check for long sentences
 */
function checkSentenceLength(text, filePath, lineNumber) {
  // Split by sentence endings
  const sentences = text.split(/[.!?]+/);
  
  sentences.forEach(sentence => {
    const words = sentence.trim().split(/\s+/);
    if (words.length > CONFIG.maxSentenceWords) {
      results.longSentences.push({
        file: filePath,
        line: lineNumber,
        wordCount: words.length,
        context: sentence.substring(0, 80)
      });
      results.totalIssues++;
    }
  });
}

/**
 * Scan a single file
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const texts = extractTextContent(content);
    
    texts.forEach(({ text, line }) => {
      checkBannedWords(text, filePath, line);
      checkComplexPhrases(text, filePath, line);
      checkPassiveVoice(text, filePath, line);
      checkSentenceLength(text, filePath, line);
    });
    
    results.totalFiles++;
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error.message);
  }
}

/**
 * Recursively scan directory
 */
function scanDirectory(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!shouldExcludeDir(item)) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile() && shouldScanFile(fullPath)) {
        scanFile(fullPath);
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
}

/**
 * Format and print results
 */
function printResults() {
  console.log('\n' + '='.repeat(80));
  console.log('  LANGUAGE SIMPLIFICATION CHECK RESULTS');
  console.log('='.repeat(80) + '\n');
  
  console.log(`📁 Files scanned: ${results.totalFiles}`);
  console.log(`⚠️  Total issues found: ${results.totalIssues}\n`);
  
  if (results.totalIssues === 0) {
    console.log('✅ No language issues found! Great job!\n');
    return;
  }
  
  // Print banned words
  if (results.bannedWords.length > 0) {
    console.log('\n' + '─'.repeat(80));
    console.log(`🚫 BANNED WORDS (${results.bannedWords.length} issues)`);
    console.log('─'.repeat(80));
    
    results.bannedWords.forEach(issue => {
      console.log(`\n  📄 ${issue.file}:${issue.line}`);
      console.log(`     ❌ "${issue.word}" → ✅ use "${issue.replacement}"`);
      console.log(`     Context: "${issue.context}..."`);
    });
  }
  
  // Print complex phrases
  if (results.complexPhrases.length > 0) {
    console.log('\n' + '─'.repeat(80));
    console.log(`📝 COMPLEX PHRASES (${results.complexPhrases.length} issues)`);
    console.log('─'.repeat(80));
    
    results.complexPhrases.forEach(issue => {
      console.log(`\n  📄 ${issue.file}:${issue.line}`);
      console.log(`     ❌ "${issue.phrase}" → ✅ use "${issue.replacement}"`);
      console.log(`     Context: "${issue.context}..."`);
    });
  }
  
  // Print passive voice
  if (results.passiveVoice.length > 0) {
    console.log('\n' + '─'.repeat(80));
    console.log(`🔄 PASSIVE VOICE (${results.passiveVoice.length} issues)`);
    console.log('─'.repeat(80));
    
    results.passiveVoice.forEach(issue => {
      console.log(`\n  📄 ${issue.file}:${issue.line}`);
      console.log(`     ⚠️  Contains "${issue.indicator}" - consider active voice`);
      console.log(`     Context: "${issue.context}..."`);
    });
  }
  
  // Print long sentences
  if (results.longSentences.length > 0) {
    console.log('\n' + '─'.repeat(80));
    console.log(`📏 LONG SENTENCES (${results.longSentences.length} issues)`);
    console.log('─'.repeat(80));
    
    results.longSentences.forEach(issue => {
      console.log(`\n  📄 ${issue.file}:${issue.line}`);
      console.log(`     ⚠️  ${issue.wordCount} words (max: ${CONFIG.maxSentenceWords})`);
      console.log(`     Context: "${issue.context}..."`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('  SUMMARY');
  console.log('='.repeat(80));
  console.log(`  🚫 Banned words: ${results.bannedWords.length}`);
  console.log(`  📝 Complex phrases: ${results.complexPhrases.length}`);
  console.log(`  🔄 Passive voice: ${results.passiveVoice.length}`);
  console.log(`  📏 Long sentences: ${results.longSentences.length}`);
  console.log('='.repeat(80) + '\n');
  
  console.log('💡 TIP: Review the SIMPLE_LANGUAGE_STYLE_GUIDE.md for best practices\n');
}

/**
 * Generate JSON report
 */
function generateReport() {
  const reportPath = path.join(__dirname, '../language-check-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.totalFiles,
      totalIssues: results.totalIssues,
      bannedWords: results.bannedWords.length,
      complexPhrases: results.complexPhrases.length,
      passiveVoice: results.passiveVoice.length,
      longSentences: results.longSentences.length
    },
    issues: results
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📊 Detailed report saved to: ${reportPath}\n`);
}

/**
 * Main execution
 */
function main() {
  console.log('\n🔍 Starting language simplification check...\n');
  
  // Scan the source directory
  scanDirectory(CONFIG.srcDir);
  
  // Print results
  printResults();
  
  // Generate JSON report
  generateReport();
  
  // Exit with error code if issues found
  if (results.totalIssues > 0) {
    process.exit(1);
  }
}

// Run the checker
main();
