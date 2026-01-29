type Props = {
  label: "HOURS" | "MINUTES" | "SECONDS";
  value: string;
};
export default function TimeCard({ label, value }: Props) {
  return (
    <div className="flex flex-col justify-center w-[264px] h-[298px] rounded-[10px] border border-mainColor bg-gradient-to-br from-white/80  to-mainColor/20 ">
      <div className="digital text-mainColor text-[154px] leading-[200px] text-center">
        {value}
      </div>
      <div className="mt-9 text-center text-[14px] tracking-[0.2em] text-mainColor font-semibold">
        {label}
      </div>
    </div>
  );
}
