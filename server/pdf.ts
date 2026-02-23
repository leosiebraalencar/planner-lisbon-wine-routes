import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import type { Itinerary, Activity, RoadTripGuide } from '@shared/schema';

const PDFS_DIR = path.join(process.cwd(), 'attached_assets', 'pdfs');

if (!fs.existsSync(PDFS_DIR)) {
  fs.mkdirSync(PDFS_DIR, { recursive: true });
}

const WINE_RED = '#722F37';
const DARK_TEXT = '#1a1a1a';
const GRAY_TEXT = '#4a4a4a';
const LIGHT_GRAY = '#f5f5f5';

const LOGO_PATH = path.join(process.cwd(), 'attached_assets', 'marca-lisbon-wine-routes-1_1763141966678.png');

const FONTS_DIR = path.join(process.cwd(), 'server', 'fonts');
const GILDA_REGULAR = path.join(FONTS_DIR, 'GildaDisplay-Regular.ttf');
const OPENSANS_REGULAR = path.join(FONTS_DIR, 'OpenSans-Regular.ttf');
const OPENSANS_BOLD = path.join(FONTS_DIR, 'OpenSans-Bold.ttf');

const CUSTOM_FONTS_AVAILABLE = fs.existsSync(GILDA_REGULAR) && fs.existsSync(OPENSANS_REGULAR) && fs.existsSync(OPENSANS_BOLD);

function registerFonts(doc: PDFKit.PDFDocument) {
  if (CUSTOM_FONTS_AVAILABLE) {
    doc.registerFont('GildaDisplay', GILDA_REGULAR);
    doc.registerFont('OpenSans', OPENSANS_REGULAR);
    doc.registerFont('OpenSans-Bold', OPENSANS_BOLD);
  }
}

const TITLE_FONT = CUSTOM_FONTS_AVAILABLE ? 'GildaDisplay' : 'Helvetica-Bold';
const BODY_FONT = CUSTOM_FONTS_AVAILABLE ? 'OpenSans' : 'Helvetica';
const BOLD_FONT = CUSTOM_FONTS_AVAILABLE ? 'OpenSans-Bold' : 'Helvetica-Bold';

type PdfLang = 'PT' | 'EN' | 'ES' | 'DE';

