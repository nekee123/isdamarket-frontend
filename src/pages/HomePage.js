import { Link } from "react-router-dom";
import "./Page.css";

function HomePage() {
  return (
    <div className="homepage">
      <h1 className="title">🐟 IsdaMarket</h1>
      <p>Fresh catch, direct from the fishermen to you!</p>
      <div className="buttons">
        <Link to="/buyer-login">
          <button className="btn buyer-btn">I’m a Buyer</button>
        </Link>
        <Link to="/seller-login">
          <button className="btn seller-btn">I’m a Seller</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
