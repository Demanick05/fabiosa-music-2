import React from "react";
import styles from "./page.module.scss";
import Link from "next/link";

const Privacy = () => {
  return (
    // <div className={styles.disclosure_container}> CONTENT WILL BE HERE...</div>
    <div className={styles.disclosure_container}>
      <h1>TERMS AND CONDITIONS OF USE</h1>
      <p>
        <b>Last updated:</b> 23/08/2024
      </p>
      <br />
      <br />
      <p>
        Welcome to our website available at`&quot;`
        <Link className={styles.link} href={"/"}>
          http://fabiosa-music.com/
        </Link>
        <b>(“Website”)</b>. We value your privacy and are committed to
        protecting your personal data. This Privacy Policy explains how we
        handle your information when you visit our Website. Please read this
        policy carefully.
      </p>
      <br />
      <br />
      <br />
      <br />
      <h2>1. WHO WE ARE</h2>
      <p>
        The Website is operated by our company - WILLE TECH LIMITED, an entity
        incorporated under the laws of Cyprus, with registration number HE373066
        and registered office at Kinyra 1, KINYRAS TOWER, 3rd floor,
        `&apos;`Agios Andreas, 1102, Nicosia, Cyprus (also referred{" "}
        <b>“Company”</b>,`&quot;`
        <b>“Fabiosa Media”</b>, <b>`&quot;`we`&quot;`</b>,{" "}
        <b>`&quot;`us`&quot;`</b>, <b>`&quot;`our`&quot;`</b>).
      </p>
      <br />
      <br />
      <br />
      <br />
      <h2>2. WHAT INFORMATION DO WE COLLECT? </h2>
      <p>
        We do not collect, store, or process any personal information from you
        and other users/visitors to our Website. Our Website does not include
        any features that require the collection of personal data.
      </p>
      <br />
      <br />
      <p>
        Our Website does not use cookies, tracking pixels, or any other form of
        tracking technology. We do not perform any form of user tracking or data
        analytics.
      </p>
      <br />
      <br />
      <p>
        Our Website does not use any third-party services that collect data from
        visitors. We do not share any information with third parties.
      </p>
      <br />
      <br />
      <br />
      <br />
      <h2>3. WHAT ARE LEGAL BASES FOR PROCESSING OF DATA</h2>
      <p>
        Currently, <b>we do not collect or process any personal data</b>.
        However, should this change in the future, please be aware of what the
        legal bases could be for such processing if needed:
      </p>
      <ul>
        <li>
          <b>Legitimate Interests:</b> Processing data to pursue our legitimate
          business interests, which could include improving our Website,
          communicating with users, protecting legal rights, ensuring security,
          or preventing fraud.
        </li>
        <li>
          <b>Cooperation Performance:</b> Managing and fulfilling agreements
          formed off the Website between you and the Company, or providing
          support related to the Website.
        </li>
        <li>
          <b>Legal Compliance:</b> Complying with legal obligations, maintaining
          records for tax, audit, and regulatory purposes, or ensuring
          compliance with data protection laws.
        </li>
        <li>
          <b>Consent:</b> Processing data based on user consent in situations
          where explicit consent is provided for specific processing activities.
        </li>
      </ul>
      <br />
      <br />
      <br />
      <br />
      <h2>4. YOUR PRIVACY RIGHTS AND HOW TO EXERCISE THEM </h2>
      <p>
        Since <b>we do not collect or process any personal data</b>, these
        rights are not currently applicable. However, should this change, you
        would be entitled to various data-related rights as described below:
      </p>
      <br />
      <br />
      <p>
        Please note that the below listed rights are based on European laws,
        namely the`&quot;`
        <Link
          className={styles.link}
          target="blank"
          href={
            "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679&from=EN#d1e40-1-1"
          }
        >
          General Data Protection Regulation
        </Link>
        `&quot;` (the “GDPR”). Depending on your country of residence, those
        rights may have different interpretations. Should you wish to assert
        your country-specific rights, kindly let us know, and we will review
        your case individually.
      </p>
      <br />
      <br />
      <table className={styles.table}>
        <tbody>
          <tr className={styles.table_row}>
            <td className={styles.td}>
              <p>
                <strong>Right to Access</strong>
              </p>
            </td>
            <td>
              <p>
                You can request confirmation about whether we process your
                personal data and, if so, access a copy of your data and
                information about how it is processed.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <strong>Right to Rectification</strong>
              </p>
            </td>
            <td>
              <p>
                You have the right to correct any inaccurate personal data and
                to have incomplete data completed.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <strong>Right to Erasure (Right to be Forgotten)</strong>
              </p>
            </td>
            <td>
              <p>
                You can request that we delete your personal data under certain
                conditions.`&quot;` You may request data erasure only if:
              </p>
              <ul>
                <li>
                  your personal data is no longer necessary for the purposes for
                  which it was initially collected,
                </li>
                <li>
                  you have withdrawn your consent to personal data processing,
                  and the consent was the sole legal basis for the processing,
                </li>
                <li>
                  you have successfully objected to the processing based on a
                  balancing of interests relating to your particular situation,
                </li>
                <li>your personal data has been unlawfully processed,</li>
                <li>
                  your personal data has to be erased for compliance with a
                  legal obligation, or
                </li>
                <li>
                  you are an underage person and used our Website by mistake.
                </li>
              </ul>
              <p>
                Further, your right to erasure is subject to restrictions. If we
                have transferred personal data to third parties, we will either
                initiate the deletion of your data from such third parties or
                inform them about the erasure, insofar as required by applicable
                law.
              </p>
              <p>
                In order to avoid any unnecessary legalese and keeping in mind
                the general use of such words, we will interpret all user
                requests asking us to &ldquo;delete my data&rdquo; as requests
                for erasure of data under`&quot;`
                <Link
                  href={
                    "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679&amp;from=EN#d1e2803-1-1"
                  }
                >
                  Article 17 of GDPR
                </Link>
                .
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <strong>Right to Restriction of Processing</strong>
              </p>
            </td>
            <td>
              <p>
                You have the right to request, under certain conditions,
                restriction of processing (i.e. the marking of stored personal
                data to restrict its future use). The requirements for
                restriction of processing are as follows:
              </p>
              <ul>
                <li>
                  The accuracy of your personal data is contested, and we must
                  verify the accuracy of your data;
                </li>
                <li>
                  The processing is unlawful but you do not want your personal
                  data to be erased, and instead you request restriction of use
                  of your personal data;
                </li>
                <li>
                  We no longer need your personal data for the purposes of
                  processing, but you need the data for the establishment,
                  exercise, or defense of legal claims;
                </li>
                <li>
                  You have objected to data processing, and we are verifying
                  whether our legitimate interests override yours.
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <strong>Right to Object</strong>
              </p>
            </td>
            <td>
              <p>
                You have the right to object to the processing of your personal
                data in whole or in part at any time, and in any form, in the
                event that our processing is based on a legitimate interest
                (balancing of interests). In order to process your objection, we
                kindly request you to refer to your particular situation as to
                why you believe that your rights and freedoms are at a
                particular risk (see`&quot;`
                <Link className={styles.link} href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679&amp;from=EN#d1e2803-1-1">
                  Article 21 of GDPR
                </Link>
                for more details).&nbsp;
              </p>
              <p>
                Please note that the right to objection is not absolute, and we
                will stop the processing of your data only provided we cannot
                demonstrate compelling legitimate grounds for processing.&nbsp;
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <strong>Right to Data Portability</strong>
              </p>
            </td>
            <td>
              <p>
                You have the right to receive your personal data in a
                structured, commonly used, and machine-readable format and to
                transfer it to another controller.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <strong>Right to Withdraw Consent</strong>
              </p>
            </td>
            <td>
              <p>
                If you have given consent for the processing of your personal
                data, you can withdraw it at any time via the contact options
                provided at the bottom.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <strong>Right to Lodge a Complaint</strong>
              </p>
            </td>
            <td>
              <p>
                If you believe your data has been processed unlawfully, you can
                lodge a complaint with the relevant data protection authority.
              </p>
              <p>
                Here is the contact information for the supervisory data
                protection authority:&nbsp;
              </p>
              <br />
              <p>Data Protection Commissioner,</p>
              <p>Address: kypranoros 15, Nicosia 1061, Cyprus</p>
              <p>Postal address</p>
              <p>P.O.Box 23378, 1682 Nicosia, Cyprus</p>
              <p>Tel: +357 22818456</p>
              <p>Fax: +357 22304565</p>
              <p>
                Email:
                <Link className={styles.link} href={"mailto:commissione@dataprotection.gov.cy"}>
                  commissioner@dataprotection.gov.cy
                </Link>
                &nbsp;
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <p>
        If you are a California resident, in addition to those established under
        the GDPR described above,`&quot;` you have additional rights under the
        California Consumer Privacy Act (<strong>&ldquo;CCPA&rdquo;</strong>
        ):
      </p>
      <br />
      <br />
      <table>
        <tbody>
          <tr>
            <td>
              <p>
                <strong>
                  Access to Specific Information and Data Portability
                </strong>
              </p>
            </td>
            <td>
              <p>
                Separately and in addition to &ldquo;Right to access&rdquo; and
                &ldquo;Right to rectification&rdquo; under the GDPR, you have
                the right to request that we disclose certain information to you
                about our collection and use of your personal information over
                the past 12 months only. Once we receive and confirm your
                verifiable consumer request, we will disclose to you:
              </p>
              <ul>
                <li>
                  The categories of personal information we collected about you.
                </li>
                <li>
                  The categories of sources for the personal information we
                  collected about you.
                </li>
                <li>
                  Our business or commercial purpose for collecting or selling
                  that personal information.
                </li>
                <li>
                  The categories of third parties with whom we share that
                  personal information.
                </li>
                <li>
                  The specific pieces of personal information we collected about
                  you.
                </li>
              </ul>
              <p>
                If we sold or disclosed your personal information for a business
                purpose, we will disclose such facts separately.
              </p>
              <p>
                Please note that you may only make a verifiable consumer request
                for access or data portability twice within a 12-month period.
                The verifiable consumer request must:
              </p>
              <ul>
                <li>
                  Provide sufficient information that allows us to reasonably
                  verify you are the person about whom we collected personal
                  information or an authorized representative of such person.
                </li>
                <li>
                  Describe your request with sufficient detail that allows us to
                  properly understand, evaluate, and respond to it.
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <strong>Right to Request Deletion</strong>
              </p>
            </td>
            <td>
              <p>
                While the right to request deletion of data under the CCPA and
                the right to erasure under the GDPR as defined above are
                fundamentally similar, please note that under the CCPA, we are
                not required to comply with your request if we need to retain
                your information for specific reasons. For your convenience, an
                abridged version of these exceptions is provided below. For more
                detailed information, please refer to the full text of
                the`&quot;`
                <Link
                  href={
                    "https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?division=3.&amp;part=4.&amp;lawCode=CIV&amp;title=1.81.5"
                  }
                >
                  CCPA
                </Link>
                or the
                <Link className={styles.link} href={"https://oag.ca.gov/privacy/ccpa"}>
                  additional clarifications from the California Attorney General
                </Link>
                .
              </p>
              <p>
                Under the CCPA, we may retain your personal information if it is
                necessary to:
              </p>
              <ul>
                <li>
                  Complete the transaction for which the personal information
                  was collected, provide a good or service requested by you, or
                  reasonably anticipated within the context of our ongoing
                  business relationship with you, or otherwise perform a
                  contract between you and us.
                </li>
                <li>
                  Detect security incidents, protect against malicious,
                  deceptive, fraudulent, or illegal activity, or prosecute those
                  responsible for such activities.
                </li>
                <li>
                  Debug to identify and repair errors that impair existing
                  intended functionality.
                </li>
                <li>
                  Exercise free speech, ensure the right of another consumer to
                  exercise their right of free speech, or exercise another right
                  provided for by law.
                </li>
                <li>
                  Comply with the California Electronic Communications Privacy
                  Act.
                </li>
                <li>
                  Engage in public or peer-reviewed scientific, historical, or
                  statistical research in the public interest that adheres to
                  all other applicable ethics and privacy laws, when the
                  information`&apos;`s deletion may likely render impossible or
                  seriously impair the research`&apos;`s achievement, if you
                  have provided informed consent.
                </li>
                <li>
                  Enable solely internal uses that are reasonably aligned with
                  your expectations based on your relationship with us.
                </li>
                <li>Comply with a legal obligation.</li>
                <li>
                  Otherwise use the personal information internally, in a lawful
                  manner that is compatible with the context in which you
                  provided the information.
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <strong>Right to</strong>
              </p>
              <p>
                <strong>Non-Discrimination</strong>
              </p>
            </td>
            <td>
              <p>
                California consumers have the right to non-discrimination when
                exercising their rights under the CCPA. Specifically, we cannot
                deny you access to the Website, provide you with a different
                level or quality of service compared to other California users,
                or threaten you with any of these actions.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <h4>
                <strong>
                  Right to request information on data transfer for third
                  party&rsquo;s direct marketing purposes
                </strong>
              </h4>
            </td>
            <td>
              <p>
                You can request information regarding the disclosure of personal
                information to third parties for their direct marketing purposes
                according to California&rsquo;s`&quot;`
                <Link
                  href={
                    "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=1798.83.&amp;lawCode=CIV"
                  }
                >
                  &ldquo;Shine the Light&rdquo; law (Civil Code Section &sect;
                  1798.83)
                </Link>
                .&nbsp;
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <strong>Right to Prohibit Sale of Information</strong>
              </p>
            </td>
            <td>
              <p>
                We do not sell personal data. If this changes, you will have the
                right to opt out of the sale of your personal data
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <p>
        Please note that the above listed rights are based on “GDPR” and “CCPA”.
        Depending on your country of residence, those rights may have different
        interpretations. Should you wish to assert your country-specific rights,
        kindly let us know, and we will review your case individually.
      </p>
      <br />
      <br />
      <br />
      <br />
      <h2>5. RETENTION OF DATA </h2>
      <p>
        Since we do not collect or process any personal data, we do not retain
        any personal data.
      </p>
      <br />
      <br />
      <br />
      <br />
      <h2>6. CHANGES TO THIS PRIVACY POLICY </h2>
      <p>
        We may update this Privacy Policy from time to time by posting the
        updated notice on this webpage. Please review it regularly. If we make
        significant changes, we will notify you through the Website or by other
        means.
      </p>
      <br />
      <br />
      <br />
      <br />
      <h2>7. CONTACT US </h2>
      <p>
        Please send us any notices regarding these Privacy Policy by email to
        <Link className={styles.link} href={"mailto:legal@fabiosamedia.com"}>
          legal@fabiosamedia.com
        </Link>{" "}
        or our registered address:
      </p>
      <br />
      WILLE TECH LIMITED <br />
      Kinyra 1, KINYRAS TOWER, 3-d floor, `&apos;`Agios Andreas<br />
      Nicosia, <br />
      1102 Cyprus<br />
    </div>
  );
};

export default Privacy;
