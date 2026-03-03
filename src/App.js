import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Aapki NewsData.io API Key yahan paste karein
const API_KEY = "pub_5b39f254d2794553b98d14439b3db996";

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Agra');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNews = useCallback(async (queryParam) => {
    setLoading(true);
    try {
      let url = "";
      
      // NewsData.io API structure (Using 'q' for keywords and 'country=in' for India)
      if (queryParam === 'Agra') {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=Agra&country=in&language=en,hi`;
      } else if (queryParam === 'National') {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en,hi&category=top`;
      } else if (queryParam === 'Sports') {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&category=sports&language=en,hi`;
      } else if (queryParam === 'Business') {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&category=business&language=en,hi`;
      } else {
        // For Search functionality
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${queryParam}&country=in&language=en,hi`;
      }

      const res = await axios.get(url);
      
      // NewsData.io results ko filter karna (Images aur Titles ke liye)
      if (res.data.results) {
        const data = res.data.results.filter(a => a.image_url && a.title);
        setArticles(data);
      }
    } catch (err) {
      console.error("API Error:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNews(activeTab);
  }, [activeTab, fetchNews]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab(searchQuery);
      fetchNews(searchQuery);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* 1. TOP STOCK TICKER */}
      <div className="ticker-wrap shadow-sm">
        <div className="ticker text-uppercase">
          <span className="ticker-item"><span className="text-success">▲ NIFTY 50:</span> 22,450.20 (+0.45%)</span>
          <span className="ticker-item"><span className="text-danger">▼ SENSEX:</span> 73,810.15 (-0.12%)</span>
          <span className="ticker-item"><span className="text-success">▲ AGRA DEVELOPMENT:</span> ACTIVE</span>
          <span className="ticker-item"><span className="text-warning">● GOLD RATE:</span> ₹62,450</span>
          <span className="ticker-item"><span className="text-info">● USD/INR:</span> ₹83.12</span>
          <span className="ticker-item"><span className="text-success">▲ TATA MOTORS:</span> +2.1%</span>
        </div>
      </div>

      {/* 2. PROFESSIONAL NAVIGATION & LOGO */}
      <nav className="navbar navbar-expand-lg sticky-top shadow-sm py-3 bg-white border-bottom border-danger border-4">
        <div className="container">
          <a className="navbar-brand fw-bolder fs-2" href="/" style={{ letterSpacing: '-1.5px' }}>
            <span style={{color: '#111'}}>BHARAT</span><span className="text-danger">TIMES</span>
          </a>
          
          <div className="collapse navbar-collapse justify-content-center">
            <div className="d-flex gap-4 fw-bold text-uppercase" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>
              {['Agra', 'National', 'Politics', 'Business', 'Sports'].map(item => (
                <span 
                  key={item} 
                  onClick={() => setActiveTab(item)}
                  style={{ 
                    cursor: 'pointer', 
                    color: activeTab === item ? '#d32f2f' : '#444',
                    borderBottom: activeTab === item ? '3px solid #d32f2f' : 'none'
                  }}
                  className="pb-1 transition-all"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 3. FUNCTIONAL SEARCH BAR */}
          <form className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border shadow-sm" onSubmit={handleSearch}>
            <input 
              type="text" 
              className="form-control border-0 bg-transparent shadow-none" 
              placeholder="Search local or global..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '180px', fontSize: '14px' }}
            />
            <button type="submit" className="btn btn-link p-0 text-danger"><i className="fa fa-search"></i></button>
          </form>
        </div>
      </nav>

      <main className="container mt-4">
        {/* 4. HERO HIGHLIGHT SECTION */}
        {!loading && articles.length > 0 ? (
          <div className="row g-4 mb-5">
            <div className="col-lg-8">
              <div className="hero-main shadow-lg rounded-4 overflow-hidden position-relative" style={{ height: '500px' }}>
                <img src={articles[0].image_url} className="w-100 h-100 object-fit-cover" alt="headline" />
                <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.95))' }}>
                  <span className="badge bg-danger rounded-0 mb-2 px-3 py-2">BREAKING NEWS</span>
                  <h2 className="text-white fw-bold mb-2">{articles[0].title}</h2>
                  <p className="text-light opacity-75 d-none d-md-block small">{articles[0].description?.slice(0, 160)}...</p>
                  <a href={articles[0].link} target="_blank" rel="noreferrer" className="btn btn-danger btn-sm px-4 mt-2 rounded-0 fw-bold">READ FULL STORY</a>
                </div>
              </div>
            </div>
            
            {/* 5. TRENDING SIDEBAR */}
            <div className="col-lg-4">
              <h5 className="fw-bold border-bottom border-3 border-danger pb-2 mb-3">TOP TRENDING</h5>
              <div className="d-flex flex-column gap-3">
                {articles.slice(1, 5).map((news, i) => (
                  <div key={i} className="d-flex gap-3 align-items-start p-2 bg-white rounded shadow-sm border-start border-danger border-3 hover-shadow">
                     <img src={news.image_url} className="rounded" style={{width: '80px', height: '80px', objectFit: 'cover'}} alt="trending" />
                     <h6 className="fw-bold mb-0" style={{fontSize: '12px', lineHeight: '1.4'}}>{news.title?.slice(0, 60)}...</h6>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-dark text-white rounded text-center small fw-bold">
                 ADVERTISEMENT SPACE
              </div>
            </div>
          </div>
        ) : !loading && <div className="text-center py-5"><h3>No data available for "{activeTab}".</h3></div>}

        {/* 6. CATEGORY GRID SECTION */}
        <div className="row mt-5">
           <div className="col-12 mb-4 d-flex justify-content-between align-items-center border-bottom border-2 pb-2">
              <h3 className="fw-bolder mb-0 text-uppercase text-dark" style={{letterSpacing: '1px'}}>
                <i className="fa fa-map-marker-alt text-danger me-2"></i>{activeTab} Sector Feed
              </h3>
              <span className="text-muted small fw-bold">LIVE UPDATES</span>
           </div>
           
           {loading ? (
             <div className="text-center w-100 py-5">
               <div className="spinner-border text-danger mb-3" role="status"></div>
               <p className="fw-bold text-secondary">SYNCING WITH DATA SERVERS...</p>
             </div>
           ) : (
             <div className="row g-4">
               {articles.slice(5, 17).map((news, idx) => (
                 <div className="col-lg-4 col-md-6" key={idx}>
                   <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all">
                     <img src={news.image_url} className="card-img-top" style={{height: '210px', objectFit: 'cover'}} alt="grid" />
                     <div className="card-body bg-white">
                        <small className="text-danger fw-bold d-block mb-2" style={{fontSize: '10px', letterSpacing: '1px'}}>{news.source_id?.toUpperCase()}</small>
                        <h6 className="fw-bold mb-3" style={{lineHeight: '1.6', height: '3.2rem', overflow: 'hidden'}}>{news.title}</h6>
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                           <small className="text-muted">{new Date(news.pubDate).toLocaleDateString()}</small>
                           <a href={news.link} target="_blank" rel="noreferrer" className="text-danger fw-bold small text-decoration-none">DETAILS →</a>
                        </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </main>

      {/* 9. STRONG FOOTER */}
      <footer className="bg-dark text-white mt-5 py-5 border-top border-danger border-5">
         <div className="container">
            <div className="row g-4">
               <div className="col-md-5">
                  <h3 className="fw-bold">BHARAT<span className="text-danger">TIMES</span></h3>
                  <p className="text-secondary small mt-3 pe-md-5">
                    Bharat Times is a premium AI-driven news aggregator platform. 
                    We provide real-time updates from Agra and across India with a focus on data integrity.
                  </p>
               </div>
               <div className="col-md-3">
                  <h6 className="fw-bold text-uppercase small mb-4">Quick Links</h6>
                  <ul className="list-unstyled text-secondary small d-grid gap-2">
                    <li>Politics</li><li>Agra Local</li><li>National News</li><li>Sports Desk</li>
                  </ul>
               </div>
               <div className="col-md-4">
                  <h6 className="fw-bold text-uppercase small mb-4">Newsletter Signup</h6>
                  <div className="d-flex shadow-sm">
                     <input type="email" className="form-control rounded-0 bg-transparent text-white border-secondary" placeholder="Email Address" />
                     <button className="btn btn-danger rounded-0 px-4 fw-bold">GO</button>
                  </div>
               </div>
            </div>
            <hr className="border-secondary mt-5" />
            <div className="text-center small text-secondary opacity-75">
               © 2026 BHARAT TIMES | AGRA SECTOR 7, UP, INDIA | POWERED BY NEWSDATA.IO
            </div>
         </div>
      </footer>
    </div>
  );
}

export default App;