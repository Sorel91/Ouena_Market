"use client";
import { useState } from "react";

const products = [
  ["Riz parfumé", "Sac de 25 kg", 17500, "🌾", "rice"],
  ["Riz brisé", "Sac de 25 kg", 14500, "🍚", "rice"],
  ["Huile végétale", "Bidon de 5 L", 9500, "🫙", "oil"],
  ["Sucre blanc", "Sac de 5 kg", 4200, "🧂", "sugar"],
  ["Farine de blé", "Sac de 25 kg", 11200, "🥖", "flour"],
  ["Lait en poudre", "Boîte familiale", 3900, "🥛", "milk"],
] as const;
const format = new Intl.NumberFormat("fr-FR");

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [view, setView] = useState<"cart" | "account" | null>(null);
  const [notice, setNotice] = useState("");
  const items = products.map((p, i) => ({ p, i, quantity: cart[i] || 0 })).filter((x) => x.quantity);
  const total = items.reduce((sum, x) => sum + x.quantity * x.p[2], 0);
  const change = (id: number, value: number) => setCart((old) => ({ ...old, [id]: Math.max(0, (old[id] || 0) + value) }));
  return <main>
    <section className="hero" id="accueil">
      <nav><a className="brand" href="#accueil">KÔRÔ <span>MARCHÉ</span></a><div className="navlinks"><a href="#produits">Produits</a><a href="#livraison">Livraison</a><button className="account-link" onClick={() => setView("account")}>Mon compte</button><button className="cart-button" onClick={() => setView("cart")}>Panier <b>{items.reduce((n,x)=>n+x.quantity,0)}</b></button></div></nav>
      <div className="hero-copy"><p className="eyebrow">ÉPICERIE EN LIGNE · MALI</p><h1>Les essentiels du quotidien,<br/><em>livrés simplement.</em></h1><p className="lede">Commandez vos produits alimentaires en quelques clics. Payez avec Orange Money ou à la livraison selon votre zone.</p><div className="hero-actions"><a className="primary" href="#produits">Découvrir le catalogue <span>→</span></a><button className="text-button" onClick={() => setView("cart")}>Voir mon panier</button></div><div className="reassurance"><span>✓ Prix clairs</span><span>✓ Paiement sécurisé</span><span>✓ Service local</span></div></div>
      <div className="hero-art"><div className="sun"/><div className="basket"><span>🌾</span><span>🍚</span><span>🫙</span><span>🥖</span></div><p>Votre marché,<br/>sans le déplacement.</p></div>
    </section>
    <section className="catalogue" id="produits"><div className="section-heading"><div><p className="eyebrow">LE CATALOGUE</p><h2>Tout ce qu’il vous faut</h2></div><p>Des produits essentiels, sélectionnés pour votre foyer.</p></div><div className="product-grid">{products.map(([name, detail, price, emoji, tone], i) => <article className="product" key={name}><div className={`product-image ${tone}`}><span>{emoji}</span><small>Disponible</small></div><div className="product-info"><p>{detail}</p><h3>{name}</h3><div><strong>{format.format(price)} <small>FCFA</small></strong><button onClick={() => change(i, 1)} aria-label={`Ajouter ${name}`}>+</button></div></div></article>)}</div></section>
    <section className="promise" id="livraison"><div><p className="eyebrow">SIMPLE COMME BONJOUR</p><h2>Du panier à votre porte.</h2></div><div className="steps"><article><b>01</b><h3>Vous choisissez</h3><p>Ajoutez vos essentiels, sans obligation de créer un compte.</p></article><article><b>02</b><h3>Vous payez</h3><p>Orange Money, ou paiement à la livraison selon votre zone.</p></article><article><b>03</b><h3>On vous livre</h3><p>Nous confirmons la commande et organisons la remise rapidement.</p></article></div></section>
    <footer><a className="brand" href="#accueil">KÔRÔ <span>MARCHÉ</span></a><p>Les produits du quotidien, accessibles à tous.</p><p>© 2026 Kôrô Marché</p></footer>
    {view === "cart" && <aside className="drawer"><button className="close" onClick={() => setView(null)} aria-label="Fermer">×</button><p className="eyebrow">VOTRE COMMANDE</p><h2>Panier</h2>{!items.length ? <p className="empty">Votre panier est encore vide.</p> : <><div className="cart-lines">{items.map(({p, i, quantity}) => <div key={p[0]}><span>{p[3]}</span><p>{p[0]}<small>{format.format(p[2])} FCFA</small></p><div className="quantity"><button onClick={() => change(i,-1)}>−</button><b>{quantity}</b><button onClick={() => change(i,1)}>+</button></div></div>)}</div><div className="total"><span>Total</span><strong>{format.format(total)} FCFA</strong></div><button className="primary checkout" onClick={() => setNotice("Prochaine étape : saisissez vos coordonnées, puis validez avec Orange Money.")}>Commander avec Orange Money</button>{notice && <p className="notice">{notice}</p>}</>}</aside>}
    {view === "account" && <div className="modal-wrap"><div className="modal"><button className="close" onClick={() => setView(null)}>×</button><p className="eyebrow">ESPACE CLIENT</p><h2>Bienvenue</h2><p>Créez votre espace pour retrouver vos commandes et commander plus vite.</p><form onSubmit={(e) => {e.preventDefault(); setNotice("Votre demande de création de compte est prête à être reliée au service d’authentification.")}}><label>Adresse e-mail<input required type="email" placeholder="vous@exemple.com"/></label><label>Mot de passe<input required type="password" placeholder="••••••••"/></label><button className="primary checkout">Créer mon compte</button></form><button className="text-button" onClick={() => setView(null)}>Continuer sans compte</button>{notice && <p className="notice">{notice}</p>}</div></div>}
  </main>;
}
