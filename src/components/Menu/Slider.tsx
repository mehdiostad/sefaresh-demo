import { getUserData } from "@/lib/getUserData";
import SliderClient from "./SliderClient";
import { normalizeDashboardUser } from "@/utils/normalizeUser";

interface SliderProps {
  data: MenuProps[];
  menuName: string;
  menuLogo: string | undefined;
  username?: string;
}

const Slider = async ({ data, menuName, menuLogo, username }: SliderProps) => {
  const userData = normalizeDashboardUser(
    (await getUserData({ username })).publicUserInfo as IApiUser
  );
  return (
    <SliderClient
      key={username}
      userData={userData}
      data={data}
      menuName={menuName}
      menuLogo={menuLogo}
      username={username}
    />
  );
};

export default Slider;
