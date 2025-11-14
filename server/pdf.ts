import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import type { Itinerary } from '@shared/schema';

const PDFS_DIR = path.join(process.cwd(), 'attached_assets', 'pdfs');

if (!fs.existsSync(PDFS_DIR)) {
  fs.mkdirSync(PDFS_DIR, { recursive: true });
}

export async function generateItineraryPDF(itinerary: Itinerary, sessionId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = `itinerary_${sessionId}.pdf`;
    const filePath = path.join(PDFS_DIR, fileName);
    
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(24).font('Helvetica-Bold').text('Lisbon Wine Routes', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).font('Helvetica').text('Personalized Wine Tourism Itinerary', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12).font('Helvetica');
    doc.text(`Duration: ${itinerary.days.length} days`);
    doc.text(`Budget: ${itinerary.quizData.budget}`);
    doc.text(`Travel Type: ${itinerary.quizData.travelers}`);
    
    if (itinerary.quizData.startDate && itinerary.quizData.endDate) {
      doc.text(`Dates: ${itinerary.quizData.startDate} to ${itinerary.quizData.endDate}`);
    }
    
    doc.moveDown(2);

    doc.fontSize(14).font('Helvetica-Bold').text('Itinerary Highlights');
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    
    itinerary.highlights.forEach((highlight, index) => {
      doc.text(`${index + 1}. ${highlight}`, { indent: 20 });
    });
    
    doc.moveDown(2);

    itinerary.days.forEach((day) => {
      doc.addPage();
      
      doc.fontSize(18).font('Helvetica-Bold').text(`Day ${day.day} - ${day.region}`, { underline: true });
      doc.moveDown(1);

      doc.fontSize(12).font('Helvetica-Bold').text('Morning', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Time: ${day.morning.time}`);
      doc.text(`Location: ${day.morning.location}`);
      doc.text(`Activity: ${day.morning.activity}`);
      doc.text(`Duration: ${day.morning.duration}`);
      doc.moveDown(0.3);
      doc.text(day.morning.description, { width: 500 });
      doc.moveDown(1);

      doc.fontSize(12).font('Helvetica-Bold').text('Afternoon', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Time: ${day.afternoon.time}`);
      doc.text(`Location: ${day.afternoon.location}`);
      doc.text(`Activity: ${day.afternoon.activity}`);
      doc.text(`Duration: ${day.afternoon.duration}`);
      doc.moveDown(0.3);
      doc.text(day.afternoon.description, { width: 500 });
      doc.moveDown(1);

      doc.fontSize(12).font('Helvetica-Bold').text('Evening', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Time: ${day.evening.time}`);
      doc.text(`Location: ${day.evening.location}`);
      doc.text(`Activity: ${day.evening.activity}`);
      doc.text(`Duration: ${day.evening.duration}`);
      doc.moveDown(0.3);
      doc.text(day.evening.description, { width: 500 });
    });

    doc.addPage();
    doc.fontSize(16).font('Helvetica-Bold').text('Recommendations');
    doc.moveDown(1);

    if (itinerary.recommendations.restaurants.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Recommended Restaurants');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      
      itinerary.recommendations.restaurants.forEach((restaurant, index) => {
        doc.text(`${index + 1}. ${restaurant}`, { indent: 20 });
      });
      
      doc.moveDown(1.5);
    }

    if (itinerary.recommendations.tips.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Travel Tips');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      
      itinerary.recommendations.tips.forEach((tip, index) => {
        doc.text(`${index + 1}. ${tip}`, { indent: 20 });
      });
    }

    doc.moveDown(3);
    doc.fontSize(10).font('Helvetica').text('For support or personalized assistance:', { align: 'center' });
    doc.text('contacto@lisbonwineroutes.com', { align: 'center', link: 'mailto:contacto@lisbonwineroutes.com' });

    doc.end();

    stream.on('finish', () => {
      resolve(filePath);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}
