export default function BlogReplyForm() {
    return (
      <div className="col-12">
        <div className="reply">
          <div className="reply-head">
            <h2 className="reply-title">Leave a Comment</h2>
            <form className="form" action="#">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="form-group">
                    <label>Your Name<span>*</span></label>
                    <input type="text" name="name" required />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="form-group">
                    <label>Your Email<span>*</span></label>
                    <input type="email" name="email" required />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label>Your Message<span>*</span></label>
                    <textarea name="message" required></textarea>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group button">
                    <button type="submit" className="btn">Post comment</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }