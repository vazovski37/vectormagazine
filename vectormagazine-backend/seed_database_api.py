"""
Seed script to populate the database via API endpoints
This works with whatever database connection the backend is using
Run this script with: python seed_database_api.py
Make sure the backend is running on http://127.0.0.1:5000
"""
import requests
import json
from datetime import datetime, timedelta

API_BASE_URL = 'http://127.0.0.1:5000/api'

def create_categories():
    """Create sample categories via API"""
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
        try:
            # Check if category exists
            response = requests.get(f'{API_BASE_URL}/categories')
            if response.status_code == 200:
                existing_cats = response.json()
                existing = next((c for c in existing_cats if c.get('slug') == cat_data['slug']), None)
                if existing:
                    print(f"Category '{cat_data['name']}' already exists, skipping...")
                    categories.append(existing)
                    continue
            
            # Create category
            response = requests.post(
                f'{API_BASE_URL}/categories',
                json=cat_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 201:
                category = response.json()
                categories.append(category)
                print(f"Created category: {cat_data['name']}")
            else:
                print(f"Failed to create category '{cat_data['name']}': {response.text}")
        except Exception as e:
            print(f"Error creating category '{cat_data['name']}': {str(e)}")
    
    return categories

def create_editorjs_content(blocks):
    """Create Editor.js content format"""
    return {
        'time': int(datetime.utcnow().timestamp() * 1000),
        'blocks': blocks,
        'version': '2.28.0'
    }

def create_articles(categories):
    """Create sample published articles via API"""
    
    # Helper to get category by slug
    def get_category(slug):
        return next((c for c in categories if c.get('slug') == slug), None)
    
    articles_data = [
        {
            'title': 'The Future of Artificial Intelligence in 2024',
            'subtitle': 'Exploring the latest breakthroughs and what they mean for the future',
            'description': 'A comprehensive look at the current state of AI and predictions for the coming year',
            'category_id': get_category('technology').get('id') if get_category('technology') else None,
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
            'status': 'published',
            'published_at': (datetime.utcnow() - timedelta(days=2)).isoformat() + 'Z',
            'author_id': 1
        },
        {
            'title': 'Minimalist Design Principles for Modern Websites',
            'subtitle': 'Less is more: How to create beautiful, functional designs',
            'description': 'Learn the core principles of minimalist design and how to apply them to create stunning web experiences',
            'category_id': get_category('design').get('id') if get_category('design') else None,
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
            'status': 'published',
            'published_at': (datetime.utcnow() - timedelta(days=5)).isoformat() + 'Z',
            'author_id': 1
        },
        {
            'title': 'Building a Sustainable Startup: Lessons from Successful Founders',
            'subtitle': 'Real strategies for building a business that lasts',
            'description': 'Insights from successful entrepreneurs on building sustainable businesses in today\'s competitive market',
            'category_id': get_category('business').get('id') if get_category('business') else None,
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
            'status': 'published',
            'published_at': (datetime.utcnow() - timedelta(days=7)).isoformat() + 'Z',
            'author_id': 1
        },
        {
            'title': 'Top 10 Movies to Watch This Year',
            'subtitle': 'Our picks for the most anticipated films of 2024',
            'description': 'A curated list of must-watch movies spanning multiple genres',
            'category_id': get_category('entertainment').get('id') if get_category('entertainment') else None,
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
            'status': 'published',
            'published_at': (datetime.utcnow() - timedelta(days=1)).isoformat() + 'Z',
            'author_id': 1
        },
        {
            'title': 'The Art of Mindful Living: A Practical Guide',
            'subtitle': 'Simple practices to bring more awareness and peace into your daily life',
            'description': 'Learn practical mindfulness techniques that you can incorporate into your everyday routine',
            'category_id': get_category('lifestyle').get('id') if get_category('lifestyle') else None,
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
            'status': 'published',
            'published_at': (datetime.utcnow() - timedelta(days=3)).isoformat() + 'Z',
            'author_id': 1
        },
        {
            'title': 'Revolutionary Web Development Trends for 2024',
            'subtitle': 'Stay ahead with the latest technologies and frameworks',
            'description': 'Explore the cutting-edge web development trends that are shaping the future of the internet',
            'category_id': get_category('technology').get('id') if get_category('technology') else None,
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
            'status': 'published',
            'published_at': (datetime.utcnow() - timedelta(hours=12)).isoformat() + 'Z',
            'author_id': 1
        }
    ]
    
    articles = []
    for article_data in articles_data:
        try:
            response = requests.post(
                f'{API_BASE_URL}/articles',
                json=article_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 201:
                article = response.json()
                articles.append(article)
                print(f"Created article: {article_data['title']}")
            else:
                print(f"Failed to create article '{article_data['title']}': {response.text}")
        except Exception as e:
            print(f"Error creating article '{article_data['title']}': {str(e)}")
    
    return articles

def main():
    """Main function to seed the database via API"""
    print("Starting database seeding via API...")
    print("Make sure the backend is running on http://127.0.0.1:5000")
    print("-" * 50)
    
    # Test connection
    try:
        response = requests.get(f'{API_BASE_URL}/categories', timeout=5)
        if response.status_code != 200:
            print(f"Warning: Could not connect to API. Status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("ERROR: Cannot connect to backend API.")
        print("Please make sure the Flask backend is running on http://127.0.0.1:5000")
        return
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return
    
    # Create categories
    print("\nCreating categories...")
    categories = create_categories()
    print(f"Created/Found {len(categories)} categories")
    
    # Create articles
    print("\nCreating articles...")
    articles = create_articles(categories)
    print(f"Created {len(articles)} articles")
    
    # Get final counts
    try:
        cat_response = requests.get(f'{API_BASE_URL}/categories')
        art_response = requests.get(f'{API_BASE_URL}/articles?status=published')
        
        if cat_response.status_code == 200 and art_response.status_code == 200:
            cat_count = len(cat_response.json())
            art_count = len(art_response.json())
            
            print("\n" + "-" * 50)
            print("Database seeding completed successfully!")
            print(f"Total categories: {cat_count}")
            print(f"Total published articles: {art_count}")
    except Exception as e:
        print(f"\nWarning: Could not verify final counts: {str(e)}")

if __name__ == '__main__':
    main()

