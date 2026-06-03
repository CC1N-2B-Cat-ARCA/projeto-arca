import { api } from "../core/api.js";
import { BASE_PATH } from "../index.js";

export async function set_is_login() {

  const session = await api.get("/get-session");
  const user = await api.get("/get-login", session)

  if (Object.keys(user).length === 0 || user === undefined) {
    state.is_login = false
  } else {
    state.is_login = true;
  }

  console.log(state.is_login)
}
const state = { is_login: false };
export async function get_login() {
  await set_is_login()
  const session = await api.get("/get-session")

  const user = await api.get("/get-login", session)
  const user_info = document.getElementById("user-info");

  const user_name = user.name
  const user_email = user.email
  const user_picture = user.avatar
  const user_profile = state.is_login ? `<p class="user-dropdown__name">${user_name}</p>
              <p class="user-dropdown__email">${user_email}</p>` : `<p class="user-dropdown__name">Minha Conta</p>
              <p class="user-dropdown__email">usuario@email.com</p>`;
  user_info.innerHTML = user_profile;

  const user_avatar = document.getElementById("user-avatar");

  const user_menu_btn = document.getElementById("userMenuBtn");

  const btn_pic = state.is_login && user_picture !== '' ? `<img src="${user_picture}" alt="user_profile_pic" class="profile-picture">` : `<i data-lucide="user-circle" class="icon-btn__icon"></i>`

  const user_pic = state.is_login && user_picture !== '' ? `<img src="${user_picture}" alt="user_profile_pic" class="profile-picture">` : `<i data-lucide="user-circle"></i>`
  user_avatar.innerHTML = user_pic

  user_menu_btn.innerHTML = btn_pic
  lucide.createIcons()
}

await get_login()

async function inject_user_dropdown() {
  const div = document.getElementById("test");
  const session = await api.get("/get-session")

  const user = await api.get("/get-login", session)

  const is_adm = user.role == 'adm' ? true : false;
  const is_ong = user.role == 'ong' ? true : false;
  const adm_zone = is_adm && state.is_login ? `<a href="${BASE_PATH}/views/adm_dashboard.html" class="user-dropdown__item user-dropdown__item--danger" id="openAdmPanel">
              <i data-lucide="log-in"></i> Zona de Administrador
            </a>` : `<div></div>`
  const ong_zone = (is_ong || is_adm) && state.is_login ? `<a href="${BASE_PATH}/views/painel_ong.html" class="user-dropdown__item user-dropdown__item--danger" id="openAdmPanel">
              <i data-lucide="log-in"></i> Perfil da Ong
            </a>` : '';
  const login_in = state.is_login ? '' : `<a href="#" class="user-dropdown__item user-dropdown__item--danger" id="openLoginModal">
              <i data-lucide="log-in"></i> Entrar / Cadastrar
            </a>`;
  const functionalities = state.is_login ? `<div class="user-dropdown__divider"></div>
            <a href="${BASE_PATH}/views/perfil.html" class="user-dropdown__item">
              <i data-lucide="heart"></i> Meu Perfil
            </a>
            <a href="#" class="user-dropdown__item">
              <i data-lucide="clipboard-list"></i> Minhas Solicitações
            </a>
            <a href="#" class="user-dropdown__item">
              <i data-lucide="settings"></i> Configurações
            </a>` : '';
  const drop_down = `${functionalities}
            <div class="user-dropdown__divider"></div>
            ${adm_zone}
            ${ong_zone}
            ${login_in}
            <a href="${BASE_PATH}/index.html" class="user-dropdown__item user-dropdown__item--danger" id="exit">
              <i data-lucide="log-out"></i> Sair
            </a>`
  div.innerHTML = '';
  div.innerHTML = drop_down
  await get_login();
}

// --- User Dropdown ---
const userMenuBtn = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');
userMenuBtn.addEventListener('click', async (e) => {
  e.stopPropagation();
  await inject_user_dropdown();
  userDropdown.classList.toggle('user-dropdown--open');
  notifDropdown.classList.remove('notif-dropdown--open');
  const loginModal = document.getElementById('loginModal');
  const openLogin = document.getElementById('openLoginModal');
  const closeModal = document.getElementById('closeModal');

  function openLoginModal() {
    loginModal.classList.add('modal-overlay--open');
    document.body.style.overflow = 'hidden';
  }
  function closeLoginModal() {
    loginModal.classList.remove('modal-overlay--open');
    document.body.style.overflow = '';
  }

  if (openLogin) openLogin.addEventListener('click', (e) => { e.preventDefault(); openLoginModal(); });
  if (closeModal) closeModal.addEventListener('click', closeLoginModal);
  if (loginModal) loginModal.addEventListener('click', (e) => { if (e.target === loginModal) closeLoginModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLoginModal(); });

});
document.addEventListener('click', () => {
  userDropdown.classList.remove('user-dropdown--open');
});
userDropdown.addEventListener('click', (e) => e.stopPropagation());