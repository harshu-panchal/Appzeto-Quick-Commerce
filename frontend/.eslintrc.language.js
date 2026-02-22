/**
 * ESLint Configuration for Language Simplification
 * 
 * This configuration enforces simple language rules in the codebase.
 * Add to your main .eslintrc.js or use separately.
 */

module.exports = {
  rules: {
    // Warn about hardcoded strings that should use i18n
    'no-restricted-syntax': [
      'warn',
      // Banned business jargon
      {
        selector: 'Literal[value=/\\b(leverage|utilize|facilitate|optimize|maximize|streamline)\\b/i]',
        message: 'Avoid business jargon. Use simpler words: use, help, improve, increase, simplify.'
      },
      // Banned technical jargon
      {
        selector: 'Literal[value=/\\b(instantiate|persist|terminate|nomenclature|taxonomy|hierarchy)\\b/i]',
        message: 'Avoid technical jargon. Use common words: create, save, end, name, categories, structure.'
      },
      // Banned formal language
      {
        selector: 'Literal[value=/\\b(commence|initiate|proceed|obtain|retrieve|transmit|dispatch)\\b/i]',
        message: 'Avoid formal language. Use simple words: start, go, get, send.'
      },
      // Acronyms without explanation
      {
        selector: 'Literal[value=/\\b(SKU|LTV|KPI|ROI)\\b/]',
        message: 'Expand acronyms or use simpler terms: Product Code, Total Spent, Goal, Return.'
      },
      // Complex phrases
      {
        selector: 'Literal[value=/in order to|at this point in time|due to the fact that/i]',
        message: 'Simplify phrases: "in order to" → "to", "at this point in time" → "now", "due to the fact that" → "because".'
      },
      // Passive voice indicators
      {
        selector: 'Literal[value=/will be (created|added|removed|deleted|updated)/i]',
        message: 'Use active voice: "We will create" instead of "will be created".'
      }
    ],
    
    // Warn about long string literals (likely need breaking up)
    'max-len': ['warn', {
      code: 100,
      ignoreStrings: false,
      ignoreTemplateLiterals: false,
      ignoreComments: true
    }]
  },
  
  overrides: [
    {
      // Stricter rules for user-facing components
      files: ['**/pages/**/*.{js,jsx}', '**/components/**/*.{js,jsx}'],
      rules: {
        'no-restricted-syntax': [
          'error', // Error instead of warn for user-facing code
          {
            selector: 'Literal[value=/\\b(leverage|utilize|facilitate|instantiate|persist|terminate)\\b/i]',
            message: 'User-facing text must use simple language. Check SIMPLE_LANGUAGE_STYLE_GUIDE.md'
          }
        ]
      }
    }
  ]
};
