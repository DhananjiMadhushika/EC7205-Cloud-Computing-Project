type Props = {
  onclick: () => void;
  title: string;
  buttonLabel: string;
};

export const AccountPopup = ({ onclick, title, buttonLabel }: Props) => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex justify-center items-center backdrop-blur-xl">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[280px] sm:w-[340px]">
        <h2 className="text-base md:text-lg font-bold mb-4 text-center">
          {title}
        </h2>

        <div className="flex justify-center mt-8">
          <button
            onClick={onclick}
            type="submit"
            className="px-6 py-2 text-sm md:text-base text-white bg-gray-500 rounded-lg hover:bg-gray-600 animate-bounce"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
