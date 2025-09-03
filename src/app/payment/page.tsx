import StripeCheckout from "@/components/Stripe/CheckoutForm";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Upgrade to Pro
          </h1>
          <p className="text-gray-300 text-lg">
            Get access to premium features and unlock the full potential of Omniplex
          </p>
        </div>
        
        <StripeCheckout />
        
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-blue-400 hover:text-blue-300 underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}