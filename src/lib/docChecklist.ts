// ============================================================
// docChecklist — Profil bazlı belge kontrol listesi (tek kaynak)
// ============================================================
// Bu modül modal render'ı (DocChecklistModal) ile PDF üretimi
// (App.tsx generateDocumentChecklistPDF) arasında ortak veri kaynağı.
// İki yer de aynı listeyi göstermesi için ayrı dosyaya çıkarıldı.

export interface DocChecklistProfile {
  targetCountry?: string;
  hasSteadyIncome: boolean;
  salaryDetected: boolean;
  hasAssets: boolean;
  hasSgkJob: boolean;
  isPublicSectorEmployee: boolean;
  isStudent: boolean;
  isMarried: boolean;
  hasChildren: boolean;
  hasPreviousRefusal: boolean;
  hasHighValueVisa?: boolean;
  hasOtherVisa?: boolean;
  strongFamilyTies?: boolean;
  hasSponsor?: boolean;
  applicantAge?: number;
  // Reverse-map için opsiyonel bayraklar — profilde zaten dolu olan
  // belgeleri modal açıldığında otomatik işaretlemek için kullanılır.
  hasValidPassport?: boolean;
  passportValidityLong?: boolean;
  hasHealthInsurance?: boolean;
  hasTravelInsurance?: boolean;
  bankRegularity?: boolean;
  has6MonthStatements?: boolean;
  has28DayHolding?: boolean;
  hasBarcodeSgk?: boolean;
  sgkEmployerLetterWithReturn?: boolean;
  useOurTemplate?: boolean;
  purposeClear?: boolean;
  datesMatchReservations?: boolean;
  paidReservations?: boolean;
  documentConsistency?: boolean;
  previousRefusalDisclosed?: boolean;
  addressMatchSgk?: boolean;
}

export type DocItem = { text: string; note?: string; status: 'required' | 'conditional' };
export type DocSection = { title: string; icon: string; items: DocItem[] };

