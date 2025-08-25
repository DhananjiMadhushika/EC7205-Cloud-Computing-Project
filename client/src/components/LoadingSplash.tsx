const LoadingSplash = () => {
    return (
      <div className="fixed inset-0 bg-[#262626] flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto"></div>
          <p className="text-white mt-4 text-xl font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  };
  
  export default LoadingSplash;