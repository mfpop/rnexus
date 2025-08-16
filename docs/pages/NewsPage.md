# News Page Documentation

## Overview
The News Page provides a comprehensive news and announcements system with a master-detail interface. Users can browse, filter, and read company news articles, industry updates, and important announcements.

## Module Purpose
**News, Alerts, and Communication** - This module is a centralized tool for disseminating important information, managing alerts, and broadcasting official communications to the entire organization or specific departments.

### Core Functions
- **News Publishing**: Empowers every department to publish official news and updates to a designated news feed.
- **Alerts Management**: Designed to create and manage time-sensitive alerts, ensuring critical information reaches the right people immediately.
- **Official Communications**: Serves as a platform for sending formal communications and memos to targeted groups or the entire company.

## Page Structure

### Route
- **URL**: `/news`
- **Component**: `NewsPage.tsx`
- **Layout**: Uses `StableLayout` with two-card architecture

### Architecture
- **Left Card**: `NewsLeftCardSimple` - Article list and filtering
- **Right Card**: `NewsRightCard` - Selected article details
- **State Management**: `NewsContext` with React Context API
- **Data Communication**: Master-detail pattern via `selectedArticle`

## Features

### Article Browsing
- **Article List**: Displays all news articles with key information
- **Search Functionality**: Filter articles by title, content, or author
- **Category Filtering**: Filter by category (company, industry, technology, safety, production)
- **Priority Indicators**: Visual priority markers (high, medium, low)
- **Read Status**: Visual indicators for read/unread articles

### Article Details
- **Full Content**: Complete article text with rich formatting
- **Metadata Display**: Author, publish date, read time, category
- **Engagement Stats**: Views, likes, comments count
- **Bookmark Feature**: Save articles for later reading
- **Tag System**: Article categorization with clickable tags

### Interactive Elements
- **Selection Highlighting**: Selected article highlighted in left panel
- **Real-time Updates**: Live engagement statistics
- **Responsive Design**: Adapts to different screen sizes
- **Keyboard Navigation**: Arrow keys for article navigation

## Data Structure

### NewsArticle Interface
```typescript
interface NewsArticle {
  id: number
  title: string
  summary: string
  content: string
  author: string
  publishDate: Date
  category: 'company' | 'industry' | 'technology' | 'safety' | 'production'
  priority: 'low' | 'medium' | 'high'
  readTime: number
  views: number
  likes: number
  comments: number
  isBookmarked: boolean
  tags: string[]
}
```

## Context Management

### NewsContext
- **State**: `selectedArticle: NewsArticle | null`
- **Actions**: `setSelectedArticle(article: NewsArticle | null)`
- **Provider**: Wraps the entire page in `StableLayout`
- **Consumer**: Both left and right cards access shared state

## Components Hierarchy

```
StableLayout
├── NewsProvider
│   ├── MainContainerTemplate
│   │   ├── NewsLeftCardSimple (leftContent)
│   │   └── NewsPage -> NewsRightCard (rightContent)
```

## User Interactions

### Left Card Actions
1. **Article Selection**: Click any article to view details
2. **Search**: Type in search box to filter articles
3. **Category Filter**: Select category from dropdown
4. **Sort Options**: Sort by date, priority, or popularity

### Right Card Actions
1. **Read Article**: Scroll through full content
2. **Bookmark**: Toggle bookmark status
3. **Like**: Increment like counter
4. **Share**: Copy article link
5. **Print**: Print article content

## Sample Data
The page includes comprehensive sample data with:
- 8 diverse news articles
- Various categories and priorities
- Realistic publish dates and engagement metrics
- Rich content with industry-relevant topics

## Styling & UX
- **Color Coding**: Categories have distinct colors
- **Priority Badges**: Visual priority indicators
- **Hover Effects**: Interactive feedback on all clickable elements
- **Loading States**: Smooth transitions between article selections
- **Typography**: Optimized reading experience with proper fonts and spacing

## Future Enhancements
- **Comments System**: User comments and discussions
- **Push Notifications**: Real-time news alerts
- **RSS Feed**: External news source integration
- **Advanced Search**: Full-text search with filters
- **Article Drafts**: Admin article creation interface
- **Social Sharing**: Integration with social media platforms
- **Department Publishing**: Enable all departments to publish official news
- **Alert System**: Time-sensitive critical information broadcasting
- **Targeted Communications**: Formal memos to specific groups or company-wide

## Related Files
- `frontend/src/pages/NewsPage.tsx` - Main page component
- `frontend/src/components/news/NewsContext.tsx` - State management
- `frontend/src/components/news/NewsLeftCardSimple.tsx` - Article list
- `frontend/src/components/news/NewsRightCard.tsx` - Article details
- `frontend/src/components/news/index.ts` - Module exports

## Technical Notes
- Uses React 19 with modern hooks
- Fully TypeScript typed
- Follows clean architecture principles
- Optimized for performance with proper state management
- Accessible design with ARIA labels and keyboard support
