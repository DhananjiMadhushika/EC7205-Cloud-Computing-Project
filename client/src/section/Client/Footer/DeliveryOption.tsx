import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../../App.css';

export default function DeliveryOption() {
  return (
    <div className="flex flex-col w-full">
     

      <div className="flex flex-col w-full px-5 mx-auto mt-20 lg:mt-16 max-w-1440 sm:px-8 lg:px-10">
        {/* Delivery Options Section */}
        <section className="mt-6 mb-12 lg:mt-10">
          <h2 className="text-3xl font-bold text-center md:text-4xl text-slate-900">
            Delivery Options
            <span className="block md:w-20 w-16 h-1.5 bg-green-700 mx-auto mt-2 md:mt-3 rounded-full"></span>
          </h2>
          
          <div className="mx-2 mt-8 prose text-slate-800 max-w-none sm:px-5">
            <h3 className="mt-6 text-lg font-semibold md:text-xl">1. DELIVERY AREAS</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">Harithaweli delivers to registered customers across the island. Our customers also get the opportunity to pick up the ordered goods from the selected store.</p>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">2. DELIVERY CHARGES</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">Available delivery options, terms and charges for each Product will be shown on the relevant Product Page. The option selected by you and the applicable estimated delivery times will be shown in your Checkout Summary.</p>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">3. DURATION</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">Depending on stock availability, you will receive your goods within 3 – 5 working days. If there is a delay in delivering your order, we will be informing you duly. We will use reasonable endeavors to deliver Products within the time frame shown.</p>
              <p className="mb-3 text-justify">Please arrange that you are available to accept your purchase. Should you not be available, ensure that you have given someone permission to accept the delivery on your behalf. Failing which, the package will be returned to our store. Again you need to pay transport to delivery.</p>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">4. DELIVERY CONFIRMATION</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">After the successful delivery of goods, Harithaweli will send you an email detailing your order to confirm you have received the correct items. Should you have any further queries, you can contact our friendly Customer Care team via email <strong>Info@Harithaweli.Lk</strong>.</p>
            </div>

            <h3 className="mt-6 text-lg font-semibold md:text-xl">5. COLLECT IN-STORE</h3>
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">Now you can browse through thousands of products on www.Harithaweli.lk at the touch of your fingertips and start ordering. Log in and order online when it suits you and collect from your selected store.</p>
              <p className="mb-3 text-justify">To collect in-store, place your order online as normal and select the "collect in-store" option in the checkout area, instead of entering your delivery details.</p>
              <p className="mb-3 text-justify">Products can be picked up from your chosen store by presenting the order confirmation screen or the confirmation email by Harithaweli, which shows your order reference number.</p>
              <p className="mb-3 text-justify">If Products are being collected in-store, please collect them within 07 days, after Harithaweli informs you that they are ready for collection. If you do not collect the same, then unless you make arrangements with us for late collection, Harithaweli will assume you have cancelled your order. This means Harithaweli may re-sell the Product. Harithaweli may need to verify your identity upon collection.</p>
              <p className="mb-3 text-justify">Please note that there are selected products that are 'only' available to be picked up at the store and these cannot be delivered.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}