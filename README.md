![Smart Customer Support Ticketing System](/public/image.png.png)

# Smart Customer Support Ticketing System

An intelligent customer support system that automatically categorizes incoming tickets and generates smart responses using RAG (Retrieval Augmented Generation) architecture.

## Features

### Core Functionality
- **Automatic Ticket Categorization**: Uses NLP to classify tickets into categories (shipping, returns, payment, quality, account, technical)
- **Smart Response Generation**: Leverages RAG pipeline to generate contextually relevant responses
- **Priority Assignment**: Automatically assigns priority levels based on urgency indicators
- **Sentiment Analysis**: Analyzes customer sentiment to improve response quality
- **Confidence Scoring**: Provides confidence scores for automated responses
- **Escalation Logic**: Automatically escalates complex or low-confidence tickets to human agents

### RAG Pipeline Components
1. **Ticket Ingestion**: Processes incoming support tickets
2. **Historical Analysis**: Searches through resolved tickets for similar issues
3. **Knowledge Base Integration**: Retrieves relevant information from company documentation
4. **Vector Embeddings**: Uses semantic search for finding similar content
5. **Multi-source Retrieval**: Combines information from multiple sources
6. **Response Generation**: Creates contextual responses using AI
7. **Quality Assurance**: Confidence scoring and escalation triggers

### Advanced Features
- **Multi-level Categorization**: Hierarchical ticket classification
- **Learning System**: Improves responses based on successful resolutions
- **Customer History**: Integrates past customer interactions
- **Agent Dashboard**: Comprehensive interface for support agents
- **Analytics**: Performance metrics and system insights

## Technical Architecture

### Backend Components
- **Database**: PostgreSQL with tables for tickets, knowledge base, and embeddings
- **RAG Service**: Core pipeline for ticket processing and response generation
- **AI Integration**: OpenAI GPT-4 for analysis and response generation
- **Vector Search**: Semantic similarity matching using embeddings
- **API Layer**: RESTful endpoints for ticket management

### Frontend Components
- **Ticket Submission**: User-friendly form for customers
- **Agent Dashboard**: Comprehensive management interface
- **Real-time Updates**: Live ticket status and analytics
- **Responsive Design**: Works on desktop and mobile devices

## Sample Use Cases (E-commerce)

### Shipping Issues
- **Input**: "My order hasn't arrived"
- **Processing**: Auto-categorized as "Shipping Issue"
- **Response**: Checks tracking, provides status update, offers compensation if delayed

### Returns
- **Input**: "I want to return this product"
- **Processing**: Generates response with return policy
- **Response**: Provides return instructions and prepaid label information

### Payment Problems
- **Input**: "Payment failed but money deducted"
- **Processing**: Checks similar resolved tickets
- **Response**: Explains reversal process and timeline

### Product Quality
- **Input**: "Product damaged during delivery"
- **Processing**: Auto-tagged with refund process
- **Response**: Offers immediate replacement with expedited shipping

## Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key

### Environment Variables
\`\`\`env
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
\`\`\`

### Database Setup
1. Run the SQL scripts in the `scripts/` folder:
   \`\`\`bash
   psql -d your_database -f scripts/001-create-tables.sql
   psql -d your_database -f scripts/002-seed-knowledge-base.sql
   psql -d your_database -f scripts/003-seed-historical-tickets.sql
   \`\`\`

### Application Setup
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Access the application:
   - Customer Portal: http://localhost:3000
   - Agent Dashboard: http://localhost:3000/dashboard

## API Endpoints

### Tickets
- `POST /api/tickets` - Submit new ticket
- `GET /api/tickets` - Get all tickets (with optional status filter)
- `GET /api/tickets?includeStats=true` - Get tickets with analytics
- `GET /api/tickets/[id]` - Get specific ticket
- `PATCH /api/tickets/[id]` - Update ticket

## System Performance Metrics

### Automated Resolution
- **Target**: 70% of tickets auto-resolved
- **Current**: Varies by category and confidence threshold

### Response Quality
- **Confidence Scoring**: 0-1 scale with 0.6+ threshold for auto-response
- **Escalation Rate**: Typically 20-30% of tickets escalated to humans
- **Customer Satisfaction**: Measured through feedback loops

### Processing Speed
- **Ticket Analysis**: < 2 seconds
- **Response Generation**: < 5 seconds
- **Database Operations**: < 1 second

## Customization

### Adding New Categories
1. Update the category list in `lib/ticket-analyzer.ts`
2. Add corresponding knowledge base entries
3. Train the system with sample tickets

### Modifying Escalation Rules
Edit the `shouldEscalateToHuman` function in `lib/response-generator.ts`:
- Adjust confidence thresholds
- Add new escalation criteria
- Modify priority-based rules

### Extending Knowledge Base
Add new entries to the `knowledge_base` table:
\`\`\`sql
INSERT INTO knowledge_base (title, content, category, tags) VALUES
('New Policy', 'Policy content...', 'category', ARRAY['tag1', 'tag2']);
