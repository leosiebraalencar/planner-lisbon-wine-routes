import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import type { Itinerary, Activity } from '@shared/schema';

const PDFS_DIR = path.join(process.cwd(), 'attached_assets', 'pdfs');

if (!fs.existsSync(PDFS_DIR)) {
  fs.mkdirSync(PDFS_DIR, { recursive: true });
}

const WINE_RED = '#722F37';
const DARK_TEXT = '#1a1a1a';
const GRAY_TEXT = '#4a4a4a';
const LIGHT_GRAY = '#f5f5f5';

const LOGO_PATH = path.join(process.cwd(), 'attached_assets', 'marca-lisbon-wine-routes-1_1763141966678.png');

function renderActivityBlock(
  doc: PDFKit.PDFDocument, 
  activity: Activity, 
  period: string,
  periodLabel: string
) {
  const startY = doc.y;
  const pageWidth = doc.page.width - 100;
  
  doc.fillColor(WINE_RED)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text(periodLabel.toUpperCase(), 50, startY);
  
  doc.fillColor(GRAY_TEXT)
    .fontSize(10)
    .font('Helvetica')
    .text(`Time: ${activity.time}`, pageWidth - 80, startY, { align: 'right', width: 130 });
  
  doc.y = startY + 25;
  
  doc.rect(50, doc.y, pageWidth, 1).fill(LIGHT_GRAY);
  doc.y += 15;
  
  doc.fillColor(DARK_TEXT)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text(`Location: `, 60)
    .font('Helvetica')
    .text(activity.location, 120, doc.y - 13);
  
  doc.moveDown(0.3);
  
  doc.font('Helvetica-Bold')
    .text(`Activity: `, 60)
    .font('Helvetica')
    .text(activity.activity, 120, doc.y - 13);
  
  doc.moveDown(0.3);
  
  doc.font('Helvetica-Bold')
    .text(`Duration: `, 60)
    .font('Helvetica')
    .text(activity.duration, 120, doc.y - 13);
  
  doc.moveDown(0.3);
  
  if (activity.address) {
    doc.font('Helvetica-Bold')
      .text(`Address: `, 60)
      .font('Helvetica')
      .text(activity.address, 120, doc.y - 13);
    doc.moveDown(0.3);
  }
  
  doc.moveDown(0.3);
  doc.fillColor(GRAY_TEXT)
    .fontSize(10)
    .font('Helvetica')
    .text(activity.description, 60, doc.y, { width: pageWidth - 20 });
  
  doc.moveDown(0.5);
  doc.fillColor(GRAY_TEXT)
    .fontSize(9)
    .text('Preço médio:', 60);
  
  doc.moveDown(0.5);
  
  if (activity.affiliateUrl) {
    const buttonY = doc.y;
    const buttonWidth = 100;
    const buttonHeight = 24;
    
    doc.roundedRect(60, buttonY, buttonWidth, buttonHeight, 4)
      .fill(WINE_RED);
    
    doc.fillColor('#ffffff')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Book now', 60, buttonY + 7, { 
        width: buttonWidth, 
        align: 'center',
        link: activity.affiliateUrl
      });
    
    doc.y = buttonY + buttonHeight + 5;
  }
  
  doc.moveDown(1.5);
}

