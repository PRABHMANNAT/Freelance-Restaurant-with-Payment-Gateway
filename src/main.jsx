import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Menu as MenuIcon,
  Search,
  Leaf,
  Flame,
  Star,
  Clock,
  Truck,
  Heart,
  Utensils,
  MapPin,
  Instagram,
  Check,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  LoaderCircle,
  Trash2,
  MessageCircle,
  Table2,
  RotateCcw,
  LockKeyhole,
} from "lucide-react";
import { menu, categories, photos, restaurant, sampleReviews } from "./data";
import {
  STORAGE_KEY,
  emptyCustomer,
  sampleCustomer,
  calculateTotals,
  validateCustomer,
  createOrder,
  addOrderOnce,
  readSaved,
  money,
  itemText,
  notification,
  deliveryConfig,
} from "./domain";
import "./styles.css";

const routes = [
  "home",
  "about",
  "menu",
  "reviews",
  "gallery",
  "contact",
  "checkout",
  "confirmation",
  "dashboard",
];
function currentRoute() {
  const r = location.hash.slice(1).split("?")[0];
  return routes.includes(r) ? r : "home";
}
function Image({ src, alt, ...props }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed ? photos.hero : src}
      alt={alt}
      {...props}
      onError={() => setFailed(true)}
    />
  );
}
function CheckoutHeader({ navigate, disabled }) {
  return (
    <header className="checkout-header">
      <a href="#home" className="brand" aria-label="Kale Da Dhaba home" onClick={(e) => disabled && e.preventDefault()}>
        <img src={photos.logo} alt="Kale Da Dhaba logo" />
        <span>KALE DA DHABA<small>{restaurant.tagline}</small></span>
      </a>
      <div>
        <button className="text-button" disabled={disabled} onClick={() => navigate("menu")}>
          <ArrowLeft size={17} /> Back to menu
        </button>
        <span className="demo-pill">Demo</span>
      </div>
    </header>
  );
}
function App() {
  const [saved, setSaved] = useState(readSaved),
    [route, setRoute] = useState(currentRoute),
    [cartOpen, setCartOpen] = useState(false),
    [mobileNav, setMobileNav] = useState(false),
    [toast, setToast] = useState(""),
    [storageError, setStorageError] = useState(false),
    [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const toastTimer = useRef();
  const hasMounted = useRef(false);
  useEffect(() => {
    const handler = () => {
      const nextRoute = currentRoute();
      if (checkoutProcessing && nextRoute !== "checkout") {
        location.hash = "checkout";
        return;
      }
      setRoute(nextRoute);
      setMobileNav(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, [checkoutProcessing]);
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const focusRouteHeading = window.setTimeout(() => {
      document.querySelector("#main-content h1")?.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(focusRouteHeading);
  }, [route]);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [saved]);
  function notify(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  }
  function navigate(to, force = false) {
    if (checkoutProcessing && !force && to !== "checkout") return;
    if (route === to) window.scrollTo({ top: 0, behavior: "smooth" });
    location.hash = to;
    setMobileNav(false);
  }
  const items = menu
    .filter((d) => saved.cart[d.id] > 0)
    .map((d) => ({ ...d, quantity: saved.cart[d.id] }));
  const count = items.reduce((s, i) => s + i.quantity, 0),
    totals = calculateTotals(items);
  function change(id, delta) {
    setSaved((s) => {
      const n = Math.max(0, Math.min(30, (s.cart[id] || 0) + delta));
      const cart = { ...s.cart };
      if (n) cart[id] = n;
      else delete cart[id];
      return { ...s, cart };
    });
  }
  function add(id) {
    change(id, 1);
    notify("A little deliciousness added to your bag.");
  }
  function remove(id) {
    setSaved((s) => {
      const cart = { ...s.cart };
      delete cart[id];
      return { ...s, cart };
    });
  }
  function checkout() {
    setCartOpen(false);
    navigate("checkout");
  }
  function complete(order) {
    setCheckoutProcessing(false);
    setSaved((s) => addOrderOnce(s, order));
    setSelectedOrder(order.id);
    navigate("confirmation", true);
  }
  const order =
    saved.orders.find((o) => o.id === selectedOrder) || saved.orders[0];
  const common = {
    navigate,
    items,
    count,
    totals,
    change,
    add,
    cart: saved.cart,
  };
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      {route !== "checkout" && <div className="announcement">
        <span>
          GOOD FOOD. GREAT COMPANY.{" "}
          <span className="announcement-extra">A LITTLE PUNJABI LOVE.</span>
        </span>
        <span className="demo-pill">Demo mode</span>
      </div>}
      {route === "checkout" ? <CheckoutHeader navigate={navigate} disabled={checkoutProcessing} /> : <header className="header">
        <a href="#home" className="brand" aria-label="Kale Da Dhaba home">
          <img src={photos.logo} alt="Kale Da Dhaba logo" />
          <span>
            KALE DA DHABA<small>{restaurant.tagline}</small>
          </span>
        </a>
        <nav
          aria-label="Main navigation"
          className={mobileNav ? "nav open" : "nav"}
        >
          {[
            ["home", "Home"],
            ["about", "About Us"],
            ["menu", "Menu"],
            ["reviews", "Reviews"],
            ["gallery", "Gallery"],
            ["contact", "Contact"],
          ].map(([to, label]) => (
            <a
              key={to}
              href={`#${to}`}
              aria-current={route === to ? "page" : undefined}
              onClick={() => setMobileNav(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="cart-trigger"
            aria-label={`Cart, ${count} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={19} />
            <span className="cart-label">Cart</span>
            <b>{count}</b>
          </button>
          <button
            className="button small nav-order"
            onClick={() => navigate("menu")}
          >
            Order online <ArrowUpRight size={16} />
          </button>
          <button
            className="icon-button mobile-toggle"
            aria-label={mobileNav ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileNav}
            onClick={() => setMobileNav(!mobileNav)}
          >
            {mobileNav ? <X /> : <MenuIcon />}
          </button>
        </div>
      </header>}
      <main id="main-content" tabIndex={-1}>
        {storageError && (
          <p className="storage-warning" role="alert">
            Browser storage is unavailable. Your demo works for this visit, but
            changes may not survive a refresh.
          </p>
        )}
        {route === "home" && <Home {...common} />}
        {route === "menu" && <MenuPage {...common} />}
        {route === "about" && <About navigate={navigate} />}
        {route === "gallery" && <Gallery />}
        {route === "contact" && <Contact navigate={navigate} />}
        {route === "reviews" && (
          <Reviews
            reviews={saved.reviews}
            orders={saved.orders}
            order={order}
            onSubmit={(review) => {
              if (saved.reviews.some((r) => r.orderId === review.orderId))
                return;
              setSaved((s) =>
                s.reviews.some((r) => r.orderId === review.orderId)
                  ? s
                  : { ...s, reviews: [review, ...s.reviews] },
              );
              notify("Thank you! Your review is saved in this demo.");
            }}
          />
        )}
        {route === "checkout" && (
          <Checkout
            {...common}
            customer={saved.customer}
            setCustomer={(customer) => setSaved((s) => ({ ...s, customer }))}
            onComplete={complete}
            onProcessingChange={setCheckoutProcessing}
          />
        )}
        {route === "confirmation" && (
          <Confirmation
            order={order}
            navigate={navigate}
            onUpdateOrder={(id, updates) =>
              setSaved((s) => ({
                ...s,
                orders: s.orders.map((existing) =>
                  existing.id === id ? { ...existing, ...updates } : existing,
                ),
              }))
            }
          />
        )}
        {route === "dashboard" && (
          <Dashboard
            orders={saved.orders}
            reviews={saved.reviews}
            onSelect={(id) => setSelectedOrder(id)}
            onReset={() => {
              setSaved({
                cart: {},
                orders: [],
                reviews: [],
                customer: { ...emptyCustomer },
              });
              setSelectedOrder(null);
              notify("Demo reset. Ready for a fresh walkthrough.");
            }}
          />
        )}
      </main>
      <Footer navigate={navigate} />
      {count > 0 &&
        !cartOpen &&
        !["checkout", "confirmation", "dashboard"].includes(route) && (
          <button
            className="mobile-cart button"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={18} />
            {count} {count === 1 ? "item" : "items"}
            <span>
              · {money(totals.total)} | View cart <ArrowRight size={16} />
            </span>
          </button>
        )}
      {cartOpen && (
        <Cart
          {...common}
          remove={remove}
          onClose={() => setCartOpen(false)}
          checkout={checkout}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {toast}
        </div>
      )}
    </>
  );
}
function Eyebrow({ children }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
function Home(props) {
  const { navigate } = props;
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-kicker">Kale Da Dhaba · Amritsar</p>
          <h1 tabIndex={-1}>Punjabi food. Properly enjoyed.</h1>
          <p className="hero-description">
            Dal, tandoori breads and Punjabi favourites. Explore the menu at
            Kale Da Dhaba, Amritsar.
          </p>
          <div className="hero-buttons">
            <button className="button" onClick={() => navigate("menu")}>
              Order online <ArrowUpRight size={19} />
            </button>
            <button className="text-button" onClick={() => navigate("menu")}>
              View menu <ArrowRight size={18} />
            </button>
          </div>
          <p className="hero-service-note">Dine in · Takeaway · Delivery</p>
        </div>
        <div className="hero-image">
          <Image
            src={photos.hero}
            alt="A generous Punjabi feast of warm kulcha and rich curries"
            fetchPriority="high"
          />
          <div className="hero-stamp" aria-hidden="true">
            <span>Kale Da Dhaba</span>
            <small>Amritsar</small>
          </div>
        </div>
      </section>
      <section className="section favourites home-featured">
        <div className="section-heading">
          <div>
            <p className="section-label">Featured dishes</p>
            <h2>Made for a proper meal.</h2>
            <p>
              A few Punjabi favourites to begin with. Build the rest of your
              table from the full menu.
            </p>
          </div>
          <button className="text-button" onClick={() => navigate("menu")}>
            View Full Menu <ArrowUpRight size={19} />
          </button>
        </div>
        <div className="food-grid featured-grid">
          {menu.filter((d) => ["dal", "chicken", "kulcha"].includes(d.id)).map((d) => (
            <FoodCard key={d.id} dish={d} {...props} />
          ))}
        </div>
        <p className="demo-note">
          Sample dishes and prices for demonstration. Food photography is
          illustrative.
        </p>
      </section>
      <section className="home-story home-about">
        <div className="story-photo">
          <Image
            src={photos.story}
            alt="A freshly buttered kulcha ready to be served"
            loading="lazy"
          />
          <span className="photo-note">From the tandoor to the table</span>
        </div>
        <div className="story-copy">
          <p className="section-label">About Kale Da Dhaba</p>
          <h2>Made for the table.</h2>
          <p>{restaurant.story}</p>
          <button className="text-button" onClick={() => navigate("about")}>
            About Kale Da Dhaba <ArrowUpRight size={19} />
          </button>
        </div>
      </section>
      <section className="section review-preview">
        <p className="section-label">Customer notes</p>
        <h2>Good food gets people talking.</h2>
        <div className="review-stage">
          <div className="review-grid">
            {sampleReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
        <button
          className="text-button centered"
          onClick={() => navigate("reviews")}
        >
          Read all reviews <ArrowUpRight size={18} />
        </button>
      </section>
      <section className="home-visit" aria-labelledby="visit-heading">
        <div>
          <p className="section-label">Visit</p>
          <h2 id="visit-heading">Come by when the table calls.</h2>
        </div>
        <div className="visit-details">
          <MapPin size={20} aria-hidden="true" />
          <p>
            <strong>{restaurant.location}</strong>
            <span>{restaurant.visit.address}</span>
          </p>
          <a className="text-button" href="#contact">Visit details <ArrowUpRight size={18} /></a>
        </div>
      </section>
      <OrderBanner navigate={navigate} />
    </>
  );
}
function FoodCard({ dish: d, cart, add, change, showTag = true }) {
  const q = cart[d.id] || 0;
  return (
    <article className="food-card">
      <div className="food-image">
        <Image src={d.image} alt={d.name} loading="lazy" />
        {showTag && d.tag && <span className="food-tag">{d.tag}</span>}
        <span
          className={`diet-mark ${d.veg ? "veg" : "nonveg"}`}
          aria-label={d.veg ? "Vegetarian" : "Non-vegetarian"}
          title={d.veg ? "Vegetarian" : "Non-vegetarian"}
        >
          <span />
        </span>
      </div>
      <div className="food-content">
        <span className="food-category">{d.category}</span>
        <h3>{d.name}</h3>
        <p>{d.description}</p>
        <div className="food-bottom">
          <strong>{money(d.price)}</strong>
          {q ? (
            <Quantity
              name={d.name}
              quantity={q}
              onChange={(delta) => change(d.id, delta)}
            />
          ) : (
            <button
              className="add-button"
              onClick={() => add(d.id)}
              aria-label={`Add ${d.name} to cart`}
            >
              Add to bag <Plus size={15} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
function Quantity({ name, quantity, onChange }) {
  return (
    <div className="quantity">
      <button
        aria-label={`Decrease ${name} quantity`}
        onClick={() => onChange(-1)}
      >
        <Minus size={14} />
      </button>
      <span aria-live="polite">{quantity}</span>
      <button
        disabled={quantity >= 30}
        aria-label={`Increase ${name} quantity`}
        onClick={() => onChange(1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
function MenuPage(props) {
  const [category, setCategory] = useState("All dishes"),
    [diet, setDiet] = useState("All"),
    [query, setQuery] = useState("");
  const filtered = menu.filter(
    (d) =>
      (category === "All dishes" || category === d.category) &&
      (diet === "All" || (diet === "Veg") === d.veg) &&
      d.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <section className="menu-intro">
        <h1 tabIndex={-1}>What are you having?</h1>
        <p>Choose your dishes. Build your order.</p>
      </section>
      <section className="section menu-section">
        <div className="menu-toolbar">
          <label className="search">
            <Search size={19} />
            <input
              aria-label="Search by dish name"
              placeholder="What are you craving?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && query) {
                  e.preventDefault();
                  setQuery("");
                }
              }}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X size={17} />
              </button>
            )}
          </label>
          <div className="diet-filters" aria-label="Dietary filters">
            {["All", "Veg", "Non-Veg"].map((x) => (
              <button
                key={x}
                aria-pressed={diet === x}
                className={diet === x ? "active" : ""}
                onClick={() => setDiet(x)}
              >
                {x === "Veg" && <Leaf size={15} />} {x}
              </button>
            ))}
          </div>
        </div>
        <div className="menu-category-wrap">
          <div className="category-tabs" aria-label="Menu categories">
            {categories.map((c) => (
              <button
                key={c}
                className={c === category ? "active" : ""}
                aria-pressed={c === category}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="menu-count">
          <span aria-live="polite">{filtered.length} dishes</span>
          <span>{restaurant.menuDisclosure}</span>
        </div>
        {filtered.length ? (
          <div className="food-grid">
            {filtered.map((d) => (
              <FoodCard key={d.id} dish={d} showTag={false} {...props} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={36} />
            <h2>No dishes found</h2>
            <p>Try a different craving or clear your filters.</p>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setDiet("All");
                setCategory("All dishes");
              }}
            >
              Reset menu
            </button>
          </div>
        )}
      </section>
      <OrderBanner navigate={props.navigate} />
    </>
  );
}
function About({ navigate }) {
  return (
    <>
      <section className="about-intro">
        <p className="section-label">About</p>
        <h1 tabIndex={-1}>A table in Amritsar.</h1>
        <p>{restaurant.about.interimIntroduction}</p>
      </section>
      <section className="about-editorial">
        <figure className="about-photo">
          <Image
            src={photos.story}
            alt="Close-up of a buttered kulcha served on a plate"
            loading="lazy"
          />
          <figcaption>
            Current permitted food photograph. A kitchen, team or frontage
            photograph is awaiting owner approval.
          </figcaption>
        </figure>
        <div className="about-copy">
          <p>
            The current demo can introduce Kale Da Dhaba as a Punjabi restaurant
            in Amritsar. It does not yet make claims about the restaurant’s
            founding, team, recipes or kitchen practice.
          </p>
          <p>
            Once the owner supplies an approved history and image, this space can
            hold a factual story of the restaurant and its table.
          </p>
          <button className="button" onClick={() => navigate("menu")}>
            Explore the menu <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </>
  );
}
function Gallery() {
  const gallery = [
    ["022214.webp", "A proper Punjabi feast"],
    ["022124.webp", "For the love of cheese"],
    ["022037.webp", "A refreshing little pause"],
    ["022118.webp", "Crunch into happiness"],
    ["022258.webp", "Butter makes it better"],
    ["022017.webp", "Big flavours, all wrapped up"],
  ];
  return (
    <>
      <section className="page-intro">
        <Eyebrow>A FEAST FOR YOUR FEED</Eyebrow>
        <h1 tabIndex={-1}>
          First, we eat <em>with our eyes.</em>
        </h1>
        <p>A little glimpse of the good things from our kitchen.</p>
      </section>
      <section className="section gallery-grid">
        {gallery.map(([image, title]) => (
          <figure key={image}>
            <Image
              src={`${import.meta.env.BASE_URL}assets/${image}`}
              alt={title}
              loading="lazy"
            />
            <figcaption>
              {title}
              <ArrowUpRight size={18} />
            </figcaption>
          </figure>
        ))}
      </section>
      <div className="gallery-social">
        <Instagram />
        <p>More flavour, fresh from our feed.</p>
        <a
          className="text-button"
          href={restaurant.instagram}
          target="_blank"
          rel="noreferrer"
        >
          @kaledadhaba <ArrowUpRight size={18} />
        </a>
      </div>
    </>
  );
}
function Contact({ navigate }) {
  return (
    <>
      <section className="page-intro">
        <Eyebrow>THERE’S ALWAYS ROOM AT OUR TABLE</Eyebrow>
        <h1 tabIndex={-1}>
          Come for a bite.
          <br />
          <em>Stay a little longer.</em>
        </h1>
        <p>Dine in, take away, or enjoy a little Punjabi comfort at home.</p>
      </section>
      <section className="section contact-grid">
        <div className="contact-image">
          <Image src={photos.hero} alt="A Punjabi meal to share" />
        </div>
        <div className="contact-info">
          <h2>
            Let’s get <em>together.</em>
          </h2>
          {[
            [MapPin, "Find us", restaurant.visit.address],
            [Smartphone, "Give us a call", restaurant.visit.phone],
            [Clock, "Opening hours", restaurant.visit.hours],
          ].map(([Icon, title, text]) => (
            <div className="contact-row" key={title}>
              <Icon />
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </div>
          ))}
          <a
            className="text-button"
            href={restaurant.instagram}
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={19} /> Follow @kaledadhaba{" "}
            <ArrowUpRight size={17} />
          </a>
          <p className="demo-note">
            Contact details are placeholders awaiting restaurant verification.
          </p>
          <button className="button" onClick={() => navigate("menu")}>
            Order a little happiness <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </>
  );
}
function ReviewCard({ review: r }) {
  const ratingLabel = `${r.rating} ${r.rating === 1 ? "star" : "stars"}`;
  const metadata = r.sample
    ? "Example review · Demo content"
    : `Demo order · ${new Date(r.timestamp).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
  return (
    <article className="review-card">
      <div className="stars" aria-label={`${ratingLabel} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={16}
            fill={n <= r.rating ? "currentColor" : "none"}
          />
        ))}
      </div>
      <blockquote>“{r.text}”</blockquote>
      <div className="review-author">
        <div>
          <strong>{r.name}</strong>
          <small>{metadata}</small>
        </div>
      </div>
    </article>
  );
}
function Reviews({ reviews, orders, order, onSubmit }) {
  const [rating, setRating] = useState(null),
    [text, setText] = useState(""),
    [done, setDone] = useState(false),
    [error, setError] = useState("");
  const eligible = orders.filter(
    (o) =>
      o.deliveryStatus === "Delivered — simulated" &&
      !reviews.some((r) => r.orderId === o.id),
  );
  const chosen = eligible.find((o) => o.id === order?.id) || eligible[0];
  function chooseRating(event, value) {
    const keys = ["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 1 : event.key === "End" ? 5 : Math.min(5, Math.max(1, value + (event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : -1)));
    setRating(next);
    document.getElementById(`rating-${next}`)?.focus();
  }
  function submit(e) {
    e.preventDefault();
    if (!chosen) return;
    if (!rating) {
      setError("Choose a rating before submitting.");
      return;
    }
    if (text.trim().length < 5) {
      setError("Tell us a little more — at least 5 characters.");
      return;
    }
    onSubmit({
      id: crypto.randomUUID(),
      orderId: chosen.id,
      name: chosen.customer.name,
      rating,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    });
    setDone(true);
    setText("");
    setRating(null);
    setError("");
  }
  return (
    <>
      <section className="page-intro reviews-intro">
        <h1 tabIndex={-1}>From our guests.</h1>
        <p>Example reviews are shown for this presentation. New feedback stays in this local demo.</p>
      </section>
      <section className="section reviews-page">
        <div className="review-grid">
          {[...reviews, ...sampleReviews].map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
        <div className="review-form-wrap">
          <div>
            <h2>How was your meal?</h2>
            <p>Your feedback is linked to this delivered demo order and saved only in this browser.</p>
          </div>
          {done ? (
            <div className="success-panel" role="status">
              <CheckCircle2 size={36} />
              <h3>Feedback saved</h3>
              <p>Thanks for sharing your feedback. It is saved only in this local demo.</p>
            </div>
          ) : chosen ? (
            <form onSubmit={submit} className="review-form">
              <p className="review-order-reference">For demo order <strong>{chosen.id}</strong></p>
              <fieldset>
                <legend>Your rating <span aria-hidden="true">(required)</span></legend>
                <div className="rating-picker" role="radiogroup" aria-label="Your rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      id={`rating-${n}`}
                      role="radio"
                      aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                      aria-checked={rating === n}
                      tabIndex={rating === null ? (n === 1 ? 0 : -1) : rating === n ? 0 : -1}
                      onClick={() => setRating(n)}
                      onKeyDown={(event) => chooseRating(event, n)}
                    >
                      <Star
                        fill={n <= rating ? "currentColor" : "none"}
                        size={30}
                      />
                    </button>
                  ))}
                </div>
              </fieldset>
              <label>
                Your review
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={700}
                  placeholder="Tell us what worked well and what we could improve."
                  aria-describedby={error ? "review-error" : undefined}
                />
              </label>
              {error && (
                <p id="review-error" className="error" role="alert">
                  {error}
                </p>
              )}
              <button className="button">
                Submit Review <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <div className="success-panel">
              <Heart size={32} />
              <h3>
                {orders.some((o) => o.deliveryStatus === "Delivered — simulated")
                  ? "You’re all caught up."
                  : "A delivered demo order is needed."}
              </h3>
              <p>
                {orders.some((o) => o.deliveryStatus === "Delivered — simulated")
                  ? "Each delivered demo order can receive one review."
                  : "Open a demo order confirmation and use Simulate delivered before leaving feedback."}
              </p>
              {!orders.length && <a className="button" href="#menu">Explore Menu <ArrowRight size={18} /></a>}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function OrderBanner({ navigate }) {
  return (
    <section className="order-banner">
      <div>
        <p className="section-label">Order online</p>
        <h2>Your favourites are ready when you are.</h2>
      </div>
      <button className="button cream" onClick={() => navigate("menu")}>
        Let’s Order <ArrowUpRight size={20} />
      </button>
    </section>
  );
}
function Footer({ navigate }) {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <a href="#home" className="brand">
            <img src={photos.logo} alt="Kale Da Dhaba logo" />
            <span>
              KALE DA DHABA<small>TASTE YOU TRUST</small>
            </span>
          </a>
          <p>
            Punjabi flavours, shared with generous hospitality in {restaurant.location}.
          </p>
          <a
            className="social-link"
            href={restaurant.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Kale Da Dhaba on Instagram"
          >
            <Instagram size={20} />
          </a>
        </div>
        <div>
          <h4>Restaurant</h4>
          <a href="#about">Our story</a>
          <a href="#menu">Explore menu</a>
          <a href="#reviews">Reviews</a>
          <a href="#gallery">Gallery</a>
        </div>
        <div>
          <h4>Visit</h4>
          <p>{restaurant.visit.address}</p>
          <p>{restaurant.visit.phone}</p>
          <p>{restaurant.visit.hours}</p>
          <a href="#contact">
            Contact details <ArrowUpRight size={14} />
          </a>
        </div>
        <div>
          <h4>Order</h4>
          <a href="#menu">Order online</a>
          <a href="#contact">Dine in & takeaway</a>
          <p>{restaurant.services}</p>
          <span className="footer-demo">
            {restaurant.authoring.demoDisclosure}
            <br />No real orders, payments or messages are sent.
          </span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Kale Da Dhaba · Client presentation demo
        </span>
        <button onClick={() => navigate("dashboard")}>
          Demo Dashboard <ArrowUpRight size={13} />
        </button>
        <span>Made for good food & good company.</span>
        <a href={`${import.meta.env.BASE_URL}credits.html`}>Asset credits</a>
      </div>
    </footer>
  );
}
function Cart({
  items,
  count,
  totals,
  change,
  remove,
  onClose,
  checkout,
  navigate,
}) {
  const panel = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    const background = [...document.getElementById("root").children].filter(
      (el) =>
        !el.classList.contains("modal-backdrop") &&
        !el.classList.contains("toast"),
    );
    background.forEach((el) => {
      el.inert = true;
    });
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = panel.current.querySelectorAll(
          'button,a,input,[tabindex="0"]',
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === panel.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      background.forEach((el) => {
        el.inert = false;
      });
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <aside
        className="cart-panel"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-header">
          <h2 id="cart-heading">Your order <small>({count})</small></h2>
          <button
            className="icon-button"
            aria-label="Close cart"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {items.length ? (
          <>
            <p className="delivery-notice">
              <Truck size={17} /> Demo delivery is {money(deliveryConfig.fee)} below {money(deliveryConfig.freeDeliveryThreshold)}; free from {money(deliveryConfig.freeDeliveryThreshold)}.
            </p>
            <div className="cart-items">
              {items.map((i) => (
                <article className="cart-item" key={i.id}>
                  <Image src={i.image} alt={i.name} />
                  <div>
                    <h3>{i.name}</h3>
                    <p>Unit price · {money(i.price)}</p>
                    <Quantity
                      name={i.name}
                      quantity={i.quantity}
                      onChange={(d) => change(i.id, d)}
                    />
                  </div>
                  <div className="cart-item-end">
                    <button
                      className="icon-button"
                      aria-label={`Remove ${i.name}`}
                      onClick={() => remove(i.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <strong>{money(i.price * i.quantity)}</strong>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-checkout">
              <Totals totals={totals} />
              <button className="button full" onClick={checkout}>
                Checkout · {money(totals.total)} <ArrowRight size={18} />
              </button>
              <button className="text-button cart-continue" onClick={onClose}>
                Continue choosing
              </button>
              <p className="demo-note centered">
                <ShieldCheck size={14} /> Demo order only. No money charged.
              </p>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <ShoppingBag size={46} />
            <h2>Your cart is empty.</h2>
            <p>Find something you fancy on the menu.</p>
            <button
              className="button"
              onClick={() => {
                onClose();
                navigate("menu");
              }}
            >
              Browse menu <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
function Totals({ totals }) {
  return (
    <div className="totals">
      <div>
        <span>Subtotal</span>
        <span>{money(totals.subtotal)}</span>
      </div>
      <div>
        <span>
          Delivery charge <small>(demo)</small>
        </span>
        <span>{totals.delivery ? money(totals.delivery) : "FREE"}</span>
      </div>
      <div className="grand-total">
        <strong>Total</strong>
        <strong>{money(totals.total)}</strong>
      </div>
    </div>
  );
}
function OrderSummary({ items, totals, onEditCart }) {
  return (
    <aside className="order-summary">
      <div className="summary-heading">
        <h3>Your order</h3>
        {onEditCart && <button className="text-button" onClick={onEditCart}>Edit cart</button>}
      </div>
      {items.map((i) => (
        <div className="summary-item" key={i.id}>
          <Image src={i.image} alt={i.name} />
          <div>
            <strong>{i.name}</strong>
            <small>Quantity: {i.quantity}</small>
          </div>
          <span>{money(i.price * i.quantity)}</span>
        </div>
      ))}
      <Totals totals={totals} />
      <p className="demo-note">
        <Truck size={16} /> 35–45 min · Illustrative demo estimate
      </p>
      <p className="demo-note">
        Sample prices, inclusive of demo taxes. Free demo delivery on orders of
        ₹799 or more.
      </p>
    </aside>
  );
}
function Checkout({
  items,
  totals,
  customer,
  setCustomer,
  onComplete,
  navigate,
  onProcessingChange,
}) {
  const [step, setStep] = useState(1),
    [errors, setErrors] = useState({}),
    [method, setMethod] = useState("COD"),
    [paymentState, setPaymentState] = useState("idle");
  const processing = paymentState === "processing";
  const locked = useRef(false),
    timer = useRef(),
    orderId = useRef(
      `KDD-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
    );
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    onProcessingChange(processing);
    return () => onProcessingChange(false);
  }, [processing, onProcessingChange]);
  function next(e) {
    e.preventDefault();
    const errs = validateCustomer(customer);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`field-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function pay(outcome = "succeeded") {
    if (locked.current || !items.length) return;
    const errs = validateCustomer(customer);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setStep(1);
      return;
    }
    const snapshot = createOrder(items, customer, method, orderId.current);
    locked.current = true;
    setPaymentState("processing");
    timer.current = setTimeout(() => {
      if (outcome !== "succeeded") {
        setPaymentState(outcome);
        locked.current = false;
        return;
      }
      setPaymentState("succeeded");
      onComplete(snapshot);
    }, 1100);
  }
  function chooseAnotherMethod() {
    locked.current = false;
    setPaymentState("idle");
  }
  if (!items.length)
    return (
      <section className="section empty-state">
        <ShoppingBag size={44} />
        <h1 tabIndex={-1}>
          Your bag is <em>waiting.</em>
        </h1>
        <p>Add your favourites before checking out.</p>
        <button className="button" onClick={() => navigate("menu")}>
          Explore Menu <ArrowRight size={18} />
        </button>
      </section>
    );
  const fieldGroups = [
    { title: "Contact details", fields: [["name", "Full name", "text", true, "Your full name", "name"], ["phone", "Phone number", "tel", true, "10-digit mobile number", "tel"], ["alternate", "Alternate phone", "tel", false, "Optional", "tel"], ["email", "Email address", "email", false, "Optional", "email"]] },
    { title: "Address", fields: [["address", "House and street", "textarea", true, "House number and street", "street-address"], ["locality", "Locality and city", "text", true, "Locality, city", "address-level2"], ["pincode", "Pincode", "text", true, "6-digit pincode", "postal-code"], ["landmark", "Landmark", "text", false, "Optional", ""]] },
    { title: "Kitchen instructions", fields: [["instructions", "Instructions", "textarea", false, "Anything we should know?", ""]] },
  ];
  return (
    <section className="section checkout-page">
      <button
        className="text-button"
        disabled={processing}
        onClick={() => (step === 2 ? setStep(1) : navigate("menu"))}
      >
        <ArrowLeft size={17} />{" "}
        {step === 2 ? "Back to delivery details" : "Back to menu"}
      </button>
      <div className="checkout-title">
        <h1 tabIndex={-1}>Delivery details</h1>
      </div>
      <ol className="steps">
        <li className="active">
          <span>{step === 2 ? <Check size={16} /> : 1}</span>Details
        </li>
        <li className={step === 2 ? "active" : ""}>
          <span>2</span>Payment
        </li>
        <li>
          <span>3</span>Confirmation
        </li>
      </ol>
      <details className="checkout-mobile-summary">
        <summary>
          <span>Order summary</span>
          <strong>{money(totals.total)}</strong>
        </summary>
        <OrderSummary
          items={items}
          totals={totals}
          onEditCart={() => navigate("menu")}
        />
      </details>
      <div className="checkout-grid">
        <div className="checkout-form-card">
          {step === 1 ? (
            <form onSubmit={next} noValidate>
              <div className="form-title">
                <h2>Where should we bring it?</h2>
                <button
                  type="button"
                  className="sample-button"
                  onClick={() => {
                    setCustomer({ ...sampleCustomer });
                    setErrors({});
                  }}
                >
                  Fill Sample Details
                </button>
              </div>
              <p className="muted">Use fictional details for this demo. * Required fields. Delivery is available to sample pincodes {Object.keys(deliveryConfig.serviceablePincodes).join(" and ")}.</p>
              {fieldGroups.map((group) => (
                <fieldset className="checkout-field-group" key={group.title}>
                  <legend>{group.title}</legend>
                  <div className="form-grid">
                    {group.fields.map(([key, label, type, required, placeholder, autoComplete]) => (
                      <label className={type === "textarea" ? "wide" : ""} key={key} htmlFor={`field-${key}`}>
                        {label} {required ? <span className="required">*</span> : <span className="optional">(optional)</span>}
                        {type === "textarea" ? (
                          <textarea id={`field-${key}`} value={customer[key]} required={required} placeholder={placeholder} maxLength={500} autoComplete={autoComplete} onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} />
                        ) : (
                          <input id={`field-${key}`} value={customer[key]} type={type} required={required} placeholder={placeholder} inputMode={["phone", "alternate", "pincode"].includes(key) ? "numeric" : undefined} maxLength={["phone", "alternate"].includes(key) ? 10 : key === "pincode" ? 6 : 120} autoComplete={autoComplete} onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} />
                        )}
                        {errors[key] && <span id={`error-${key}`} className="error">{errors[key]}</span>}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <button className="button full">
                Continue to Payment <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <>
              <h2>Choose how to pay</h2>
              <p className="muted">
                Choose how you’d like to pay in this demo.
              </p>
              <div className="delivery-card">
                <MapPin size={20} />
                <div>
                  <strong>{customer.name}</strong>
                  <p>
                    {customer.address}, {customer.locality}, {customer.pincode}
                  </p>
                  <small>{customer.phone}</small>
                </div>
                <button
                  disabled={processing}
                  className="text-button"
                  onClick={() => setStep(1)}
                >
                  Edit
                </button>
              </div>
              <fieldset disabled={processing} className="payment-options">
                <legend>Payment method</legend>
                {[
                  [
                    Banknote,
                    "COD",
                    "Cash on Delivery",
                    "Pay when your food arrives",
                  ],
                  [Smartphone, "UPI", "UPI", "A quick, simulated UPI payment"],
                  [
                    CreditCard,
                    "Card",
                    "Debit / Credit Card",
                    "Fixed test details only",
                  ],
                ].map(([Icon, value, label, desc]) => (
                  <label
                    className={method === value ? "selected" : ""}
                    key={value}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={method === value}
                      onChange={() => {
                        setMethod(value);
                        chooseAnotherMethod();
                      }}
                    />
                    <Icon size={24} />
                    <span>
                      <strong>{label}</strong>
                      <small>{desc}</small>
                    </span>
                    {method === value && <CheckCircle2 size={20} />}
                  </label>
                ))}
              </fieldset>
              {method !== "COD" && (
                <div className="mock-payment">
                  <div className="mock-heading">
                    <LockKeyhole size={17} />
                    <strong>
                      {method === "UPI"
                        ? "UPI payment simulator"
                        : "Card payment simulator"}
                    </strong>
                    <span>TEST MODE</span>
                  </div>
                  {method === "UPI" ? (
                    <div className="mock-upi">
                      <Smartphone size={34} />
                      <strong>Pay {money(totals.total)}</strong>
                      <p>Demo merchant · Kale Da Dhaba</p>
                      <span>demo-customer@mock · Non-payable test ID</span>
                    </div>
                  ) : (
                    <div className="test-card">
                      <div>
                        <span>KALE DA DHABA · TEST CARD</span>
                        <CreditCard size={25} />
                      </div>
                      <strong>4242 4242 4242 4242</strong>
                      <div>
                        <span>DEMO CUSTOMER</span>
                        <span>12/30 · CVC 123</span>
                      </div>
                    </div>
                  )}
                  <p className="demo-note">
                    Fixed test details. No real payment information is
                    collected.
                  </p>
                </div>
              )}
              <div className="payment-disclaimer">
                <ShieldCheck size={19} />
                <p>
                  <strong>Demo — no money will be charged.</strong>
                </p>
              </div>
              {paymentState !== "idle" && paymentState !== "processing" && paymentState !== "succeeded" && (
                <div className={`payment-outcome ${paymentState}`} role="status">
                  <strong>{paymentState === "failed" ? "Simulated payment failed." : paymentState === "cancelled" ? "Simulated payment cancelled." : "Simulated payment is pending."}</strong>
                  <p>{paymentState === "pending" ? "No paid confirmation or order has been created. Retry or choose another method." : "Your cart, delivery details and kitchen notes are still here."}</p>
                  <div>
                    <button className="button outline" onClick={() => pay("succeeded")}>Retry</button>
                    <button className="text-button" onClick={chooseAnotherMethod}>Choose another method</button>
                  </div>
                </div>
              )}
              <button
                disabled={processing}
                className="button full"
                onClick={() => pay("succeeded")}
              >
                {processing ? (
                  <>
                    <LoaderCircle className="spin" size={20} />{" "}
                    {method === "COD"
                      ? "Placing demo order…"
                      : "Simulating payment…"}
                  </>
                ) : method === "COD" ? (
                  <>
                    Place Demo Order · {money(totals.total)}{" "}
                    <ArrowRight size={18} />
                  </>
                ) : (
                  <>
                    Simulate payment · {money(totals.total)} <ArrowRight size={18} />
                  </>
                )}
              </button>
              <details className="demo-controls">
                <summary>Demo controls</summary>
                <p>Run a non-successful test outcome. It keeps your cart and does not create an order.</p>
                <div>
                  <button type="button" disabled={processing} onClick={() => pay("failed")}>Simulate failure</button>
                  <button type="button" disabled={processing} onClick={() => pay("cancelled")}>Simulate cancellation</button>
                  <button type="button" disabled={processing} onClick={() => pay("pending")}>Simulate pending</button>
                </div>
              </details>
              <p className="demo-note centered">{method === "COD" ? "Cash on Delivery remains unpaid and will be marked “Pending — COD.”" : "A successful simulation records payment only; restaurant acceptance and notifications remain simulated."}</p>
            </>
          )}
        </div>
        <OrderSummary items={items} totals={totals} onEditCart={() => navigate("menu")} />
      </div>
    </section>
  );
}
function Confirmation({ order: o, navigate, onUpdateOrder }) {
  const [copyFeedback, setCopyFeedback] = useState("");
  if (!o)
    return (
      <section className="section empty-state">
        <ShoppingBag size={40} />
        <h1 tabIndex={-1}>
          No orders <em>just yet.</em>
        </h1>
        <button className="button" onClick={() => navigate("menu")}>
          Explore Menu
        </button>
      </section>
    );
  const stages = ["Received", "Preparing", "Ready", "Delivered"];
  const activeStage = o.deliveryStatus
    ? stages.indexOf(o.deliveryStatus.split(" — ")[0])
    : -1;
  async function copyReference() {
    try {
      await navigator.clipboard.writeText(o.id);
      setCopyFeedback("Order reference copied.");
    } catch {
      setCopyFeedback("Copy is unavailable in this browser.");
    }
  }
  return (
    <section className="section confirmation">
      <div className="confirmation-heading">
        <h1 tabIndex={-1}>Demo order confirmed</h1>
        <p>Nothing was charged, sent to the restaurant, or shared outside this browser.</p>
      </div>
      <article className="receipt" aria-label={`Demo order receipt ${o.id}`}>
        <div className="receipt-status"><Check size={17} /> Demo order snapshot</div>
        <div className="receipt-key">
          <div><span>Order reference</span><strong>{o.id}</strong></div>
          <div><span>Payment</span><strong>{o.paymentStatus}</strong></div>
          <div><span>Total</span><strong>{money(o.total)}</strong></div>
        </div>
        <div className="receipt-actions">
          <button className="text-button" onClick={() => document.getElementById("order-details")?.scrollIntoView({ behavior: "smooth" })}>View order</button>
          <button className="text-button" onClick={copyReference}>Copy order reference</button>
          <button className="text-button" onClick={() => navigate("menu")}>Back to menu</button>
        </div>
        <p className="copy-feedback" role="status" aria-live="polite">{copyFeedback}</p>
      </article>
      {activeStage >= 0 && (
        <ol className="order-progress" aria-label="Simulated order progress">
          {stages.map((stage, index) => <li className={index <= activeStage ? "active" : ""} key={stage}>{stage}</li>)}
        </ol>
      )}
      <div className="confirmation-grid" id="order-details">
        <div className="confirmation-details">
          <h3>Delivery details</h3>
          <div><MapPin /><section><strong>Delivering to {o.customer.name}</strong><p>{o.customer.address}, {o.customer.locality ? `${o.customer.locality}, ` : ""}{o.customer.pincode}</p><p>{o.customer.phone}</p></section></div>
          {o.customer.instructions && <div><MessageCircle /><section><strong>Kitchen note</strong><p>{o.customer.instructions}</p></section></div>}
          <div className="estimate"><Truck size={20} /><section><strong>{o.estimate}</strong><p>Illustrative delivery estimate only.</p></section></div>
        </div>
        <OrderSummary items={o.items} totals={o} />
      </div>
      <details className="confirmation-demo-controls">
        <summary>Demo controls</summary>
        <p>Simulate fulfilment locally. These statuses do not represent restaurant acceptance.</p>
        <div>{stages.map((stage) => <button key={stage} onClick={() => onUpdateOrder(o.id, { deliveryStatus: `${stage} — simulated`, fulfilmentStatus: `${stage} — simulated` })}>Simulate {stage.toLowerCase()}</button>)}</div>
      </details>
      <div className="confirmation-actions">
        <button className="button outline" onClick={() => navigate("menu")}>Back to menu</button>
        {o.deliveryStatus === "Delivered — simulated" && <button className="button" onClick={() => navigate("reviews")}>How was your meal? <ArrowRight size={18} /></button>}
      </div>
    </section>
  );
}
const columns = [
  "Order ID",
  "Timestamp",
  "Customer Name",
  "Phone",
  "Alternate Phone",
  "Email",
  "Address",
  "Pincode",
  "Items",
  "Special Instructions",
  "Total",
  "Payment Method",
  "Payment Status",
  "Order Status",
];
function Dashboard({ orders, reviews, onReset, onSelect }) {
  const [selected, setSelected] = useState(""),
    [reset, setReset] = useState(false);
  const o = orders.find((x) => x.id === selected) || orders[0];
  function select(id) {
    setSelected(id);
    onSelect(id);
  }
  return (
    <section className="section dashboard">
      <div className="dashboard-heading">
        <div>
          <Eyebrow>BEHIND THE COUNTER</Eyebrow>
          <h1 tabIndex={-1}>
            Demo <em>Dashboard.</em>
          </h1>
          <p>
            Your complete order workflow, without any external integrations.
          </p>
        </div>
        <button className="button outline" onClick={() => setReset(true)}>
          <RotateCcw size={16} /> Reset Demo
        </button>
      </div>
      {reset && (
        <div className="reset-confirm" role="alert">
          <div>
            <strong>Start a fresh walkthrough?</strong>
            <p>
              This clears this demo’s cart, orders, customer details, and
              reviews on this browser.
            </p>
          </div>
          <button
            className="button"
            onClick={() => {
              onReset();
              setReset(false);
              setSelected("");
            }}
          >
            Yes, reset demo
          </button>
          <button className="button outline" onClick={() => setReset(false)}>
            Cancel
          </button>
        </div>
      )}
      <div className="dashboard-stats">
        <article>
          <ShoppingBag />
          <span>Demo orders</span>
          <strong>{orders.length}</strong>
        </article>
        <article>
          <Banknote />
          <span>Order value · simulated</span>
          <strong>{money(orders.reduce((s, o) => s + o.total, 0))}</strong>
        </article>
        <article>
          <MessageCircle />
          <span>Message previews</span>
          <strong>{orders.length * 2}</strong>
        </article>
        <article>
          <Star />
          <span>Submitted reviews</span>
          <strong>{reviews.length}</strong>
        </article>
      </div>
      <div className="sheet-panel">
        <div className="sheet-title">
          <Table2 />
          <div>
            <h2>Google Sheets Preview — simulated</h2>
            <p>
              Local demo data · No Google account or spreadsheet is connected
            </p>
          </div>
          <span className="sheet-saved">
            <CheckCircle2 size={16} /> {orders.length} rows
          </span>
        </div>
        <div className="sheet-toolbar">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Insert</span>
          <span>Format</span>
          <span className="muted">Preview only</span>
        </div>
        {orders.length ? (
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Scrollable simulated order spreadsheet"
          >
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  {columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((x, index) => (
                  <tr
                    key={x.id}
                    className={o?.id === x.id ? "selected-row" : ""}
                  >
                    <td>{index + 1}</td>
                    {[
                      x.id,
                      new Date(x.timestamp).toLocaleString("en-IN"),
                      x.customer.name,
                      x.customer.phone,
                      x.customer.alternate || "—",
                      x.customer.email || "—",
                      x.customer.address,
                      x.customer.pincode,
                      itemText(x),
                      x.customer.instructions || "—",
                      money(x.total),
                      x.method,
                      x.paymentStatus,
                      x.status,
                    ].map((cell, i) => (
                      <td key={i}>
                        {i === 0 ? (
                          <button
                            onClick={() => select(x.id)}
                            aria-label={`Preview order ${x.id}`}
                          >
                            {cell}
                          </button>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state compact">
            <Table2 size={35} />
            <h3>Your first order starts here.</h3>
            <p>
              Place a demo order and its full details will appear automatically.
            </p>
            <a className="text-button" href="#menu">
              Explore Menu <ArrowRight size={17} />
            </a>
          </div>
        )}
        <div className="sheet-bottom">
          <Table2 size={14} /> Demo orders{" "}
          <span>All changes stay in this browser</span>
        </div>
      </div>
      {o && (
        <>
          <div className="notification-heading">
            <div>
              <Eyebrow>THE RIGHT DETAILS. THE RIGHT PEOPLE.</Eyebrow>
              <h2>
                A message for <em>both sides.</em>
              </h2>
            </div>
            <label>
              Preview order
              <select value={o.id} onChange={(e) => select(e.target.value)}>
                {orders.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.id} · {x.customer.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="whatsapp-grid">
            {[true, false].map((owner) => (
              <div className="whatsapp" key={String(owner)}>
                <div className="whatsapp-header">
                  <span className="whatsapp-avatar">
                    {owner ? <Utensils size={23} /> : o.customer.name[0]}
                  </span>
                  <div>
                    <strong>
                      {owner ? "Restaurant owner" : o.customer.name}
                    </strong>
                    <small>
                      {owner
                        ? "New order notification"
                        : "Customer confirmation"}
                    </small>
                  </div>
                  <MessageCircle size={23} />
                </div>
                <div className="whatsapp-body">
                  <span className="message-demo">
                    Simulated — no message sent
                  </span>
                  <div className="message-bubble">
                    <p>{notification(o, owner)}</p>
                    <span>
                      {new Date(o.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      <Check size={12} />
                      <Check size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <p className="demo-note centered">
        Payment, spreadsheet, and WhatsApp previews are generated entirely in
        your browser.
      </p>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
