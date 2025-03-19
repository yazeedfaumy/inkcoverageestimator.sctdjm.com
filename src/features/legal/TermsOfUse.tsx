import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export function TermsOfUse() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => {}} />
      <div className="flex-1 max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Terms of Use</h1>
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using the Ink Calculator service provided by Sterling Carter 
                Technology Distributors, you accept and agree to be bound by these Terms of Use. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
              <p className="text-gray-600 mb-2">
                Our service provides real-time document analysis for ink coverage calculation and cost estimation.
                Key aspects of our service include:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>All processing is performed locally in your browser</li>
                <li>No document storage or retention</li>
                <li>Immediate deletion of uploaded files after analysis</li>
                <li>No server-side storage of analysis results</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <p className="text-gray-600 mb-2">You agree to:</p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Use the service only for lawful purposes</li>
                <li>Not upload malicious files or content</li>
                <li>Save or download any reports you wish to keep</li>
                <li>Maintain the confidentiality of your data</li>
                <li>Not attempt to circumvent any service limitations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Privacy</h2>
              <p className="text-gray-600">
                We prioritize your privacy and data security. Our service operates without storing 
                your documents or analysis results. All calculations are performed in real-time, 
                and no document content is retained after processing. You are responsible for 
                saving any reports or results you wish to keep.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Service Limitations</h2>
              <p className="text-gray-600">
                The service is provided "as is" without warranties of any kind. We do not guarantee 
                uninterrupted access and reserve the right to modify or discontinue the service 
                at any time. Calculation results are estimates and should be verified independently 
                for critical business decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms of Use, please contact:
                <br /><br />
                Sterling Carter Technology Distributors<br />
                22 Cargill Avenue<br />
                Kingston 10, Jamaica<br />
                <br />
                Email: info@sctdjm.com<br />
                Phone: 876-968-6637
              </p>
            </section>

            <div className="text-sm text-gray-500 mt-8">
              Last updated: January 2024
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}