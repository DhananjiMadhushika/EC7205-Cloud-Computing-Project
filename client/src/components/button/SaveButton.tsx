type Props = {
  label: string;
  buttonClick: () => void;
};

export const SaveButton = ({ label, buttonClick }: Props) => {
  return (
    <button
      onClick={buttonClick}
      className="capitalize w-full py-2 text-sm font-semibold text-white transition bg-white rounded-full bg-opacity-20 hover:bg-green-600"
    >
      {label}
    </button>
  );
};
