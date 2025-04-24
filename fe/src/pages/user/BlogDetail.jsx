import React from 'react';
import BlogComments from '../../components/user/blog/BlogComments';
import BlogReplyForm from '../../components/user/blog/BlogReplyForm';
import BlogSidebar from '../../components/user/blog/BlogSidebar';

export default function BlogDetail() {
  return (
    <div className="blog-single section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-12">
            <div className="blog-single-main">
              <div className="row">
                <div className="col-12">
                  <div className="image">
                    <img src="https://via.placeholder.com/950x460" alt="#" />
                  </div>
                  <div className="blog-detail">
                    <h2 className="blog-title">What are the secrets to start-up success?</h2>
                    <div className="blog-meta">
                      <span className="author">
                        <a href="#"><i className="fa fa-user"></i>By Admin</a>
                        <a href="#"><i className="fa fa-calendar"></i>Dec 24, 2018</a>
                        <a href="#"><i className="fa fa-comments"></i>Comment (15)</a>
                      </span>
                    </div>
                    <div className="content">
                      <p>What a crazy time. I have five children in college or pursuing postgraduate studies...</p>
                      <blockquote>
                        <i className="fa fa-quote-left"></i> Do what you love to do and give it your very best...
                      </blockquote>
                      <p>While I miss being with my older children, I know that a college experience can be the source of great growth...</p>
                    </div>
                  </div>
                  <div className="share-social">
                    <div className="row">
                      <div className="col-12">
                        <div className="content-tags">
                          <h4>Tags:</h4>
                          <ul className="tag-inner">
                            <li><a href="#">Glass</a></li>
                            <li><a href="#">Pant</a></li>
                            <li><a href="#">t-shirt</a></li>
                            <li><a href="#">sweater</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <BlogComments />
                <BlogReplyForm />
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-12">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
