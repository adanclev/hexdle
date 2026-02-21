import { useState } from "react";
import { SplashPage } from "@/pages/SplashPage"
import { Game } from "@/pages/GamePage";
// import { LandscapeWarning } from "@/pages/LandscapeWarning";

export const MainPage = () => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleClick = () => {
    const newState = !isActive;
    setIsActive(newState);
  }

  return (
    <>
      {isActive
        ? <Game />
        : <SplashPage onClickPlay={handleClick} />
      }
    </>
  )
}
