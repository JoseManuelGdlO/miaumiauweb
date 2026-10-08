import siteLogo from "@/assets/logo.jpg";

const MaintenancePlaceholder = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-lg">
        <img
          src={siteLogo}
          alt="Miau Miau"
          className="mx-auto mb-6 h-20 w-auto object-contain"
        />
        <h1
          className="text-3xl sm:text-4xl font-bold text-foreground"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Estamos trabajando en la aplicación
        </h1>
      </div>
    </main>
  );
};

export default MaintenancePlaceholder;
