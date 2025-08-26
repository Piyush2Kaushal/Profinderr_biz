// Local Imports
import Logo from "assets/LogoBizz.png";
import { Progress } from "components/ui";

// ----------------------------------------------------------------------

export function SplashScreen() {
  return (
    <div className="fixed grid h-full w-full place-content-center">
      <img src={Logo} alt="Logo" className="mx-auto h-auto w-16 sm:w-40" />
      <Progress
        color="primary"
        isIndeterminate
        animationDuration="1s"
        className="mt-2 h-1"
      />
    </div>
  );
}
