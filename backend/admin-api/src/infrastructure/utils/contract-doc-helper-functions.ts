export const generateHTMLContent = (brandSignUrl: string, influencerSignUrl: string) => {
  const influencerImgDiv = influencerSignUrl
    ? `<div style="float: left; margin-left: 35px;"><img src="${influencerSignUrl}" width="100" height="50" style="margin-bottom: -10px;"/></div>`
    : '';
  const brandImgDiv = brandSignUrl
    ? `<div style="float: right; margin-right: 80px;"><img src="${brandSignUrl}" width="100" height="50" style="margin-bottom: -10px;"/></div>`
    : '';

  return `
              <html>
                <head>
                  <style>
            body {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 13px;
              margin: 0;
              padding: 80px;
            }
            .content {
              margin: 0 auto; /* Center content horizontally */
              padding-left: 50px; /* Add padding to left */
              padding-right: 50px; /* Add padding to right */
              max-width: 800px; /* Optional: Set a maximum width */
            }
            h1 {
              text-align: center;
              font-size: 17px;
              font-weight: bold;
              margin-bottom: 20px;

            }
            h3 {
              font-family: Arial, sans-serif;
              font-size: 17px;
              font-weight: bold;
              margin-top: 20px;
            }
            p,
            ul {
              font-size: 13px;
              line-height: 1.5;
            }
            ul {
              margin-left: 20px;
            }
            </style>
                </head>
                <body>
                  <h1 style="text-align:center;  margin-bottom: 50px">UBU COLLABORATION AGREEMENT STANDARD TERMS</h1>
                    <h3>1. Scope of Work</h3>
            <p>The Content Creator agrees to create and publish the deliverables featuring the Brand's products (the "Content") as outlined in Exhibit A of this Agreement.</p>
            <h3>2. Deliverables</h3>
            <p>
            The Content Creator will:
            <ul>
            <li>Create and publish the number of deliverables defined in Exhibit A of this Agreement.</li>
            <li>Ensure that each deliverable includes the following hashtags: as defined in "Exhibit A".</li>
            <li>Tag the Brand's official Instagram account, as defined in Exhibit A, in each deliverable.</li>
            <li>Adhere to the Content Guidelines provided by the Brand.</li>
            </ul>
            </p>
            <h3>3. Timeline</h3>
            <p>
            <ul>
            <li>The Content Creator will publish the deliverables on the dates defined in Exhibit A of this Agreement.</li>
            <li>The Content Creator will submit drafts of the Content for review at least 5 days prior to each scheduled posting date.</li>
            <li><strong>Revisions: </strong>he Brand will provide feedback within 48 hours of receiving the draft.</li>
            </ul>
            </p>
            <h3>4. Compensation</h3>
            <p>
            <ul>
            <li>The Brand agrees to pay the Content Creator the compensation as defined in Exhibit A of this Agreement.</li>
            <li><strong>Payment Schedule:</strong></li>
            <ul>
              <li>50% of the total compensation within 48 hours of the requested post date.</li>
              <li>50% within 7 days after the completion and publication of all deliverables.</li>
            </ul>
            <li><strong>Late Payment: </strong>In the event of late payment, the Brand agrees to pay an additional fee of 2% of the total compensation for each week the payment is delayed.</li>
            <li><strong>Taxes: </strong>The Content Creator is responsible for all taxes related to the compensation received under this Agreement.</li>
            </ul>
            </p>
            <h3>5. Content Guidelines</h3>
            <p>
            <ul>
            <li>The Content must align with the Brand’s values and aesthetic.</li>
            <li>The Content should be original and not infringe on any third-party rights.</li>
            <li>The Content Creator must include a clear disclosure of the partnership, such as #ad or #sponsored, in compliance with FTC guidelines.</li>
            <li>The Content Guidelines provided by the Brand are the intellectual property of the Brand.</li>
            </ul>
            </p>
            <h3>6. Approval and Revisions</h3>
            <p>
            <ul>
            <li>The Brand has the right to review and request up to two rounds of revisions for the Content before it is published.</li>
            <li>Each round of revisions must be completed within 48 hours of being delivered through the UBU Platform, Inc.'s Platform. If the Brand does not provide feedback within 48 hours, the Content will be deemed accepted as is.</li>
            <li><strong>Rejection of Content: </strong>If, after two rounds of revisions, the Brand rejects the Content, the Brand may terminate the Agreement and will not be required to make any further payments. The Content Creator will be compensated only for any completed and accepted work.</li>
            </ul>
            </p>
            <h3>7. Ownership and Usage Rights</h3>
            <p>
            <ul>
            <li>The Content Creator retains ownership of the Content created under this Agreement.</li>
            <li>The Content Creator grants the Brand a perpetual, non-exclusive, royalty-free, worldwide license to use, repost, and promote the Content on the Brand's social media channels, website, and other marketing materials.</li>
            <li>This license is granted for the duration of the Content’s use in marketing campaigns and does not expire with the termination of this Agreement.</li>
            </ul>
            </p>
            <h3>8. Indemnification</h3>
            <p>
            <ul>
            <li>Each party agrees to indemnify, defend, and hold harmless the other party from any claims, liabilities, damages, losses, or expenses arising out of or related to any breach of this Agreement or any negligent or willful act or omission by the indemnifying party.</li>
            </ul>
            </p>
            <h3>9. Termination</h3>
            <p>
            <ul>
            <li>Either party may terminate this Agreement with 5 business days' written notice.</li>
            <li><strong>Additional Grounds for Termination: </strong>Either party may terminate this Agreement immediately in the event of a material breach of contract or failure to perform any substantial obligation hereunder.</li>
            <li><strong>Consequences of Termination: </strong>Upon termination, the Content Creator will return any unused materials provided by the Brand and will be compensated for any completed and accepted work up to the termination date. If the Content Creator has received the first 50% payment but fails to submit any deliverables that are approved by the Brand, the Content Creator must return the initial payment to the Brand within 48 hours of receiving notice of termination via the UBU platform communication module or via the personal email provided in Exhibit A.</li>
            </ul>
            </p>
            <h3>10. Notice</h3>
            <p>
            <ul>
            <li>Any notice required or permitted to be given under this Agreement shall be in writing and shall be deemed duly given when received if sent via:</li>
            <ul>
              <li>The UBU platform communication module.</li>
              <li>The email address provided by each party in Exhibit A.</li>
            </ul>
            <li>Notices sent via email shall be deemed received upon the sender's receipt of a confirmation of delivery.</li>
            </ul>
            </p>
            <h3>11. Dispute Resolution</h3>
            <p>
            <ul>
            <li>Any disputes arising out of or in connection with this Agreement shall be resolved through mediation in accordance with the American Bar Association (ABA) mediation standards.</li>
            <li><strong>Governing Law: </strong>This Agreement shall be governed by and construed in accordance with the laws of the State of California.</li>
            <li><strong>Jurisdiction:</strong> Any legal proceedings related to this Agreement shall be brought in the courts of California.</li>
            </ul>
            </p>
            <h3>12. Force Majeure</h3>
            <ul>
            <li>Neither party shall be liable for any failure or delay in performance under this Agreement due to circumstances beyond their reasonable control, including, but not limited to, acts of God, natural disasters, war, labor disputes, or governmental actions.</li>
            <li style= "margin-bottom: 200px;">In the event of a force majeure that prevents the completion of deliverables, any money received by the Content Creator for undelivered work shall be returned to the Brand within 48 hours of notification of the force majeure event.</li>
            </ul>
            <span style="display:inline-block; width: 200px;"></span> <!-- Adjust width to your desired spacing -->
            <h3 > Disclaimer of Liability</h3>
            <p>
            <strong>UBU Platform’s Role:</strong> The UBU Platform acts solely as a facilitator for the collaboration between the Brand and the Content Creator. UBU is not a party to this Collaboration Agreement and bears no responsibility for the performance or non-performance of either party under this Agreement.
            </p>
            <p>
            <strong>Limitation of Liability:</strong> UBU shall not be liable for any claims, demands, damages, losses, liabilities, or expenses arising out of or related to the Collaboration Agreement between the Brand and the Content Creator. This includes, but is not limited to, any disputes regarding deliverables, payments, content approval, intellectual property rights, or breach of contract.
            </p>
            <p>
            <strong>No Warranties:</strong> UBU makes no warranties or representations regarding the suitability, reliability, or qualifications of either party involved in the collaboration. The Brand and the Content Creator acknowledge and agree that they enter into this Collaboration Agreement at their own risk.
            </p>
            <p style="margin-bottom: 200px;">
            <strong>Dispute Resolution:</strong> Any disputes arising out of or related to the Collaboration Agreement are to be resolved solely between the Brand and the Content Creator. UBU will not mediate or participate in any way in such disputes unless required by law.
             ${influencerImgDiv}
                  ${brandImgDiv}
                  <div style="clear: both;"></div>
            <span style="display:inline-block; width: 200px;">________________________</span>
            <span style="display:inline-block; width: 200px;"></span> <!-- Adjust width to your desired spacing -->
            <span>________________________</span>
            <br/>
              <span style="display:inline-block; width: 40px;"></span> <!-- Adjust width to your desired spacing -->
            <span style="display:inline-block; width: 200px;">Influencer</span>
            <span style="display:inline-block; width: 230px;"></span> <!-- Adjust width to your desired spacing -->
            <span>BO</span>
            </p>
                  
        `;
};
