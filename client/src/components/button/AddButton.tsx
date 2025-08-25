type Props = {
  label: string;
  buttonClick: () => void;
};

export const AddButton = ({ label, buttonClick }: Props) => {
  return (
    <button
      onClick={buttonClick}
      className="px-3 md:px-5 py-1.5 sm-425:py-2 text-sm sm:text-base font-semibold text-white transition bg-green-500 rounded-lg hover:bg-green-600"
    >
      {label}
    </button>
  );
};
