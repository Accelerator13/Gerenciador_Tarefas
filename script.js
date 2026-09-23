const $ = id => document.getElementById(id);
let tarefas = carregar(), filtro = "todas", editando = -1;

function carregar(){
  try{
    const d = JSON.parse(localStorage.getItem("tarefas"));
    return Array.isArray(d) ? d.map(t => ({nome:String(t.nome), concluida:!!t.concluida, prio:t.prio || "media"})) : [];
  }catch(e){ return []; }
}
function salvar(){ try{ localStorage.setItem("tarefas", JSON.stringify(tarefas)); }catch(e){} }
function mudou(){ salvar(); render(); }

function adicionar(){
  const nome = $("nome").value.trim();
  if(!nome){ $("nome").focus(); return; }
  tarefas.push({nome, concluida:false, prio:$("prio").value});
  $("nome").value = ""; mudou(); $("nome").focus();
}

function render(){
  const ul = $("lista"); ul.innerHTML = "";
  const visiveis = tarefas.map((t,i)=>({t,i})).filter(({t}) =>
    filtro==="todas" || (filtro==="pendentes" ? !t.concluida : t.concluida));

  if(!visiveis.length){
    const v = document.createElement("div"); v.className = "vazio";
    v.textContent = tarefas.length ? "Nada neste filtro." : "Nenhuma tarefa ainda. Escreva a primeira acima.";
    ul.appendChild(v);
  }

  visiveis.forEach(({t,i}) => {
    const li = document.createElement("li");
    li.className = t.prio + (t.concluida ? " feita" : "");

    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = t.concluida;
    cb.setAttribute("aria-label","Concluir "+t.nome);
    cb.onchange = () => { t.concluida = cb.checked; mudou(); };
    li.appendChild(cb);

    if(editando === i){
      const ed = document.createElement("input");
      ed.type = "text"; ed.className = "edit"; ed.value = t.nome; ed.maxLength = 120;
      const ok = () => { const v = ed.value.trim(); if(v) t.nome = v; editando = -1; mudou(); };
      ed.onkeydown = e => { if(e.key==="Enter") ok(); if(e.key==="Escape"){ editando=-1; render(); } };
      ed.onblur = ok;
      li.appendChild(ed);
      setTimeout(() => ed.focus(), 0);
    } else {
      const s = document.createElement("span");
      s.className = "t"; s.textContent = t.nome; s.title = "Duplo clique para editar";
      s.ondblclick = () => { editando = i; render(); };
      li.appendChild(s);
    }

    const rm = document.createElement("button");
    rm.className = "rm"; rm.textContent = "✕"; rm.setAttribute("aria-label","Remover "+t.nome);
    rm.onclick = () => { tarefas.splice(i,1); mudou(); };
    li.appendChild(rm);
    ul.appendChild(li);
  });

  const feitas = tarefas.filter(t => t.concluida).length, total = tarefas.length;
  $("resumo").textContent = total ? feitas+" de "+total+" concluídas" : "Sem tarefas por enquanto";
  $("prog").style.width = (total ? feitas/total*100 : 0) + "%";
  $("btnLimpar").hidden = feitas === 0;
  document.querySelectorAll("#filtros button").forEach(b => b.setAttribute("aria-pressed", b.dataset.f===filtro));
}

$("btnAdd").onclick = adicionar;
$("nome").addEventListener("keydown", e => { if(e.key==="Enter") adicionar(); });
$("btnLimpar").onclick = () => { tarefas = tarefas.filter(t => !t.concluida); mudou(); };
$("filtros").onclick = e => { if(e.target.dataset.f){ filtro = e.target.dataset.f; render(); } };
$("btnTema").onclick = () => {
  const r = document.documentElement;
  const escuro = r.dataset.theme ? r.dataset.theme==="dark" : matchMedia("(prefers-color-scheme:dark)").matches;
  r.dataset.theme = escuro ? "light" : "dark";
};
render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
