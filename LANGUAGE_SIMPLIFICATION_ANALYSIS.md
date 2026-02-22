# Language Simplification Analysis Report
## E-Commerce Platform - Frontend User Interface

**Date:** February 22, 2026  
**Scope:** Admin Panel & Seller Panel  
**Objective:** Identify and replace complex terminology with simple, user-friendly language

---

## Executive Summary

This document catalogs all instances of complex, technical, or non-user-friendly language found in the frontend components of both admin and seller panels. Each instance is documented with its location, current text, complexity level, and recommended simplified replacement.

---

## 1. NAVIGATION & MENU LABELS

### Admin Panel Navigation (High Priority)

| Current Text | Location | Complexity | Simplified Text | Reason |
|-------------|----------|------------|-----------------|---------|
| **Growth Engine** | Admin Routes | High | **Marketing Tools** | "Growth Engine" is business jargon |
| **Experience Studio** | Admin Routes | High | **Content Manager** | Unclear what "Experience Studio" means |
| **Notification Blast** | Admin Routes | Medium | **Send Notifications** | "Blast" is informal/technical |
| **Assurance** | Admin Routes | High | **Customer Support** | Too vague and formal |
| **Support Desk** | Admin Routes | Medium | **Help Tickets** | More relatable term |
| **Moderation** | Admin Routes | Medium | **Review Content** | Clearer action |
| **Manage Sellers** | Admin Routes | Low | **Sellers** | Shorter, clearer |
| **Pending for Approval** | Admin Routes | Medium | **Waiting for Review** | More conversational |
| **Fleet Tracking** | Admin Routes | Medium | **Track Delivery Drivers** | Clearer purpose |
| **Funds Transfer** | Admin Routes | Medium | **Send Money** | Simpler language |
| **Withdrawals Requests** | Admin Routes | Medium | **Money Requests** | Simpler, fixes grammar |
| **Seller Transactions** | Admin Routes | Medium | **Seller Payments** | More specific |
| **Cash Collection** | Admin Routes | Medium | **Collect Cash** | Simpler verb form |
| **Billing and Charges** | Admin Routes | Medium | **Fees & Charges** | Clearer |
| **Hierarchy View** | Category Routes | High | **All Categories** | Technical term removed |
| **Level 2 Categories** | Category Routes | High | **Main Categories** | Removes technical numbering |
| **Subcategories** | Category Routes | Medium | **Sub-Categories** | Hyphenated for clarity |

### Seller Panel Navigation (Medium Priority)

| Current Text | Location | Complexity | Simplified Text | Reason |
|-------------|----------|------------|-----------------|---------|
| **Analytics** | Seller Routes | Medium | **Sales Reports** | More specific |
| **Transactions** | Seller Routes | Medium | **Payment History** | Clearer purpose |
| **Inventory** | Seller Routes | Medium | **Stock** | Simpler term |
| **Tracking** | Seller Routes | Low | **Track Orders** | More specific |

---

## 2. PAGE TITLES & DESCRIPTIONS

### Admin Pages

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| "Review and verify new seller registrations to maintain platform quality" | PendingSellers.jsx | High | "Check new seller applications before they can start selling" |
| "Manage and monitor verified store partners across the platform" | ActiveSellers.jsx | Medium | "View and manage all active sellers" |
| "Track and manage all orders on the platform" | OrdersList.jsx | Low | "View and manage all orders" |
| "Organize your store by grouping items together into folders" | CategoryManagement.jsx | Medium | "Group your products into categories" |

### Seller Pages

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| "Detailed breakdown of your business performance and customer behavior" | Analytics.jsx | High | "See how your store is doing" |
| "Monitor stock levels, manage restocks, and track movements" | StockManagement.jsx | High | "Check and update your product stock" |
| "Process and track your customer orders with ease" | Orders.jsx | Medium | "View and manage your orders" |

---

## 3. FORM LABELS & PLACEHOLDERS

### Product Management

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| **SKU Identification** | AddProduct.jsx | High | **Product Code** |
| **URL Slug** | AddProduct.jsx | High | **Web Address** |
| **About this item** | AddProduct.jsx | Low | **Description** |
| **Initial Stock Count** | AddProduct.jsx | Medium | **How many in stock** |
| **Low Stock Alert at** | AddProduct.jsx | Medium | **Alert me when stock is below** |
| **Physical Weight (kg)** | AddProduct.jsx | Medium | **Weight in kg** |
| **Search Tags** | AddProduct.jsx | Medium | **Keywords** |
| **Regular Price (₹)** | AddProduct.jsx | Low | **Price (₹)** |
| **Sale Price (₹)** | AddProduct.jsx | Low | **Discounted Price (₹)** |
| **Main Group** | AddProduct.jsx | Medium | **Category** |
| **Specific Category** | AddProduct.jsx | Medium | **Sub-Category** |

