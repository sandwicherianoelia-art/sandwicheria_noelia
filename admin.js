const KEY='noelia_store_v2',PASS='noelia_admin_pass';
function parsePrice(v){if(typeof v==='number')return Number.isFinite(v)?v:0;let x=String(v??'').trim().replace(/\s/g,'').replace(/\$/g,'');if(!x)return 0;if(x.includes(',')&&x.includes('.')){if(x.lastIndexOf(',')>x.lastIndexOf('.'))x=x.replace(/\./g,'').replace(',','.');else x=x.replace(/,/g,'')}else if(x.includes(',')){x=x.replace(/\./g,'').replace(',','.')}else if(/^\d{1,3}(\.\d{3})+$/.test(x)){x=x.replace(/\./g,'')}let n=Number(x);return Number.isFinite(n)?n:0}
function money(v){return '$'+parsePrice(v).toLocaleString('es-AR')}

const defaults={settings:{name:'Sandwich de Miga Noelia',tagline:'Sabor fresco · Hecho con dedicación',primary:'#b51518',accent:'#ef8b22',logo:'',heroImage:'',heroTitle:'Sabores para compartir',heroText:'Sandwiches frescos, clásicos y especiales para reuniones, eventos y todos los días.',featuredText:'Opciones elegidas para reuniones, cumpleaños y eventos.',aboutTitle:'Sandwich de Miga Noelia',aboutText:'Preparación cuidada, ingredientes frescos y atención personalizada.',whatsapp:'5491155555555',phone:'11 5555-5555',email:'',address:'Zona oeste · Buenos Aires',socials:'Instagram · Facebook',transferAlias:'',pageUrl:'',topBg:'#ef8b22',brandBg:'#b51518',navBg:'#ffffff',heroBg:'#7d1717',categoriesBg:'#ffffff',productsBg:'#ffffff',featuredBg:'#fffaf2',aboutBg:'#ffffff',footerBg:'#242424',categoriesImage:'',productsImage:'',featuredImage:'',aboutImage:'',footerImage:''},categories:['Clásicos','Triples','Especiales','Lunch','Eventos'],products:[]};let data;
function load(){try{data=JSON.parse(localStorage.getItem(KEY))||structuredClone(defaults)}catch(e){data=structuredClone(defaults)}}
const storeRef=window.noeliaDb.ref('tienda');
async function loadCloud(){try{const x=await storeRef.once('value');if(x.exists()){data=x.val();localStorage.setItem(KEY,JSON.stringify(data))}else await storeRef.set(data)}catch(e){console.error(e)}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));return storeRef.set(data).catch(e=>{console.error(e);alert('No se pudo guardar en Firebase')})}function fileData(file){return new Promise((res,rej)=>{if(!file)return res('');let r=new FileReader;r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
async function start(){login.style.display='none';app.style.display='grid';load();await loadCloud();data.settings={...defaults.settings,...(data.settings||{})};data.categories=data.categories||defaults.categories.slice();data.products=data.products||[];fill();renderProducts();renderCats();renderOrders();storeRef.on('value',x=>{if(!x.exists())return;data=x.val();data.settings={...defaults.settings,...(data.settings||{})};data.categories=data.categories||[];data.products=data.products||[];localStorage.setItem(KEY,JSON.stringify(data));fill();renderProducts();renderCats();renderOrders()})}const existing=localStorage.getItem(PASS);loginHelp.textContent=existing?'Ingresá la clave de administrador.':'Primera vez: escribí una clave y quedará creada en este navegador.';loginBtn.onclick=()=>{let p=pass.value;if(!p)return alert('Ingresá una clave');if(!existing){localStorage.setItem(PASS,p);start()}else if(p===existing)start();else alert('Clave incorrecta')};document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.getElementById(b.dataset.tab).classList.add('active')});
function fill(){let s=data.settings;['name','tagline','primary','accent','heroTitle','heroText','featuredText','aboutTitle','aboutText','whatsapp','phone','email','address','socials','transferAlias','pageUrl','topBg','brandBg','navBg','heroBg','categoriesBg','productsBg','featuredBg','aboutBg','footerBg'].forEach(id=>{let e=document.getElementById(id);if(e)e.value=s[id]||'#ffffff'});if(s.logo)logoPrev.src=s.logo;if(s.heroImage)heroPrev.src=s.heroImage;refreshCatSelect()}
function refreshCatSelect(){pCat.innerHTML=data.categories.map(c=>`<option>${c}</option>`).join('')}
saveGeneral.onclick=async()=>{let s=data.settings;['name','tagline','primary','accent','heroTitle','heroText','featuredText','aboutTitle','aboutText'].forEach(id=>s[id]=document.getElementById(id).value);if(logoFile.files[0])s.logo=await fileData(logoFile.files[0]);if(heroFile.files[0])s.heroImage=await fileData(heroFile.files[0]);save();fill();alert('Guardado')};
saveAppearance.onclick=async()=>{let s=data.settings;['topBg','brandBg','navBg','heroBg','categoriesBg','productsBg','featuredBg','aboutBg','footerBg'].forEach(id=>s[id]=document.getElementById(id).value);for(const [key,id] of [['categoriesImage','categoriesImageFile'],['productsImage','productsImageFile'],['featuredImage','featuredImageFile'],['aboutImage','aboutImageFile'],['footerImage','footerImageFile']]){let f=document.getElementById(id).files[0];if(f)s[key]=await fileData(f)}save();alert('Colores y fondos guardados')};
function updateQr(){let u=pageUrl.value.trim()||location.href.replace(/admin\.html.*$/,'index.html');pageQr.src='https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='+encodeURIComponent(u)}
makeQr.onclick=updateQr;
saveContact.onclick=()=>{['whatsapp','phone','email','address','socials','transferAlias','pageUrl'].forEach(id=>data.settings[id]=document.getElementById(id).value);save();updateQr();alert('Contacto y pagos guardados')};
pPack.onchange=()=>pPackOther.style.display=pPack.value==='Otra'?'block':'none';
addProduct.onclick=async()=>{if(!pName.value)return alert('Falta nombre');let price=parsePrice(pPrice.value);if(price<=0)return alert('Ingresá un precio válido');let presentation=pPack.value==='Otra'?((+pPackOther.value||1)+' unidades'):pPack.value;data.products.push({id:Date.now(),name:pName.value,category:pCat.value,price, presentation,description:pDesc.value,image:await fileData(pImg.files[0]),featured:pFeat.checked});save();pName.value=pPrice.value=pDesc.value=pPackOther.value='';pPack.value='Unidad';pPackOther.style.display='none';pImg.value='';pFeat.checked=false;renderProducts()};
function renderProducts(){productList.innerHTML=data.products.map(p=>`<div class='item'><div>${p.image?`<img src='${p.image}' class='preview' style='vertical-align:middle;margin-right:10px'>`:''}<b>${p.name}</b> — ${p.category} — ${p.presentation||'Unidad'} — ${money(p.price)} ${p.featured?'⭐':''}</div><div><button onclick='editP(${p.id})'>Editar</button> <button class='danger' onclick='changePhoto(${p.id})'>Foto</button> <button class='danger' onclick='delP(${p.id})'>Eliminar</button></div></div>`).join('')||'<p>No hay productos.</p>'}
window.delP=id=>{if(confirm('¿Eliminar producto?')){data.products=data.products.filter(p=>p.id!==id);save();renderProducts()}};window.editP=id=>{let p=data.products.find(x=>x.id===id);let n=prompt('Nombre',p.name);if(n===null)return;p.name=n;p.price=parsePrice(prompt('Precio',p.price)??p.price);let pres=prompt('Presentación (Unidad, 6 unidades, 12 unidades, 24 unidades, 48 unidades u otra)',p.presentation||'Unidad');if(pres)p.presentation=pres;p.description=prompt('Descripción',p.description)||p.description;let c=prompt('Categoría',p.category);if(c)p.category=c;p.featured=confirm('Aceptar = destacado / Cancelar = no destacado');save();renderProducts()};window.changePhoto=id=>{let inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.onchange=async()=>{let p=data.products.find(x=>x.id===id);p.image=await fileData(inp.files[0]);save();renderProducts()};inp.click()};
addCat.onclick=()=>{let c=newCat.value.trim();if(c&&!data.categories.includes(c)){data.categories.push(c);save();newCat.value='';renderCats();refreshCatSelect()}};function renderCats(){catList.innerHTML=data.categories.map((c,i)=>`<div class='item'><span>${c}</span><button class='danger' onclick='delCat(${i})'>Eliminar</button></div>`).join('')}window.delCat=i=>{if(confirm('¿Eliminar categoría?')){data.categories.splice(i,1);save();renderCats();refreshCatSelect()}};changePass.onclick=()=>{if(newPass.value.length<4)return alert('Usá al menos 4 caracteres');localStorage.setItem(PASS,newPass.value);newPass.value='';alert('Clave cambiada')};

const ordersRef=window.noeliaDb.ref('pedidos');
let ordersCache={};
function orderMoney(v){return '$'+parsePrice(v).toLocaleString('es-AR')}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function renderOrders(){
 if(!window.ordersList)return;
 let arr=Object.values(ordersCache||{}).sort((a,b)=>(b.id||0)-(a.id||0));
 ordersList.innerHTML=arr.map(o=>{let c=o.customer||{},items=(o.items||[]).map(x=>`${x.qty} x ${x.name}`).join(' · ');let q=encodeURIComponent(`${c.address||''}, ${c.city||''}, Buenos Aires, Argentina`);return `<div class="item orderAdmin"><div><b>${esc(c.name)}</b> — ${esc(c.phone)}<br><span>📍 ${esc(c.address)} · ${esc(c.city)}</span><br><small>${esc(items)}</small><br><b>Total: ${orderMoney(o.total)} · ${o.payMode===50?'Seña 50%':'Pago total'}: ${orderMoney(o.payAmount)}</b><br><span>Estado: ${esc(o.status||'Pendiente')}</span></div><div><a class="mapAdmin" target="_blank" href="https://www.google.com/maps/search/?api=1&query=${q}">Ver en Google Maps</a><br><button onclick="setOrderStatus('${o.id||''}','Confirmado')">Confirmar</button> <button class="danger" onclick="deleteOrder('${o.id||''}')">Eliminar</button></div></div>`}).join('')||'<p>Todavía no hay pedidos.</p>'
}
ordersRef.on('value',snap=>{ordersCache=snap.val()||{};renderOrders()});
window.setOrderStatus=(id,status)=>ordersRef.child(String(id)).update({status});
window.deleteOrder=id=>{if(confirm('¿Eliminar este pedido?'))ordersRef.child(String(id)).remove()};
setTimeout(()=>{if(window.pageUrl&&!pageUrl.value)pageUrl.value=location.href.replace(/admin\.html.*$/,'index.html');if(window.pageQr)updateQr()},300);

function salesDateParts(iso){
  const d=new Date(iso||0);
  return {day:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,
          month:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`,
          year:String(d.getFullYear())};
}
function renderSalesHistory(){
  if(!window.salesHistoryList)return;
  let arr=Object.values(ordersCache||{}).sort((a,b)=>(b.id||0)-(a.id||0));
  const period=salesPeriod?.value||'all', selected=salesDate?.value||'';
  if(period!=='all' && selected){
    arr=arr.filter(o=>{
      const p=salesDateParts(o.createdAt);
      if(period==='day') return p.day===selected;
      if(period==='month') return p.month===selected.slice(0,7);
      if(period==='year') return p.year===selected.slice(0,4);
      return true;
    });
  }
  const total=arr.reduce((a,o)=>a+(+o.total||0),0);
  const clients=new Set(arr.map(o=>(o.customer?.phone||o.customer?.name||'').trim()).filter(Boolean)).size;
  salesSummary.innerHTML=`<div><b>${arr.length}</b><span>Ventas / pedidos</span></div><div><b>${clients}</b><span>Clientes</span></div><div><b>${orderMoney(total)}</b><span>Total</span></div>`;
  salesHistoryList.innerHTML=arr.map(o=>{
    const c=o.customer||{}, items=(o.items||[]).map(x=>`${x.qty} x ${x.name}`).join(' · ');
    const date=new Date(o.createdAt||o.id||0).toLocaleString('es-AR');
    return `<div class="item orderAdmin"><div><b>${esc(c.name)}</b> — ${esc(c.phone)}</div><div>${date}</div><div>📍 ${esc(c.address)} · ${esc(c.city)}</div><small>${esc(items)}</small><div><b>Total: ${orderMoney(o.total)}</b> · ${o.payMode===50?'Seña 50%':'Pago 100%'}: ${orderMoney(o.payAmount)}</div><div>Estado: ${esc(o.status||'Pendiente')}</div></div>`;
  }).join('')||'<p>No hay ventas para el período seleccionado.</p>';
}
if(window.applySalesFilter) applySalesFilter.onclick=renderSalesHistory;
if(window.salesPeriod) salesPeriod.onchange=renderSalesHistory;
ordersRef.on('value',snap=>{ordersCache=snap.val()||{};renderOrders();renderSalesHistory()});
setTimeout(renderSalesHistory,400);
