import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

type Props = {
  label?: string;
  daily?: boolean;
  weekly?: boolean;
  monthly?: boolean;
  yearly?: boolean;
  range?: boolean;
};

export const DateSelector = ({
  label,
  daily,
  weekly,
  monthly,
  yearly,
  range,
}: Props) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="flex justify-start items-center gap-4">
      {label && (
        <label className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white">
          {label}
        </label>
      )}

      {daily && (
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => {
            setStartDate(date);
            setEndDate(date);
          }}
          className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
          placeholderText="Select Date"
        />
      )}

      {weekly && (
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => {
            if (date) {
              const startOfWeek = new Date(date);
              startOfWeek.setDate(date.getDate() - date.getDay());
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);
              setStartDate(startOfWeek);
              setEndDate(endOfWeek);
            } else {
              setStartDate(null);
              setEndDate(null);
            }
          }}
          showWeekNumbers
          showWeekPicker
          className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
          placeholderText="Select Week"
        />
      )}

      {monthly && (
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => {
            if (date) {
              const startOfMonth = new Date(
                date.getFullYear(),
                date.getMonth(),
                1
              );
              const endOfMonth = new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
              );
              setStartDate(startOfMonth);
              setEndDate(endOfMonth);
            } else {
              setStartDate(null);
              setEndDate(null);
            }
          }}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
          placeholderText="Select Month"
        />
      )}

      {yearly && (
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => {
            if (date) {
              const startOfYear = new Date(date.getFullYear(), 0, 1); // Start of the year
              const endOfYear = new Date(date.getFullYear(), 11, 31); // End of the year
              setStartDate(startOfYear);
              setEndDate(endOfYear);
            } else {
              setStartDate(null);
              setEndDate(null);
            }
          }}
          showYearPicker
          dateFormat="yyyy"
          className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
          placeholderText="Select Year"
        />
      )}

      {range && (
        <>
           <div className="flex justify-start items-center gap-4 ">
              <label className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white">
                From:
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
                placeholderText="Start Date"
              />
            </div>

            <div className="flex justify-start items-center gap-4">
              <label className="capitalize block mb-1.5 md:mb-2 text-sm md:text-base font-medium text-white">
                To:
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                className="bg-black border-black text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border focus:border-green-600"
                placeholderText="End Date"
              />
            </div>
        </>
      )}
    </div>
  );
};