const pdfTranslations: Record<PdfLang, Record<string, string>> = {
  PT: {
    title: 'O Seu Roteiro Personalizado de Enoturismo',
    titlePersonalized: ', O Seu Roteiro Personalizado de Enoturismo está pronto!',
    duration: 'Duração:',
    days: 'dias',
    day: 'dia',
    dayLabel: 'DIA',
    budget: 'Orçamento:',
    travelType: 'Tipo de Viagem:',
    dates: 'Datas:',
    datesTo: 'a',
    highlights: 'DESTAQUES DO ROTEIRO',
    travelTips: 'Dicas de Viagem',
    recommendations: 'RECOMENDAÇÕES',
    accommodation: 'Alojamento',
    carRental: 'Aluguer de Carro',
    averagePrice: 'Preço médio',
    support: 'Para apoio ou assistência personalizada:',
    moreInfo: 'Para mais informações sobre enoturismo visite:',
    bookNow: 'Reservar',
    morning: 'Manhã',
    afternoon: 'Tarde',
    evening: 'Noite',
    carPickup: 'Levantamento do Carro',
    overnightStay: 'Estadia Noturna',
    roadTripGuide: 'GUIA DE ROAD TRIP',
    rtgChecklist: 'Checklist na Retirada do Carro',
    rtgNarrated: 'Roteiro Narrado',
    rtgWhatToBring: 'O Que Levar / Preparar',
    rtgDocuments: 'Documentos',
    rtgComfort: 'Conforto',
    rtgSafety: 'Segurança',
    rtgTechnology: 'Tecnologia',
    rtgClimate: 'Clima',
    rtgDrivingTips: 'Dicas de Condução e Segurança',
    rtgPlanB: 'Planos B',
    rtgMaps: 'Mapas do Trajeto',
    rtgSummary: 'Resumo Rápido',
    rtgTip: 'Dica',
    rtgAlert: 'Alerta',
    rtgSuggestion: 'Sugestão',
  },
  EN: {
    title: 'Your Personalized Wine Tourism Itinerary',
    titlePersonalized: ', Your Personalized Wine Tourism Itinerary is ready!',
    duration: 'Duration:',
    days: 'days',
    day: 'day',
    dayLabel: 'DAY',
    budget: 'Budget:',
    travelType: 'Travel Type:',
    dates: 'Dates:',
    datesTo: 'to',
    highlights: 'ITINERARY HIGHLIGHTS',
    travelTips: 'Travel Tips',
    recommendations: 'RECOMMENDATIONS',
    accommodation: 'Accommodation',
    carRental: 'Car Rental',
    averagePrice: 'Average price',
    support: 'For support or personalized assistance:',
    moreInfo: 'For more information about wine tourism visit:',
    bookNow: 'Book now',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    carPickup: 'Car Pickup',
    overnightStay: 'Overnight Stay',
    roadTripGuide: 'ROAD TRIP GUIDE',
    rtgChecklist: 'Car Pickup Checklist',
    rtgNarrated: 'Narrated Route',
    rtgWhatToBring: 'What to Bring / Prepare',
    rtgDocuments: 'Documents',
    rtgComfort: 'Comfort',
    rtgSafety: 'Safety',
    rtgTechnology: 'Technology',
    rtgClimate: 'Climate',
    rtgDrivingTips: 'Driving Tips & Safety',
    rtgPlanB: 'Plan B',
    rtgMaps: 'Route Maps',
    rtgSummary: 'Quick Summary',
    rtgTip: 'Tip',
    rtgAlert: 'Alert',
    rtgSuggestion: 'Suggestion',
  },
  ES: {
    title: 'Tu Itinerario Personalizado de Enoturismo',
    titlePersonalized: ', Tu Itinerario Personalizado de Enoturismo está listo!',
    duration: 'Duración:',
    days: 'días',
    day: 'día',
    dayLabel: 'DÍA',
    budget: 'Presupuesto:',
    travelType: 'Tipo de Viaje:',
    dates: 'Fechas:',
    datesTo: 'a',
    highlights: 'DESTACADOS DEL ITINERARIO',
    travelTips: 'Consejos de Viaje',
    recommendations: 'RECOMENDACIONES',
    accommodation: 'Alojamiento',
    carRental: 'Alquiler de Coche',
    averagePrice: 'Precio medio',
    support: 'Para soporte o asistencia personalizada:',
    moreInfo: 'Para más información sobre enoturismo visite:',
    bookNow: 'Reservar',
    morning: 'Mañana',
    afternoon: 'Tarde',
    evening: 'Noche',
    carPickup: 'Recogida del Coche',
    overnightStay: 'Estancia Nocturna',
    roadTripGuide: 'GUÍA DE ROAD TRIP',
    rtgChecklist: 'Checklist en la Recogida del Coche',
    rtgNarrated: 'Ruta Narrada',
    rtgWhatToBring: 'Qué Llevar / Preparar',
    rtgDocuments: 'Documentos',
    rtgComfort: 'Comodidad',
    rtgSafety: 'Seguridad',
    rtgTechnology: 'Tecnología',
    rtgClimate: 'Clima',
    rtgDrivingTips: 'Consejos de Conducción y Seguridad',
    rtgPlanB: 'Planes B',
    rtgMaps: 'Mapas de la Ruta',
    rtgSummary: 'Resumen Rápido',
    rtgTip: 'Consejo',
    rtgAlert: 'Alerta',
    rtgSuggestion: 'Sugerencia',
  },
  DE: {
    title: 'Ihre Personalisierte Weintourismus-Route',
    titlePersonalized: ', Ihre Personalisierte Weintourismus-Route ist fertig!',
    duration: 'Dauer:',
    days: 'Tage',
    day: 'Tag',
    dayLabel: 'TAG',
    budget: 'Budget:',
    travelType: 'Reiseart:',
    dates: 'Datum:',
    datesTo: 'bis',
    highlights: 'ROUTE-HIGHLIGHTS',
    travelTips: 'Reisetipps',
    recommendations: 'EMPFEHLUNGEN',
    accommodation: 'Unterkunft',
    carRental: 'Autovermietung',
    averagePrice: 'Durchschnittspreis',
    support: 'Für Unterstützung oder persönliche Beratung:',
    moreInfo: 'Für weitere Informationen über Weintourismus besuchen Sie:',
    bookNow: 'Jetzt buchen',
    morning: 'Morgen',
    afternoon: 'Nachmittag',
    evening: 'Abend',
    carPickup: 'Autoabholung',
    overnightStay: 'Übernachtung',
    roadTripGuide: 'ROAD TRIP GUIDE',
    rtgChecklist: 'Checkliste bei Fahrzeugübernahme',
    rtgNarrated: 'Erzählte Route',
    rtgWhatToBring: 'Was mitnehmen / vorbereiten',
    rtgDocuments: 'Dokumente',
    rtgComfort: 'Komfort',
    rtgSafety: 'Sicherheit',
    rtgTechnology: 'Technologie',
    rtgClimate: 'Klima',
    rtgDrivingTips: 'Fahrtipps & Sicherheit',
    rtgPlanB: 'Plan B',
    rtgMaps: 'Routenkarten',
    rtgSummary: 'Kurzzusammenfassung',
    rtgTip: 'Tipp',
    rtgAlert: 'Hinweis',
    rtgSuggestion: 'Vorschlag',
  },
};

