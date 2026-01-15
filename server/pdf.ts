import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import type { Itinerary, Activity } from '@shared/schema';

const PDFS_DIR = path.join(process.cwd(), 'attached_assets', 'pdfs');

if (!fs.existsSync(PDFS_DIR)) {
  fs.mkdirSync(PDFS_DIR, { recursive: true });
}

function renderActivity(doc: PDFKit.PDFDocument, activity: Activity, period: string) {
  doc.fontSize(12).font('Helvetica-Bold').text(period, { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(11).font('Helvetica');
  doc.text(`Time: ${activity.time}`);
  doc.text(`Location: ${activity.location}`);
  doc.text(`Activity: ${activity.activity}`);
  doc.text(`Duration: ${activity.duration}`);
  
  if (activity.address) {
    doc.text(`Address: ${activity.address}`);
  }
  
  doc.moveDown(0.3);
  doc.text(activity.description, { width: 500 });
  
  if (activity.affiliateUrl) {
    doc.moveDown(0.2);
    doc.fillColor('#7c3aed').text('Book Now', { 
      link: activity.affiliateUrl,
      underline: true 
    });
    doc.fillColor('#000000');
  }
  
  doc.moveDown(1);
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

      renderActivity(doc, day.morning, 'Morning');
      renderActivity(doc, day.afternoon, 'Afternoon');
      renderActivity(doc, day.evening, 'Evening');
    });

    doc.addPage();
    doc.fontSize(16).font('Helvetica-Bold').text('Recommendations');
    doc.moveDown(1);

    if (itinerary.recommendations.restaurants.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Recommended Restaurants');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      
      itinerary.recommendations.restaurants.forEach((restaurant, index) => {
        doc.font('Helvetica-Bold').text(`${index + 1}. ${restaurant.name}`, { indent: 20 });
        if (restaurant.address) {
          doc.font('Helvetica').text(`   Address: ${restaurant.address}`, { indent: 20 });
        }
        if (restaurant.description) {
          doc.font('Helvetica').text(`   ${restaurant.description}`, { indent: 20 });
        }
        doc.moveDown(0.3);
      });
      
      doc.moveDown(1);
    }

    if (itinerary.recommendations.accommodation) {
      doc.fontSize(14).font('Helvetica-Bold').text('Accommodation');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`${itinerary.recommendations.accommodation.name}`, { indent: 20 });
      if (itinerary.recommendations.accommodation.address) {
        doc.text(`Address: ${itinerary.recommendations.accommodation.address}`, { indent: 20 });
      }
      if (itinerary.recommendations.accommodation.affiliateUrl) {
        doc.fillColor('#7c3aed').text('Book Now', { 
          indent: 20,
          link: itinerary.recommendations.accommodation.affiliateUrl,
          underline: true 
        });
        doc.fillColor('#000000');
      }
      doc.moveDown(1);
    }

    if (itinerary.recommendations.carRental) {
      doc.fontSize(14).font('Helvetica-Bold').text('Car Rental');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Provider: ${itinerary.recommendations.carRental.provider}`, { indent: 20 });
      doc.fillColor('#7c3aed').text('Book Your Car', { 
        indent: 20,
        link: itinerary.recommendations.carRental.affiliateUrl,
        underline: true 
      });
      doc.fillColor('#000000');
      doc.moveDown(1);
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
