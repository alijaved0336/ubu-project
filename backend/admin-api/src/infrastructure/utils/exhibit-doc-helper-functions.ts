// Utility method to generate party details
export const generatePartyDetails = (doc, title: string, name: string, address: string, email: string, phone: string) => {
  doc.font('Helvetica-Bold').fontSize(11).text(`${title}:`);
  doc.font('Helvetica').fontSize(11).text(`${name}`);
  doc.font('Helvetica').fontSize(11).text(`${address}`);
  doc.font('Helvetica').fontSize(11).text(`${email}`);
  doc.font('Helvetica').fontSize(11).text(`${phone}`).moveDown(2);
};

export const generateSection = (doc, title: string, content: string) => {
  const bulletIndent = 40;
  const textIndent = 50;
  const contentWidth = doc.page.width - textIndent - doc.page.margins.right;

  doc.font('Helvetica-Bold').fontSize(11).text(title).moveDown(1);
  doc.font('Helvetica-Bold').fontSize(11).text('• Description of Work:', { indent: 20 }).moveDown(0.5);
  doc
    .font('Helvetica')
    .fontSize(11)
    .text(content, doc.x + 30, doc.y, {
      width: contentWidth,
      align: 'justify',
      textIndent: 40,
    })
    .moveDown(2);
};

