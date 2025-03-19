import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export function ContactUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => {}} />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Contact Information</h1>
            
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Sterling Carter Technology Distributors</h2>
                <address className="text-gray-600 not-italic">
                  22 Cargill Avenue<br />
                  Kingston 10<br />
                  Jamaica
                </address>
              </div>

              <div className="text-center">
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">
                  <a href="tel:876-968-6637" className="hover:text-blue-600 transition-colors">
                    876-968-6637
                  </a>
                </p>
              </div>

              <div className="text-center">
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">
                  <a href="mailto:info@sctdjm.com" className="hover:text-blue-600 transition-colors">
                    info@sctdjm.com
                  </a>
                </p>
              </div>

              <div className="text-center">
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 8:30 AM - 5:00 PM<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}