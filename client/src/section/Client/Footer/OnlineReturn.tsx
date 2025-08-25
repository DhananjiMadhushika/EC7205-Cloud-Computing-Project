import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../../App.css';

export default function OnlineReturn() {
  return (
    <div className="flex flex-col w-full">
     
      <div className="flex flex-col w-full px-5 mx-auto mt-20 lg:mt-16 max-w-1440 sm:px-8 lg:px-10">
        {/* Returns and Refunds Section */}
        <section className="mt-6 mb-12 lg:mt-10">
          <h2 className="text-3xl font-bold text-center md:text-4xl text-slate-900">
            Online Returns and Refunds
            <span className="block md:w-20 w-16 h-1.5 bg-green-700 mx-auto mt-2 md:mt-3 rounded-full"></span>
          </h2>
          
          <div className="mx-2 mt-8 prose text-slate-800 max-w-none sm:px-5">
            <h3 className="mt-6 text-lg font-semibold md:text-xl">1. INTRODUCTION</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">Harithaweli will refund a purchase (selected items) for the exact amount, deducting the following:</p>
              <ul className="pl-6 mb-3 text-justify list-disc">
                <li>Any delivery costs already incurred by Harithaweli</li>
                <li>Any restocking fee for special orders</li>
              </ul>
              <p className="mb-3 text-justify">Refunds will only be processed as per the refund and return policy mentioned below and special details provided in the product you purchased. We will also be considering the payment method that was used when the order was created and will be sent into the account it was paid from e.g. credit card, bank transfer… etc.</p>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">2. VALID REASONS TO RETURN AN ITEM</h3>
            <div className="pl-4 mt-3">
              <ul className="pl-6 mb-3 text-justify list-disc">
                <li>The delivered Product is damaged (physically destroyed or broken) / defective the delivered product is incomplete (i.e., has missing items and/or accessories).</li>
                <li>The delivered product is not as advertised (i.e. does not match product description or picture).</li>
                <li>The delivered product does not fit.</li>
                <li>The delivered product is incorrect (i.e., wrong product/color, fake/counterfeit item, or expired.)</li>
              </ul>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">3. RETURN POLICY</h3>
            <div className="pl-4 mt-3">
              <ul className="pl-6 mb-3 text-justify list-disc">
                <li>Harithaweli must be informed within 24 hours of any cancellation, before the goods are dispatched from our stores. Please note that some product orders may not be able to cancel upon confirmation, which will also be noted on the product page.</li>
                <li>Harithaweli must be informed within 7 days of any returns for the products that are eligible to be returned.</li>
                <li>Item must be in the original packaging with intact in the same condition it was delivered in.</li>
                <li>Items returned after the Return Period has lapsed will not be accepted.</li>
                <li>Items to be returned are the sole responsibility of the customer until they reach us, and customer needs to ensure items are properly packed to prevent any damages en route to us. Items damaged en route will not be accepted.</li>
                <li>It is the customer's responsibility to ensure proof of delivery note for parcels that contain items to be returned.</li>
                <li>Harithaweli will require minimum 05-07 business days to process your return request and ready the replacement unit.</li>
                <li>You may also return a product, at your cost, to the Harithaweli store provided; you have the original invoice/proof of purchase together with warranty certificates (if applicable) and have complied with the required terms and conditions set out by Harithaweli.</li>
              </ul>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">4. REFUND POLICY</h3>
            <div className="pl-4 mt-3">
              <ul className="pl-6 mb-3 text-justify list-disc">
                <li>Harithaweli, in its sole discretion, reserves the right to initiate all refunds via electronic mediums.</li>
                <li>A refund can take up to 7 (seven) working days to reflect in your account, and fund transfers are subject to verification of your banking details.</li>
                <li>We reserve the right not to refund the delivery fee in respect of any late cancellations. If you cancel your payment for any reason or if your payment method should cease to be valid for whatever reason, you will nevertheless be bound to pay the full purchase price, including all costs incurred by us relating to the recovery thereof.</li>
                <li>If a replacement unit for the size/specific model is no longer available, the customer will be issued a full refund. The refund will not include any delivery charges borne by the customer for return of item.</li>
              </ul>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">5. PRODUCT PRICING</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">The prices for all the items mentioned on Harithaweli.lk are the final and last prices of sale via online means.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}