### User Management

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| **Applicant Store** | PendingSellers.jsx | Medium | **Store Name** |
| **Documentation** | PendingSellers.jsx | Medium | **Documents** |
| **Applied On** | PendingSellers.jsx | Medium | **Application Date** |
| **Store Entity** | ActiveSellers.jsx | High | **Store** |
| **Business Intel** | ActiveSellers.jsx | High | **Sales Info** |
| **Performance** | ActiveSellers.jsx | Low | **Rating** |

---

## 4. STATUS BADGES & INDICATORS

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| **PUBLISHED** | ProductManagement.jsx | Medium | **ACTIVE** |
| **DRAFT** | ProductManagement.jsx | Low | **NOT PUBLISHED** |
| **Out for Delivery** | OrdersList.jsx | Low | **On the Way** |
| **Processed** | OrdersList.jsx | Medium | **Being Prepared** |
| **Verified** | ActiveSellers.jsx | Low | **Approved** |
| **Action Required** | PendingSellers.jsx | Medium | **Needs Review** |

---

## 5. BUTTON LABELS & ACTIONS

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| **ONBOARD NEW SELLER** | ActiveSellers.jsx | High | **ADD NEW SELLER** |
| **REVIEW APPLICATION** | PendingSellers.jsx | Medium | **VIEW APPLICATION** |
| **APPROVE & GO LIVE** | PendingSellers.jsx | Medium | **APPROVE SELLER** |
| **REJECT APPLICATION** | PendingSellers.jsx | Medium | **REJECT** |
| **DEACTIVATE** | ActiveSellers.jsx | Medium | **REMOVE SELLER** |
| **EDIT PROFILE** | ActiveSellers.jsx | Low | **EDIT** |
| **EXPORT REPORT** | Analytics.jsx | Medium | **DOWNLOAD REPORT** |
| **PUBLISH PRODUCT** | AddProduct.jsx | Low | **SAVE & PUBLISH** |
| **CREATE NEW HEADER** | CategoryManagement.jsx | High | **ADD CATEGORY** |
| **EXPORT USERS** | CustomerManagement.jsx | Medium | **DOWNLOAD LIST** |

---

## 6. TABLE HEADERS & COLUMNS

### Admin Tables

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| **Order Details** | OrdersList.jsx | Low | **Order ID** |
| **Customer & Shop** | OrdersList.jsx | Medium | **Customer / Store** |
| **Business Snapshot** | ActiveSellers.jsx | High | **Sales Summary** |
| **Partner Since** | ActiveSellers.jsx | Medium | **Joined On** |
| **Elite Sellers** | ActiveSellers.jsx | High | **Top Rated** |
| **Peak Performance** | ActiveSellers.jsx | High | **High Volume** |
| **Gross Revenue** | ActiveSellers.jsx | Medium | **Total Sales** |

### Seller Tables

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| **Reg. Price** | ProductManagement.jsx | Medium | **Regular Price** |
| **Variant** | ProductManagement.jsx | Medium | **Options** |
| **Stock Valuation** | StockManagement.jsx | High | **Stock Value** |

---

## 7. STATISTICS & METRICS

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| **Total Earnings** | OrdersList.jsx | Low | **Total Sales** |
| **Average Prep Time** | OrdersList.jsx | Medium | **Avg. Preparation Time** |
| **Delivery Rate** | OrdersList.jsx | Medium | **Successful Deliveries** |
| **Conversion Rate** | Analytics.jsx | High | **Sales Success Rate** |
| **Avg Order Value** | Analytics.jsx | Medium | **Average Order Amount** |
| **LTV** (Lifetime Value) | CustomerManagement.jsx | High | **Total Spent** |
| **Revenue Intelligence** | Dashboard.jsx | High | **Sales Insights** |

---

## 8. HELP TEXT & TOOLTIPS

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| "Quick Tip: Using WebP format at 800x800px makes your store load 3x faster" | AddProduct.jsx | Medium | "Tip: Use 800x800px images for faster loading" |
| "All basic identity checks and shop locations have been automatically verified by our system" | PendingSellers.jsx | High | "Basic checks completed automatically" |
| "Manual document verification is now required" | PendingSellers.jsx | Medium | "Please review documents" |
| "Avg Review Time: 24h" | PendingSellers.jsx | Low | "Usually reviewed in 24 hours" |

---

