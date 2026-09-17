document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  const menuToggle = document.querySelector('#menuToggle');
  const mainNav = document.querySelector('#mainNav');
  menuToggle?.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) lucide.createIcons();
  });
  mainNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

  const quoteDialog = document.querySelector('#quoteDialog');
  document.querySelectorAll('.open-quote').forEach(btn => btn.addEventListener('click', e => {
    if (btn.tagName === 'A') e.preventDefault();
    quoteDialog.showModal();
  }));
  document.querySelector('#closeQuote')?.addEventListener('click', () => quoteDialog.close());
  quoteDialog?.addEventListener('click', e => { if (e.target === quoteDialog) quoteDialog.close(); });
  document.querySelector('#quoteForm')?.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('#quoteFeedback').classList.add('active');
  });

  let selectorStep = 1;
  const steps = [...document.querySelectorAll('.selector-step')];
  const railSteps = [...document.querySelectorAll('.step-rail span')];
  const next = document.querySelector('#selectorNext');
  const back = document.querySelector('#selectorBack');
  const selectorResult = document.querySelector('#selectorResult');
  function updateSelector() {
    steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === selectorStep));
    railSteps.forEach((s, i) => s.classList.toggle('active', i + 1 === selectorStep));
    selectorResult.classList.remove('active');
    document.querySelector('#selectorStepLabel').textContent = `ADIM ${selectorStep} / 4`;
    document.querySelector('#selectorProgress').style.width = `${selectorStep * 25}%`;
    back.disabled = selectorStep === 1;
    next.innerHTML = selectorStep === 4 ? 'Önerimi Göster <i data-lucide="sparkles"></i>' : 'Devam Et <i data-lucide="arrow-right"></i>';
    if (window.lucide) lucide.createIcons();
  }
  next?.addEventListener('click', () => {
    if (selectorStep < 4) { selectorStep++; updateSelector(); return; }
    const data = new FormData(document.querySelector('#selectorForm'));
    const place = data.get('place') || 'iş yeriniz';
    const priority = data.get('priority') || 'Güvenlik';
    let product = 'Otomatik Çelik Kepenk', alt = 'Alüminyum Kepenk';
    if (priority === 'Görünürlük') { product = 'Şeffaf Kepenk'; alt = 'Delikli Çelik Kepenk'; }
    if (priority === 'Isı yalıtımı') { product = 'Yalıtımlı Alüminyum Kepenk'; alt = 'Seksiyonel Kapı'; }
    if (priority === 'Estetik') { product = 'Alüminyum Kepenk'; alt = 'Şeffaf Kepenk'; }
    if (priority === 'Hız') { product = 'Hızlı Otomatik Kapı'; alt = 'Fotoselli Kapı'; }
    if (place === 'Garaj' || place === 'Apartman') { product = 'Otomatik Garaj Kapısı'; alt = 'Alüminyum Kepenk'; }
    if (place === 'Otopark') { product = 'Kollu Bariyer Sistemi'; alt = 'Yana Kayar Kapı Motoru'; }
    document.querySelector('#recommendedProduct').textContent = product;
    document.querySelector('#alternativeProduct').textContent = alt;
    document.querySelector('#recommendedReason').textContent = `${place} kullanımında ${priority.toLocaleLowerCase('tr-TR')} önceliğinize ve belirttiğiniz ölçülere uygun başlangıç seçeneğidir. Kesin öneri keşif sonrası netleşir.`;
    steps.forEach(s => s.classList.remove('active'));
    selectorResult.classList.add('active');
    document.querySelector('.selector-nav').style.display = 'none';
  });
  back?.addEventListener('click', () => { if (selectorStep > 1) { selectorStep--; updateSelector(); } });

  let pricing = null;
  const calc = () => {
    if (!pricing || !document.querySelector('#priceForm')) return;
    const w = Math.max(100, Number(document.querySelector('#calcWidth').value || 100)) / 100;
    const h = Math.max(100, Number(document.querySelector('#calcHeight').value || 100)) / 100;
    const type = document.querySelector('#calcType').value;
    const profile = document.querySelector('#calcProfile').value;
    const motor = document.querySelector('#calcMotor').value;
    const receiver = document.querySelector('#calcReceiver').value;
    let total = w * h * pricing.typeRates[type] + pricing.profile[profile] + pricing.motor[motor] + pricing.receiver[receiver];
    ['Remote','Ups','Install','Photocell','Safety'].forEach(key => {
      const input = document.querySelector(`#calc${key}`);
      if (input?.checked) total += pricing.extras[key.toLowerCase()];
    });
    const low = Math.round(total / pricing.rounding) * pricing.rounding;
    const high = Math.round((total * pricing.rangeMultiplier) / pricing.rounding) * pricing.rounding;
    const format = n => new Intl.NumberFormat('tr-TR', { style:'currency', currency:'TRY', maximumFractionDigits:0 }).format(n);
    document.querySelector('#priceOutput').textContent = `${format(low)} — ${format(high)}`;
    document.querySelector('#calcSummary').innerHTML = `<li>${document.querySelector('#calcType').selectedOptions[0].text}</li><li>${Math.round(w*100)} × ${Math.round(h*100)} cm</li><li>${document.querySelector('#calcMotor').selectedOptions[0].text}</li><li>${document.querySelector('#calcCity').value || 'İl belirtilmedi'} / ${document.querySelector('#calcDistrict').value || 'İlçe belirtilmedi'}</li>`;
  };
  fetch('data/pricing.json').then(r => r.json()).then(data => { pricing = data; calc(); }).catch(() => {
    const output = document.querySelector('#priceOutput');
    if (output) output.textContent = 'Fiyat verisi yüklenemedi';
  });
  document.querySelectorAll('#priceForm input, #priceForm select').forEach(el => el.addEventListener('input', calc));

  const diagnoses = {
    power: ['Enerji veya kontrol bağlantısı sorunu olabilir.','Elektrik beslemesi, sigorta, kumanda ya da kontrol kartı kaynaklı bir kesinti ihtimali bulunur.',['Binada elektrik olup olmadığını kontrol edin.','Kumandanın pilini kontrol edin.']],
    stuck: ['Mekanik sıkışma veya limit ayarı sorunu olabilir.','Lamel, ray veya motor limit ayarı kepengin belirli bir noktada durmasına neden olabilir.',['Raylarda görünür bir engel olup olmadığına uzaktan bakın.','Kepengi tekrar tekrar çalıştırmayın.']],
    remote: ['Kumanda pili veya alıcı eşleşmesi kontrol edilmeli.','Pilin bitmesi, kumandanın eşleşmesini kaybetmesi veya alıcı kartı sorunu olası nedenlerdir.',['Varsa yedek kumandayı deneyin.','Yeni ve doğru tip pil ile test edin.']],
    noise: ['Ray, lamel veya motor kaynaklı sürtünme olabilir.','Normal dışı ses mekanik gevşeme, ray sürtünmesi veya motor zorlanması belirtisi olabilir.',['Sesin geldiği bölgeyi uzaktan belirleyin.','Kullanımı durdurup servis kaydı açın.']],
    open: ['Kontrol ya da mekanik engel ihtimali var.','Enerji olmasına rağmen açılmıyorsa motor, limit, kilit veya lamel sıkışması değerlendirilmelidir.',['Fiziksel kilit varsa açık konumda olduğunu doğrulayın.','Ray çevresinde görünür engel olup olmadığına bakın.']],
    electric: ['UPS veya manuel açma sistemi gerekebilir.','Elektrik kesintisinde kullanım yöntemi motor ve aksesuar tipine göre değişir.',['Varsa ürün kullanım talimatını kontrol edin.','UPS göstergesini yalnızca dışarıdan gözlemleyin.']],
    motor: ['Motor ile hareket aktarımı arasında sorun olabilir.','Motor sesi duyulmasına rağmen hareket yoksa bağlantı, mil veya mekanik aktarım değerlendirilmelidir.',['Kepengi çalıştırmayı durdurun.','Görünür bir engel olup olmadığına uzaktan bakın.']],
    close: ['Fotosel, limit veya ray engeli kontrol edilmeli.','Kapanmama durumu emniyet sensörü, limit ayarı veya raydaki bir engelden kaynaklanabilir.',['Fotosel önünde engel olmadığını kontrol edin.','Ray çevresini uzaktan gözlemleyin.']],
    motorFault: ['Motor korumaya geçmiş veya arızalanmış olabilir.','Aşırı kullanım, kapasite yetersizliği ya da elektriksel sorun motoru durdurabilir.',['Sistemi dinlendirin ve tekrar tekrar denemeyin.','Yanık kokusu varsa enerjiyi güvenli şekilde kesin.']],
    receiver: ['Alıcı kartı enerji veya eşleşme sorunu olabilir.','Kart beslemesi, anten, kumanda eşleşmesi veya kart arızası değerlendirilmelidir.',['Varsa duvar butonunu deneyin.','Kart kutusunu açmayın.']],
    remoteFault: ['Kumanda pili veya eşleşmesi kontrol edilmeli.','Tek kumandada sorun varsa pil/cihaz; tüm kumandalarda varsa alıcı sistemi değerlendirilir.',['Yedek kumandayı deneyin.','Uygun tip yeni pil kullanın.']],
    other: ['Belirti teknik inceleme gerektiriyor.','Tanımlanamayan ses, hareket veya kontrol sorunlarında sistemi zorlamadan servis kaydı oluşturun.',['Kısa bir video veya fotoğraf hazırlayın.','Ürün ve motor bilgilerini not edin.']]
  };
  document.querySelectorAll('#symptomGrid button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('#symptomGrid button').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const [title,text,checks] = diagnoses[button.dataset.issue];
    document.querySelector('#diagnosisTitle').textContent = title;
    document.querySelector('#diagnosisText').textContent = text;
    document.querySelector('#safeChecks').innerHTML = checks.map(c => `<li>${c}</li>`).join('');
    document.querySelector('#diagnosis').classList.add('active');
  }));
  document.querySelector('#closeDiagnosis')?.addEventListener('click', () => document.querySelector('#diagnosis').classList.remove('active'));
  document.querySelector('.open-service')?.addEventListener('click', () => document.querySelector('#service').scrollIntoView({behavior:'smooth'}));

  document.querySelector('#serviceForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const n = String(Math.floor(10000 + Math.random() * 89999));
    document.querySelector('#ticketNumber').textContent = `AY-DEMO-${n}`;
    document.querySelector('#ticketSuccess').classList.add('active');
  });

  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
    if (d.open) document.querySelectorAll('details').forEach(other => { if (other !== d) other.open = false; });
  }));
});
