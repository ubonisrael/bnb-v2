export default function TermsPage() {
  return (
    <div className="max-w-4xl px-6 py-12 mx-auto prose prose-gray">
      <h1>Terms and Conditions</h1>

      <h2>1. Overview of Services</h2>
      <p>
        BankNBook provides a booking, scheduling, and customer engagement
        platform for small service-based businesses (e.g. barbers, salons,
        beauticians, etc.). Businesses (“Vendors” or “Merchants”) use our
        platform to manage appointments, process payments, engage with clients,
        and analyze customer behavior. End users (“Clients” or “Customers”) use
        the platform to book appointments and interact with vendors.
      </p>

      <h2>2. Eligibility</h2>
      <ul>
        <li>Be at least 18 years of age.</li>
        <li>Have the authority to enter into legally binding agreements.</li>
        <li>
          Comply with all local, national, and international laws when using our
          platform.
        </li>
      </ul>

      <h2>3. User Accounts</h2>
      <ul>
        <li>
          You are responsible for maintaining the confidentiality of your
          account credentials.
        </li>
        <li>
          You agree to provide accurate and complete information during
          registration and to update it as needed.
        </li>
        <li>
          You are responsible for all activities that occur under your account.
        </li>
      </ul>

      <h2>4. Business Account Responsibilities</h2>
      <ul>
        <li>
          You must ensure your listing is accurate, including business hours,
          services, pricing, and cancellation policies.
        </li>
        <li>
          You agree to honor all bookings and provide the services you
          advertise.
        </li>
        <li>
          You are responsible for managing your own payments and refunds through
          BankNBook’s payment gateway.
        </li>
        <li>
          You grant BankNBook the right to use your business name and logo for
          promotional purposes.
        </li>
      </ul>

      <h2>5. Customer Responsibilities</h2>
      <ul>
        <li>
          You must provide accurate contact details when making a booking.
        </li>
        <li>
          You agree to attend bookings or cancel/reschedule in accordance with
          the vendor’s policies.
        </li>
        <li>
          Repeated no-shows or misuse of the platform may result in suspension
          or termination of your account.
        </li>
      </ul>

      <h2>6. Fees and Payments</h2>
      <ul>
        <li>
          Vendors: You agree to pay the applicable fees outlined on our pricing
          page, including subscription fees (£10/month per business).
        </li>
        <li>
          Customers: You will be charged a non-refundable fee at the time of
          booking for transaction processing by BankNBook. You will also be
          charged by the vendor for the service, at the time of service or
          booking, depending on the vendor’s policy.
        </li>
        <li>
          All payments are securely processed through our third-party payment
          gateway.
        </li>
        <li>
          Fees are non-refundable except as required by law or expressly stated
          in writing by BankNBook.
        </li>
      </ul>

      <h2>7. Cancellations and Refunds</h2>
      <ul>
        <li>Vendors set their own cancellation and refund policies.</li>
        <li>
          BankNBook is not responsible for issuing refunds unless due to
          technical failure on our part.
        </li>
        <li>
          Disputes between vendors and customers should be resolved between the
          parties, though BankNBook may mediate at its discretion.
        </li>
      </ul>

      <h2>8. Data and Privacy</h2>
      <p>
        Your use of the platform is also governed by our Privacy Policy, which
        explains how we collect, use, and store your personal data in accordance
        with GDPR and UK data protection regulations.
      </p>

      <h2>9. Prohibited Use</h2>
      <ul>
        <li>Violate any law or regulation.</li>
        <li>Post false or misleading information.</li>
        <li>Infringe upon the rights of others.</li>
        <li>Distribute spam or malicious software.</li>
        <li>
          Interfere with or disrupt the platform's integrity or performance.
        </li>
      </ul>

      <h2>10. Intellectual Property</h2>
      <ul>
        <li>
          All content and software provided by BankNBook is owned by or licensed
          to us.
        </li>
        <li>
          You may not copy, modify, distribute, or reverse engineer any part of
          the platform.
        </li>
        <li>
          Vendors retain ownership of their content but grant BankNBook a
          license to display, distribute, and promote it through the platform.
        </li>
      </ul>

      <h2>11. Third-Party Services</h2>
      <p>
        BankNBook may integrate with third-party tools such as payment
        processors, analytics platforms, or marketing solutions. We are not
        responsible for the performance or policies of these services.
      </p>

      <h2>12. Limitation of Liability</h2>
      <ul>
        <li>
          BankNBook shall not be liable for any indirect, incidental, or
          consequential damages.
        </li>
        <li>
          We make no guarantees about uptime, availability, or uninterrupted
          access to the platform.
        </li>
        <li>
          Our total liability under these terms shall not exceed the total fees
          paid by you in the preceding 12 months.
        </li>
      </ul>

      <h2>13. Indemnity</h2>
      <p>
        You agree to indemnify and hold harmless BankNBook, its affiliates,
        officers, and employees from any claims or liabilities arising out of
        your use of the platform, violation of these Terms, or infringement of
        any third-party rights.
      </p>

      <h2>14. Termination</h2>
      <ul>
        <li>
          BankNBook may suspend or terminate your access if you breach these
          Terms or misuse the platform.
        </li>
        <li>
          You may cancel your account at any time, but you remain responsible
          for any outstanding fees or bookings.
        </li>
      </ul>

      <h2>15. Changes to the Terms</h2>
      <p>
        We may modify these Terms at any time. We will notify you of material
        changes via email or platform notice. Continued use of the platform
        constitutes your acceptance of the updated Terms.
      </p>

      <h2>16. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of England and Wales. Any disputes shall be subject to the
        exclusive jurisdiction of the courts in the United Kingdom.
      </p>

      <h2>17. Contact Us</h2>
      <p>
        Email:{" "}
        <a
          href="mailto:banknbook.com@gmail.com"
          className="text-blue-600 underline"
        >
          banknbook.com@gmail.com
        </a>
      </p>
    </div>
  );
}
