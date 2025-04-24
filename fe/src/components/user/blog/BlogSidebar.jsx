import React from 'react';

export default function BlogSidebar() {
  return (
    <div className="main-sidebar">
      <div className="single-widget search">
        <div className="form">
          <input type="email" placeholder="Search Here..." />
          <a className="button" href="#"><i className="fa fa-search"></i></a>
        </div>
      </div>
      <div className="single-widget category">
        <h3 className="title">Blog Categories</h3>
        <ul className="categor-list">
          <li><a href="#">Men's Apparel</a></li>
          <li><a href="#">Women's Apparel</a></li>
          <li><a href="#">Bags Collection</a></li>
          <li><a href="#">Accessories</a></li>
          <li><a href="#">Sun Glasses</a></li>
        </ul>
      </div>
      <div className="single-widget recent-post">
        <h3 className="title">Recent post</h3>
        {[1, 2, 3].map((_, index) => (
          <div className="single-post" key={index}>
            <div className="image">
              <img src="https://via.placeholder.com/100x100" alt="#" />
            </div>
            <div className="content">
              <h5><a href="#">Top 10 Beautiful Women Dress in the world</a></h5>
              <ul className="comment">
                <li><i className="fa fa-calendar"></i>Jan 11, 2020</li>
                <li><i className="fa fa-commenting-o"></i>35</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="single-widget side-tags">
        <h3 className="title">Tags</h3>
        <ul className="tag">
          <li><a href="#">business</a></li>
          <li><a href="#">wordpress</a></li>
          <li><a href="#">html</a></li>
          <li><a href="#">multipurpose</a></li>
          <li><a href="#">education</a></li>
          <li><a href="#">template</a></li>
          <li><a href="#">Ecommerce</a></li>
        </ul>
      </div>
      <div className="single-widget newsletter">
        <h3 className="title">Newsletter</h3>
        <div className="letter-inner">
          <h4>Subscribe & get news <br /> latest updates.</h4>
          <div className="form-inner">
            <input type="email" placeholder="Enter your email" />
            <a href="#">Submit</a>
          </div>
        </div>
      </div>
    </div>
  );
}
