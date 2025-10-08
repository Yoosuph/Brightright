import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import FloatingLabelInput from './forms/FloatingLabelInput';

interface PlanDetails {
  id: 'starter' | 'professional' | 'enterprise';
  name: string;
  monthlyPrice?: number;
  annualPrice?: number;
  features: string[];
  limits: {
    prompts: string;
    aiPlatforms: string;
    competitors: string;
    countries: string;
  };
}

interface CheckoutModalProps {
  selectedPlan?: PlanDetails;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: CheckoutResult) => void;
}

interface CheckoutResult {
  plan: PlanDetails;
  billingCycle: 'monthly' | 'annually';
  paymentMethod: PaymentMethod;
  customer: CustomerDetails;
  trialStarted?: boolean;
}

interface PaymentMethod {
  type: 'card' | 'bank';
  last4?: string;
  brand?: string;
}

interface CustomerDetails {
  email: string;
  fullName: string;
  company?: string;
  country: string;
}

const plans: PlanDetails[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 79,
    annualPrice: 790,
    features: [
      '100 prompts tracked/month',
      '2 AI platforms',
      '3 competitors',
      '1 country',
      'Basic analytics',
      'PDF exports'
    ],
    limits: {
      prompts: '100/month',
      aiPlatforms: '2',
      competitors: '3',
      countries: '1'
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 299,
    annualPrice: 2990,
    features: [
      '1,000 prompts tracked/month',
      'All 5 AI platforms',
      '20 competitors',
      '5 countries',
      'Advanced analytics',
      'API access',
      '5 team seats'
    ],
    limits: {
      prompts: '1,000/month',
      aiPlatforms: 'All 5',
      competitors: '20',
      countries: '5'
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    features: [
      'Unlimited prompts',
      'All AI platforms + custom',
      'Unlimited competitors',
      'Unlimited countries',
      'Real-time monitoring',
      'Full API + webhooks',
      'Dedicated support'
    ],
    limits: {
      prompts: 'Unlimited',
      aiPlatforms: 'All + Custom',
      competitors: 'Unlimited',
      countries: 'Unlimited'
    }
  }
];

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  selectedPlan,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [selectedPlanData, setSelectedPlanData] = useState(selectedPlan || plans[1]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Customer Details
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    email: '',
    fullName: '',
    company: '',
    country: 'United States'
  });

  // Payment Details
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: '',
    city: '',
    postalCode: ''
  });

  const totalSteps = selectedPlanData.id === 'enterprise' ? 2 : 3;

  if (!isOpen) return null;

  const getPrice = (plan: PlanDetails) => {
    if (!plan.monthlyPrice) return null;
    return billingCycle === 'annually' ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: PlanDetails) => {
    if (!plan.monthlyPrice || !plan.annualPrice) return 0;
    return Math.round(((plan.monthlyPrice * 12 - plan.annualPrice) / (plan.monthlyPrice * 12)) * 100);
  };

  const handlePlanSelect = (plan: PlanDetails) => {
    setSelectedPlanData(plan);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (selectedPlanData.id === 'enterprise') {
      // For enterprise, just collect contact info
      onSuccess({
        plan: selectedPlanData,
        billingCycle,
        customer: customerDetails,
        paymentMethod: { type: 'card' }
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onSuccess({
        plan: selectedPlanData,
        billingCycle,
        customer: customerDetails,
        paymentMethod: {
          type: 'card',
          last4: paymentDetails.cardNumber.slice(-4),
          brand: 'visa'
        },
        trialStarted: true
      });
      setIsProcessing(false);
    }, 2000);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true; // Plan selection
      case 2: return customerDetails.email && customerDetails.fullName;
      case 3: return paymentDetails.cardNumber && paymentDetails.expiryDate && paymentDetails.cvv;
      default: return false;
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderProgressBar = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
        <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
        <div 
          className="bg-gradient-to-r from-brand-purple to-brand-pink h-1 rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Select the plan that best fits your AI visibility tracking needs
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 p-1 bg-gray-500/10 rounded-full">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                    billingCycle === 'monthly' 
                      ? 'bg-white dark:bg-gray-800 shadow-md text-gray-900 dark:text-white' 
                      : 'text-gray-500'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annually')}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all flex items-center ${
                    billingCycle === 'annually' 
                      ? 'bg-white dark:bg-gray-800 shadow-md text-gray-900 dark:text-white' 
                      : 'text-gray-500'
                  }`}
                >
                  Annually
                  <span className="text-xs font-semibold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full ml-2">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {plans.map(plan => {
                const price = getPrice(plan);
                const savings = getSavings(plan);
                const isSelected = selectedPlanData.id === plan.id;

                return (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-brand-purple bg-brand-purple/5' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          {plan.id === 'professional' && (
                            <span className="text-xs bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div><span className="font-medium">Prompts:</span> {plan.limits.prompts}</div>
                          <div><span className="font-medium">AI Platforms:</span> {plan.limits.aiPlatforms}</div>
                          <div><span className="font-medium">Competitors:</span> {plan.limits.competitors}</div>
                          <div><span className="font-medium">Countries:</span> {plan.limits.countries}</div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        {price ? (
                          <div>
                            <div className="text-2xl font-bold">${price}</div>
                            <div className="text-sm text-gray-500">
                              {billingCycle === 'annually' ? '/year' : '/month'}
                            </div>
                            {billingCycle === 'annually' && savings > 0 && (
                              <div className="text-xs text-green-500">Save {savings}%</div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="text-2xl font-bold">Custom</div>
                            <div className="text-sm text-gray-500">Contact us</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-1">
                          {plan.features.slice(0, 4).map((feature, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                          {plan.features.length > 4 && (
                            <span className="text-xs text-gray-500">
                              +{plan.features.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Account Information</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {selectedPlanData.id === 'enterprise' 
                  ? 'We\'ll contact you to discuss your custom requirements'
                  : 'Tell us about yourself to set up your account'
                }
              </p>
            </div>

            <div className="space-y-4">
              <FloatingLabelInput
                id="email"
                label="Email Address"
                type="email"
                value={customerDetails.email}
                onChange={e => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="you@company.com"
              />
              
              <FloatingLabelInput
                id="fullName"
                label="Full Name"
                value={customerDetails.fullName}
                onChange={e => setCustomerDetails(prev => ({ ...prev, fullName: e.target.value }))}
                required
                placeholder="John Doe"
              />
              
              <FloatingLabelInput
                id="company"
                label="Company Name (Optional)"
                value={customerDetails.company}
                onChange={e => setCustomerDetails(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Your Company"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <select
                  value={customerDetails.country}
                  onChange={e => setCustomerDetails(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {selectedPlanData.id === 'enterprise' && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <IconInfo className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Enterprise Plan</h4>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Our sales team will contact you within 24 hours to discuss your specific requirements 
                  and provide a custom quote tailored to your organization's needs.
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Payment Information</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Start your 14-day free trial - no charge until {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-4">
              <FloatingLabelInput
                id="cardNumber"
                label="Card Number"
                value={paymentDetails.cardNumber}
                onChange={e => {
                  // Basic card number formatting
                  const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                  if (value.length <= 19) {
                    setPaymentDetails(prev => ({ ...prev, cardNumber: value }));
                  }
                }}
                placeholder="1234 5678 9012 3456"
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabelInput
                  id="expiryDate"
                  label="Expiry Date"
                  value={paymentDetails.expiryDate}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
                    if (value.length <= 5) {
                      setPaymentDetails(prev => ({ ...prev, expiryDate: value }));
                    }
                  }}
                  placeholder="MM/YY"
                  required
                />
                
                <FloatingLabelInput
                  id="cvv"
                  label="CVV"
                  value={paymentDetails.cvv}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) {
                      setPaymentDetails(prev => ({ ...prev, cvv: value }));
                    }
                  }}
                  placeholder="123"
                  required
                />
              </div>
              
              <FloatingLabelInput
                id="nameOnCard"
                label="Name on Card"
                value={paymentDetails.nameOnCard}
                onChange={e => setPaymentDetails(prev => ({ ...prev, nameOnCard: e.target.value }))}
                placeholder="John Doe"
                required
              />
              
              <FloatingLabelInput
                id="billingAddress"
                label="Billing Address"
                value={paymentDetails.billingAddress}
                onChange={e => setPaymentDetails(prev => ({ ...prev, billingAddress: e.target.value }))}
                placeholder="123 Main St"
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabelInput
                  id="city"
                  label="City"
                  value={paymentDetails.city}
                  onChange={e => setPaymentDetails(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="San Francisco"
                  required
                />
                
                <FloatingLabelInput
                  id="postalCode"
                  label="Postal Code"
                  value={paymentDetails.postalCode}
                  onChange={e => setPaymentDetails(prev => ({ ...prev, postalCode: e.target.value }))}
                  placeholder="94105"
                  required
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <IconShield className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-green-900 dark:text-green-100">Secure & Risk-Free</h4>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                14-day free trial with full access. Cancel anytime during trial with no charge. 
                Your payment information is encrypted and secure.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <div className="w-full max-w-2xl animate-slide-up">
        <Card className="w-full">
          {renderProgressBar()}
          {renderStep()}
          
          <div className="mt-8 flex gap-4">
            {step > 1 && (
              <Button onClick={handleBack} variant="secondary" className="flex-1">
                Back
              </Button>
            )}
            
            {step < totalSteps ? (
              <Button 
                onClick={handleNext} 
                variant="primary" 
                className="flex-1"
                disabled={!canProceed()}
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                variant="primary" 
                className="flex-1"
                disabled={!canProceed() || isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <IconSpinner className="w-4 h-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  selectedPlanData.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'
                )}
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
            <p>
              By continuing, you agree to our{' '}
              <a href="#" className="text-brand-purple hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-brand-purple hover:underline">Privacy Policy</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Icon Components
const IconInfo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconShield = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconSpinner = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default CheckoutModal;