function renderActivityBlock(
  doc: PDFKit.PDFDocument, 
  activity: Activity, 
  periodLabel: string,
  pt: Record<string, string> = pdfTranslations.EN
) {
  const startY = doc.y;
  const pageWidth = doc.page.width - 100;
  
  doc.fillColor(WINE_RED)
    .fontSize(11)
    .font(BOLD_FONT)
    .text(periodLabel.toUpperCase(), 50, startY);
  
  doc.fillColor(GRAY_TEXT)
    .fontSize(10)
    .font(BODY_FONT)
    .text(activity.time, pageWidth - 80, startY, { align: 'right', width: 130 });
  
  doc.y = startY + 25;
  
  doc.rect(50, doc.y, pageWidth, 1).fill(LIGHT_GRAY);
  doc.y += 15;
  
  doc.fillColor(DARK_TEXT)
    .fontSize(11)
    .font(BOLD_FONT)
    .text(activity.location, 60);
  
  doc.moveDown(0.3);
  
  doc.fillColor(GRAY_TEXT)
    .fontSize(10)
    .font(BODY_FONT)
    .text(activity.activity, 60);
  
  doc.moveDown(0.3);
  
  if (activity.address) {
    doc.fontSize(9)
      .fillColor(GRAY_TEXT)
      .text(activity.address, 60);
    doc.moveDown(0.3);
  }
  
  doc.moveDown(0.2);
  doc.fillColor(GRAY_TEXT)
    .fontSize(10)
    .font(BODY_FONT)
    .text(activity.description, 60, doc.y, { width: pageWidth - 20 });
  
  doc.moveDown(0.5);
  
  if (activity.price && activity.price > 0) {
    doc.fillColor(DARK_TEXT)
      .fontSize(9)
      .font(BOLD_FONT)
      .text(`${pt.averagePrice || 'Average price'}: €${activity.price.toFixed(2)}`, 60);
    doc.moveDown(0.3);
  }
  
  doc.fontSize(9)
    .font(BODY_FONT)
    .fillColor(GRAY_TEXT)
    .text(`${pt.duration.replace(':', '')}: ${activity.duration}`, 60);
  
  doc.moveDown(0.5);
  
  if (activity.affiliateUrl) {
    const buttonY = doc.y;
    const buttonWidth = 100;
    const buttonHeight = 24;
    
    doc.roundedRect(60, buttonY, buttonWidth, buttonHeight, 4)
      .fill(WINE_RED);
    
    doc.fillColor('#ffffff')
      .fontSize(10)
      .font(BOLD_FONT)
      .text(pt.bookNow, 60, buttonY + 7, { 
        width: buttonWidth, 
        align: 'center',
        link: activity.affiliateUrl
      });
    
    doc.y = buttonY + buttonHeight + 5;

    if (activity.isTheFork || activity.theForkPromoCode) {
      doc.fillColor(WINE_RED)
        .fontSize(8)
        .font(BOLD_FONT)
        .text('Use o código 30B64ED e receba 1000 Yums!', 60);
      doc.moveDown(0.3);
    }
  }
  
  doc.moveDown(1.5);
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > doc.page.height - 60) {
    doc.addPage();
  }
}

