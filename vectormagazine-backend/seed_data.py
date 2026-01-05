"""
Seed script to populate the database with sample categories and published articles.
Run this script with: python seed_data.py
"""

import requests
from datetime import datetime

API_BASE = "http://127.0.0.1:5000/api"

# Sample categories for a magazine
CATEGORIES = [
    {
        "name": "Technology",
        "slug": "technology",
        "description": "Latest trends in tech, gadgets, and digital innovation"
    },
    {
        "name": "Lifestyle",
        "slug": "lifestyle", 
        "description": "Culture, travel, food, and modern living"
    },
    {
        "name": "Business",
        "slug": "business",
        "description": "Entrepreneurship, startups, and market insights"
    },
    {
        "name": "Design",
        "slug": "design",
        "description": "Architecture, interior design, and visual arts"
    },
    {
        "name": "Science",
        "slug": "science",
        "description": "Discoveries, research, and the natural world"
    }
]

# Sample articles with Editor.js content format
ARTICLES = [
    {
        "title": "The Future of Artificial Intelligence in 2026",
        "subtitle": "How AI is reshaping industries and transforming the way we live and work",
        "description": "An in-depth look at the latest AI developments and their impact on society",
        "category_slug": "technology",
        "tags": ["AI", "Machine Learning", "Future Tech", "Innovation"],
        "cover_image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
        "status": "published",
        "content": {
            "time": 1704067200000,
            "blocks": [
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Artificial Intelligence has evolved from a futuristic concept to an integral part of our daily lives. From smart assistants to autonomous vehicles, AI is transforming every aspect of how we interact with technology."
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "The Rise of Generative AI",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Generative AI has emerged as one of the most transformative technologies of our time. Models like GPT-4 and beyond are now capable of creating content that rivals human creativity, from writing articles to generating code and artwork."
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "The implications for businesses are profound. Companies are leveraging these tools to automate content creation, enhance customer service, and accelerate software development."
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "AI in Healthcare",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Perhaps nowhere is AI's potential more exciting than in healthcare. Machine learning algorithms are now capable of detecting diseases earlier than ever before, analyzing medical images with superhuman accuracy, and even predicting patient outcomes."
                    }
                },
                {
                    "type": "quote",
                    "data": {
                        "text": "AI will be the most transformative technology in healthcare since the discovery of antibiotics.",
                        "caption": "Dr. Sarah Chen, AI Research Director"
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "As we look ahead, the convergence of AI with other emerging technologies like quantum computing and biotechnology promises to unlock possibilities we can barely imagine today."
                    }
                }
            ],
            "version": "2.28.0"
        }
    },
    {
        "title": "Minimalist Living: The Art of Intentional Spaces",
        "subtitle": "Discover how embracing minimalism can transform your home and mindset",
        "description": "A guide to creating peaceful, clutter-free living environments",
        "category_slug": "lifestyle",
        "tags": ["Minimalism", "Interior Design", "Wellness", "Home"],
        "cover_image": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200",
        "status": "published",
        "content": {
            "time": 1704153600000,
            "blocks": [
                {
                    "type": "paragraph",
                    "data": {
                        "text": "In a world overwhelmed by consumerism and constant stimulation, minimalist living offers a refreshing alternative. It's not about deprivation—it's about making room for what truly matters."
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "The Philosophy Behind Minimalism",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Minimalism is more than an aesthetic; it's a mindset. At its core, it asks us to question our relationship with possessions and to prioritize experiences and relationships over material goods."
                    }
                },
                {
                    "type": "list",
                    "data": {
                        "style": "unordered",
                        "items": [
                            "Focus on quality over quantity",
                            "Create spaces that promote calm and clarity",
                            "Reduce decision fatigue by simplifying choices",
                            "Invest in experiences rather than things"
                        ]
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "Practical Steps to Get Started",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Begin with one room at a time. Remove everything that doesn't serve a purpose or bring you joy. Create designated spaces for essential items, and resist the urge to fill empty spaces."
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "The result is a home that feels open, peaceful, and truly yours—a sanctuary from the chaos of modern life."
                    }
                }
            ],
            "version": "2.28.0"
        }
    },
    {
        "title": "The Rise of Remote-First Companies",
        "subtitle": "How distributed teams are redefining the future of work",
        "description": "Exploring the shift to remote work and its impact on business culture",
        "category_slug": "business",
        "tags": ["Remote Work", "Startups", "Future of Work", "Leadership"],
        "cover_image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
        "status": "published",
        "content": {
            "time": 1704240000000,
            "blocks": [
                {
                    "type": "paragraph",
                    "data": {
                        "text": "The traditional office is no longer the default. A new generation of companies is being built from the ground up with distributed teams, challenging long-held assumptions about how work should be done."
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "Benefits of the Remote-First Model",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Remote-first companies enjoy access to a global talent pool, reduced overhead costs, and often report higher employee satisfaction. Workers appreciate the flexibility to design their work environment and schedule."
                    }
                },
                {
                    "type": "list",
                    "data": {
                        "style": "ordered",
                        "items": [
                            "Access to global talent without geographic limitations",
                            "Significant cost savings on office space",
                            "Improved work-life balance for employees",
                            "Increased productivity through focused work time"
                        ]
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "Challenges and Solutions",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Of course, remote work comes with challenges. Communication can suffer, and maintaining company culture requires intentional effort. Successful remote-first companies invest heavily in async communication tools, regular virtual gatherings, and occasional in-person retreats."
                    }
                },
                {
                    "type": "quote",
                    "data": {
                        "text": "Remote work isn't about replicating the office online—it's about building something better.",
                        "caption": "CEO of a leading remote-first startup"
                    }
                }
            ],
            "version": "2.28.0"
        }
    },
    {
        "title": "Biophilic Design: Bringing Nature Indoors",
        "subtitle": "How architects are incorporating natural elements to create healthier spaces",
        "description": "Exploring the trend of nature-inspired architecture and design",
        "category_slug": "design",
        "tags": ["Architecture", "Biophilic Design", "Sustainability", "Wellness"],
        "cover_image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
        "status": "published",
        "content": {
            "time": 1704326400000,
            "blocks": [
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Humans have an innate connection to nature—a concept known as biophilia. Modern architects and designers are leveraging this connection to create spaces that promote wellbeing, productivity, and happiness."
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "Elements of Biophilic Design",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Biophilic design goes beyond adding a few potted plants. It encompasses natural lighting, organic materials, water features, and views of nature. The goal is to create an immersive experience that connects occupants with the natural world."
                    }
                },
                {
                    "type": "list",
                    "data": {
                        "style": "unordered",
                        "items": [
                            "Maximize natural light through large windows and skylights",
                            "Incorporate living walls and indoor gardens",
                            "Use natural materials like wood, stone, and bamboo",
                            "Include water features for calming soundscapes"
                        ]
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "The Science Behind the Trend",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Research shows that biophilic design can reduce stress, enhance creativity, and improve cognitive function. In office settings, it has been linked to reduced absenteeism and higher job satisfaction."
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "As we spend more time indoors, bringing nature inside isn't just aesthetically pleasing—it's essential for our health and happiness."
                    }
                }
            ],
            "version": "2.28.0"
        }
    },
    {
        "title": "Quantum Computing: Breaking the Boundaries of Possibility",
        "subtitle": "Understanding the technology that could revolutionize computing as we know it",
        "description": "A beginner's guide to quantum computing and its potential applications",
        "category_slug": "science",
        "tags": ["Quantum Computing", "Physics", "Technology", "Innovation"],
        "cover_image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200",
        "status": "published",
        "content": {
            "time": 1704412800000,
            "blocks": [
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Classical computers have transformed our world, but they have limits. Quantum computers promise to solve problems that would take traditional machines billions of years—in mere minutes."
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "How Quantum Computers Work",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Unlike classical bits, which exist as 0s or 1s, quantum bits (qubits) can exist in multiple states simultaneously thanks to a phenomenon called superposition. This allows quantum computers to process vast amounts of information in parallel."
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Entanglement, another quantum property, allows qubits to be mysteriously connected, enabling complex calculations that classical computers cannot perform efficiently."
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "Potential Applications",
                        "level": 2
                    }
                },
                {
                    "type": "list",
                    "data": {
                        "style": "unordered",
                        "items": [
                            "Drug discovery and molecular simulation",
                            "Cryptography and secure communications",
                            "Financial modeling and optimization",
                            "Climate modeling and weather prediction"
                        ]
                    }
                },
                {
                    "type": "quote",
                    "data": {
                        "text": "Quantum computing will allow us to solve humanity's most complex problems.",
                        "caption": "Nobel Laureate in Physics"
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "While fully fault-tolerant quantum computers are still years away, the progress being made today is laying the foundation for a computational revolution."
                    }
                }
            ],
            "version": "2.28.0"
        }
    },
    {
        "title": "The Electric Vehicle Revolution Accelerates",
        "subtitle": "How EVs are transforming transportation and reshaping the auto industry",
        "description": "A deep dive into the rapidly evolving electric vehicle market",
        "category_slug": "technology",
        "tags": ["Electric Vehicles", "Sustainability", "Automotive", "Clean Energy"],
        "cover_image": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200",
        "status": "published",
        "content": {
            "time": 1704499200000,
            "blocks": [
                {
                    "type": "paragraph",
                    "data": {
                        "text": "The shift to electric vehicles is no longer a question of if, but when. Sales are soaring, charging infrastructure is expanding, and governments worldwide are setting ambitious targets for phasing out internal combustion engines."
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "Market Momentum",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "EV sales have grown exponentially, with every major automaker now offering electric models. Battery technology continues to improve, extending range and reducing costs. The tipping point has arrived."
                    }
                },
                {
                    "type": "header",
                    "data": {
                        "text": "Challenges Ahead",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Despite the progress, challenges remain. Charging infrastructure needs to expand, particularly in rural areas. Battery production must scale sustainably, and the electrical grid must adapt to increased demand."
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Yet the trajectory is clear: the future of transportation is electric, and it's arriving faster than anyone predicted."
                    }
                }
            ],
            "version": "2.28.0"
        }
    }
]


