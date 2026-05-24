import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateOrderPDF = (order, items, vendor) => {
  const doc = new jsPDF();
  const primary = [22, 163, 74];
  const dark = [15, 23, 42];
  const gray = [100, 116, 139];

  // Header background
  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 40, 'F');

  // Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('DIAGOSO', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('La Maison du Commerce — Mali', 14, 26);
  doc.text('diagoso.ml | contact@diagoso.ml', 14, 33);

  // Invoice label
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURE', 196, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(order.order_number, 196, 28, { align: 'right' });

  // Vendor info
  doc.setTextColor(...dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('VENDEUR', 14, 54);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.text(vendor?.shop_name || vendor?.full_name || '', 14, 61);
  doc.text(vendor?.phone || '', 14, 67);
  doc.text(vendor?.email || '', 14, 73);
  doc.text(vendor?.city || 'Bamako, Mali', 14, 79);

  // Customer info
  doc.setTextColor(...dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', 120, 54);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.text(order.customer_name, 120, 61);
  doc.text(order.customer_phone, 120, 67);
  if (order.customer_address) doc.text(order.customer_address, 120, 73);
  doc.text(order.customer_city || 'Bamako, Mali', 120, order.customer_address ? 79 : 73);

  // Meta
  doc.setTextColor(...dark);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 14, 92);
  doc.text('Statut paiement:', 14, 98);
  doc.text('Mode de paiement:', 14, 104);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  doc.text(new Date(order.created_at).toLocaleDateString('fr-FR'), 55, 92);
  doc.text(order.payment_status === 'paid' ? 'Payée ✓' : 'En attente', 55, 98);
  const payMap = { cash: 'Espèces', orange_money: 'Orange Money', wave: 'Wave', moov_money: 'Moov Money' };
  doc.text(payMap[order.payment_method] || order.payment_method, 55, 104);

  // Items table
  doc.autoTable({
    startY: 114,
    head: [['Produit', 'Prix unitaire', 'Qté', 'Total']],
    body: items.map(i => [
      i.product_name,
      Number(i.product_price).toLocaleString('fr-FR') + ' FCFA',
      i.quantity,
      Number(i.subtotal).toLocaleString('fr-FR') + ' FCFA'
    ]),
    headStyles: { fillColor: primary, textColor: [255,255,255], fontStyle: 'bold', fontSize: 10 },
    bodyStyles: { fontSize: 10, textColor: dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 0: { cellWidth: 80 }, 1: { halign: 'right' }, 2: { halign: 'center', cellWidth: 20 }, 3: { halign: 'right', fontStyle: 'bold' } },
    margin: { left: 14, right: 14 }
  });

  const finalY = doc.lastAutoTable.finalY + 8;

  // Totals
  const totalsX = 120;
  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.text('Sous-total:', totalsX, finalY);
  doc.text(Number(order.subtotal).toLocaleString('fr-FR') + ' FCFA', 196, finalY, { align: 'right' });
  doc.text('Livraison:', totalsX, finalY + 7);
  doc.text(Number(order.delivery_fee || 0).toLocaleString('fr-FR') + ' FCFA', 196, finalY + 7, { align: 'right' });

  // Total box
  doc.setFillColor(...primary);
  doc.roundedRect(totalsX - 4, finalY + 12, 84, 14, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', totalsX, finalY + 22);
  doc.text(Number(order.total).toLocaleString('fr-FR') + ' FCFA', 196, finalY + 22, { align: 'right' });

  // Notes
  if (order.notes) {
    doc.setTextColor(...dark);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 14, finalY + 36);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text(order.notes, 14, finalY + 43);
  }

  // Footer
  const pageH = doc.internal.pageSize.height;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, pageH - 20, 210, 20, 'F');
  doc.setTextColor(...gray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('DIAGOSO — La Maison du Commerce | Bamako, Mali | www.diagoso.ml', 105, pageH - 11, { align: 'center' });
  doc.text('Merci pour votre confiance ! 🙏', 105, pageH - 5, { align: 'center' });

  doc.save(`Facture-${order.order_number}.pdf`);
};

export const generateSubscriptionPDF = (invoice, vendor) => {
  const doc = new jsPDF();
  const primary = [22, 163, 74];
  const dark = [15, 23, 42];
  const gray = [100, 116, 139];

  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('DIAGOSO', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('La Maison du Commerce — Mali', 14, 26);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURE ABONNEMENT', 196, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoice_number, 196, 28, { align: 'right' });

  doc.setTextColor(...dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Facture destinée à :', 14, 58);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...gray);
  doc.text(vendor?.shop_name || '', 14, 66);
  doc.text(vendor?.full_name || '', 14, 73);
  doc.text(vendor?.email || '', 14, 80);
  doc.text(vendor?.phone || '', 14, 87);

  doc.setTextColor(...dark);
  doc.setFontSize(10);
  doc.text(`Période : ${new Date(invoice.period_start).toLocaleDateString('fr-FR')} → ${new Date(invoice.period_end).toLocaleDateString('fr-FR')}`, 14, 100);
  doc.text(`Émise le : ${new Date(invoice.created_at).toLocaleDateString('fr-FR')}`, 14, 108);

  doc.autoTable({
    startY: 120,
    head: [['Description', 'Montant']],
    body: [['Abonnement mensuel DIAGOSO — Accès plateforme e-commerce', '10 000 FCFA']],
    headStyles: { fillColor: primary, textColor: [255,255,255], fontStyle: 'bold' },
    bodyStyles: { fontSize: 11, textColor: dark },
    columnStyles: { 0: { cellWidth: 140 }, 1: { halign: 'right', fontStyle: 'bold', cellWidth: 40 } },
    margin: { left: 14, right: 14 }
  });

  const fy = doc.lastAutoTable.finalY + 16;
  doc.setFillColor(...primary);
  doc.roundedRect(110, fy, 86, 18, 4, 4, 'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL À PAYER: 10 000 FCFA', 153, fy + 12, { align: 'center' });

  doc.setTextColor(...gray);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Modes de paiement acceptés: Orange Money (+223 XX XX XX XX) · Wave · Moov Money · Espèces', 14, fy + 36);

  const pageH = doc.internal.pageSize.height;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, pageH - 20, 210, 20, 'F');
  doc.setTextColor(...gray);
  doc.setFontSize(8);
  doc.text('DIAGOSO — La Maison du Commerce | Bamako, Mali', 105, pageH - 11, { align: 'center' });
  doc.text('Merci de votre confiance et de votre paiement dans les délais ! 🙏', 105, pageH - 5, { align: 'center' });

  doc.save(`Abonnement-DIAGOSO-${invoice.invoice_number}.pdf`);
};
