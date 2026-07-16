import React, { useState } from 'react';
import { BookOpen, User, Clock, ArrowLeft, Heart, Share2, MessageSquare } from 'lucide-react';

// Static Editorial Blog Posts from Chef Vikram
const BLOG_POSTS = [
  {
    id: 'art-of-tadka',
    title: 'The Art of Tadka: Oil-Tempering Spices',
    excerpt: 'Tempering spices in hot oil is the secret behind Indian culinary depth. Discover the science and correct sequencing of blooming spices.',
    category: 'Techniques',
    author: 'Chef Vikram',
    readTime: '5 min read',
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=600",
    content: [
      "Tadka—also known as tempering, chhonk, or vaghar—is the ultimate signature of Indian culinary science. It is a cooking technique in which whole spices (such as mustard seeds, cumin seeds, dried red chilies, and curry leaves) are briefly roasted in hot oil or ghee to release their essential oils and intensify their flavors.",
      "Why does it work? The flavor compounds in spices are lipophilic, meaning they are fat-soluble. Blooming them in hot fat extracts these aromatic compounds and binds them to the fat, which acts as a carrier, distributing the flavor evenly throughout the entire dish.",
      "The Golden Rule of Tempering: Sequencing is everything. Always start with hard whole spices that take longer to cook, such as mustard seeds (which must pop) and cumin, followed by fresh aromatics like chopped ginger, garlic, and curry leaves, and finish with ground powder spices (like turmeric or red chili) at the very end to prevent burning. Remember, a burnt tadka ruins the entire dish!"
    ]
  },
  {
    id: 'mastering-saffron',
    title: 'Mastering Saffron: Blooming the Golden Threads',
    excerpt: 'Saffron is the world\'s most precious spice. Learn the correct technique to bloom saffron for maximum aroma and vibrant color distribution.',
    category: 'Ingredients',
    author: 'Chef Vikram',
    readTime: '4 min read',
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600",
    content: [
      "Saffron is harvested from the stigma of the Crocus sativus flower, and it takes over 75,000 flowers to produce just a single pound of threads, making it the most expensive spice by weight in the world. It provides a unique floral-honey flavor and a deep orange-yellow hue.",
      "A common mistake is throwing dry saffron threads directly into boiling food. This locks the flavor inside and leads to uneven yellow spots. To get the maximum output from your saffron, you must 'bloom' it.",
      "How to Bloom Saffron: Grind a pinch of saffron threads with a tiny pinch of sugar using a mortar and pestle to create a powder. Pour 2 tablespoons of warm (not boiling) milk or water over the powder and let it sit for at least 15 minutes. The liquid will turn a brilliant crimson gold, ready to be stirred into your biryanis or saffron risottos."
    ]
  },
  {
    id: 'modern-tofu-tikka',
    title: 'Modern Tofu: Indian-Spice Infusions',
    excerpt: 'Tofu is a blank canvas. Discover the chef techniques for pressing and infusing tikka masala marinades deep into soy curds.',
    category: 'Fusion',
    author: 'Chef Vikram',
    readTime: '6 min read',
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
    content: [
      "For vegetarian cooks, tofu is an amazing protein alternative, but it often gets criticized for being bland. In modern Indian cooking, we treat tofu exactly like paneer—infusing it with robust tikka spices to create a gorgeous fusion experience.",
      "Step 1: Pressing. Tofu comes packed in water. To get flavor in, you must get the water out. Wrap your firm tofu block in a clean kitchen towel, place a heavy pan on top, and let it drain for 20 minutes. This creates a porous sponge ready to absorb marinade.",
      "Step 2: The Tikka Marinade. Whisk Greek yogurt, ginger-garlic paste, turmeric, Kashmiri red chili powder, garam masala, mustard oil, and a squeeze of lime. Toss your pressed tofu cubes in this mixture and let them sit for 1 hour. Grill or pan-sear until charred on the edges for a smoky, high-protein culinary bite."
    ]
  }
];

// Mock Community Feed shared recipes
const COMMUNITY_FEED = [
  {
    id: 'feed-1',
    title: 'Charred Tandoori Gobi Bowl',
    description: 'A beautiful spiced cauliflower bowl served over herb-infused quinoa and topped with mint Greek yogurt dressing.',
    author: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400',
    likes: 42,
    comments: 8,
    cuisine: 'North Indian'
  },
  {
    id: 'feed-2',
    title: 'Smoked Garlic Tomato Bisque',
    description: 'Velvety smooth fire-roasted tomato broth tempered with dried basil oil and garlic bread crostini.',
    author: 'Priya Mehta',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXgs4l58XRlcyu9IHsEEZLEiCjH74_BStvfkusb7cXrxpU1AYD_oIW_SUklMsClzvBzeH7D4FZCqESDtNZqv7xUTWX8hS1CqJ2nMIDg8TAjuU7-E_WWSw3o24XaqfWqav8a4uOGX3b23fAR60XgMufs3v_wuxlX1CdvJATT6S2rIAmT4vQS8IujiQ0BmS6RZXdv9rhCfG-GnYi8xcPiGrMNXZlk1gGiaLsuVx2B-4gejMOPWwdd9qH2Q',
    likes: 67,
    comments: 14,
    cuisine: 'Continental'
  },
  {
    id: 'feed-3',
    title: 'Cardamom Saffron Panna Cotta',
    description: 'A delicate fusion dessert blooming saffron gold threads and cardamom extract, topped with crushed pistachios.',
    author: 'Siddharth V.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400',
    likes: 89,
    comments: 21,
    cuisine: 'Desserts'
  }
];