def create_categories():
    """Create sample categories"""
    print("\n📁 Creating categories...")
    category_map = {}
    
    for cat in CATEGORIES:
        response = requests.post(f"{API_BASE}/categories", json=cat)
        if response.status_code == 201:
            data = response.json()
            category_map[cat["slug"]] = data["id"]
            print(f"  ✅ Created category: {cat['name']}")
        elif response.status_code == 400 and "already exists" in response.text:
            # Category already exists, fetch it
            cats_response = requests.get(f"{API_BASE}/categories")
            if cats_response.status_code == 200:
                for existing_cat in cats_response.json():
                    if existing_cat["slug"] == cat["slug"]:
                        category_map[cat["slug"]] = existing_cat["id"]
                        print(f"  ⚠️ Category already exists: {cat['name']}")
                        break
        else:
            print(f"  ❌ Failed to create category: {cat['name']} - {response.text}")
    
    return category_map


def create_articles(category_map):
    """Create sample articles"""
    print("\n📝 Creating articles...")
    
    for article in ARTICLES:
        # Get category ID from slug
        category_id = category_map.get(article["category_slug"])
        
        article_data = {
            "title": article["title"],
            "subtitle": article["subtitle"],
            "description": article["description"],
            "content": article["content"],
            "cover_image": article["cover_image"],
            "category_id": category_id,
            "tags": article["tags"],
            "status": article["status"],
            "author_id": 1
        }
        
        response = requests.post(f"{API_BASE}/articles", json=article_data)
        if response.status_code == 201:
            data = response.json()
            print(f"  ✅ Created article: {article['title'][:50]}...")
            print(f"      Status: {data.get('status')} | Category: {article['category_slug']}")
        elif response.status_code == 400:
            print(f"  ⚠️ Article may already exist: {article['title'][:50]}...")
        else:
            print(f"  ❌ Failed to create article: {article['title'][:50]}... - {response.text}")


def main():
    """Main function to seed the database"""
    print("=" * 60)
    print("🌱 VECTOR MAGAZINE - Database Seeder")
    print("=" * 60)
    
    # Test API connection
    try:
        response = requests.get(f"{API_BASE}/categories")
        if response.status_code != 200:
            print(f"❌ API not responding correctly. Status: {response.status_code}")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure the backend is running at http://127.0.0.1:5000")
        return
    
    print("✅ API connection successful!")
    
    # Create categories
    category_map = create_categories()
    
    # Create articles
    create_articles(category_map)
    
    print("\n" + "=" * 60)
    print("🎉 Seeding complete!")
    print("=" * 60)
    
    # Print summary
    articles_response = requests.get(f"{API_BASE}/articles?status=published")
    if articles_response.status_code == 200:
        published = len(articles_response.json())
        print(f"\n📊 Summary:")
        print(f"   Categories: {len(category_map)}")
        print(f"   Published Articles: {published}")
    

if __name__ == "__main__":
    main()