export async function generateItineraryPDF(itinerary: Itinerary, sessionId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = `itinerary_${sessionId}.pdf`;
    const filePath = path.join(PDFS_DIR, fileName);
    
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 50, right: 50 }
    });

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

    doc.fillColor(WINE_RED)
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('Personalized Wine Tourism Itinerary', { align: 'center' });
    
    doc.moveDown(2);

    const infoStartY = doc.y;
    const columnWidth = pageWidth / 2 - 20;

    doc.fillColor(DARK_TEXT)
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('Duration: ', 50, infoStartY)
      .font('Helvetica')
      .text(`${itinerary.days.length} day${itinerary.days.length > 1 ? 's' : ''}`, 110, infoStartY);
    
    doc.font('Helvetica-Bold')
      .text('Budget: ', 50)
      .font('Helvetica')
      .text(itinerary.quizData.budget, 110, doc.y - 13);
    
    doc.font('Helvetica-Bold')
      .text('Travel Type: ', 50)
      .font('Helvetica')
      .text(itinerary.quizData.travelers, 130, doc.y - 13);
    
    if (itinerary.quizData.startDate && itinerary.quizData.endDate) {
      doc.font('Helvetica-Bold')
        .text('Dates: ', 50)
        .font('Helvetica')
        .text(`${itinerary.quizData.startDate} to ${itinerary.quizData.endDate}`, 90, doc.y - 13);
    }

    const highlightsX = doc.page.width / 2 + 20;
    
    doc.fillColor(WINE_RED)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('ITINERARY HIGHLIGHTS', highlightsX, infoStartY, { width: columnWidth });
    
    doc.moveDown(0.5);
    
    doc.fillColor(DARK_TEXT)
      .fontSize(10)
      .font('Helvetica');
    
    const highlights = itinerary.highlights.slice(0, 4);
    highlights.forEach((highlight, index) => {
      doc.text(`${index + 1}. ${highlight}`, highlightsX, doc.y, { width: columnWidth });
      doc.moveDown(0.3);
    });

    itinerary.days.forEach((day) => {
      doc.addPage();
      
      doc.fillColor(WINE_RED)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(`DAY ${day.day} - ${day.region.toUpperCase()}`, 50, 50);
      
      doc.moveDown(1.5);

      renderActivityBlock(doc, day.morning, 'morning', 'Morning');
      renderActivityBlock(doc, day.afternoon, 'afternoon', 'Afternoon');
      renderActivityBlock(doc, day.evening, 'evening', 'Evening');
    });

    if (itinerary.recommendations.accommodation || itinerary.recommendations.carRental) {
      doc.addPage();
      
      doc.fillColor(WINE_RED)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('RECOMMENDATIONS', 50, 50);
      
      doc.moveDown(1.5);

      if (itinerary.recommendations.accommodation) {
        doc.fillColor(WINE_RED)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('Accommodation');
        
        doc.moveDown(0.5);
        
        doc.fillColor(DARK_TEXT)
          .fontSize(11)
          .font('Helvetica-Bold')
          .text(itinerary.recommendations.accommodation.name);
        
        if (itinerary.recommendations.accommodation.address) {
          doc.fontSize(10)
            .font('Helvetica')
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
            .font('Helvetica-Bold')
            .text('Book now', 50, buttonY + 7, { 
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
          .font('Helvetica-Bold')
          .text('Car Rental');
        
        doc.moveDown(0.5);
        
        doc.fillColor(DARK_TEXT)
          .fontSize(11)
          .font('Helvetica-Bold')
          .text(itinerary.recommendations.carRental.provider);
        
        doc.moveDown(0.5);
        
        const buttonY = doc.y;
        const buttonWidth = 100;
        const buttonHeight = 24;
        
        doc.roundedRect(50, buttonY, buttonWidth, buttonHeight, 4)
          .fill(WINE_RED);
        
        doc.fillColor('#ffffff')
          .fontSize(10)
          .font('Helvetica-Bold')
          .text('Book now', 50, buttonY + 7, { 
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
        .font('Helvetica-Bold')
        .text('Travel Tips');
      
      doc.moveDown(0.5);
      
      doc.fillColor(DARK_TEXT)
        .fontSize(10)
        .font('Helvetica');
      
      itinerary.recommendations.tips.forEach((tip, index) => {
        doc.text(`${index + 1}. ${tip}`, { indent: 10 });
        doc.moveDown(0.3);
      });
    }

    doc.moveDown(3);
    
    doc.fillColor(GRAY_TEXT)
      .fontSize(9)
      .font('Helvetica')
      .text('For support or personalized assistance:', { align: 'center' });
    
    doc.fillColor(WINE_RED)
      .text('contacto@lisbonwineroutes.com', { 
        align: 'center', 
        link: 'mailto:contacto@lisbonwineroutes.com',
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
