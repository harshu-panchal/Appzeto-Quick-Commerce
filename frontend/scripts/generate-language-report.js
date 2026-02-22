#!/usr/bin/env node

/**
 * Generate Language Simplification Report
 * 
 * Creates a detailed HTML report of language issues found in the codebase.
 * Run with: npm run report:language
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportJsonPath = path.join(__dirname, '../language-check-report.json');
const reportHtmlPath = path.join(__dirname, '../language-check-report.html');

// Check if JSON report exists
if (!fs.existsSync(reportJsonPath)) {
  console.error('❌ No report found. Run "npm run lint:language" first.');
  process.exit(1);
}

// Read the JSON report
const report = JSON.parse(fs.readFileSync(reportJsonPath, 'utf8'));

// Generate HTML report
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Language Simplification Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    .header p {
      opacity: 0.9;
      font-size: 14px;
    }
    
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
    }
    
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .stat-card .number {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }
    
    .stat-card .label {
      font-size: 12px;
      text-transform: uppercase;
      color: #666;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .section {
      padding: 40px;
      border-bottom: 1px solid #eee;
    }
    
    .section:last-child {
      border-bottom: none;
    }
    
    .section-title {
      font-size: 24px;
      margin-bottom: 20px;
      color: #333;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      background: #667eea;
      color: white;
    }
    
    .issue {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    
    .issue-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 10px;
    }
    
    .file-path {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #666;
      background: white;
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    .line-number {
      font-size: 11px;
      color: #999;
      background: white;
      padding: 2px 6px;
      border-radius: 3px;
    }
    
    .issue-content {
      margin-top: 10px;
    }
    
    .problem {
      color: #dc3545;
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .solution {
      color: #28a745;
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    .context {
      font-size: 13px;
      color: #666;
      font-style: italic;
      background: white;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
    }
    
    .no-issues {
      text-align: center;
      padding: 60px 20px;
      color: #28a745;
    }
    
    .no-issues svg {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
    }
    
    .footer {
      padding: 20px 40px;
      background: #f8f9fa;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔍 Language Simplification Report</h1>
      <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
    </div>
    
    <div class="summary">
      <div class="stat-card">
        <div class="number">${report.summary.totalFiles}</div>
        <div class="label">Files Scanned</div>
      </div>
      <div class="stat-card">
        <div class="number">${report.summary.totalIssues}</div>
        <div class="label">Total Issues</div>
      </div>
      <div class="stat-card">
        <div class="number">${report.summary.bannedWords}</div>
        <div class="label">Banned Words</div>
      </div>
      <div class="stat-card">
        <div class="number">${report.summary.complexPhrases}</div>
        <div class="label">Complex Phrases</div>
      </div>
      <div class="stat-card">
        <div class="number">${report.summary.passiveVoice}</div>
        <div class="label">Passive Voice</div>
      </div>
      <div class="stat-card">
        <div class="number">${report.summary.longSentences}</div>
        <div class="label">Long Sentences</div>
      </div>
    </div>
    
    ${report.summary.totalIssues === 0 ? `
      <div class="no-issues">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h2>No Issues Found!</h2>
        <p>All user-facing text follows the simple language guidelines.</p>
      </div>
    ` : ''}
    
    ${report.issues.bannedWords.length > 0 ? `
      <div class="section">
        <h2 class="section-title">
          🚫 Banned Words
          <span class="badge">${report.issues.bannedWords.length}</span>
        </h2>
        ${report.issues.bannedWords.map(issue => `
          <div class="issue">
            <div class="issue-header">
              <span class="file-path">${issue.file}</span>
              <span class="line-number">Line ${issue.line}</span>
            </div>
            <div class="issue-content">
              <div class="problem">❌ "${issue.word}"</div>
              <div class="solution">✅ Use "${issue.replacement}" instead</div>
              <div class="context">"${issue.context}..."</div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    ${report.issues.complexPhrases.length > 0 ? `
      <div class="section">
        <h2 class="section-title">
          📝 Complex Phrases
          <span class="badge">${report.issues.complexPhrases.length}</span>
        </h2>
        ${report.issues.complexPhrases.map(issue => `
          <div class="issue">
            <div class="issue-header">
              <span class="file-path">${issue.file}</span>
              <span class="line-number">Line ${issue.line}</span>
            </div>
            <div class="issue-content">
              <div class="problem">❌ "${issue.phrase}"</div>
              <div class="solution">✅ Use "${issue.replacement}" instead</div>
              <div class="context">"${issue.context}..."</div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    ${report.issues.passiveVoice.length > 0 ? `
      <div class="section">
        <h2 class="section-title">
          🔄 Passive Voice
          <span class="badge">${report.issues.passiveVoice.length}</span>
        </h2>
        ${report.issues.passiveVoice.map(issue => `
          <div class="issue">
            <div class="issue-header">
              <span class="file-path">${issue.file}</span>
              <span class="line-number">Line ${issue.line}</span>
            </div>
            <div class="issue-content">
              <div class="problem">⚠️ Contains "${issue.indicator}"</div>
              <div class="solution">💡 Consider using active voice</div>
              <div class="context">"${issue.context}..."</div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    ${report.issues.longSentences.length > 0 ? `
      <div class="section">
        <h2 class="section-title">
          📏 Long Sentences
          <span class="badge">${report.issues.longSentences.length}</span>
        </h2>
        ${report.issues.longSentences.map(issue => `
          <div class="issue">
            <div class="issue-header">
              <span class="file-path">${issue.file}</span>
              <span class="line-number">Line ${issue.line}</span>
            </div>
            <div class="issue-content">
              <div class="problem">⚠️ ${issue.wordCount} words (max: 20)</div>
              <div class="solution">💡 Break into shorter sentences</div>
              <div class="context">"${issue.context}..."</div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    <div class="footer">
      <p>Review the <strong>SIMPLE_LANGUAGE_STYLE_GUIDE.md</strong> for best practices</p>
      <p>Generated by Language Simplification Checker v1.0</p>
    </div>
  </div>
</body>
</html>
`;

// Write HTML report
fs.writeFileSync(reportHtmlPath, html);

console.log(`\n✅ HTML report generated: ${reportHtmlPath}`);
console.log(`   Open in browser to view detailed results\n`);
