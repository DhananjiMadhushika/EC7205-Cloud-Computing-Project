import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../../App.css';

export default function OnlineSecurity() {
  return (
    <div className="flex flex-col w-full">
     
      <div className="flex flex-col w-full px-5 mx-auto mt-20 lg:mt-16 max-w-1440 sm:px-8 lg:px-10">
        {/* Online Security Section */}
        <section className="mt-6 mb-12 lg:mt-10">
          <h2 className="text-3xl font-bold text-center md:text-4xl text-slate-900">
            Online Security
            <span className="block md:w-20 w-16 h-1.5 bg-green-700 mx-auto mt-2 md:mt-3 rounded-full"></span>
          </h2>
          
          <div className="mx-2 mt-8 prose text-slate-800 max-w-none sm:px-5">
            <div className="pl-4 mt-3">
              <p className="mb-3 text-justify">While online shopping presents a world of great experiences and opportunities right at your fingertips, it has also given rise to new security risks. Harithaweli is committed to helping you stay safe online and we've put together some points you should always keep in mind:</p>
              
              <ul className="pl-6 mb-3 text-justify list-disc">
                <li>Make sure the URL is secure by checking if it starts with https:// – the "s" after "http" shows you that it's a secure site. Some browsers will also indicate a secure site by having a lock icon appear before the URL. If you're unsure, try searching for the company and website online to see if there have been any complaints or reports of scams.</li>
                
                <li>Ensure you have an updated anti-virus program installed, this will protect your device against any malicious sites and will alert you before allowing you to access such sites.</li>
                
                <li>Be careful of phishing scams. Don't click on links in suspicious emails or on suspicious sites – particularly when it requires you to enter any personal details. If you're unsure of the source of emails or the site, be sure to verify this with the Customer Contact Centre instead.</li>
                
                <li>When signing up for an account, choose a strong password that combines uppercase and lowercase letters, at least one digit and a special character such as, "!" "#" $" etc. Avoid birthdays, names and easy combinations such as, "1234" or "ABCD"</li>
                
                <li>Most of the banks currently support a 3D Secure system when paying online. When you use your credit card for online shopping at Harithaweli, we will connect your details with the central bank approved payment gateway provider using 3D Secure as an additional security measure, should your issuing bank support it. Therefore, we do not store any of the payment details in our database as you provide the details to the gateway provider.</li>
                
                <li>3D Secure will authenticate your details and will authorize payment for online shopping. If your issuing bank supports 3D Secure but you have not activated it, we recommend you to contact your bank to activate it.</li>
                
                <li>Harithaweli will not request your username or password via emails or telephone calls at any given point. Therefore, do not provide any sensitive data to anonymous people.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}