function locPdf(ls: any, lang: string): string {
  if (!ls) return '';
  if (typeof ls === 'string') return ls;
  return ls[lang] || ls.EN || ls.PT || '';
}

function renderRoadTripGuide(doc: PDFKit.PDFDocument, guide: RoadTripGuide, pt: Record<string, string>, lang: string) {
  const pageWidth = doc.page.width - 100;

  doc.addPage();
  doc.fillColor(WINE_RED)
    .fontSize(16)
    .font(TITLE_FONT)
    .text(pt.roadTripGuide || 'ROAD TRIP GUIDE', 50, 50);
  doc.moveDown(1.5);

  if (guide.carPickupChecklist.length > 0) {
    doc.fillColor(WINE_RED)
      .fontSize(12)
      .font(TITLE_FONT)
      .text(pt.rtgChecklist || 'Car Pickup Checklist');
    doc.moveDown(0.5);

    guide.carPickupChecklist.forEach((item, idx) => {
      ensureSpace(doc, 20);
      doc.fillColor(DARK_TEXT)
        .fontSize(10)
        .font(BODY_FONT)
        .text(`${idx + 1}. ${locPdf(item, lang)}`, 60, doc.y, { width: pageWidth - 20 });
      doc.moveDown(0.3);
    });
    doc.moveDown(1);
  }

  if (guide.narratedBlocks.length > 0) {
    ensureSpace(doc, 40);
    doc.fillColor(WINE_RED)
      .fontSize(12)
      .font(TITLE_FONT)
      .text(pt.rtgNarrated || 'Narrated Route');
    doc.moveDown(0.5);

    guide.narratedBlocks.forEach((block) => {
      ensureSpace(doc, 60);

      doc.fillColor(WINE_RED)
        .fontSize(11)
        .font(BOLD_FONT)
        .text(locPdf(block.title, lang), 50, doc.y, { width: pageWidth });
      doc.moveDown(0.3);

      doc.fillColor(DARK_TEXT)
        .fontSize(10)
        .font(BODY_FONT)
        .text(locPdf(block.content, lang), 60, doc.y, { width: pageWidth - 20 });
      doc.moveDown(0.4);

      if (block.tip) {
        const tipText = locPdf(block.tip, lang);
        if (tipText) {
          ensureSpace(doc, 25);
          doc.fillColor('#2563EB')
            .fontSize(9)
            .font(BOLD_FONT)
            .text(`${pt.rtgTip || 'Tip'}: `, 60, doc.y, { continued: true });
          doc.font(BODY_FONT)
            .fillColor(GRAY_TEXT)
            .text(tipText, { width: pageWidth - 30 });
          doc.moveDown(0.2);
        }
      }

      if (block.alert) {
        const alertText = locPdf(block.alert, lang);
        if (alertText) {
          ensureSpace(doc, 25);
          doc.fillColor('#D97706')
            .fontSize(9)
            .font(BOLD_FONT)
            .text(`${pt.rtgAlert || 'Alert'}: `, 60, doc.y, { continued: true });
          doc.font(BODY_FONT)
            .fillColor(GRAY_TEXT)
            .text(alertText, { width: pageWidth - 30 });
          doc.moveDown(0.2);
        }
      }

      if (block.suggestion) {
        const sugText = locPdf(block.suggestion, lang);
        if (sugText) {
          ensureSpace(doc, 25);
          doc.fillColor('#059669')
            .fontSize(9)
            .font(BOLD_FONT)
            .text(`${pt.rtgSuggestion || 'Suggestion'}: `, 60, doc.y, { continued: true });
          doc.font(BODY_FONT)
            .fillColor(GRAY_TEXT)
            .text(sugText, { width: pageWidth - 30 });
          doc.moveDown(0.2);
        }
      }

      doc.moveDown(0.8);
    });
  }

  const categories = [
    { key: 'documents', label: pt.rtgDocuments || 'Documents', items: guide.whatToBring.documents },
    { key: 'comfort', label: pt.rtgComfort || 'Comfort', items: guide.whatToBring.comfort },
    { key: 'safety', label: pt.rtgSafety || 'Safety', items: guide.whatToBring.safety },
    { key: 'technology', label: pt.rtgTechnology || 'Technology', items: guide.whatToBring.technology },
    { key: 'climate', label: pt.rtgClimate || 'Climate', items: guide.whatToBring.climate },
  ];

  const hasItems = categories.some(c => c.items.length > 0);
  if (hasItems) {
    ensureSpace(doc, 40);
    doc.fillColor(WINE_RED)
      .fontSize(12)
      .font(TITLE_FONT)
      .text(pt.rtgWhatToBring || 'What to Bring / Prepare');
    doc.moveDown(0.5);

    categories.forEach(({ label, items }) => {
      if (items.length === 0) return;
      ensureSpace(doc, 30);
      doc.fillColor(WINE_RED)
        .fontSize(10)
        .font(BOLD_FONT)
        .text(label, 60);
      doc.moveDown(0.2);
      items.forEach(item => {
        ensureSpace(doc, 15);
        doc.fillColor(DARK_TEXT)
          .fontSize(9)
          .font(BODY_FONT)
          .text(`• ${locPdf(item, lang)}`, 70, doc.y, { width: pageWidth - 30 });
        doc.moveDown(0.2);
      });
      doc.moveDown(0.3);
    });
    doc.moveDown(0.5);
  }

  if (guide.drivingTips.length > 0) {
    ensureSpace(doc, 40);
    doc.fillColor(WINE_RED)
      .fontSize(12)
      .font(TITLE_FONT)
      .text(pt.rtgDrivingTips || 'Driving Tips & Safety');
    doc.moveDown(0.5);

    guide.drivingTips.forEach((tip, idx) => {
      ensureSpace(doc, 20);
      doc.fillColor(DARK_TEXT)
        .fontSize(10)
        .font(BODY_FONT)
        .text(`${idx + 1}. ${locPdf(tip, lang)}`, 60, doc.y, { width: pageWidth - 20 });
      doc.moveDown(0.3);
    });
    doc.moveDown(0.5);
  }

  if (guide.planB.length > 0) {
    ensureSpace(doc, 40);
    doc.fillColor(WINE_RED)
      .fontSize(12)
      .font(TITLE_FONT)
      .text(pt.rtgPlanB || 'Plan B');
    doc.moveDown(0.5);

    guide.planB.forEach(plan => {
      ensureSpace(doc, 35);
      doc.fillColor(DARK_TEXT)
        .fontSize(10)
        .font(BOLD_FONT)
        .text(locPdf(plan.scenario, lang), 60, doc.y, { width: pageWidth - 20 });
      doc.moveDown(0.2);
      doc.fillColor(GRAY_TEXT)
        .font(BODY_FONT)
        .text(locPdf(plan.solution, lang), 60, doc.y, { width: pageWidth - 20 });
      doc.moveDown(0.5);
    });
  }

  if (guide.googleMapsLinks.length > 0) {
    ensureSpace(doc, 40);
    doc.fillColor(WINE_RED)
      .fontSize(12)
      .font(TITLE_FONT)
      .text(pt.rtgMaps || 'Route Maps');
    doc.moveDown(0.5);

    guide.googleMapsLinks.forEach(link => {
      ensureSpace(doc, 25);
      doc.fillColor(WINE_RED)
        .fontSize(10)
        .font(BOLD_FONT)
        .text(link.label, 60, doc.y, { link: link.url, underline: true });
      doc.moveDown(0.3);
    });
    doc.moveDown(0.5);
  }

  if (guide.summary) {
    ensureSpace(doc, 60);
    doc.fillColor(WINE_RED)
      .fontSize(12)
      .font(TITLE_FONT)
      .text(pt.rtgSummary || 'Quick Summary');
    doc.moveDown(0.5);
    doc.fillColor(DARK_TEXT)
      .fontSize(10)
      .font(BODY_FONT)
      .text(locPdf(guide.summary, lang), 50, doc.y, { width: pageWidth });
    doc.moveDown(1);
  }
}

