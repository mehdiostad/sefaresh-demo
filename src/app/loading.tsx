export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen flex-col gap-2 bg-slate-800 w-full">
      <div className="spinner"></div>
      <p className="text-white" dir="rtl">لطفا صبر کنید...</p>
    </div>
  );
};

export default LoadingSpinner;
