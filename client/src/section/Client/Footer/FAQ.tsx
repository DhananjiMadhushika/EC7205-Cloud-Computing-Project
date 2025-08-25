import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../../App.css';

export default function FAQ() {
  return (
    <div className="flex flex-col w-full">
     
      <div className="flex flex-col w-full px-5 mx-auto mt-20 lg:mt-16 max-w-1440 sm:px-8 lg:px-10">
        {/* FAQ Section */}
        <section className="mt-6 mb-12 lg:mt-10">
          <h2 className="text-3xl font-bold text-center md:text-4xl text-slate-900">
            Frequently Asked Questions
            <span className="block md:w-20 w-16 h-1.5 bg-green-700 mx-auto mt-2 md:mt-3 rounded-full"></span>
          </h2>
          
          <div className="mx-2 mt-8 prose text-slate-800 max-w-none sm:px-5">
            {/* Shopping Information */}
            <h3 className="mt-6 text-lg font-semibold md:text-xl">SHOPPING INFORMATION</h3>
            
            <div className="pl-4 mt-3">
              <p className="mb-2 font-semibold">How can I check the stock availability?</p>
              <p className="mb-3 text-justify">Harithaweli website shows the availability of stock on the product page. We do our best to source stock even if it is low, but there may be cases where we will need to contact you as this may lead to extended lead times. Unfortunately, due to the nature of our business, there may be situations where we might have an out of the stock situation. However, if you have a doubt and want to confirm the quantity available, it's best to contact us on 0710 500 800. (Please note that you cannot reserve stock).</p>
              
              <p className="mb-2 font-semibold">Can you guarantee the availability?</p>
              <p className="mb-3 text-justify">As we are competitively priced and our stock sells on-demand through our physical store and online mediums, we cannot guarantee stock at all times. However, we try our best to source the items for you. We will be in contact with you should we encounter any problems with stock.</p>
              
              <p className="mb-2 font-semibold">What exactly happens after ordering?</p>
              <p className="mb-3 text-justify">Once you place your order, we will pack the goods and dispatch them to be delivered. The courier personnel will contact you and deliver the goods to your doorstep.</p>
              
              <p className="mb-2 font-semibold">Where can I view my sales receipt?</p>
              <p className="mb-3 text-justify">You can visit the 'My Account' dashboard and go to the 'Orders' section. You will see your past orders here and can view your receipt.</p>
              
              <p className="mb-2 font-semibold">How long do I have to return an order?</p>
              <p className="mb-3 text-justify">You have to inform us within 7 days and send the goods at earliest. Please visit 'Returns and Refund' page for more information.</p>
              
              <p className="mb-2 font-semibold">Can I make changes to my order after checking out?</p>
              <p className="mb-3 text-justify">We will always make our best effort to accommodate possible changes. Please contact Customer Support, info@harithaweli.lk, who will assist you with your query.</p>
              
              <p className="mb-2 font-semibold">Can I return a product?</p>
              <p className="mb-3 text-justify">Yes, you can return it to your local Harithaweli showroom if you have received a damaged or expired product. Please refer to our returns policy.</p>
              
              <p className="mb-2 font-semibold">How about dangerous goods?</p>
              <p className="mb-3 text-justify">We restrict the sale and delivery of dangerous goods on our website.</p>
              
              <p className="mb-2 font-semibold">How to identify the products available for delivery?</p>
              <p className="mb-3 text-justify">Products with a delivery icon are available to be purchased and home delivery is available. To find out if a product can be delivered to your area, enter your postcode on the product page for delivery details.</p>
              
              <p className="mb-2 font-semibold">How to identify the products available for store pick-up?</p>
              <p className="mb-3 text-justify">The products that are available only for store pick-up will be mentioned in the product details page. Further, a warning will be given at the checkout with the list of products that are available for store pick-up.</p>
            </div>
            
            {/* Delivery Information */}
            <h3 className="mt-6 text-lg font-semibold md:text-xl">DELIVERY INFORMATION</h3>
            
            <div className="pl-4 mt-3">
              <p className="mb-2 font-semibold">Delivery charges for orders from the Online Shop?</p>
              <p className="mb-3 text-justify">We deliver across the island at a flat base rate. The charges are calculated as per the weight and distance. What you have to remember is that we charge for the total package and not individual items.</p>
              
              <p className="mb-2 font-semibold">How long will delivery take?</p>
              <p className="mb-3 text-justify">It depends on where you live. Usually, it will be delivered within 3 – 5 working days. However, the duration might increase during exceptional situations.</p>
              
              <p className="mb-2 font-semibold">Can I change my delivery address after submitting the order?</p>
              <p className="mb-3 text-justify">Yes, you can change your delivery address. Please contact Customer Support at info@harithaweli.lk for assistance.</p>
              
              <p className="mb-2 font-semibold">How long do I have to return an order?</p>
              <p className="mb-3 text-justify">You have to inform us within 7 days and send the goods at earliest. Please visit 'Returns and Refund' page for more information.</p>
              
              <p className="mb-2 font-semibold">Do I need to provide assistance when delivering the product?</p>
              <p className="mb-3 text-justify">The Delivery Fee charged assumes that customers can provide reasonable assistance during delivery. Customers will be contacted prior to the booking of the delivery to ensure that they are able to provide reasonable assistance. If customers are not able to aid the driver, then assistance will be organized with the courier at an additional cost to the customer.</p>
            </div>
            
            {/* Payment Information */}
            <h3 className="mt-6 text-lg font-semibold md:text-xl">PAYMENT INFORMATION</h3>
            
            <div className="pl-4 mt-3">
              <p className="mb-2 font-semibold">What are the payment methods available?</p>
              <p className="mb-3 text-justify">You can pay using your credit card, debit card, payment wallet or bank transfer. Please read 'Terms and Conditions' for more information.</p>
              
              <p className="mb-2 font-semibold">Will I receive the same product that I see in the picture?</p>
              <p className="mb-3 text-justify">Yes. We display pictures of the exact product. If there is a change of product, color… etc., we will inform you before dispatching the goods.</p>
              
              <p className="mb-2 font-semibold">How can I return an item?</p>
              <p className="mb-3 text-justify">You are required to call us or inform us within 7 days and we will guide you through.</p>
              
              <p className="mb-2 font-semibold">How is the recipient reimbursed?</p>
              <p className="mb-3 text-justify">Just in case if there is a returned invoice, we will be making the refund to the medium in which you made the payment. Please see 'Refunds Policy' for more information.</p>
              
              <p className="mb-2 font-semibold">Will you restock items indicated as "out of stock?"</p>
              <p className="mb-3 text-justify">If by any chance you find 'Out of Stock' items, they will be refilled in due course.</p>
            </div>
            
            {/* Things to Remember */}
            <h3 className="mt-6 text-lg font-semibold md:text-xl">THINGS TO REMEMBER</h3>
            
            <div className="pl-4 mt-3">
              <p className="mb-2 font-semibold">Is Harithaweli online shopping safe?</p>
              <p className="mb-3 text-justify">Yes. We have taken every precaution to ensure your details are safe with us and that your experience is pleasant with us.
              All sensitive information you provide is encrypted using industry-standard Secure Sockets Layer technology, and we utilize a leading payment processor in Sri Lanka which is approved by the Central Bank of Sri Lanka.
              We also insist that all credit card payments use 3D Secure processes (such as MasterCard's Secure Code and Verified by Visa).</p>
              
              <p className="mb-2 font-semibold">What is a good password?</p>
              <p className="mb-3 text-justify">Harithaweli attempts to make your online shopping experience as secure as possible. The password entered on registration must be alpha-numeric (that is, a mix of letters and numbers) and must be a minimum of 8 characters in total. Your password needs to be a mix of 1 uppercase, 1 number and 1 special character.</p>
              
              <p className="mb-2 font-semibold">How to change my password?</p>
              <p className="mb-3 text-justify">There is a "Forgot Your Password" link on the login page. You will be prompted to enter an email address to send a password reset email which will allow you to reset your password. Please ensure that you enter the email address you registered with. If your email address has changed, please contact us on 0710 500 800. We will do the needful after a verification.</p>
              
              <p className="mb-2 font-semibold">Do I have to change my password from time to time?</p>
              <p className="mb-3 text-justify">For your convenience, we have maintained a static password that will not expire. However, should you wish to change your password, you can either change it in your 'My Account' section or reset it following the password reset process.</p>
              
              <p className="mb-2 font-semibold">What are the internet browsers that you support?</p>
              <p className="mb-3 text-justify">Our website is built to work across all mainstream Internet browsers. But for optimal browsing experience, we recommend:
              <br />Internet Explorer – Version 10 and later (Windows only)
              <br />Edge – Version 94 and above (Windows, Android & Mac)
              <br />Firefox – Version 24 and later (Windows, Android & Mac)
              <br />Google Chrome – Version 30 and later (Windows, Android & Mac)
              <br />Safari – Version 6 and later (Mac & iPhone only)</p>
              
              <p className="mb-2 font-semibold">Can the Harithaweli website be used in smart devices?</p>
              <p className="mb-3 text-justify">Yes, as our website is responsive and designed to be used across current mainstream mobile devices, such as tablets (e.g. Apple iPad or Samsung Galaxy Tab) or mobile phones (e.g. Apple iPhone, Samsung Galaxy S range, Microsoft Lumia, Sony, Huawei, Vivo, Oppo, Xiaomi… etc.).</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}