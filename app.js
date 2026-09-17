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
    if (place === 'Garaj' || place === 'Apartman') { product = 'Otomatik Garaj Kapısı'; alt = 'Alüminyum Kepenk'; }
    document.querySelector('#recommendedProduct').textContent = product;
    document.querySelector('#alternativeProduct').textContent = alt;
    document.querySelector('#recommendedReason').textContent = `${place} kullanımında ${priority.toLocaleLowerCase('tr-TR')} önceliğinize ve belirttiğiniz ölçülere uygun başlangıç seçeneğidir. Kesin öneri keşif sonrası netleşir.`;
    steps.forEach(s => s.classList.remove('active'));
    selectorResult.classList.add('active');
    document.querySelector('.selector-nav').style.display = 'none';
  });
  back?.addEventListener('click', () => { if (selectorStep > 1) { selectorStep--; updateSelector(); } });

  const calc = () => {
    const typeRates = { steel: 3450, transparent: 5200, aluminum: 3950, garage: 4600 };
    const w = Math.max(100, Number(document.querySelector('#calcWidth').value || 100)) / 100;
    const h = Math.max(100, Number(document.querySelector('#calcHeight').value || 100)) / 100;
    const type = document.querySelector('#calcType').value;
    const motor = document.querySelector('#calcMotor').value;
    let total = w * h * typeRates[type];
    total += motor === 'heavy' ? 12500 : motor === 'standard' ? 7500 : 0;
    if (document.querySelector('#calcRemote').checked) total += 1800;
    if (document.querySelector('#calcUps').checked) total += 6800;
    if (document.querySelector('#calcInstall').checked) total += 4500;
    const low = Math.round(total / 250) * 250;
    const high = Math.round((total * 1.17) / 250) * 250;
    const format = n => new Intl.NumberFormat('tr-TR', { style:'currency', currency:'TRY', maximumFractionDigits:0 }).format(n);
    document.querySelector('#priceOutput').textContent = `${format(low)} — ${format(high)}`;
  };
  document.querySelectorAll('#priceForm input, #priceForm select').forEach(el => el.addEventListener('input', calc));
  calc();

  const diagnoses = {
    power: ['Enerji veya kontrol bağlantısı sorunu olabilir.','Elektrik beslemesi, sigorta, kumanda ya da kontrol kartı kaynaklı bir kesinti ihtimali bulunur.',['Binada elektrik olup olmadığını kontrol edin.','Kumandanın pilini kontrol edin.']],
    stuck: ['Mekanik sıkışma veya limit ayarı sorunu olabilir.','Lamel, ray veya motor limit ayarı kepengin belirli bir noktada durmasına neden olabilir.',['Raylarda görünür bir engel olup olmadığına uzaktan bakın.','Kepengi tekrar tekrar çalıştırmayın.']],
    remote: ['Kumanda pili veya alıcı eşleşmesi kontrol edilmeli.','Pilin bitmesi, kumandanın eşleşmesini kaybetmesi veya alıcı kartı sorunu olası nedenlerdir.',['Varsa yedek kumandayı deneyin.','Yeni ve doğru tip pil ile test edin.']],
    noise: ['Ray, lamel veya motor kaynaklı sürtünme olabilir.','Normal dışı ses mekanik gevşeme, ray sürtünmesi veya motor zorlanması belirtisi olabilir.',['Sesin geldiği bölgeyi uzaktan belirleyin.','Kullanımı durdurup servis kaydı açın.']],
    open: ['Kontrol ya da mekanik engel ihtimali var.','Enerji olmasına rağmen açılmıyorsa motor, limit, kilit veya lamel sıkışması değerlendirilmelidir.',['Fiziksel kilit varsa açık konumda olduğunu doğrulayın.','Ray çevresinde görünür engel olup olmadığına bakın.']],
    electric: ['UPS veya manuel açma sistemi gerekebilir.','Elektrik kesintisinde kullanım yöntemi motor ve aksesuar tipine göre değişir.',['Varsa ürün kullanım talimatını kontrol edin.','UPS göstergesini yalnızca dışarıdan gözlemleyin.']]
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