export const CommunityView = () => {
  const [activeSubTab, setActiveSubTab] = useState('feed'); // 'feed' | 'blog'
  const [selectedBlog, setSelectedBlog] = useState(null);
  
  // Likes local interactive state
  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (id) => {
    setLikedPosts(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  if (selectedBlog) {
    return (
      <div className="max-w-[800px] mx-auto px-container-padding py-12 animate-scale-in">
        <button 
          onClick={() => setSelectedBlog(null)}
          className="flex items-center gap-2 text-primary hover:text-primary-container mb-8 font-bold border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog list</span>
        </button>

        <article className="glass-card rounded-[32px] overflow-hidden border border-white/30 shadow-xl">
          <div className="h-64 md:h-96 relative overflow-hidden">
            <img 
              src={selectedBlog.image} 
              alt={selectedBlog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <span className="bg-primary/95 text-white font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider mb-3 inline-block">
                {selectedBlog.category}
              </span>
              <h1 className="text-xl md:text-3xl font-black text-white">{selectedBlog.title}</h1>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 text-xs text-on-surface-variant font-medium">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>By {selectedBlog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{selectedBlog.readTime}</span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
              {selectedBlog.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-container-padding py-12">
      
      {/* Header */}
      <section className="mb-12">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-label-md rounded-full mb-3 text-xs font-bold uppercase tracking-wider">
          Global Kitchen
        </span>
        <h2 className="font-display text-3xl font-black text-on-surface mb-2">Culinary Community</h2>
        <p className="text-sm text-on-surface-variant max-w-xl font-medium opacity-80">
          Discover culinary insights, cooking tips, and popular dishes shared by home chefs worldwide.
        </p>

        {/* Tab Selector */}
        <div className="flex border-b border-outline-variant/35 mt-10 gap-8">
          <button 
            onClick={() => setActiveSubTab('feed')}
            className={`pb-4 font-black text-xs uppercase tracking-wider transition-all border-none bg-transparent cursor-pointer ${
              activeSubTab === 'feed' 
                ? 'text-primary border-b-4 border-primary' 
                : 'text-on-surface-variant hover:text-primary opacity-60'
            }`}
          >
            Trending Feed
          </button>
          <button 
            onClick={() => setActiveSubTab('blog')}
            className={`pb-4 font-black text-xs uppercase tracking-wider transition-all border-none bg-transparent cursor-pointer ${
              activeSubTab === 'blog' 
                ? 'text-primary border-b-4 border-primary' 
                : 'text-on-surface-variant hover:text-primary opacity-60'
            }`}
          >
            Chef Blogs
          </button>
        </div>
      </section>

      {/* Tab Contents */}
      {activeSubTab === 'feed' ? (
        /* Community Social Feed layout */
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COMMUNITY_FEED.map((post) => {
            const isLiked = likedPosts.includes(post.id);
            return (
              <div 
                key={post.id}
                className="glass-card rounded-[24px] overflow-hidden border border-white/35 shadow-sm hover:shadow-xl group bg-transparent flex flex-col relative animate-scale-in"
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/95 text-primary text-[10px] font-black uppercase px-3 py-1 rounded-lg">
                    {post.cuisine}
                  </span>
                </div>
                
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Chef avatar card */}
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={post.avatar} 
                        alt={post.author} 
                        className="w-8 h-8 rounded-full object-cover border border-primary/20"
                      />
                      <span className="text-xs font-bold text-on-surface">{post.author}</span>
                    </div>

                    <h3 className="font-display font-black text-sm text-on-surface mb-2 truncate">
                      {post.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed opacity-85 line-clamp-2 mb-6">
                      {post.description}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 mt-auto">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold border-none bg-transparent cursor-pointer transition-colors ${
                        isLiked ? 'text-primary' : 'text-on-surface-variant opacity-70 hover:text-primary'
                      }`}
                    >
                      <Heart className="w-4 h-4" style={{ fill: isLiked ? 'currentColor' : 'none' }} />
                      <span>{post.likes + (isLiked ? 1 : 0)}</span>
                    </button>

                    <div className="flex gap-4">
                      <button className="flex items-center gap-1.5 text-xs text-on-surface-variant opacity-70 hover:text-primary border-none bg-transparent cursor-pointer">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center text-on-surface-variant opacity-70 hover:text-primary border-none bg-transparent cursor-pointer">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        /* Culinary Blogs list */
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-scale-in">
          {BLOG_POSTS.map((post) => (
            <div 
              key={post.id}
              onClick={() => setSelectedBlog(post)}
              className="glass-card rounded-[24px] p-4 flex flex-col gap-4 border border-white/35 cursor-pointer shadow-sm hover:shadow-xl group bg-transparent animate-scale-in"
            >
              <div className="recipe-image-container h-48 overflow-hidden rounded-2xl relative">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={post.title} 
                  src={post.image}
                />
                <span className="absolute top-3 left-3 bg-primary text-white font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider">
                  {post.category}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant opacity-60 mb-2 font-bold">
                  <span>{post.author}</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-headline-sm font-bold text-sm text-on-surface mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed opacity-80">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-primary text-xs font-black uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Footer Section */}
      <footer className="mt-24 py-12 px-container-padding bg-surface-container-lowest border-t border-outline-variant/30 rounded-[32px]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-gutter">
          <div>
            <h3 className="font-headline-md text-primary font-black mb-2 text-base">TadkaMode AI</h3>
            <p className="text-xs text-on-surface-variant max-w-xs">
              © 2024 TadkaMode AI. Premium Culinary Precision for the Modern Kitchen.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs text-on-surface font-black uppercase tracking-wider">Platform</h4>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs text-on-surface font-black uppercase tracking-wider">Connect</h4>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Press Kit</a>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default CommunityView;
