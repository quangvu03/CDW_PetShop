import React from 'react';

export default function BlogComments() {
  return (
    <div className="col-12">
      <div className="comments">
        <h3 className="comment-title">Comments (3)</h3>
        <div className="single-comment">
          <img src="https://via.placeholder.com/80x80" alt="#" />
          <div className="content">
            <h4>Alisa harm <span>At 8:59 pm On Feb 28, 2018</span></h4>
            <p>Enthusiastically leverage existing premium quality vectors...</p>
            <div className="button">
              <a href="#" className="btn"><i className="fa fa-reply"></i>Reply</a>
            </div>
          </div>
        </div>
        <div className="single-comment left">
          <img src="https://via.placeholder.com/80x80" alt="#" />
          <div className="content">
            <h4>john deo <span>Feb 28, 2018 at 8:59 pm</span></h4>
            <p>Phosfluorescently leverage others enterprisee...</p>
            <div className="button">
              <a href="#" className="btn"><i className="fa fa-reply"></i>Reply</a>
            </div>
          </div>
        </div>
        <div className="single-comment">
          <img src="https://via.placeholder.com/80x80" alt="#" />
          <div className="content">
            <h4>megan mart <span>Feb 28, 2018 at 8:59 pm</span></h4>
            <p>Phosfluorescently leverage others enterprisee...</p>
            <div className="button">
              <a href="#" className="btn"><i className="fa fa-reply"></i>Reply</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