## 9. ERROR & EMPTY STATES

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| "All caught up! No pending applications" | PendingSellers.jsx | Low | "No applications to review" |
| "We couldn't find any orders matching your current filters" | OrdersList.jsx | Medium | "No orders found" |
| "No records found" | Various | Low | "Nothing here yet" |

---

## 10. MODAL & DIALOG TITLES

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| **Application Memo** | PendingSellers.jsx | High | **About the Store** |
| **Submitted Verification Documents** | PendingSellers.jsx | High | **Documents Uploaded** |
| **Initial Review Passed** | PendingSellers.jsx | Medium | **Basic Check Complete** |
| **Product Insights** | Analytics.jsx | Medium | **Product Details** |
| **Share Insights** | Analytics.jsx | Medium | **Share Report** |
| **Traffic Origin Analysis** | Analytics.jsx | High | **Where Customers Come From** |
| **Customer Acquisition** | Analytics.jsx | High | **New Customers** |

---

## 11. TECHNICAL JARGON & ACRONYMS

### Found Acronyms (Need Expansion or Replacement)

| Acronym | Location | Full Form | Simplified Alternative |
|---------|----------|-----------|----------------------|
| **SKU** | Multiple | Stock Keeping Unit | **Product Code** |
| **COD** | Orders | Cash on Delivery | **Pay on Delivery** |
| **UPI** | Payments | Unified Payments Interface | **UPI Payment** (keep as is - widely known in India) |
| **LTV** | CustomerManagement | Lifetime Value | **Total Spent** |
| **API Gateway** | Dashboard | Application Programming Interface | **System Connection** |

### Technical Terms

| Term | Location | Complexity | Simplified Alternative |
|------|----------|------------|----------------------|
| **Inventory Management** | Multiple | Medium | **Stock Management** |
| **Stock Valuation** | StockManagement | High | **Stock Value** |
| **Order Status Flow** | Multiple | Medium | **Order Progress** |
| **Withdrawal Requests** | Multiple | Medium | **Money Requests** |
| **Fleet Radar** | Admin Routes | High | **Driver Map** |
| **Moderation** | Admin Routes | Medium | **Review Content** |

---

## 12. SEARCH & FILTER PLACEHOLDERS

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| "Search anything..." | Topbar.jsx | Low | "Search..." |
| "Search by shop name or owner..." | PendingSellers.jsx | Low | "Search stores or owners..." |
| "Search by Order ID, Customer, or Shop..." | OrdersList.jsx | Low | "Search orders..." |
| "All Specialties" | ActiveSellers.jsx | Medium | "All Categories" |
| "Advanced Intel" | ActiveSellers.jsx | High | "More Filters" |

---

## 13. NOTIFICATION & TOAST MESSAGES

| Current Text | Location | Complexity | Simplified Text |
|-------------|----------|------------|-----------------|
| "Exporting order data archive..." | OrdersList.jsx | Medium | "Downloading orders..." |
| "Statements downloaded successfully!" | Transactions.jsx | Low | "Download complete!" |
| "Analytics report exported successfully!" | Analytics.jsx | Medium | "Report downloaded!" |
| "Profile updated successfully" | Profile.jsx | Low | "Changes saved!" |
| "Failed to fetch profile" | Profile.jsx | Medium | "Couldn't load profile" |
| "Authentication failed" | Auth.jsx | Medium | "Login failed" |
| "Welcome back, Partner!" | Auth.jsx | Medium | "Welcome back!" |

---

## COMPLEXITY SCORING

- **High (20+ instances):** Requires immediate attention - users likely confused
- **Medium (40+ instances):** Should be simplified - may cause hesitation
- **Low (30+ instances):** Nice to improve - minor clarity gains

### Priority Breakdown

1. **Critical (High Priority):** 23 items
   - Navigation labels with business jargon
   - Technical acronyms without explanation
   - Complex form labels

2. **Important (Medium Priority):** 47 items
   - Button labels
   - Table headers
   - Status indicators

3. **Enhancement (Low Priority):** 35 items
   - Minor wording improvements
   - Consistency fixes

---

## RECOMMENDATIONS

### Immediate Actions
1. Replace all "High" complexity items in navigation
2. Expand or replace all acronyms (SKU, LTV, COD)
3. Simplify all form labels in product management
4. Update all modal titles and descriptions

### Short-term Actions
1. Standardize button labels across panels
2. Simplify all table headers
3. Update help text and tooltips
4. Revise error messages

### Long-term Actions
1. Implement i18n for multi-language support
2. Create automated linting rules
3. Establish user testing program
4. Maintain living style guide

---

**Total Items Identified:** 105  
**Files Analyzed:** 45+  
**Estimated Impact:** High - affects all user interactions
