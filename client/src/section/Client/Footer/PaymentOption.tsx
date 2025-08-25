import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../../App.css';

export default function PaymentOption() {
  return (
    <div className="flex flex-col w-full">
     
      <div className="flex flex-col w-full px-5 mx-auto mt-20 lg:mt-16 max-w-1440 sm:px-8 lg:px-10">
        {/* Payment Options Section */}
        <section className="mt-6 mb-12 lg:mt-10">
          <h2 className="text-3xl font-bold text-center md:text-4xl text-slate-900">
            Payment Options
            <span className="block md:w-20 w-16 h-1.5 bg-green-700 mx-auto mt-2 md:mt-3 rounded-full"></span>
          </h2>
          
          <div className="mx-2 mt-8 prose text-slate-800 max-w-none sm:px-5">
            <h3 className="mt-6 text-lg font-semibold md:text-xl">1. ACCEPTED PAYMENT METHODS</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">We want to make shopping as convenient as possible for you. In keeping with this purpose, we have made available numerous options for you to make your payments. We accept all types of major credit cards, bank transfers or in-store payments. Please note that the available payment options may differ from product to product. Available options will be displayed at the checkout.</p>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">2. CARD PAYMENTS</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">We currently accept any credit or debit card with Visa, MasterCard, American Express (AMEX), Discover Network, Diners Club International and Union Pay. Further, you also get the luxury of paying through payment networks Sampath Vishwa, EZCash, MCash, Genie, UPay, WeChatPay, DFCC Virtual Wallet.</p>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">3. CASH PAYMENTS</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">Harithaweli not accepts payment in the form of cash on delivery. You also get the convenience to pay for your purchased goods by visiting our store.</p>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">4. BANK TRANSFERS</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">You get the freedom of making your payments through a bank transfer using the following details. Please make sure that you enter your confirmed order number as the reference.</p>
              <ul className="pl-6 mb-3 text-justify list-disc">
                <li>Name: CEEDECS LANKA HOLDINGS</li>
                <li>Bank: BANK OF CEYLON</li>
                <li>Branch: KADAWATHA</li>
                <li>Account# 2736074</li>
                <li>Swift code# BCEYLKLXXXX</li>
              </ul>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">5. EASY PAYMENT SCHEMES</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">At Harithaweli we're committed to making things as convenient as possible for you. That's why there are payment plans available especially for our customers who buy online. Easy payment schemes are available for credit cards from selected banks such as Nations Trust Bank (NTB), DFCC Bank, Commercial Bank Plc, Bank of Ceylon, Sampath Bank and Hatton National Bank Plc (HNB). The monthly rate will be indicated to you when you make the purchase.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}