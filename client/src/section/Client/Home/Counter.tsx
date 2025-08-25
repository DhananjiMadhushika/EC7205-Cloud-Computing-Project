import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const stats = [
  { id: 1, title: "Years of Experience", value: 23 },
  { id: 2, title: "Our Awards", value: 25 },
  { id: 3, title: "Total Completed Project", value: 203 },
  { id: 4, title: "Our Happy Clients", value: 150 },
];

export default function Counter() {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section
      className="relative px-2 py-5 text-white bg-fixed bg-center bg-cover md:py-10 lg:px-4 backdrop-blur-2xl"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(5, 61, 121, 0.8), rgba(249, 115, 22, 0.6)), url('/client/hero/p2.webp')`,
      }}
    >
      <div className="grid w-full grid-cols-1 gap-8 px-5 mx-auto text-center sm:grid-cols-2 md:grid-cols-4 md-840:gap-20 md-985:gap-24 lg:gap-8 max-w-1440 sm:px-8 xl:px-10 ">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col items-center" ref={ref}>
            <p className="text-xl font-semibold text-gray-200 xl:text-2xl">{stat.title}</p>
            <div className="mt-4 text-5xl font-bold xl:text-6xl">
              <span className="text-orange-500">
                {inView && <CountUp start={0} end={stat.value} duration={3} />}
              </span>
              <span className="ml-1 text-white ">+</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};