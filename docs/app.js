const client = supabase.createClient(
  "https://vmqbhkriccrudblamqgm.supabase.co",
  "sb_publishable_xNK2vuUYnkpEYrDSeIa4hQ_VMqaTQ0q"
);

const products = [
  ["Riz parfumé", "Sac de 25 kg", 17500, "🌾"],
  ["Riz brisé", "Sac de 25 kg", 14500, "🍚"],
  ["Huile végétale", "Bidon de 5 L", 9500, "🫙"],
  ["Sucre blanc", "Sac de 5 kg", 4200, "🧂"],
  ["Farine de blé", "Sac de 25 kg", 11200, "🥖"],
  ["Lait en poudre", "Boîte familiale", 3900, "🥛"],
];
const cart = {};
let signUp = false;
let toastTimer;
const money = (value) => `${value.toLocaleString("fr-FR")} FCFA`;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function render() {
  grid.innerHTML = products.map((p, id) => `<article class="product"><div class="pic">${p[3]}</div><div class="info"><small>${p[1]}</small><h3>${p[0]}</h3><div class="row"><b>${money(p[2])}</b><button class="add" data-add="${id}" aria-label="Ajouter ${p[0]}">+</button></div></div></article>`).join("");
  grid.querySelectorAll("[data-add]").forEach((button) => button.onclick = () => add(+button.dataset.add));
  let quantity = 0;
  let totalAmount = 0;
  lines.innerHTML = products.map((p, id) => {
    if (!cart[id]) return "";
    quantity += cart[id]; totalAmount += cart[id] * p[2];
    return `<div class="line"><div><b>${p[3]} ${p[0]}</b><small>${money(p[2])} l’unité</small><button class="remove" data-remove="${id}">Supprimer</button></div><div class="qty"><button data-change="${id}" data-delta="-1">−</button><b>${cart[id]}</b><button data-change="${id}" data-delta="1">+</button></div></div>`;
  }).join("") || '<p class="message">Votre panier est encore vide.</p>';
  lines.querySelectorAll("[data-change]").forEach((button) => button.onclick = () => change(+button.dataset.change, +button.dataset.delta));
  lines.querySelectorAll("[data-remove]").forEach((button) => button.onclick = () => removeItem(+button.dataset.remove));
  count.textContent = quantity;
  count.hidden = quantity === 0;
  cartBtn.setAttribute("aria-label", `Ouvrir le panier, ${quantity} article${quantity > 1 ? "s" : ""}`);
  total.textContent = money(totalAmount);
}
function add(id) { change(id, 1); showToast(`✓ ${products[id][0]} ajouté au panier`); }
function change(id, delta) { cart[id] = Math.max(0, (cart[id] || 0) + delta); if (!cart[id]) delete cart[id]; render(); }
function removeItem(id) { delete cart[id]; render(); showToast("Produit retiré du panier"); }
function open(element) { backdrop.classList.add("open"); element.classList.add("open"); }
function closeAll() { backdrop.classList.remove("open"); drawer.classList.remove("open"); auth.classList.remove("open"); payment.classList.remove("open"); orange.classList.remove("open"); }
function switchAuth() {
  signUp = !signUp;
  authTitle.textContent = signUp ? "Créer un compte" : "Connexion";
  authText.textContent = signUp ? "Créez votre espace client pour suivre vos commandes." : "Connectez-vous pour retrouver vos commandes.";
  authSubmit.textContent = signUp ? "Créer mon compte" : "Se connecter";
  authSwitch.textContent = signUp ? "J’ai déjà un compte" : "Créer un compte";
  password.autocomplete = signUp ? "new-password" : "current-password";
  authMessage.textContent = "";
}
async function refreshAccount() {
  const { data: { user } } = await client.auth.getUser();
  accountBtn.textContent = user ? `Bonjour, ${user.email}` : "Mon compte";
}

cartBtn.onclick = () => open(drawer);
accountBtn.onclick = () => open(auth);
backdrop.onclick = closeAll;
document.querySelectorAll(".close").forEach((button) => button.onclick = closeAll);
authSwitch.onclick = switchAuth;
authForm.addEventListener("submit", async (event) => {
  event.preventDefault(); authMessage.textContent = "";
  const emailValue = email.value;
  const passwordValue = password.value;
  const result = signUp
    ? await client.auth.signUp({ email: emailValue, password: passwordValue, options: { emailRedirectTo: location.href } })
    : await client.auth.signInWithPassword({ email: emailValue, password: passwordValue });
  if (result.error) { authMessage.textContent = result.error.message; return; }
  if (signUp) { authMessage.textContent = "Vérifiez votre e-mail pour confirmer votre compte."; return; }
  closeAll(); refreshAccount();
});
checkoutBtn.onclick = () => {
  if (!Object.keys(cart).length) return showToast("Ajoutez au moins un produit au panier");
  closeAll(); open(payment);
};
guestCheckoutBtn.onclick = () => { paymentTotal.textContent = total.textContent; closeAll(); open(orange); };
loginCheckoutBtn.onclick = () => { closeAll(); open(auth); authMessage.textContent = "Connectez-vous ou créez un compte pour retrouver cette commande."; };
paymentDoneBtn.onclick = () => { closeAll(); showToast("Merci. Votre paiement sera vérifié avant confirmation."); };
client.auth.onAuthStateChange(refreshAccount);
refreshAccount(); render();

