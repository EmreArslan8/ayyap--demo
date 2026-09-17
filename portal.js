document.addEventListener('DOMContentLoaded',()=>{
 if(window.lucide) lucide.createIcons();
 const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
 $$('.choice-row button').forEach(b=>b.addEventListener('click',()=>{b.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');updateConfig();}));
 function updateConfig(){const shutter=$('#previewShutter');if(!shutter)return;const color=$('.color-choice .active')?.dataset.color||'graphite';shutter.className='preview-shutter '+color;const type=$('[data-group=type] .active')?.textContent||'Çelik Kepenk';const motor=$('[data-group=motor] .active')?.textContent||'Standart Motor';const w=Number($('#designWidth')?.value||300),h=Number($('#designHeight')?.value||250);$('#sumType').textContent=type;$('#sumMotor').textContent=motor;$('#sumSize').textContent=`${w} × ${h} cm`;$('#designPrice').textContent=new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format((w*h/10000)*3500+(motor.includes('Yoğun')?12500:7500)+6300);}
 $$('#designWidth,#designHeight').forEach(i=>i?.addEventListener('input',updateConfig));updateConfig();
 $('#trackForm')?.addEventListener('submit',e=>{e.preventDefault();const code=$('#trackCode').value.trim().toUpperCase();if(!code)return;$('#trackNumber').textContent=code;$('#trackResult').classList.add('active');});
 const dashboardButtons=$$('.dash-menu button[data-tab]');
 function openDashboardTab(tabId,updateHash=false){
  const panel=$('#'+tabId),button=dashboardButtons.find(item=>item.dataset.tab===tabId);
  if(!panel||!button)return;
  dashboardButtons.forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active));});
  $$('.dash-tabs').forEach(item=>item.classList.toggle('active',item===panel));
  if(updateHash)history.pushState(null,'','#'+tabId);
 }
 dashboardButtons.forEach(button=>button.addEventListener('click',()=>openDashboardTab(button.dataset.tab,true)));
 if(location.hash)openDashboardTab(location.hash.slice(1));
 window.addEventListener('hashchange',()=>openDashboardTab(location.hash.slice(1)));
 const chatForm=$('#chatForm'),chatInput=$('#chatInput'),messages=$('#messages');
 function answer(q){const l=q.toLocaleLowerCase('tr-TR');if(l.includes('arız')||l.includes('çalışm')||l.includes('açılm'))return 'Bu belirti enerji, kumanda, kontrol kartı veya mekanik sıkışma kaynaklı olabilir. Motor kutusuna müdahale etmeyin. Güvenli ön kontrol için Kepenk Doktoru’nu kullanın veya servis kaydı oluşturun.';if(l.includes('fiyat')||l.includes('kaç para'))return 'Kesin fiyat veremem; ölçü, profil, motor, montaj ve keşif koşulları birlikte değerlendirilir. Verdiğiniz ölçülerle ön fiyat hesaplama aracına geçebilirsiniz.';if(l.includes('garaj'))return 'Garaj için kullanım sıklığı ve tavan yapısına göre seksiyonel garaj kapısı veya otomatik kepenk değerlendirilebilir. Yoğun kullanım varsa motor kapasitesi özellikle incelenmelidir.';return 'Dükkan ve mağaza uygulamalarında güvenlik önceliği için otomatik çelik kepenk; vitrin görünürlüğü önemliyse şeffaf kepenk düşünülebilir. Ölçü ve kullanım sıklığını paylaşırsanız seçimi daraltabilirim.';}
 function send(q){if(!q||!messages)return;messages.insertAdjacentHTML('beforeend',`<div class="message user">${q.replace(/[<>]/g,'')}</div><div class="message bot">${answer(q)}</div>`);messages.scrollTop=messages.scrollHeight;}
 chatForm?.addEventListener('submit',e=>{e.preventDefault();send(chatInput.value.trim());chatInput.value='';});$$('.quick-prompts button').forEach(b=>b.addEventListener('click',()=>send(b.textContent)));
});
