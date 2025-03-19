import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => {}} />
      <div className="flex-1 max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Data Processing & Storage</h2>
              <p className="text-gray-600 mb-4">
                Sterling Carter Technology Distributors is committed to protecting your privacy. Our ink calculator service:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Does not store or save any uploaded documents</li>
                <li>Performs all calculations in real-time within your browser</li>
                <li>Does not retain any document content after analysis</li>
                <li>Automatically removes all uploaded files once processing is complete</li>
                <li>Does not transmit document content to any external servers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Information Collection</h2>
              <p className="text-gray-600 mb-2">We collect minimal technical information required for service operation:</p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Screen resolution</li>
                <li>Basic usage statistics (without personal identifiers)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
              <p className="text-gray-600">
                All calculations and processing occur locally in your browser. We implement 
                industry-standard security measures to protect any temporary data during processing. 
                Since we don't store your documents or analysis results, there is no risk of 
                data breach or unauthorized access to your content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Report Generation</h2>
              <p className="text-gray-600">
                Generated reports are created in real-time and are only available during your 
                active session. We do not store or retain any reports on our servers. You are 
                responsible for saving or downloading any reports you wish to keep.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Contact Information</h2>
              <p className="text-gray-600">
                For questions about this Privacy Policy or our data practices, please contact us at:
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