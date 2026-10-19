import siteLogo from "@/assets/miau-logo-mark.png";
import catConstructor from "@/assets/cat-constructor.png";

const MaintenancePlaceholder = () => {
  return (
    <main className="relative h-screen overflow-hidden bg-white">
      <img
        src={siteLogo}
        alt="Miau Miau"
        className="absolute left-4 top-4 z-10 h-16 w-auto object-contain object-left md:left-8 md:top-6 md:h-20"
      />
      <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center px-6 pt-24 text-center md:pt-28">
        <h1
          className="text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Sitio web en construcción
        </h1>
        <p
          className="mt-5 max-w-xl text-lg font-black text-foreground sm:text-xl"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Estamos trabajando para darte una mejor experiencia
        </p>
        <p
          className="mt-4 max-w-md text-sm font-black text-muted-foreground"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Muy pronto podrás conocer todas nuestras novedades, productos y contenido para consentir a tu gato
        </p>
      </div>
      <img
        src={catConstructor}
        alt=""
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-auto w-full max-h-[40vh] max-w-xl -translate-x-1/2 object-contain object-bottom md:max-h-[46vh] md:max-w-3xl"
      />
    </main>
  );
};

export default MaintenancePlaceholder;
