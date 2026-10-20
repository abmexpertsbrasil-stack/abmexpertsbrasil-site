(function () {
  'use strict';
  var CFG = window.ABMX_CONFIG || {};
  var SOON = 'em-breve.html';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function hoje() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function externos(root) {
    root.querySelectorAll('a[href^="http"]').forEach(function (a) {
      a.target = '_blank'; a.rel = 'noopener';
    });
  }

  /* Itens presentes em todas as páginas:
     link "Para você" no menu e no rodapé, e o botão "Fale com o ABM Experts" (WhatsApp) */
  var WA_FALE = 'https://wa.me/' + (CFG.whatsappNumero || '5561991228864') +
    '?text=' + encodeURIComponent('Olá, vim pelo site da ABM Experts.');

  document.querySelectorAll('.ax-nav-links, .ax-mobile-menu ul').forEach(function (ul) {
    if (!ul.querySelector('a[href="agenda.html"]')) {
      var liAgenda = document.createElement('li');
      liAgenda.innerHTML = '<a href="agenda.html">Agenda</a>';
      var refCom = ul.querySelector('a[href="comunidade.html"]');
      if (refCom) ul.insertBefore(liAgenda, refCom.parentNode); else ul.appendChild(liAgenda);
    }
    if (ul.querySelector('a[href="para-voce.html"]')) return;
    var li = document.createElement('li');
    li.innerHTML = '<a href="para-voce.html">Para você</a>';
    var ref = ul.querySelector('a[href="para-empresas.html"]');
    if (ref) ul.insertBefore(li, ref.parentNode); else ul.appendChild(li);
  });

  var navEco = document.querySelector('footer nav[aria-label="Ecossistema"]');
  if (navEco && !navEco.querySelector('a[href="agenda.html"]')) {
    var refConteudo = navEco.querySelector('a[href="conteudo.html"]');
    var aAgenda = document.createElement('a');
    aAgenda.href = 'agenda.html'; aAgenda.textContent = 'Agenda';
    if (refConteudo) { aAgenda.setAttribute('style', refConteudo.getAttribute('style')); refConteudo.parentNode.insertBefore(aAgenda, refConteudo.nextSibling); }
  }

  var menuMovel = document.getElementById('menu-movel');
  if (menuMovel && !menuMovel.querySelector('.ax-fale-menu')) {
    var bm = document.createElement('a');
    bm.className = 'ax-btn ax-btn-outline-light ax-btn-lg ax-fale-menu';
    bm.href = WA_FALE; bm.textContent = 'Fale com o ABM Experts';
    menuMovel.appendChild(bm);
  }

  var navEmpresas = document.querySelector('footer nav[aria-label="Para empresas"]');
  if (navEmpresas && !document.querySelector('footer nav[aria-label="Para você"]')) {
    var nv = document.createElement('nav');
    nv.setAttribute('aria-label', 'Para você');
    nv.setAttribute('style', navEmpresas.getAttribute('style'));
    nv.innerHTML = '<span style="font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #A9B3AE;">Para você</span>' +
      '<a href="para-voce.html" style="color: #FFFFFF; text-decoration: none;">Mentoria individual</a>' +
      '<a href="' + WA_FALE + '" style="color: #FFFFFF; text-decoration: none;">Fale com o ABM Experts</a>';
    navEmpresas.parentNode.insertBefore(nv, navEmpresas);
  }

  if (!document.querySelector('.ax-fale')) {
    var fale = document.createElement('a');
    fale.className = 'ax-fale';
    fale.href = WA_FALE;
    fale.setAttribute('aria-label', 'Fale com o ABM Experts pelo WhatsApp');
    fale.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.4 7.5L3 21l1.6-5.3A8.5 8.5 0 1 1 21 12z"/></svg><span>Fale com o ABM Experts</span>';
    document.body.appendChild(fale);
  }

  /* Menu no celular */
  var toggle = document.querySelector('.ax-nav-toggle');
  var menu = document.getElementById('menu-movel');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var aberto = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!aberto));
      toggle.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
      menu.hidden = aberto;
      document.body.style.overflow = aberto ? '' : 'hidden';
    });
  }

  /* Listas que vêm dos arquivos em /data (editados pelo Pages CMS) */
  var CHAVES = { agenda: 'eventos', conteudos: 'itens', cursos: 'cursos', depoimentos: 'depoimentos', parceiros: 'parceiros' };

  function renderLista(box, dados) {
    var alias = box.getAttribute('data-alias');
    var tpl = box.querySelector('template').innerHTML;
    var nome = box.getAttribute('data-list');
    var itens = (dados && dados[CHAVES[nome]]) || [];
    var pagina = box.getAttribute('data-pagina');
    if (pagina) itens = itens.filter(function (it) { return it.pagina === pagina; });
    if (nome === 'agenda') {
      var h = hoje();
      itens = itens.filter(function (e) { return !e.data || e.data >= h; })
        .sort(function (a, b) { return (a.data || '').localeCompare(b.data || ''); });
    }
    if (!itens.length) {
      var vazio = document.querySelector('[data-vazio="' + nome + '"]');
      if (vazio) vazio.hidden = false;
      var bloco = box.closest('article, section');
      if (bloco && nome !== 'cursos') bloco.hidden = true;
      return [];
    }
    var html = itens.map(function (it) {
      var out = tpl.replace(new RegExp('\\{\\{' + alias + '\\.(\\w+)\\}\\}', 'g'), function (_, k) {
        var v = it[k];
        if ((k === 'link' || k === 'link2') && !v) return SOON;
        return esc(v);
      });
      return '<div style="display: contents" data-formato="' + esc(it.formato || '') + '">' + out + '</div>';
    }).join('');
    box.insertAdjacentHTML('beforeend', html);
    box.querySelectorAll('[data-if]').forEach(function (el) {
      var wrap = el.closest('[data-formato]');
      var idx = Array.prototype.indexOf.call(box.querySelectorAll(':scope > [data-formato]'), wrap);
      var item = itens[idx] || {};
      if (!item[el.getAttribute('data-if')]) el.remove();
    });
    externos(box);
    return itens;
  }

  function filtros(box, itens) {
    var chips = document.querySelector('[data-chips]');
    if (!chips) return;
    var contagem = {};
    itens.forEach(function (i) { contagem[i.formato] = (contagem[i.formato] || 0) + 1; });
    var opcoes = [['Todos', itens.length]].concat(Object.keys(contagem).map(function (k) { return [k, contagem[k]]; }));
    chips.innerHTML = opcoes.map(function (o, n) {
      return '<li><button type="button" class="ax-chip" aria-pressed="' + (n === 0) + '" data-valor="' + esc(o[0]) + '">' + esc(o[0]) + '<span class="ax-chip-count">' + o[1] + '</span></button></li>';
    }).join('');
    chips.addEventListener('click', function (ev) {
      var b = ev.target.closest('.ax-chip'); if (!b) return;
      var v = b.getAttribute('data-valor');
      chips.querySelectorAll('.ax-chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      box.querySelectorAll(':scope > [data-formato]').forEach(function (el) {
        el.hidden = v !== 'Todos' && el.getAttribute('data-formato') !== v;
      });
    });
  }

  document.querySelectorAll('[data-list]').forEach(function (box) {
    var nome = box.getAttribute('data-list');
    fetch('data/' + nome + '.json', { cache: 'no-cache' })
      .then(function (r) { return r.json(); })
      .then(function (dados) {
        var itens = renderLista(box, dados);
        if (nome === 'conteudos') filtros(box, itens);
      })
      .catch(function () {
        var bloco = box.closest('article, section');
        if (bloco && nome === 'agenda') bloco.hidden = true;
      });
  });

  /* Janelas (diagnóstico e indicação de parceiro) */
  var ultimoFoco = null;
  function abrir(id, origem) {
    var m = document.getElementById(id); if (!m) return;
    ultimoFoco = document.activeElement;
    var parceiro = origem ? origem.getAttribute('data-parceiro') : '';
    var campoParceiro = m.querySelector('input[name="Parceiro"]');
    if (campoParceiro) campoParceiro.value = parceiro || '';
    var rotulo = m.querySelector('[data-parceiro-label]');
    if (rotulo) { rotulo.textContent = parceiro ? 'Parceiro escolhido: ' + parceiro : ''; rotulo.hidden = !parceiro; }
    m.hidden = false;
    document.body.style.overflow = 'hidden';
    var campo = m.querySelector('input, select, textarea'); if (campo) campo.focus();
  }
  function fechar(m) {
    m.hidden = true;
    document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  }
  document.addEventListener('click', function (ev) {
    var o = ev.target.closest('[data-open]');
    if (o) { ev.preventDefault(); abrir(o.getAttribute('data-open'), o); return; }
    var c = ev.target.closest('[data-close]');
    if (c) { fechar(c.closest('#diag, #parceiro')); return; }
    if (ev.target.id === 'diag' || ev.target.id === 'parceiro') fechar(ev.target);
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    document.querySelectorAll('#diag:not([hidden]), #parceiro:not([hidden])').forEach(fechar);
  });

  /* Formulários: e-mail (Web3Forms) + resumo no WhatsApp (CallMeBot) */
  function resumo(nomeForm, campos) {
    return 'Site ABM Experts | ' + nomeForm + '\n' + campos.map(function (c) { return c[0] + ': ' + c[1]; }).join('\n');
  }

  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var nomeForm = form.getAttribute('data-form') || document.title.replace('ABM Experts Brasil | ', '');
      var campos = [];
      new FormData(form).forEach(function (v, k) { if (String(v).trim()) campos.push([k, String(v).trim()]); });
      var botao = form.querySelector('[type="submit"]');
      if (botao) { botao.disabled = true; botao.dataset.label = botao.textContent; botao.textContent = 'Enviando...'; }

      var envios = [];
      if (CFG.web3formsKey) {
        var corpo = { access_key: CFG.web3formsKey, subject: 'Site ABM Experts | ' + nomeForm, from_name: 'Site ABM Experts' };
        campos.forEach(function (c) { corpo[c[0]] = c[1]; });
        envios.push(fetch('https://api.web3forms.com/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(corpo)
        }).then(function (r) { if (!r.ok) throw new Error('email'); }));
      }
      if (CFG.callmebotKey && CFG.whatsappNumero) {
        var url = 'https://api.callmebot.com/whatsapp.php?phone=' + encodeURIComponent(CFG.whatsappNumero) +
          '&text=' + encodeURIComponent(resumo(nomeForm, campos)) + '&apikey=' + encodeURIComponent(CFG.callmebotKey);
        envios.push(fetch(url, { mode: 'no-cors' }).catch(function () {}));
      }

      Promise.all(envios).then(function () {
        var modal = form.closest('#diag, #parceiro');
        if (modal) {
          form.hidden = true;
          modal.querySelectorAll('[data-form-hide]').forEach(function (e) { e.hidden = true; });
          var ok = modal.querySelector('[data-done]'); if (ok) ok.hidden = false;
        } else {
          form.innerHTML = '<div class="ax-modal-done" role="status">Recebemos sua mensagem. A ABM Experts vai responder pelo e-mail ou WhatsApp que você informou.</div>';
        }
      }).catch(function () {
        if (botao) { botao.disabled = false; botao.textContent = botao.dataset.label; }
        var aviso = form.querySelector('.ax-form-status');
        if (!aviso) { aviso = document.createElement('p'); aviso.className = 'ax-form-status'; aviso.setAttribute('role', 'alert'); form.appendChild(aviso); }
        aviso.textContent = 'Não foi possível enviar agora. Tente de novo ou escreva para abmexpertsbrasil@gmail.com.';
      });
    });
  });

  externos(document);
})();
