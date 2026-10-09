import mantenimiento from "@/assets/mantenimiento.jpg";

const MaintenancePlaceholder = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff6ea] px-4 py-8">
      <img
        src={mantenimiento}
        alt="Estamos trabajando en la aplicación"
        className="h-auto w-full max-w-6xl object-contain"
      />
    </main>
  );
};

export default MaintenancePlaceholder;
