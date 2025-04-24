import React from 'react';

export default function Payment() {
  return (
      <section className="container" style={{ marginTop: '100px', marginBottom: '100px' }}>
        <form action="" method="POST">
          <input type="hidden" name="vnp_Amount" value="" />
          <button type="submit" className="btn btn-primary">
            Thanh Toán
          </button>
        </form>
      </section>
  );
}