export async function generateItineraryPDF(itinerary: Itinerary, sessionId: string, lang: PdfLang = 'EN'): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = `itinerary_${sessionId}.pdf`;
    const filePath = path.join(PDFS_DIR, fileName);
    const pt = pdfTranslations[lang] || pdfTranslations.EN;
    
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 50, right: 50 }
    });

    registerFonts(doc);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const pageWidth = doc.page.width - 100;

    if (fs.existsSync(LOGO_PATH)) {
      try {
        doc.image(LOGO_PATH, (doc.page.width - 150) / 2, 30, { width: 150 });
        doc.y = 100;
      } catch (e) {
        doc.y = 40;
      }
    }

    const customerName = itinerary.quizData.customerName;
    const pdfTitle = customerName 
      ? `${customerName}${pt.titlePersonalized}`
      : pt.title;
    
    doc.fillColor(WINE_RED)
      .fontSize(22)
      .font(TITLE_FONT)
      .text(pdfTitle, { align: 'center' });
    
    doc.moveDown(2);

    const infoStartY = doc.y;
    const columnWidth = pageWidth / 2 - 20;

    doc.fillColor(DARK_TEXT)
      .fontSize(11)
      .font(BOLD_FONT)
      .text(`${pt.duration} `, 50, infoStartY);
    doc.font(BODY_FONT)
      .text(`${itinerary.days.length} ${itinerary.days.length > 1 ? pt.days : pt.day}`, 120, infoStartY);
    
    doc.font(BOLD_FONT)
      .text(`${pt.budget} `, 50);
    const budgetY = doc.y - 13;
    doc.font(BODY_FONT)
      .text(itinerary.quizData.budget, 120, budgetY);
    
    doc.font(BOLD_FONT)
      .text(`${pt.travelType} `, 50);
    const travelY = doc.y - 13;
    doc.font(BODY_FONT)
      .text(itinerary.quizData.travelers, 130, travelY);
    
    if (itinerary.quizData.startDate && itinerary.quizData.endDate) {
      doc.font(BOLD_FONT)
        .text(`${pt.dates} `, 50);
      const datesY = doc.y - 13;
      doc.font(BODY_FONT)
        .text(`${itinerary.quizData.startDate} ${pt.datesTo} ${itinerary.quizData.endDate}`, 100, datesY);
    }

    const highlightsX = doc.page.width / 2 + 20;
    
    doc.fillColor(WINE_RED)
      .fontSize(12)
      .font(TITLE_FONT)
      .text(pt.highlights, highlightsX, infoStartY, { width: columnWidth });
    
    doc.moveDown(0.5);
    
    doc.fillColor(DARK_TEXT)
      .fontSize(10)
      .font(BODY_FONT);
    
    const highlights = itinerary.highlights.slice(0, 4);
    highlights.forEach((highlight, index) => {
      doc.text(`${index + 1}. ${highlight}`, highlightsX, doc.y, { width: columnWidth });
      doc.moveDown(0.3);
    });

    itinerary.days.forEach((day) => {
      doc.addPage();
      
      doc.fillColor(WINE_RED)
        .fontSize(16)
        .font(TITLE_FONT)
        .text(`${pt.dayLabel} ${day.day} - ${day.region.toUpperCase()}`, 50, 50);
      
      doc.moveDown(1.5);

      if (day.carRentalPickup) {
        doc.fillColor(WINE_RED)
          .fontSize(11)
          .font(BOLD_FONT)
          .text(`${pt.carPickup} - 08:00`);
        doc.moveDown(0.3);
        doc.fillColor(DARK_TEXT)
          .fontSize(10)
          .font(BODY_FONT)
          .text(day.carRentalPickup.provider);
        doc.moveDown(0.8);
      }

      renderActivityBlock(doc, day.morning, pt.morning, pt);
      renderActivityBlock(doc, day.afternoon, pt.afternoon, pt);
      renderActivityBlock(doc, day.evening, pt.evening, pt);

      if (day.hotel) {
        doc.moveDown(0.5);
        doc.fillColor(WINE_RED)
          .fontSize(11)
          .font(BOLD_FONT)
          .text(pt.overnightStay);
        doc.moveDown(0.3);
        doc.fillColor(DARK_TEXT)
          .fontSize(10)
          .font(BOLD_FONT)
          .text(day.hotel.name);
        if (day.hotel.description) {
          doc.font(BODY_FONT)
            .fillColor(GRAY_TEXT)
            .text(day.hotel.description);
        }
        doc.moveDown(0.5);
      }
    });

    if (itinerary.recommendations.accommodation || itinerary.recommendations.carRental) {
      doc.addPage();
      
      doc.fillColor(WINE_RED)
        .fontSize(16)
        .font(TITLE_FONT)
        .text(pt.recommendations, 50, 50);
      
      doc.moveDown(1.5);

      if (itinerary.recommendations.accommodation) {
        doc.fillColor(WINE_RED)
          .fontSize(12)
          .font(TITLE_FONT)
          .text(pt.accommodation);
        
        doc.moveDown(0.5);
        
        doc.fillColor(DARK_TEXT)
          .fontSize(11)
          .font(BOLD_FONT)
          .text(itinerary.recommendations.accommodation.name);
        
        if (itinerary.recommendations.accommodation.address) {
          doc.fontSize(10)
            .font(BODY_FONT)
            .fillColor(GRAY_TEXT)
            .text(itinerary.recommendations.accommodation.address);
        }
        
        if (itinerary.recommendations.accommodation.affiliateUrl) {
          doc.moveDown(0.5);
          const buttonY = doc.y;
          const buttonWidth = 100;
          const buttonHeight = 24;
          
          doc.roundedRect(50, buttonY, buttonWidth, buttonHeight, 4)
            .fill(WINE_RED);
          
          doc.fillColor('#ffffff')
            .fontSize(10)
            .font(BOLD_FONT)
            .text(pt.bookNow, 50, buttonY + 7, { 
              width: buttonWidth, 
              align: 'center',
              link: itinerary.recommendations.accommodation.affiliateUrl
            });
          
          doc.y = buttonY + buttonHeight + 20;
        }
        
        doc.moveDown(1.5);
      }

      if (itinerary.recommendations.carRental) {
        doc.fillColor(WINE_RED)
          .fontSize(12)
          .font(TITLE_FONT)
          .text(pt.carRental);
        
        doc.moveDown(0.5);
        
        doc.fillColor(DARK_TEXT)
          .fontSize(11)
          .font(BOLD_FONT)
          .text(itinerary.recommendations.carRental.provider);
        
        doc.moveDown(0.5);
        
        const buttonY = doc.y;
        const buttonWidth = 100;
        const buttonHeight = 24;
        
        doc.roundedRect(50, buttonY, buttonWidth, buttonHeight, 4)
          .fill(WINE_RED);
        
        doc.fillColor('#ffffff')
          .fontSize(10)
          .font(BOLD_FONT)
          .text(pt.bookNow, 50, buttonY + 7, { 
            width: buttonWidth, 
            align: 'center',
            link: itinerary.recommendations.carRental.affiliateUrl
          });
        
        doc.y = buttonY + buttonHeight + 20;
      }
    }

    if (itinerary.recommendations.tips.length > 0) {
      doc.moveDown(1);
      
      doc.fillColor(WINE_RED)
        .fontSize(12)
        .font(TITLE_FONT)
        .text(pt.travelTips);
      
      doc.moveDown(0.5);
      
      doc.fillColor(DARK_TEXT)
        .fontSize(10)
        .font(BODY_FONT);
      
      itinerary.recommendations.tips.forEach((tip, index) => {
        doc.text(`${index + 1}. ${tip}`, { indent: 10 });
        doc.moveDown(0.3);
      });
    }

    if (itinerary.roadTripGuide) {
      renderRoadTripGuide(doc, itinerary.roadTripGuide, pt, lang);
    }

    doc.moveDown(3);
    
    doc.fillColor(GRAY_TEXT)
      .fontSize(9)
      .font(BODY_FONT)
      .text(pt.support, { align: 'center' });
    
    doc.fillColor(WINE_RED)
      .text('contacto@lisbonwineroutes.com', { 
        align: 'center', 
        link: 'mailto:contacto@lisbonwineroutes.com',
        underline: true
      });

    doc.moveDown(1.5);

    doc.fillColor(GRAY_TEXT)
      .fontSize(9)
      .font(BODY_FONT)
      .text(pt.moreInfo, { align: 'center' });

    doc.fillColor(WINE_RED)
      .text('www.lisbonwineroutes.com', {
        align: 'center',
        link: 'https://www.lisbonwineroutes.com/',
        underline: true
      });

    doc.end();

    stream.on('finish', () => {
      resolve(filePath);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}