export function buildSections(profile: DocChecklistProfile): DocSection[] {
  const country = profile.targetCountry || 'Schengen';
  const isUK = country === 'İngiltere';
  const isUSA = country === 'ABD';
  const sections: DocSection[] = [];

  sections.push({
    title: 'Zorunlu Belgeler',
    icon: '📋',
    items: [
      { text: 'Geçerli pasaport (en az 2 boş sayfa)', status: 'required' },
      { text: 'Önceki pasaportlar (vizeli/damgalı sayfalarla)', status: 'required' },
      { text: 'Vize başvuru formu (eksiksiz ve imzalı)', status: 'required' },
      { text: 'Biyometrik fotoğraf — 35x45mm, beyaz arka fon, 6 aydan yeni', status: 'required' },
      { text: 'Nüfus cüzdanı fotokopisi (ön ve arka)', status: 'required' },
      { text: 'Tam tekmil vukuatlı nüfus kayıt örneği (e-Devlet, barkodlu)', status: 'required' },
      { text: 'Yerleşim yeri belgesi (e-Devlet, barkodlu)', status: 'required' },
      { text: 'Tarihçeli yerleşim yeri belgesi (e-Devlet, barkodlu)', status: 'required' },
      { text: 'e-Devlet yurda giriş-çıkış belgesi (2009\'dan bugüne)', status: 'required' },
      { text: 'Uçak rezervasyonu — gidiş ve dönüş', status: 'required' },
      { text: 'Otel / konaklama rezervasyonu', status: 'required' },
      { text: 'Detaylı seyahat planı (itinerary)', status: 'required' },
      ...(!isUSA ? [{ text: 'Seyahat sağlık sigortası (min. €30.000, Schengen kapsamı)', note: 'AXA, Allianz, Europ Assistance önerilir', status: 'required' as const }] : []),
    ],
  });

  sections.push({
    title: 'Finansal Belgeler',
    icon: '💰',
    items: [
      {
        text: isUK
          ? 'Son 6 aylık banka hesap dökümü (banka kaşeli ve imzalı)'
          : 'Son 3 aylık banka hesap dökümü (banka kaşeli ve imzalı)',
        note: isUK
          ? '28-gün kuralı: para en az 28 gün hesapta olmalı'
          : 'Günlük min. €100-120 gösterilebilmeli',
        status: 'required',
      },
      ...(profile.hasSteadyIncome || profile.salaryDetected
        ? [{ text: 'Son 3 aylık maaş bordrosu', status: 'conditional' as const }]
        : []),
      ...(profile.hasAssets
        ? [{ text: 'Tapu fotokopisi ve/veya araç ruhsatı', status: 'conditional' as const }]
        : []),
    ],
  });

  const isRetired = !profile.hasSgkJob && profile.hasAssets && (profile.applicantAge ?? 0) >= 55;

  if (profile.hasSgkJob || profile.isPublicSectorEmployee) {
    sections.push({
      title: 'Mesleki Belgeler',
      icon: '💼',
      items: [
        { text: 'SGK hizmet dökümü (e-Devlet, barkodlu)', status: 'required' },
        ...(profile.isPublicSectorEmployee
          ? [
              { text: 'Kamu kurumu görev belgesi (imzalı ve kaşeli)', status: 'required' as const },
              { text: 'Kamu kurumu izin onay belgesi (geri dönüş tarihi içeren)', status: 'required' as const },
            ]
          : [
              { text: 'İşveren izin ve görev yazısı (geri dönüş taahhütlü, kaşeli-imzalı)', note: '"İzin verilmiştir" tek başına yetmez; kesin geri dönüş tarihi içermeli', status: 'required' as const },
              { text: 'İşyerine ait güncel vergi levhası fotokopisi', status: 'required' as const },
              { text: 'Ticaret Odası kayıt sureti (6 aydan eski olmayan)', status: 'conditional' as const },
            ]
        ),
      ],
    });
  } else if (profile.isStudent) {
    sections.push({
      title: 'Öğrenci Belgeleri',
      icon: '🎓',
      items: [
        { text: 'Güncel öğrenci belgesi (tercihen İngilizce/Almanca)', status: 'required' },
        { text: 'Not dökümü / Transkript', status: 'required' },
        { text: 'Burs belgesi veya veli finansal sponsorluğu', status: 'conditional' },
      ],
    });
  } else if (isRetired) {
    sections.push({
      title: 'Emeklilik Belgeleri',
      icon: '🏖️',
      items: [
        { text: 'SGK / Bağ-Kur emeklilik belgesi (e-Devlet, barkodlu)', status: 'required' },
        { text: 'Son 3 aylık emekli maaşı hesap dökümü', status: 'required' },
        { text: 'Varlık beyanı (tapu, araç ruhsatı, mevduat)', status: 'conditional' },
      ],
    });
  }

  if (profile.hasSponsor) {
    sections.push({
      title: 'Sponsor Belgeleri',
      icon: '🤝',
      items: [
        { text: 'Noter onaylı sponsor taahhütnamesi (masrafları karşılama beyanı)', status: 'required' },
        { text: 'Sponsorun son 3 aylık banka dökümü (kaşeli-imzalı)', status: 'required' },
        { text: 'Sponsorun kimlik/pasaport fotokopisi', status: 'required' },
        { text: 'Sponsorluk ilişki belgesi (akrabalık / davet / resmi bağ)', status: 'required' },
        { text: 'Sponsorun gelir belgesi (maaş bordrosu veya vergi levhası)', status: 'conditional' },
      ],
    });
  }

  if (profile.isMarried || profile.hasChildren) {
    const familyItems: DocItem[] = [];
    if (profile.isMarried) {
      familyItems.push({ text: 'Evlilik cüzdanı fotokopisi', status: 'required' });
      familyItems.push({ text: 'Formül B — evlilik kayıt belgesi (e-Devlet)', status: 'required' });
    }
    if (profile.hasChildren) {
      familyItems.push({ text: 'Çocukların nüfus cüzdanı fotokopisi', status: 'conditional' });
      familyItems.push({ text: 'Formül A — doğum belgesi (e-Devlet)', status: 'conditional' });
    }
    sections.push({ title: 'Aile ve Memleket Bağ Belgeleri', icon: '👨‍👩‍👧', items: familyItems });
  }

  const countrySpecific: DocItem[] = [];
  if (isUSA) {
    countrySpecific.push({ text: 'DS-160 formu (online, barkod sayfası basılmış)', status: 'required' });
    countrySpecific.push({ text: 'Mülakat randevu onayı', status: 'required' });
    countrySpecific.push({ text: '"Strong ties to Turkey" belge paketi (SGK + tapu + aile)', status: 'required' });
  } else if (isUK) {
    countrySpecific.push({ text: 'Online UK vize başvurusu teyidi (IHS ücreti makbuzu)', status: 'required' });
    countrySpecific.push({ text: '28 gün boyunca sabit banka bakiyesi kanıtı', status: 'required' });
    countrySpecific.push({ text: 'Schengen vize geçmişi (eski pasaport sayfası)', note: 'Schengen geçmişi olmadan UK başvurusu riskli', status: 'conditional' });
  } else {
    countrySpecific.push({ text: 'Konsolosluğa hitaben niyet mektubu (amaç, tarihler, masraf karşılama)', status: 'required' });
    if (profile.hasPreviousRefusal) {
      countrySpecific.push({ text: 'Önceki ret mektubu fotokopisi — MUTLAKA beyan edilmeli', note: 'Gizlemek kara listeye alınmanıza yol açar', status: 'required' });
    }
  }
  if (countrySpecific.length > 0) {
    sections.push({ title: `${country} Özel Belgeler`, icon: '🏛️', items: countrySpecific });
  }

  return sections;
}
