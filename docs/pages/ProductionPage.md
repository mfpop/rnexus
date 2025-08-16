# Production Page Documentation

## Overview
The Production Page provides real-time monitoring and management of manufacturing production lines. It offers a comprehensive dashboard for tracking efficiency, status, and performance metrics across all production facilities.

## Page Structure

### Route
- **URL**: `/production`
- **Component**: `ProductionPage.tsx`
- **Layout**: Uses `StableLayout` with two-card architecture

### Architecture
- **Left Card**: `ProductionLeftCardSimple` - Production line list and filters
- **Right Card**: `ProductionRightCard` - Selected line detailed metrics
- **State Management**: `ProductionContext` with React Context API
- **Data Communication**: Master-detail pattern via `selectedLine`

## Features

### Production Line Monitoring
- **Line Overview**: List of all production lines with key metrics
- **Status Indicators**: Real-time status (Running, Maintenance, Stopped)
- **Efficiency Tracking**: Current efficiency percentage with visual indicators
- **Search & Filter**: Find lines by name, status, or efficiency range
- **Shift Information**: Current shift and operator details

### Detailed Line Metrics
- **Performance Dashboard**: Comprehensive metrics and charts
- **Production Targets**: Daily/weekly/monthly targets vs actual output
- **Quality Metrics**: Defect rates, quality scores, and compliance
- **Equipment Status**: Individual machine status within the line
- **Historical Data**: Trends and performance over time

### Alerts & Notifications
- **Real-time Alerts**: Critical issues and maintenance warnings
- **Performance Thresholds**: Automatic alerts when efficiency drops
- **Maintenance Scheduling**: Upcoming maintenance notifications
- **Quality Issues**: Immediate alerts for quality deviations

## Data Structure

### ProductionLine Interface
```typescript
interface ProductionLine {
  id: number
  name: string
  status: 'running' | 'maintenance' | 'stopped'
  efficiency: number
  output: number
  target: number
  location: string
  shift: string
  operator: string
  lastMaintenance: Date
  nextMaintenance: Date
  qualityScore: number
  alerts: Alert[]
  machines: Machine[]
}
```

### Supporting Interfaces
```typescript
interface Alert {
  id: number
  type: 'warning' | 'error' | 'info'
  message: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface Machine {
  id: number
  name: string
  status: 'operational' | 'maintenance' | 'offline'
  efficiency: number
  temperature: number
  vibration: number
}
```

## Context Management

### ProductionContext
- **State**: `selectedLine: ProductionLine | null`
- **Actions**: `setSelectedLine(line: ProductionLine | null)`
- **Provider**: Wraps the entire page in `StableLayout`
- **Consumer**: Both left and right cards access shared state

## Components Hierarchy

```
StableLayout
├── ProductionProvider
│   ├── MainContainerTemplate
│   │   ├── ProductionLeftCardSimple (leftContent)
│   │   └── ProductionPage -> ProductionRightCard (rightContent)
```

## User Interactions

### Left Card Actions
1. **Line Selection**: Click any production line to view details
2. **Status Filtering**: Filter by operational status
3. **Efficiency Sorting**: Sort by efficiency percentage
4. **Search Lines**: Search by line name or location
5. **Refresh Data**: Manual refresh for real-time updates

### Right Card Actions
1. **View Metrics**: Detailed performance analytics
2. **Export Data**: Download reports and metrics
3. **Schedule Maintenance**: Plan maintenance activities
4. **Adjust Targets**: Modify production targets
5. **View Alerts**: Manage alerts and notifications
6. **Machine Details**: Drill down to individual machine status

## Key Metrics Displayed

### Efficiency Metrics
- **Overall Equipment Effectiveness (OEE)**
- **Availability**: Uptime percentage
- **Performance**: Speed vs. ideal speed
- **Quality**: Good parts vs. total parts

### Production Metrics
- **Units Produced**: Current shift/day/week
- **Target Achievement**: Percentage of targets met
- **Cycle Time**: Average time per unit
- **Throughput**: Units per hour/shift

### Quality Metrics
- **Defect Rate**: Percentage of defective units
- **First Pass Yield**: Units passing quality on first attempt
- **Rework Rate**: Units requiring rework
- **Customer Complaints**: Quality-related feedback

## Sample Data
The page includes realistic sample data featuring:
- 6 production lines with varied statuses
- Real-time efficiency metrics (75-98%)
- Diverse equipment types and locations
- Authentic manufacturing scenarios
- Historical maintenance records

## Styling & UX
- **Status Colors**: Green (running), yellow (maintenance), red (stopped)
- **Efficiency Gauges**: Visual progress indicators
- **Alert Badges**: Priority-coded notification system
- **Real-time Updates**: Live data refresh indicators
- **Responsive Charts**: Performance visualization
- **Mobile Optimization**: Touch-friendly interface

## Integration Points

### IoT Connectivity
- **Sensor Data**: Real-time machine sensor integration
- **SCADA Systems**: Manufacturing execution system connectivity
- **PLCs**: Programmable logic controller data feeds
- **Quality Systems**: Integration with quality management systems

### Reporting Integration
- **ERP Systems**: Enterprise resource planning data sync
- **BI Dashboards**: Business intelligence reporting
- **Maintenance Systems**: CMMS integration
- **Analytics Platforms**: Advanced analytics and ML

## Security & Access Control
- **Role-based Access**: Different views for operators, supervisors, managers
- **Data Encryption**: Secure transmission of sensitive production data
- **Audit Trails**: Complete logging of all user actions
- **Session Management**: Secure user session handling

## Performance Considerations
- **Real-time Updates**: Optimized WebSocket connections
- **Data Caching**: Intelligent caching for frequently accessed data
- **Lazy Loading**: Progressive loading of historical data
- **Compression**: Efficient data transmission

## Future Enhancements
- **Predictive Analytics**: AI-powered maintenance predictions
- **AR Integration**: Augmented reality for equipment maintenance
- **Mobile App**: Dedicated mobile application for floor managers
- **Advanced Reporting**: Customizable dashboard and reports
- **Integration APIs**: Third-party system integration
- **Voice Commands**: Voice-activated status queries

## Related Files
- `frontend/src/pages/ProductionPage.tsx` - Main page component
- `frontend/src/components/production/ProductionContext.tsx` - State management
- `frontend/src/components/production/ProductionLeftCardSimple.tsx` - Line list
- `frontend/src/components/production/ProductionRightCard.tsx` - Line details
- `frontend/src/components/production/index.ts` - Module exports

## Technical Notes
- Real-time data updates via WebSocket connections
- Optimized for manufacturing environments
- High-performance rendering for large datasets
- Robust error handling for network issues
- Comprehensive logging and monitoring
