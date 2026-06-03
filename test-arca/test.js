function inject_user_dropdown(){
    const div = document.getElementById("test");
    const is_adm = false;
    const is_ong = false;
    const adm_zone = is_adm ? `<a href="#" class="user-dropdown__item user-dropdown__item--danger" id="openAdmPanel">
              <i data-lucide="log-in"></i> Zona de Administrador
            </a>` : '';
    const ong_zone = is_ong || is_adm ? `<a href="#" class="user-dropdown__item user-dropdown__item--danger" id="openAdmPanel">
              <i data-lucide="log-in"></i> Perfil da Ong
            </a>` : '';

    const drop_down = `<div class="user-dropdown__divider"></div>
            <a href="../views/perfil.html" class="user-dropdown__item">
              <i data-lucide="heart"></i> Meu Perfil
            </a>
            <a href="#" class="user-dropdown__item">
              <i data-lucide="clipboard-list"></i> Minhas Solicitações
            </a>
            <a href="#" class="user-dropdown__item">
              <i data-lucide="settings"></i> Configurações
            </a>
            <div class="user-dropdown__divider"></div>
            ${adm_zone} 
            <a href="#" class="user-dropdown__item user-dropdown__item--danger" id="openLoginModal">
              <i data-lucide="log-in"></i> Entrar / Cadastrar
            </a>
            <a href="#" class="user-dropdown__item user-dropdown__item--danger">
              <i data-lucide="log-out"></i> Sair
            </a>`
    div.innerHTML = drop_down
}