// Deliverables Section
export const generateDeliverables = (doc, payload) => {
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('2. Deliverables', doc.x - 30, doc.y)
    .moveDown(1);
  doc.font('Helvetica-Bold').fontSize(11).text(`• Number of Deliverables:`, { indent: 20 }).moveDown(0.5);

  if (Array.isArray(payload.numberOfDeliverables)) {
    console.log('array error->>', payload.numberOfDeliverables);

    const deliverables = payload.numberOfDeliverables.filter((d) => d).map((d) => `Number of ${d.type}: ${d.count}`);

    doc.font('Helvetica').fontSize(11).list(deliverables, { bulletRadius: 2, indent: 40 }).moveDown(0.5);
  } else {
    console.error('numberOfDeliverables is not an array');
  }

  if (payload.hashtags && payload.hashtags.length > 0) {
    const validHashtags = payload.hashtags.filter((h) => h);
    doc.font('Helvetica-Bold').fontSize(11).text('• Specific Hashtags:', { indent: 20 }).moveDown(0.5);
    doc.font('Helvetica').fontSize(11).list(validHashtags, { bulletRadius: 2, indent: 40 }).moveDown(0.5);
  }

  if (payload.additionalRequirements) {
    doc.font('Helvetica-Bold').fontSize(11).text(`• Additional Requirements:`, { indent: 20 }).moveDown(0.5);
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${payload.additionalRequirements}`, doc.x + 40, doc.y, {})
      .moveDown(2);
  } else {
    doc
      .font('Helvetica')
      .fontSize(11)
      .text('', doc.x + 40, doc.y, {})
      .moveDown(2);
  }
};

// Timeline Section (updated to use fields from the payload)
export const generateTimeline = (doc, campaignAcceptanceDeadline: string, publicationDates: string) => {
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('3. Timeline', doc.x - 40, doc.y)
    .moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(11).text(`• Campaign Acceptance Deadline:`, { align: 'justify', indent: 20 }).moveDown(0.5);
  doc.font('Helvetica').fontSize(11).text(`• ${campaignAcceptanceDeadline}`, { align: 'justify', indent: 40 }).moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(11).text(`• Publication Dates:`, { align: 'justify', indent: 20 }).moveDown(0.5);
  doc.font('Helvetica').fontSize(11).text(`• ${publicationDates}`, { align: 'justify', indent: 40 }).moveDown(2);
};

// Compensation Section
export const generateCompensation = (doc, totalCompensation: number) => {
  doc.font('Helvetica-Bold').fontSize(11).text('4. Compensation').moveDown(0.5);
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text(`• Total Compensation: $${totalCompensation.toFixed(2)}`, {
      align: 'justify',
      indent: 20,
    })
    .moveDown(0.5);
  doc
    .font('Helvetica')
    .fontSize(11)
    .text(`• $${totalCompensation.toFixed(2)} (Total amount to be paid to the Content Creator for the work)`, { align: 'justify', indent: 40 })
    .moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(11).text(`• Payment Schedule:`, { align: 'justify', indent: 20 }).moveDown(0.5);
  doc
    .font('Helvetica')
    .fontSize(11)
    .text(`• 50% of the total compensation within 48 hours of the requested post date.`, { align: 'justify', indent: 40 })
    .moveDown(0.5);
  doc
    .font('Helvetica')
    .fontSize(11)
    .text(`• 50% of the total compensation within 7 days after the completion and publication of all deliverables.`, doc.x + 40, doc.y, {})
    .moveDown(2);
};

// Content Guidelines Section
export const generateContentGuidelines = (doc, brandGuidelines?: string) => {
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('5. Content Guidelines', doc.x - 40, doc.y)
    .moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(11).text(`• Brand Guidelines:`, { align: 'justify', indent: 20 }).moveDown(0.5);
  doc
    .font('Helvetica')
    .fontSize(11)
    .text(
      `• The Content Creator must adhere to the Brand’s content guidelines, which include [details on tone, style, aesthetic, and target audience].`,
      doc.x + 40,
      doc.y,
      { align: 'justify' },
    )
    .moveDown(0.5);
  if (brandGuidelines) {
    doc.font('Helvetica').fontSize(11).text(`• Please consider the following brand-guidelines: ${brandGuidelines}`, { align: 'justify' }).moveDown(2);
  }
};

// Communications Section
export const generateCommunicationSection = (doc, brandDetails, influencerDetails) => {
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('6. Communication', doc.x - 40, doc.y)
    .moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(11).text(`• Contact Information:`, { align: 'justify', indent: 20 }).moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(11).text(`• Brand Representative Name: `, {
    align: 'justify',
    indent: 40,
    continued: true,
  });
  doc.font('Helvetica').fontSize(11).text(`${brandDetails.name}`, { align: 'justify', indent: 40 }).moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(11).text(`• Brand Email: `, {
    align: 'justify',
    indent: 40,
    continued: true,
  });
  doc.font('Helvetica').fontSize(11).text(`${brandDetails.email}`, { align: 'justify', indent: 40 }).moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(11).text(`• Content Creator Email: `, {
    align: 'justify',
    indent: 40,
    continued: true,
  });
  doc.font('Helvetica').fontSize(11).text(`${influencerDetails.email}`, { align: 'justify', indent: 40 }).moveDown(0.5);
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text(`• Preferred Communication Method:`, {
      align: 'justify',
      indent: 20,
    })
    .moveDown(0.5);
  doc.font('Helvetica').fontSize(11).text(`• UBU Platform`, { align: 'justify', indent: 40 }).moveDown(2);
};

// Special Conditions Section
export const generateAdditionalNotes = (doc, specialConditions?: string, revisions?: { number: number; turnaroundTime: number }) => {
  if (specialConditions || revisions) {
    doc.font('Helvetica-Bold').fontSize(11).text('7. Additional Notes').moveDown(0.5);
    if (specialConditions) {
      doc.font('Helvetica-Bold').fontSize(11).text(`• Special Conditions:`, { align: 'justify', indent: 20 }).moveDown(0.5);
      doc
        .font('Helvetica')
        .fontSize(11)
        .text(`${specialConditions}`, doc.x + 40, doc.y, { align: 'justify' })
        .moveDown(0.5);
    } else {
      doc
        .font('Helvetica')
        .fontSize(11)
        .text(``, doc.x + 40, doc.y, { align: 'justify' })
        .moveDown();
    }
    if (revisions) {
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('• Revisions', doc.x - 40, doc.y, { indent: 20 })
        .moveDown(0.5);
      doc
        .font('Helvetica')
        .fontSize(11)
        .text(`• Number of Revisions: ${revisions.number}`, {
          align: 'justify',
          indent: 40,
        })
        .moveDown(0.5);
      doc
        .font('Helvetica')
        .fontSize(11)
        .text(`• Revision Turnaround Time: ${revisions.turnaroundTime} hours`, {
          align: 'justify',
          indent: 40,
        })
        .moveDown(2);
    }
  }
};
