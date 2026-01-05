"""
Seed script to populate the database with sample categories and articles
Run this script with: python seed_database.py
"""
from datetime import datetime, timedelta
from app import create_app
from models import db, Category, Article, ArticleStatus
import re

def generate_slug(title):
    """Generate URL-friendly slug from title"""
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    slug = slug.strip('-')
    return slug

def create_categories():
    """Create sample categories"""
    categories_data = [
        {
            'name': 'Technology',
            'slug': 'technology',
            'description': 'Latest tech news, reviews, and innovations'
        },
        {
            'name': 'Design',
            'slug': 'design',
            'description': 'UI/UX design, graphic design, and creative inspiration'
        },
        {
            'name': 'Business',
            'slug': 'business',
            'description': 'Business strategies, entrepreneurship, and market insights'
        },
        {
            'name': 'Entertainment',
            'slug': 'entertainment',
            'description': 'Movies, TV shows, music, and pop culture'
        },
        {
            'name': 'Lifestyle',
            'slug': 'lifestyle',
            'description': 'Health, wellness, travel, and personal development'
        }
    ]
    
    categories = []
    for cat_data in categories_data:
        # Check if category already exists
        existing = Category.query.filter_by(slug=cat_data['slug']).first()
        if existing:
            print(f"Category '{cat_data['name']}' already exists, skipping...")
            categories.append(existing)
        else:
            category = Category(
                name=cat_data['name'],
                slug=cat_data['slug'],
                description=cat_data['description']
            )
            db.session.add(category)
            categories.append(category)
            print(f"Created category: {cat_data['name']}")
    
    db.session.commit()
    return categories

def create_editorjs_content(blocks):
    """Create Editor.js content format"""
    return {
        'time': int(datetime.utcnow().timestamp() * 1000),
        'blocks': blocks,
        'version': '2.28.0'
    }

def create_articles(categories):
    """Create sample published articles"""
    
    # Helper to get category by slug
    def get_category(slug):
        return next((c for c in categories if c.slug == slug), None)
    
    articles_data = [
        {
            'title': 'The Future of Artificial Intelligence in 2024',
            'subtitle': 'Exploring the latest breakthroughs and what they mean for the future',
            'description': 'A comprehensive look at the current state of AI and predictions for the coming year',
            'category': get_category('technology'),
            'tags': ['AI', 'Technology', 'Innovation', 'Machine Learning'],
            'cover_image': '/static/uploads/0ab2c7e0e1d345ab9be416242747aff4.png',
            'content': create_editorjs_content([
                {
                    'type': 'header',
                    'data': {
                        'text': 'Introduction',
                        'level': 2
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'Artificial Intelligence has been evolving at an unprecedented pace. In 2024, we\'re seeing breakthroughs that were once thought to be decades away. From large language models to computer vision, AI is transforming every industry.'
                    }
                },
                {
                    'type': 'header',
                    'data': {
                        'text': 'Key Developments',
                        'level': 2
                    }
                },
                {
                    'type': 'list',
                    'data': {
                        'style': 'unordered',
                        'items': [
                            'Advanced language models with improved reasoning capabilities',
                            'AI-powered creative tools for design and content creation',
                            'Autonomous systems becoming more reliable and safe',
                            'Ethical AI frameworks gaining mainstream adoption'
                        ]
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'These developments are not just technical achievements; they represent a fundamental shift in how we interact with technology and solve complex problems.'
                    }
                },
                {
                    'type': 'quote',
                    'data': {
                        'text': 'The best way to predict the future is to invent it.',
                        'caption': 'Alan Kay',
                        'alignment': 'left'
                    }
                }
            ]),
            'meta_title': 'The Future of AI in 2024 - Technology Insights',
            'meta_description': 'Discover the latest AI breakthroughs and what they mean for the future of technology and society.',
            'published_at': datetime.utcnow() - timedelta(days=2)
        },
        {
            'title': 'Minimalist Design Principles for Modern Websites',
            'subtitle': 'Less is more: How to create beautiful, functional designs',
            'description': 'Learn the core principles of minimalist design and how to apply them to create stunning web experiences',
            'category': get_category('design'),
            'tags': ['Design', 'Web Design', 'UI/UX', 'Minimalism'],
            'cover_image': '/static/uploads/5324f939696b4e22b9b44f6c087c44dc.png',
            'content': create_editorjs_content([
                {
                    'type': 'header',
                    'data': {
                        'text': 'What is Minimalist Design?',
                        'level': 2
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'Minimalist design is about stripping away the unnecessary elements and focusing on what truly matters. It\'s not about removing everything, but about removing everything that doesn\'t serve a purpose.'
                    }
                },
                {
                    'type': 'header',
                    'data': {
                        'text': 'Core Principles',
                        'level': 2
                    }
                },
                {
                    'type': 'list',
                    'data': {
                        'style': 'ordered',
                        'items': [
                            'Use plenty of white space to create breathing room',
                            'Limit your color palette to 2-3 colors',
                            'Choose typography that is readable and elegant',
                            'Focus on functionality over decoration',
                            'Use grid systems for consistent layouts'
                        ]
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'When done right, minimalist design creates a sense of calm and clarity that guides users naturally through your interface.'
                    }
                }
            ]),
            'meta_title': 'Minimalist Design Principles - Design Guide',
            'meta_description': 'Master the art of minimalist web design with these essential principles and best practices.',
            'published_at': datetime.utcnow() - timedelta(days=5)
        },
        {
            'title': 'Building a Sustainable Startup: Lessons from Successful Founders',
            'subtitle': 'Real strategies for building a business that lasts',
            'description': 'Insights from successful entrepreneurs on building sustainable businesses in today\'s competitive market',
            'category': get_category('business'),
            'tags': ['Startup', 'Entrepreneurship', 'Business Strategy', 'Growth'],
            'cover_image': '/static/uploads/e741381737974f559dd4b5720f048308.jpg',
            'content': create_editorjs_content([
                {
                    'type': 'header',
                    'data': {
                        'text': 'The Foundation',
                        'level': 2
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'Building a sustainable startup requires more than just a great idea. It demands careful planning, strong execution, and the ability to adapt to changing market conditions.'
                    }
                },
                {
                    'type': 'header',
                    'data': {
                        'text': 'Key Strategies',
                        'level': 2
                    }
                },
                {
                    'type': 'list',
                    'data': {
                        'style': 'unordered',
                        'items': [
                            'Focus on solving a real problem for your customers',
                            'Build a strong team with complementary skills',
                            'Maintain financial discipline and plan for the long term',
                            'Create a culture of continuous learning and improvement',
                            'Build genuine relationships with customers and partners'
                        ]
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'Success in entrepreneurship is not about quick wins, but about building something that creates lasting value for all stakeholders.'
                    }
                }
            ]),
            'meta_title': 'Building Sustainable Startups - Business Guide',
            'meta_description': 'Learn from successful founders how to build a startup that stands the test of time.',
            'published_at': datetime.utcnow() - timedelta(days=7)
        },
        {
            'title': 'Top 10 Movies to Watch This Year',
            'subtitle': 'Our picks for the most anticipated films of 2024',
            'description': 'A curated list of must-watch movies spanning multiple genres',
            'category': get_category('entertainment'),
            'tags': ['Movies', 'Entertainment', 'Film', 'Reviews'],
            'cover_image': '/static/uploads/ed09851b636b4342a3c1ccf3088549a4.jpg',
            'content': create_editorjs_content([
                {
                    'type': 'header',
                    'data': {
                        'text': 'Action & Adventure',
                        'level': 2
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'This year has brought us some incredible action-packed films that push the boundaries of visual effects and storytelling.'
                    }
                },
                {
                    'type': 'header',
                    'data': {
                        'text': 'Drama & Thriller',
                        'level': 2
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'For those who prefer thought-provoking narratives, there are several standout dramas that explore complex human relationships and social issues.'
                    }
                },
                {
                    'type': 'list',
                    'data': {
                        'style': 'ordered',
                        'items': [
                            'Epic Sci-Fi Adventure - A mind-bending journey through space',
                            'Psychological Thriller - A gripping tale of suspense',
                            'Romantic Comedy - Heartwarming and hilarious',
                            'Documentary - Eye-opening real-world stories',
                            'Animated Feature - Beautiful animation for all ages'
                        ]
                    }
                }
            ]),
            'meta_title': 'Top Movies 2024 - Entertainment Guide',
            'meta_description': 'Discover the best movies to watch this year across all genres.',
            'published_at': datetime.utcnow() - timedelta(days=1)
        },
        {
            'title': 'The Art of Mindful Living: A Practical Guide',
            'subtitle': 'Simple practices to bring more awareness and peace into your daily life',
            'description': 'Learn practical mindfulness techniques that you can incorporate into your everyday routine',
            'category': get_category('lifestyle'),
            'tags': ['Mindfulness', 'Wellness', 'Self-Improvement', 'Mental Health'],
            'cover_image': '/static/uploads/3d0845aa8b7747bc9fea3eb597a7b5bf.jpg',
            'content': create_editorjs_content([
                {
                    'type': 'header',
                    'data': {
                        'text': 'What is Mindfulness?',
                        'level': 2
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'Mindfulness is the practice of being fully present and engaged in the current moment, without judgment. It\'s about noticing your thoughts, feelings, and sensations as they arise.'
                    }
                },
                {
                    'type': 'header',
                    'data': {
                        'text': 'Daily Practices',
                        'level': 2
                    }
                },
                {
                    'type': 'list',
                    'data': {
                        'style': 'unordered',
                        'items': [
                            'Start your day with 5 minutes of meditation',
                            'Practice mindful eating - savor each bite',
                            'Take regular breaks to check in with yourself',
                            'End your day with gratitude journaling',
                            'Use breathing exercises during stressful moments'
                        ]
                    }
                },
                {
                    'type': 'quote',
                    'data': {
                        'text': 'The present moment is the only time over which we have dominion.',
                        'caption': 'Thich Nhat Hanh',
                        'alignment': 'left'
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'Remember, mindfulness is not about achieving a perfect state of calm, but about developing awareness and acceptance of whatever is present in each moment.'
                    }
                }
            ]),
            'meta_title': 'Mindful Living Guide - Lifestyle & Wellness',
            'meta_description': 'Discover practical mindfulness techniques to enhance your daily life and well-being.',
            'published_at': datetime.utcnow() - timedelta(days=3)
        },
        {
            'title': 'Revolutionary Web Development Trends for 2024',
            'subtitle': 'Stay ahead with the latest technologies and frameworks',
            'description': 'Explore the cutting-edge web development trends that are shaping the future of the internet',
            'category': get_category('technology'),
            'tags': ['Web Development', 'Programming', 'Frontend', 'Backend'],
            'cover_image': '/static/uploads/ff4e3aeac28246b9aa53655243f863fe.png',
            'content': create_editorjs_content([
                {
                    'type': 'header',
                    'data': {
                        'text': 'Frontend Innovations',
                        'level': 2
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'The frontend landscape continues to evolve rapidly. New frameworks and tools are making it easier than ever to build fast, responsive, and accessible web applications.'
                    }
                },
                {
                    'type': 'header',
                    'data': {
                        'text': 'Backend Evolution',
                        'level': 2
                    }
                },
                {
                    'type': 'paragraph',
                    'data': {
                        'text': 'Serverless architectures, edge computing, and modern API design patterns are revolutionizing how we build backend systems.'
                    }
                },
                {
                    'type': 'list',
                    'data': {
                        'style': 'unordered',
                        'items': [
                            'React Server Components for better performance',
                            'TypeScript adoption continues to grow',
                            'Edge computing for lower latency',
                            'AI-powered development tools',
                            'Improved accessibility standards'
                        ]
                    }
                }
            ]),
            'meta_title': 'Web Development Trends 2024 - Tech Guide',
            'meta_description': 'Stay updated with the latest web development trends and technologies shaping the industry.',
            'published_at': datetime.utcnow() - timedelta(hours=12)
        }
    ]
    
    articles = []
    for article_data in articles_data:
        # Generate slug
        slug = generate_slug(article_data['title'])
        
        # Ensure unique slug
        base_slug = slug
        counter = 1
        while Article.query.filter_by(slug=slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        # Calculate read time (simplified - count words in content)
        word_count = 0
        for block in article_data['content']['blocks']:
            if block.get('type') == 'paragraph':
                text = block.get('data', {}).get('text', '')
                word_count += len(text.split())
            elif block.get('type') == 'header':
                text = block.get('data', {}).get('text', '')
                word_count += len(text.split())
            elif block.get('type') == 'list':
                items = block.get('data', {}).get('items', [])
                for item in items:
                    word_count += len(str(item).split())
        
        read_time = max(1, round(word_count / 225))
        
        # Check if article already exists
        existing = Article.query.filter_by(slug=slug).first()
        if existing:
            print(f"Article '{article_data['title']}' already exists, skipping...")
            continue
        
        article = Article(
            title=article_data['title'],
            subtitle=article_data['subtitle'],
            description=article_data['description'],
            content=article_data['content'],
            cover_image=article_data['cover_image'],
            read_time=read_time,
            published_at=article_data['published_at'],
            category_id=article_data['category'].id if article_data['category'] else None,
            tags=article_data['tags'],
            slug=slug,
            meta_title=article_data['meta_title'],
            meta_description=article_data['meta_description'],
            og_image=article_data['cover_image'],
            author_id=1,
            status=ArticleStatus.PUBLISHED,
            views_count=0,
            created_at=article_data['published_at'],
            updated_at=article_data['published_at']
        )
        
        db.session.add(article)
        articles.append(article)
        print(f"Created article: {article_data['title']}")
    
    db.session.commit()
    return articles

def main():
    """Main function to seed the database"""
    app = create_app()
    
    with app.app_context():
        print("Starting database seeding...")
        print("-" * 50)
        
        # Create categories
        print("\nCreating categories...")
        categories = create_categories()
        print(f"Created/Found {len(categories)} categories")
        
        # Create articles
        print("\nCreating articles...")
        articles = create_articles(categories)
        print(f"Created {len(articles)} articles")
        
        print("\n" + "-" * 50)
        print("Database seeding completed successfully!")
        print(f"Total categories: {Category.query.count()}")
        print(f"Total articles: {Article.query.count()}")
        print(f"Published articles: {Article.query.filter_by(status=ArticleStatus.PUBLISHED).count()}")

if __name__ == '__main__':
    main()

